import {NextResponse} from "next/server";
import {Document} from "@langchain/core/documents";
import {TokenTextSplitter} from "langchain/text_splitter";
import {PromptTemplate} from "@langchain/core/prompts";
import {
  collapseDocs,
  splitListOfDocs,
} from "langchain/chains/combine_documents/reduce";
import {ChatOpenAI} from "@langchain/openai";
import {formatDocument} from "langchain/schema/prompt_template";
import {RunnablePassthrough, RunnableSequence} from "@langchain/core/runnables";
import {BaseCallbackConfig} from "@langchain/core/callbacks/manager";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {dummyTranscript} from "../data";
// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
// });

export const maxDuration = 300; // 5 minutes

// Initialize the OpenAI model
export async function POST(req: Request) {
  const {prompt, text} = await req.json();
  try {
    const model = new ChatOpenAI({
      model: "gpt-4-turbo",
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    // Define prompt templates for document formatting, summarizing, collapsing, and combining
    const documentPrompt = PromptTemplate.fromTemplate("{pageContent}");

    const summarizePrompt = PromptTemplate.fromTemplate(
      `As the author of this text im seeking your expertise in extracting insights related to the text. i would like you to answer to following prompt: ${prompt}. Here is the text:\n\n{context}`
    );
    const collapsePrompt = PromptTemplate.fromTemplate(
      `Collapse this content while still including important ideas from the to answer the question:${prompt} content:\n\n{context}`
    );
    const combinePrompt = PromptTemplate.fromTemplate(
      `Respond in a formatted response. Combine these to best answer the question:${prompt} :\n\n{context}`
    );

    // Wrap the `formatDocument` util so it can format a list of documents
    const formatDocs = async (documents: Document[]): Promise<string> => {
      const formattedDocs = await Promise.all(
        documents.map((doc) => formatDocument(doc, documentPrompt))
      );
      return formattedDocs.join("\n\n");
    };

    // Define a function to get the number of tokens in a list of documents
    const getNumTokens = async (documents: Document[]): Promise<number> =>
      model.getNumTokens(await formatDocs(documents));

    // Initialize the output parser
    const outputParser = new StringOutputParser();

    // Define the map chain to format, summarize, and parse the document
    const mapChain = RunnableSequence.from([
      {context: async (i: Document) => formatDocument(i, documentPrompt)},
      summarizePrompt,
      model,
      outputParser,
    ]);

    // Define the collapse chain to format, collapse, and parse a list of documents
    const collapseChain = RunnableSequence.from([
      {context: async (documents: Document[]) => formatDocs(documents)},
      collapsePrompt,
      model,
      outputParser,
    ]);

    // Define a function to collapse a list of documents until the total number of tokens is within the limit
    const collapse = async (
      documents: Document[],
      options?: {
        config?: BaseCallbackConfig;
      },
      tokenMax = 4000
    ) => {
      const editableConfig = options?.config;
      let docs = documents;
      let collapseCount = 1;
      while ((await getNumTokens(docs)) > tokenMax) {
        if (editableConfig) {
          editableConfig.runName = `Collapse ${collapseCount}`;
        }
        const splitDocs = splitListOfDocs(docs, getNumTokens, tokenMax);
        docs = await Promise.all(
          splitDocs.map((doc) => collapseDocs(doc, collapseChain.invoke))
        );
        collapseCount += 1;
      }
      return docs;
    };

    // Define the reduce chain to format, combine, and parse a list of documents
    const reduceChain = RunnableSequence.from([
      {context: formatDocs},
      combinePrompt,
      model,
      outputParser,
    ]).withConfig({runName: "Reduce"});

    // Define the final map-reduce chain
    const mapReduceChain = RunnableSequence.from([
      RunnableSequence.from([
        {doc: new RunnablePassthrough(), content: mapChain},
        (input) =>
          new Document({
            pageContent: input.content,
            metadata: input.doc.metadata,
          }),
      ])
        .withConfig({runName: "Summarize (return doc)"})
        .map(),
      collapse,
      reduceChain,
    ]).withConfig({runName: "Map reduce"});
    // Split the text into documents and process them with the map-reduce chain
    const docs = text.split("\n\n").map(
      (pageContent: string) =>
        new Document({
          pageContent,
          metadata: {
            source: "https://www.youtube.com/watch?v=1X_KdkoGxSs",
          },
        })
    );
    const result = await mapReduceChain.invoke(docs);

    return NextResponse.json({
      success: true,
      response: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      response: error.message,
    });
  }
}

export async function GET() {
  try {
    const model = new ChatOpenAI({
      model: "gpt-3.5-turbo",
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    // Define prompt templates for document formatting, summarizing, collapsing, and combining
    const documentPrompt = PromptTemplate.fromTemplate("{pageContent}");

    const question = "Create 5 questions to help me study";

    const summarizePrompt = PromptTemplate.fromTemplate(
      `As the author of this text im seeking your expertise in extracting insights related to the text. i would like you to answer to following prompt: ${question}. Here is the manuscript for text:\n\n{context}`
    );
    const collapsePrompt = PromptTemplate.fromTemplate(
      `Collapse this content while retaining the required information to respond to following prompt:${question} content:\n\n{context}`
    );
    const combinePrompt = PromptTemplate.fromTemplate(
      `Respond in a formatted response. Combine these responses to best respond to following prompt:${question} :\n\n{context}`
    );

    // Wrap the `formatDocument` util so it can format a list of documents
    const formatDocs = async (documents: Document[]): Promise<string> => {
      const formattedDocs = await Promise.all(
        documents.map((doc) => formatDocument(doc, documentPrompt))
      );
      return formattedDocs.join("\n\n");
    };

    // Define a function to get the number of tokens in a list of documents
    const getNumTokens = async (documents: Document[]): Promise<number> =>
      model.getNumTokens(await formatDocs(documents));

    // Initialize the output parser
    const outputParser = new StringOutputParser();

    // Define the map chain to format, summarize, and parse the document
    const mapChain = RunnableSequence.from([
      {context: async (i: Document) => formatDocument(i, documentPrompt)},
      summarizePrompt,
      model,
      outputParser,
    ]);

    // Define the collapse chain to format, collapse, and parse a list of documents
    const collapseChain = RunnableSequence.from([
      {context: async (documents: Document[]) => formatDocs(documents)},
      collapsePrompt,
      model,
      outputParser,
    ]);

    // Define a function to collapse a list of documents until the total number of tokens is within the limit
    const collapse = async (
      documents: Document[],
      options?: {
        config?: BaseCallbackConfig;
      },
      tokenMax = 26385
    ) => {
      const editableConfig = options?.config;
      let docs = documents;
      let collapseCount = 1;
      while ((await getNumTokens(docs)) > tokenMax) {
        if (editableConfig) {
          editableConfig.runName = `Collapse ${collapseCount}`;
        }
        const splitDocs = splitListOfDocs(docs, getNumTokens, tokenMax);
        docs = await Promise.all(
          splitDocs.map((doc) => collapseDocs(doc, collapseChain.invoke))
        );
        console.log("collapseCount", collapseCount);
        collapseCount += 1;
      }
      return docs;
    };

    // Define the reduce chain to format, combine, and parse a list of documents
    const reduceChain = RunnableSequence.from([
      {context: formatDocs},
      combinePrompt,
      model,
      outputParser,
    ]).withConfig({runName: "Reduce"});

    // Define the final map-reduce chain
    const mapReduceChain = RunnableSequence.from([
      RunnableSequence.from([
        {doc: new RunnablePassthrough(), content: mapChain},
        (input) =>
          new Document({
            pageContent: input.content,
            metadata: input.doc.metadata,
          }),
      ])
        .withConfig({runName: "Summarize (return doc)"})
        .map(),
      collapse,
      reduceChain,
    ]).withConfig({runName: "Map reduce"});
    // Split the text into documents and process them with the map-reduce chain

    const splitter = new TokenTextSplitter({
      chunkSize: 1600,
      chunkOverlap: 1,
    });

    const output = await splitter.createDocuments([dummyTranscript]);

    let outputs = [];

    for (const doc of output) {
      const result = await mapReduceChain.invoke([doc]);
      outputs.push(result);
    }

    // create a final response with the outputs

    const docs = outputs
      .join(" ")
      .split("\n\n")
      .map(
        (pageContent: string) =>
          new Document({
            pageContent,
            metadata: {
              source: "https://www.youtube.com/watch?v=1X_KdkoGxSs",
            },
          })
      );

    const combineChain = RunnableSequence.from([
      {context: formatDocs},
      combinePrompt,
      model,
      outputParser,
    ]);

    const result = await combineChain.invoke(docs);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      response: error.message,
    });
  }
}

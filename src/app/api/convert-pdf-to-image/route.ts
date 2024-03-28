import {NextResponse} from "next/server";

// import credintials from "./moltar-bc665-0fdafd009593.json";
export async function POST(req: Request) {
  const requestData = await req.json();
  const fileName = requestData.fileName;
  try {
    // Imports the Google Cloud client libraries
    const vision = require("@google-cloud/vision").v1;

    // Creates a client
    console.log(
      "env $$$ ",
      process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY
    );
    const client = new vision.ImageAnnotatorClient({
      projectId: "moltar-bc665",
      credentials: JSON.parse(
        process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY as string
      ),
    });

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // Bucket where the file resides
    const bucketName = "moltar-bc665.appspot.com";
    // Path to PDF file within bucket
    // The folder to store the results
    const outputPrefix = "results";

    const gcsSourceUri = `gs://${bucketName}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${fileName}/${fileName}.json`;

    const inputConfig = {
      // Supported mime_types are: 'application/pdf' and 'image/tiff'
      mimeType: "application/pdf",
      gcsSource: {
        uri: gcsSourceUri,
      },
    };
    const outputConfig = {
      gcsDestination: {
        uri: gcsDestinationUri,
      },
    };
    const features = [{type: "DOCUMENT_TEXT_DETECTION"}];
    const request = {
      requests: [
        {
          inputConfig: inputConfig,
          features: features,
          outputConfig: outputConfig,
        },
      ],
    };

    const [operation] = await client.asyncBatchAnnotateFiles(request);
    const [filesResponse] = await operation.promise();
    const destinationUri =
      filesResponse.responses[0].outputConfig.gcsDestination.uri;
    console.log("Json saved to: " + destinationUri);

    return NextResponse.json({
      message: "PDF processing completed successfully.",
      url: destinationUri,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}

// export async function GET() {
//   try {
//     // Imports the Google Cloud client libraries
//     const vision = require("@google-cloud/vision").v1;

//     // Creates a client
//     const client = new vision.ImageAnnotatorClient({
//       projectId: "moltar-bc665",
//       credentials: JSON.parse(
//         process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY
//       ),
//     });

//     /**
//      * TODO(developer): Uncomment the following lines before running the sample.
//      */
//     // Bucket where the file resides
//     const bucketName = "moltar-bc665.appspot.com";
//     // Path to PDF file within bucket
//     // The folder to store the results
//     const outputPrefix = "scanned-documents";
//     // const fileName = "4ym68it";
//     const fileName = "081wc6";
//     const gcsSourceUri = `gs://${bucketName}/${fileName}`;
//     const gcsDestinationUri = `gs://${bucketName}/${fileName}/`;

//     const inputConfig = {
//       // Supported mime_types are: 'application/pdf' and 'image/tiff'
//       mimeType: "application/pdf",
//       gcsSource: {
//         uri: gcsSourceUri,
//       },
//     };
//     const outputConfig = {
//       gcsDestination: {
//         uri: gcsDestinationUri,
//       },
//     };
//     const features = [{type: "DOCUMENT_TEXT_DETECTION"}];
//     const request = {
//       requests: [
//         {
//           inputConfig: inputConfig,
//           features: features,
//           outputConfig: outputConfig,
//         },
//       ],
//     };

//     const [operation] = await client.asyncBatchAnnotateFiles(request);
//     const [filesResponse] = await operation.promise();
//     const destinationUri =
//       filesResponse.responses[0].outputConfig.gcsDestination.uri;
//     console.log("Json saved to: " + destinationUri);

//     return NextResponse.json({
//       destinationUri,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({message: error.message});
//   }
// }

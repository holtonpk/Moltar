"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time. Please note that we do not offer refunds for partial months.",
  },
  {
    question: "Is my data safe and secure?",
    answer:
      "Yes, we take data security seriously. Our servers are hosted in a world-class data center that is protected by 24-hour surveillance, and our product is built with strict security features. All plan include SSL encryption to keep your data safe.",
  },

  {
    question: "What happens if I want to upgrade my plan?",
    answer:
      "You can upgrade your plan at any time. The new pricing will take effect on your next billing cycle.",
  },

  {
    question: "Do you have a free trial?",
    answer:
      "Yes, we offer a free trial for new users. Sign up and get a full access to all features for 14 days.",
  },
];

export default function FAQ() {
  return (
    <div className="mt-20  pb-4 h-fit border-y border-y-border bg-background/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur">
      <div className="my-20  text-center mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="p-3">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl sm:tracking-wide md:text-4xl">
              Pricing FAQs
            </h2>
          </div>
          <Accordion
            type="single"
            collapsible
            className="col-span-2 px-3 sm:px-0"
          >
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={idx.toString()}>
                <AccordionTrigger className="py-4 hover:no-underline">
                  <h3 className="text-left text-lg font-bold ">
                    {faq.question}
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-4 text-left ">{faq.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

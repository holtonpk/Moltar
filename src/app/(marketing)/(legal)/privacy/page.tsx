import React from "react";
import { Mdx } from "@/components/mdx-components";
import { legal } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: `Privacy Policy - ${siteConfig.name}`,
});

const Page = () => {
  const page = {
    title: "Privacy Policy",
    description: `The Privacy Policy for ${siteConfig.name}`,
  };

  return (
    <article className="container max-w-3xl py-6 lg:py-12 bg-background/30 blurBack  rounded-md">
      <div className="space-y-4">
        <h1 className="inline-block font-heading text-4xl lg:text-5xl font-bold">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-xl text-muted-foreground">{page.description}</p>
        )}
      </div>
      <hr className="my-4" />
      <p>
        A privacy policy is a legal document or statement that discloses how a
        company or website collects, uses, discloses, and manages a
        customer&apos;s data. It fulfills a legal requirement to protect a
        customer&apos;s or client&apos;s privacy. This policy includes
        information about the type of data collected (personal and
        non-personal), the method of collection, how the data is used, who
        it&apos;s shared with, and how it&apos;s protected. Its goal is to
        transparently disclose the company&apos;s data handling practices to
        ensure trust and compliance with privacy laws.
      </p>
      {legal.privacyPolicy.map((section) => (
        <>
          <h2 className="mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
            {section.title}
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{section.body}</p>
        </>
      ))}

      <h2 className="mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
        Contact Us
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <a
          href={`mailto:${siteConfig.contact.supportEmail}`}
          className="hover:text-muted-foreground"
        >
          {siteConfig.contact.supportEmail}
        </a>
      </p>
    </article>
  );
};

export default Page;

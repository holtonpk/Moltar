import React from "react";
import { Metadata } from "next";
import { Mdx } from "@/components/mdx-components";
import { legal } from "@/config/legal";
import { constructMetadata } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = constructMetadata({
  title: `Terms of Service - ${siteConfig.name}`,
});

const Page = () => {
  const page = {
    title: "Terms of Service",
    description: "Read our terms and conditions.",
  };

  return (
    <article className="container max-w-3xl py-6 lg:py-12 bg-background/30 blurBack rounded-md">
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
        A Terms of Service (ToS), also known as Terms and Conditions or Terms of
        Use, is a legal agreement between a company or website and its users
        that defines the rules and guidelines for using the site or service.
        This document outlines what is expected from the users, what they can
        expect from the service, the limitations of the service, and policies
        around issues like payment, account termination, intellectual property,
        and dispute resolution. It acts as a contract that users must agree to
        follow in order to use the service. Its purpose is to protect the
        company, ensure the smooth operation of the service, and set clear
        boundaries for users.
      </p>
      {legal.termsOfService.map((section) => (
        <>
          <h2 className="mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
            {section.title}
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{section.body}</p>
        </>
      ))}
    </article>
  );
};

export default Page;

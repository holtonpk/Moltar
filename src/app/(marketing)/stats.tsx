import { unstable_cache } from "next/cache";
// import prisma from "#/lib/prisma";
import { formatNumber } from "@/lib/utils";

export default function Stats() {
  return (
    <div className="border-y border-y-border mt-10 bg-background/10 py-8 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur">
      <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20 grid gap-y-4  md:divide-x md:divide-border md:grid-cols-3 md:gap-y-0">
        {[
          { name: "Tracked Sellers", value: 5324 },
          { name: "Products", value: 483 },
          { name: "Tracked posts", value: 32404 },
        ].map(({ name, value }) => (
          <div
            key={name}
            className="flex flex-col items-center justify-center space-y-2 "
          >
            <p className="text-4xl font-bold md:text-6xl">
              {formatNumber(value)}
            </p>
            <p className="font-semibold uppercase text-primary md:text-lg">
              {name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import {useMemo, useState} from "react";
import Confetti from "react-dom-confetti";
import {Icons} from "@/components/icons";
import {Switch} from "@/components/ui/switch";
import {Tooltip} from "@/components/ui/tooltip";
import {Product, UserData} from "@/types";
// import {
//   createCheckoutSession,
//   manageSubscription,
// } from "@/stripe/createCheckoutSession";
import {Button} from "@/components/ui/button";
import {LinkButton} from "@/components/ui/link";
import {useRouter} from "next/navigation";
// import { UserData } from "@/context/user-auth";

const plans = [
  {
    id: "prod_O7mMgmiT0fFlcC",
    name: "Pro",
    description:
      "Design for the high volume seller, looking to scale to the moon",
    icon: "gem",
    monthly_price: {id: "price_1NLWnVEewcpAM4MfkryhNa63", unit_amount: 5900},
    annual_price: {id: "price_1NLWnVEewcpAM4Mfc99W6lns", unit_amount: 59000},
    firebaseRole: "2",
    features: [
      {text: "Access to Top Accounts"},
      {text: "Access to Product Database"},
      {text: "Access to Accounts Database"},
      {text: "Unlimited Account Collections"},
      {text: "Unlimited Product Tracking"},
      {text: "Unlimited Product Searches"},
    ],
  },
  {
    id: "prod_O7mKmHjF7ieN0k",
    name: "Basic",
    description: "Perfect for a low level seller just getting started",
    icon: "bolt",
    monthly_price: {id: "price_1NLWlOEewcpAM4MfQnvrGA51", unit_amount: 2900},
    annual_price: {id: "price_1NLWlOEewcpAM4Mfk2S7oPFq", unit_amount: 29000},
    firebaseRole: "1",
    features: [
      {text: "Access to Top Accounts"},
      {text: "Access to Product Database"},
      {text: "Access to Accounts Database"},
      {text: "Unlimited Account Collections", negative: true},
      {text: "Unlimited Product Tracking", negative: true},
      {text: "Unlimited Product Searches", negative: true},
    ],
  },
];

interface PricingProps {
  currentUser?: UserData;
  success_url?: string;
  cancel_url?: string;
}
export default function Pricing({
  currentUser,
  cancel_url,
  success_url,
}: PricingProps) {
  const [annualBilling, setAnnualBilling] = useState(true);
  const period = useMemo(
    () => (annualBilling ? "monthly_price" : "annual_price"),
    [annualBilling]
  );

  const orderedPlans = plans.sort((a, b) => {
    return a[period].unit_amount + b[period].unit_amount;
  });

  return (
    <div className=" text-center mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
      <div className="relative mx-auto mb-6 md:mb-10 flex max-w-fit items-center space-x-2 mt-8">
        <p className="text-muted-foreground whitespace-nowrap text-sm md:text-base">
          Billed Monthly
        </p>
        <Confetti
          active={period === "annual_price"}
          config={{elementCount: 200, spread: 90}}
        />
        <Switch
          fn={setAnnualBilling}
          checked={annualBilling}
          trackDimensions="h-6 w-12"
          thumbDimensions="h-5 w-5"
          thumbTranslate="translate-x-6"
        />
        <p className="text-muted-foreground whitespace-nowrap  text-sm md:text-base">
          Billed Annually
        </p>
        <span className="absolute -right-6 -top-8 rounded-full bg-purple-200 px-3 py-1 text-[12px]   text-purple-700 sm:-right-[9.5rem] sm:-top-2">
          🎁 2 months FREE
        </span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 md:max-w-3xl mx-auto">
        {orderedPlans.map((plan, i) => {
          return (
            <PlanCard
              key={i}
              plan={plan}
              popular={i == 0}
              period={period}
              cancel_url={cancel_url}
              success_url={success_url}
              // currentUser={currentUser}
            />
          );
        })}
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: Product;
  popular: boolean;
  period: "annual_price" | "monthly_price";
  // currentUser?: UserData;
  cancel_url?: string;
  success_url?: string;
}

const PlanCard = ({
  plan,
  popular,
  period,
  // currentUser,
  cancel_url,
  success_url,
}: PlanCardProps) => {
  const Icon = Icons[plan.icon as keyof typeof Icons];

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const selectPlan = async () => {
    // if (!currentUser) return;
    setIsLoading(true);
    // await createCheckoutSession(
    //   currentUser.uid,
    //   plan[period].id,
    //   `${siteConfig.url}/${success_url}`,
    //   `${siteConfig.url}/${cancel_url}`
    // );
    // setIsLoading(false);
  };

  const cancelPlan = async () => {
    // if (!currentUser) return;
    setIsLoading(true);
    // const manageLink = await manageSubscription(
    //   currentUser.stripeId,
    //   cancel_url || "dashboard"
    // );
    // router.push(manageLink);
    setIsLoading(false);
  };

  // console.log(currentUser);

  const currentUser: any = {
    firstName: "John",
    lastName: "Doe",
    photoURL: "https://randomuser.me/api",
    stripeId: "cus_Jy5J4v2FvZ",
    userPlan: {
      id: "sub_Jy5J4v2FvZ",
      tier: "1",
      active: true,
      cancel_at_period_end: false,
      current_period_end: 1638470400,
      current_period_start: 1635878400,
      created: 1635878400,
      metadata: {},
      status: "active",
      trial_end: 1638470400,
      trial_start: 1635878400,
    },
    welcome_intro: true,
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-background border shadow-lg`}
    >
      {popular && (
        <div className="absolute top-3 right-3  mx-auto w-fit rounded-md bg-background/30 blurBack z-[3] px-3 py-1 text-sm font-medium text-primary border">
          Most Popular
        </div>
      )}
      {popular && <div className=" colorBackground z-[1] " />}

      <div className="p-5 pb-2 text-left relative z-[3]">
        <div className="bg-background/30 blurBack p-2 rounded-md w-fit border-accent  border ">
          <Icon className="h-4 w-4 md:w-6 md:h-6 text-primary" />
        </div>
        <h3 className="my-3 text-left font-display text-xl md:text-3xl font-bold ">
          {plan.name}
        </h3>
        <p className="text-muted-foreground text-sm md:text-base">
          {plan.description}
        </p>
        <span className="my-5 font-display text-4xl md:text-6xl leading-[.7] font-semibold flex items-end">
          $
          {period === "annual_price"
            ? Math.round(plan.annual_price.unit_amount / 100 / 12)
            : plan.monthly_price.unit_amount / 100}
          <p className="text-muted-foreground text-[12px] md:text-sm mb-2">
            /{" "}
            {period === "annual_price"
              ? `$${plan.annual_price.unit_amount / 100} billed annually`
              : "month"}
          </p>
        </span>
      </div>

      <ul className="space-y-5 px-8  bg-muted/20 p-6  relative z-[3] border-y">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              {feature.negative ? (
                <Icons.xCircle className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Icons.checkCircle className="h-6 w-6 text-primary" />
              )}
            </div>
            {feature.footnote ? (
              <div className="flex items-center">
                <p
                  className={`${
                    feature.negative
                      ? "text-muted-foreground  opacity-50"
                      : "text-primary"
                  } text-[12px]  md:text-base`}
                >
                  {feature.text}
                </p>
                <Tooltip content={feature.footnote}>
                  <div className="flex h-4 w-8 justify-center">
                    <Icons.helpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Tooltip>
              </div>
            ) : (
              <p
                className={`${
                  feature.negative
                    ? "text-muted-foreground  opacity-50"
                    : "text-primary"
                } text-[12px]  md:text-base`}
              >
                {feature.text}
              </p>
            )}
          </li>
        ))}
      </ul>
      <div className=" relative z-[3]" />
      <div className="p-5 relative z-[3] ">
        {currentUser ? (
          <Button
            // onClick={
            //   currentUser.userPlan?.tier.toLocaleString() === plan.firebaseRole
            //     ? cancelPlan
            //     : selectPlan
            // }
            className="w-full"
            // variant={
            //   currentUser.userPlan?.tier.toLocaleString() === plan.firebaseRole
            //     ? "destructive"
            //     : popular
            //     ? "default"
            //     : "secondary"
            // }
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {currentUser.userPlan?.tier.toLocaleString() === plan.firebaseRole
              ? "Cancel Plan"
              : " Try For Free"}
          </Button>
        ) : (
          <>
            <LinkButton
              href={"/onboarding/register"}
              className="w-full"
              variant={popular ? "default" : "secondary"}
            >
              Try For Free
            </LinkButton>
            <p className="text-muted-foreground mt-2 text-sm">
              7 Day Free Trial. Cancel Anytime
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// const Pricing = ({ plans }: { plans: Product[] }) => {
//   console.log("plans", plans);
//   const [annualBilling, setAnnualBilling] = useState(true);
//   const period = useMemo(
//     () => (annualBilling ? "monthly_price" : "annual_price"),
//     [annualBilling]
//   );

//   const orderedPlans = plans.sort((a, b) => {
//     // Assuming both products always have a monthly_price. If not, you need to add checks.
//     return a[period].unit_amount - b[period].unit_amount;
//   });

//   return (
//     <div className=" text-center z-20">
//       <div id="pricing" className="mx-auto my-10 sm:max-w-lg">
//         <h2 className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
//           Simple,{" "}
//           <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//             affordable
//           </span>{" "}
//           pricing.
//         </h2>
//         {/* <p className="mt-5 text-primary sm:text-lg">
//           Shorten your links without breaking your bank. <br />
//           Start for free, no credit card required.
//         </p> */}
//       </div>

//       <div className="relative mx-auto mb-14 flex max-w-fit items-center space-x-2">
//         <p className="text-muted-foreground">Billed Monthly</p>
//         <Confetti
//           active={period === "annual_price"}
//           config={{ elementCount: 200, spread: 90 }}
//         />
//         <Switch
//           fn={setAnnualBilling}
//           checked={annualBilling}
//           trackDimensions="h-6 w-12"
//           thumbDimensions="h-5 w-5"
//           thumbTranslate="translate-x-6"
//         />
//         <p className="text-muted-foreground">Billed Annually</p>
//         <span className="absolute -right-12 -top-8 rounded-full bg-purple-200 px-3 py-1 text-sm text-purple-700 sm:-right-[9.5rem] sm:-top-2">
//           🎁 2 months FREE
//         </span>
//       </div>

//       <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
//         {orderedPlans.map((plan, i) => {
//           return (
//             <PlanCard key={i} plan={plan} popular={i == 1} period={period} />
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Pricing;

// interface PlanCardProps {
//   plan: Product;
//   popular: boolean;
//   period: "annual_price" | "monthly_price";
// }

// const PlanCard = ({ plan, popular, period }: PlanCardProps) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { currentUser } = useAuth()!;

//   const price = plan[period];
//   console.log("plan ===>", plan);

//   const selectPlan = async () => {
//     console.log("price ===>", price);
//     if (!currentUser || !price) return;
//     setIsLoading(true);
//     await createCheckoutSession(
//       currentUser?.uid,
//       price?.id,
//       `${siteConfig.url}/dashboard`,
//       `${siteConfig.url}/onboarding/register`
//     );
//   };

//   return (
//     <div
//       key={plan.id}
//       className={`relative rounded-2xl bg-background ${
//         popular ? "border-2 border-blue-600 shadow-blue-200" : "border"
//       } shadow-lg`}
//     >
//       {popular && (
//         <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
//           Popular
//         </div>
//       )}

//       <div className="p-5">
//         <h3 className="my-3 text-center font-display text-3xl font-bold">
//           {plan.name}
//         </h3>
//         <p className="text-gray-500">{"this need to be a tagline"}</p>
//         <p className="my-5 font-display text-6xl font-semibold">
//           $
//           {period === "annual_price"
//             ? plan.annual_price.unit_amount / 100 / 12
//             : plan.monthly_price.unit_amount / 100}
//         </p>
//         <p className="text-gray-500">
//           per {period === "annual_price" ? "month, billed annually" : "month"}
//         </p>
//       </div>
//       <div className="flex h-20 items-center justify-center border-b border-t border-border bg-muted/20">
//         <div className="flex items-center">
//           <p className="text-primary">Up to ? link clicks/mo</p>
//           <Tooltip content="If you exceed your monthly usage, your existing links will still work, but you need to upgrade to view their stats/add more links. Link clicks are shared across all projects.">
//             <div className="flex h-4 w-8 justify-center">
//               <Icons.helpCircle className="h-4 w-4 text-gray-600" />
//             </div>
//           </Tooltip>
//         </div>
//       </div>
//       <ul className="my-10 space-y-5 px-8">
//         {plan.features.map((feature, i) => (
//           <li key={i} className="flex space-x-5">
//             <div className="flex-shrink-0">
//               {feature.negative ? (
//                 <Icons.xCircle className="h-6 w-6 text-muted-foreground" />
//               ) : (
//                 <Icons.checkCircle className="h-6 w-6 text-green-500" />
//               )}
//             </div>
//             {feature.footnote ? (
//               <div className="flex items-center">
//                 <p
//                   className={
//                     feature.negative ? "text-muted-foreground" : "text-primary"
//                   }
//                 >
//                   {feature.text}
//                 </p>
//                 <Tooltip content={feature.footnote}>
//                   <div className="flex h-4 w-8 justify-center">
//                     <Icons.helpCircle className="h-4 w-4 text-gray-600" />
//                   </div>
//                 </Tooltip>
//               </div>
//             ) : (
//               <p
//                 className={
//                   feature.negative ? "text-muted-foreground" : "text-primary"
//                 }
//               >
//                 {feature.text}
//               </p>
//             )}
//           </li>
//         ))}
//       </ul>
//       <div className="border-t border-border" />
//       <div className="p-5">
//         <Button
//           onClick={selectPlan}
//           className={`${
//             popular
//               ? "bg-theme-blue border-none hover:bg-primary text-white hover:text-theme-blue"
//               : ""
//           } w-full`}
//         >
//           {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
//           Get Started
//         </Button>
//       </div>
//     </div>
//   );
// };

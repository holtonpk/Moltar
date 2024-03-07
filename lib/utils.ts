import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

// import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", {month: "short"}).format(date);
  const year = date.getFullYear().toString().slice(-2);

  return `${day} ${month}, ${year}`;
}

export function formatDateShort(timestamp: number): string {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", {month: "numeric"}).format(
    date
  );
  const year = date.getFullYear().toString().slice(-2);

  return `${month}-${day}`;
}

export function formatNumber(input: number | string): string {
  let number: number;

  if (typeof input === "string") {
    number = parseFloat(input);
    if (isNaN(number)) {
      throw new Error(
        "Invalid input. Input must be a number or a string that can be parsed to a number."
      );
    }
  } else if (typeof input === "number") {
    number = input;
  } else {
    throw new Error(
      "Invalid input. Input must be a number or a string that can be parsed to a number."
    );
  }

  let formattedNumber: string;

  if (number >= 1000000) {
    const divisionResult = number / 1000000;
    formattedNumber =
      divisionResult.toFixed(Number.isInteger(divisionResult) ? 0 : 1) + "M";
  } else if (number >= 1000) {
    const divisionResult = number / 1000;
    formattedNumber =
      divisionResult.toFixed(Number.isInteger(divisionResult) ? 0 : 1) + "k";
  } else {
    formattedNumber = number.toString();
  }

  return formattedNumber;
}

export function timeSince(timestamp: number): string {
  const now: Date = new Date();
  const inputDate: Date = new Date(timestamp);
  const seconds: number = Math.floor(
    (now.getTime() - inputDate.getTime()) / 1000
  );

  const intervals: Array<[string, number]> = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
    ["s", 1],
  ];

  for (const [name, secondsInUnit] of intervals) {
    const interval: number = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval}${name} ago`;
    }
  }
  return "just now";
}

export function timeDifference(timestamp1: number, timestamp2: number): string {
  const millisecondsPerSecond = 1000;
  const millisecondsPerMinute = 60 * millisecondsPerSecond;
  const millisecondsPerHour = 60 * millisecondsPerMinute;
  const millisecondsPerDay = 24 * millisecondsPerHour;

  const elapsedMilliseconds = Math.abs(timestamp1 - timestamp2);

  if (elapsedMilliseconds >= millisecondsPerDay) {
    const days = Math.round(elapsedMilliseconds / millisecondsPerDay);
    return `${days} day${days === 1 ? "" : "s"}`;
  } else if (elapsedMilliseconds >= millisecondsPerHour) {
    const hours = Math.round(elapsedMilliseconds / millisecondsPerHour);
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  } else if (elapsedMilliseconds >= millisecondsPerMinute) {
    const minutes = Math.round(elapsedMilliseconds / millisecondsPerMinute);
    return `${minutes} minutes${minutes === 1 ? "" : "s"}`;
  } else {
    const seconds = Math.round(elapsedMilliseconds / millisecondsPerSecond);
    return `${seconds} second${seconds === 1 ? "" : "s"}`;
  }
}

export const configPercentChange = (value1: any, value2: any) => {
  try {
    const percentChange = ((value1 - value2) / value2) * 100;

    if (Number.isNaN(percentChange)) {
      return "0.00%";
    }

    return percentChange.toFixed(2) + "%";
  } catch (e) {
    return "0.00%";
  }
};

export const convertImageToFile = async (name: string, url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], name, {type: "image/jpeg"});
  return file;
};

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export function formatMoney(input: number | string): string {
  let amount: number;

  // Convert string input to number
  if (typeof input === "string") {
    amount = parseFloat(input);
    if (isNaN(amount)) {
      throw new Error("Input string is not a number");
    }
  } else {
    amount = input;
  }

  // Format number as currency
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function nFormatter(num?: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    {value: 1, symbol: ""},
    {value: 1e3, symbol: "K"},
    {value: 1e6, symbol: "M"},
    {value: 1e9, symbol: "G"},
    {value: 1e12, symbol: "T"},
    {value: 1e15, symbol: "P"},
    {value: 1e18, symbol: "E"},
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

type Stats = {
  date: number;
  data: number;
  id: string;
}[][];

type Result = {
  date: number;
  data: number;
}[];

export function combinePostsByDay(countStats: Stats): Result {
  // Flatten the array
  const flattened = countStats.flat();

  // Calculate the sums and counts
  const sumsAndCounts = flattened.reduce(
    (acc: Record<string, [number, Set<string>, number]>, stat) => {
      // Create a new Date object from the timestamp and format it to 'YYYY-MM-DD'
      const date = new Date(stat.date);
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      // If the date isn't a property on the accumulator, add it with an initial value of [0, new Set(), stat.date]
      if (!acc[dateString]) {
        acc[dateString] = [0, new Set(), stat.date];
      }

      // Check if we've already seen this id for this date
      if (!acc[dateString][1].has(stat.id)) {
        // If not, add the number of posts to the total for the date
        acc[dateString][0] += stat.data;
        // And add the id to the set of unique ids for the date
        acc[dateString][1].add(stat.id);
      }

      return acc;
    },
    {}
  );

  // Convert the sums object to an array of objects
  const result: Result = Object.entries(sumsAndCounts).map(
    ([date, [totalPosts, ids, timestamp]]) => {
      const averagePosts = totalPosts / ids.size;
      return {date: timestamp, data: averagePosts};
    }
  );

  return result;
}

const defaultReturnObject = {
  percentChange: 0,
  value: 0,
  increase: 0,
};

const configData = (account: any, field: string) => {
  try {
    const orderedData = account.accountStats;
    const mostRecentData = orderedData[orderedData.length - 1];
    const oldestData = orderedData[0];

    const percentChange = Math.round(
      ((mostRecentData[field] - oldestData[field]) / oldestData[field]) * 100
    );

    if (Number.isNaN(percentChange)) {
      return defaultReturnObject;
    }

    return {
      percentChange: percentChange,
      value: mostRecentData[field],
      increase: mostRecentData[field] - oldestData[field],
    };
  } catch (e) {
    return defaultReturnObject;
  }
};

export const formatDataAsPercentChange = (accountData: any) => {
  return accountData.reduce((formattedData: any, account: any) => {
    if (account.accountStats && account.accountStats.length > 0) {
      // Sort the accountStats array upfront
      account.accountStats.sort((a: any, b: any) => {
        return a.dataCollectionTime - b.dataCollectionTime;
      });

      const followers = configData(account, "followerCount");
      const likes = configData(account, "heartCount");
      const posts = configData(account, "videoCount");

      formattedData.push({
        nickname: account.nickname,
        id: account.id,
        uniqueId: account.uniqueId,
        avatar: account.avatar,
        followers,
        likes,
        posts,
      });
    }
    return formattedData;
  }, []);
};

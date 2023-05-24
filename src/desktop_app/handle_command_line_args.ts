// https://github.com/yargs/yargs/blob/main/docs/typescript.md
// https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/

import fs from "fs";
import yargs from "yargs/yargs";
// import options  from "./parse_cmd";

import { validate_url, construct_valid_url } from "./utils";

// import types
import { ThreadArgs } from "../types";

// import configs
import { ARCHIVE_PATH } from "../config/consts";

// OLD FUNC
// export function parse_user_input(argv: string[]): [string[], null] | [null, ThreadArgs] {
//     const [,,url] = argv
//     const err: string[] = []
//     if (!url) {
//         err.push("Error: no Url")
//         return [err, null]
//     }

//     const url_mod = construct_valid_url(url)
//     // console.log(url_mod)
//     validate_url(url_mod, err)
//     if (err.length) return [err, null]
//     return [null, { url: url_mod }]

// }

type TYargsOptions = {
  readonly l: {
    readonly type: "array";
    readonly default: readonly [];
    readonly alias: "list";
    readonly description: "threads to download";
  };
  readonly u: {
    readonly type: "boolean";
    readonly default: false;
    readonly alias: "update";
    readonly description: "use the archive folder to update the current threads";
  };
  readonly i: {
    readonly type: "array";
    readonly default: readonly [];
    readonly alias: "include";
    readonly description: "Only the images that has post ids in this list will be downloaded";
  };
  readonly e: {
    readonly type: "array";
    readonly default: readonly [];
    readonly alias: "exclude";
    readonly description: "images with post ids in this list will not be downloaded";
  };
};

type TArgv = {
  [x: string]: unknown;
  readonly l: readonly [] | (string | number)[];
  readonly u: boolean;
  readonly i: readonly [] | (string | number)[];
  readonly e: readonly [] | (string | number)[];
  _: (string | number)[];
  $0: string;
};

const yargsOptions: TYargsOptions = {
  l: { type: "array", default: [], alias: "list", description: "threads to download" },
  u: {
    type: "boolean",
    default: false,
    alias: "update",
    description: "use the archive folder to update the current threads",
  },
  i: {
    type: "array",
    default: [],
    alias: "include",
    description: "Only the images that has post ids in this list will be downloaded",
  },
  e: {
    type: "array",
    default: [],
    alias: "exclude",
    description: "images with post ids in this list will not be downloaded",
  },
};

/**
 * Parses input arguments and returns an array of tuples representing the result.
 * The result can be either an array of error messages and null values, or an array
 * of null values and ThreadArgs objects.
 *
 * @param {string[]} args - An array of string arguments to be parsed.
 * @returns {([string[], null][] | [null, ThreadArgs][])} - An array of tuples representing the parsed result.
 * @throws {Error} - Throws an error if there are any issues with parsing the input arguments.
 */
export function parse_input(args: string[]): [string[], null][] | [null, ThreadArgs][] {
  const argv = yargs(args).options(yargsOptions).parseSync();

  if (argv.u) return handle_u(argv);

  if (argv._.length) return handle_regular(argv);

  if (argv.l.length) return handle_l(argv);

  return [[["Error: no Url"], null]]; // handle no args passed
}

function handle_u(argv: TArgv) {
  const archive = fs.readFileSync(ARCHIVE_PATH, "utf-8");
  const threads: string[] = [];
  archive
    .split("\n")
    .slice(2)
    .forEach((line) => {
      const threadFields = line
        .split("|")
        .map((field) => field.trim())
        .slice(1, -1);

      if (threadFields[threadFields.length - 3] === "T") return; // exclude already removed threads
      if (threadFields[threadFields.length - 2] === "T") return; // exclude Unwanted updates
      
      const thread = line
        .split("|")
        .map((cell) => cell.trim())
        .slice(3, 5)
        .join("/");

      if (threads.includes(thread) || !thread.length) return;
      threads.push(thread);
    });

  console.log("Inside handle_u()\n", threads);
  return threads.reverse().map((thread) => [null, { url: construct_valid_url(thread), include: argv.i, exclude: argv.e }]) as [
    null,
    ThreadArgs
  ][];
}

function handle_regular(argv: TArgv) {
  const return_vals = argv._.map((url) => {
    const err: string[] = [];
    const url_mod = construct_valid_url(url as string);
    validate_url(url_mod, err);
    if (err.length) return [err, null];
    return [null, { url: url_mod, include: argv.i, exclude: argv.e }];
  });
  return return_vals as [string[], null][] | [null, ThreadArgs][]; // urls: [null, https://, null]
}

function handle_l(argv: TArgv) {
  const return_vals = argv.l.map((url) => [null, construct_valid_url(url as string)]);
  console.log(return_vals);
  return return_vals as [string[], null][] | [null, ThreadArgs][];
}

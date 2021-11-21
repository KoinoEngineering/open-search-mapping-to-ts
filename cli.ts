import commandLineArgs from "command-line-args";
import main, { Options } from "./src";
import StackError from "./src/error/StackError";

const options = commandLineArgs([
  {
    name: "url",
    alias: "u",
    type: String,
  },
  {
    name: "outFile",
    alias: "o",
    type: String,
  },
  {
    name: "requiredAll",
    alias: "r",
    type: Boolean,
    defaultValue: false,
  },
]);

if (!options.url) {
  throw new StackError("cli args has no url");
}

main(options.url, options.outFile, options as Options);

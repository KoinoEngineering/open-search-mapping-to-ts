import commandLineArgs from "command-line-args";
import main from "./src";
import StackError from "./src/error/StackError";

const optionDefinitions: commandLineArgs.OptionDefinition[] = [
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
];

const options = commandLineArgs(optionDefinitions);

if (!options.host) {
  throw new StackError("cli args has no host");
}

main(options.url, options.outFile);

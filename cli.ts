import commandLineArgs from "command-line-args";
import main from "./src";
import StackError from "./src/error/StackError";

const optionDefinitions: commandLineArgs.OptionDefinition[] = [
  {
    name: "host",
    alias: "h",
    type: String,
  },
  {
    name: "indexName",
    alias: "i",
    type: String,
  },
  {
    name: "outDir",
    alias: "o",
    type: String,
  },
];

const options = commandLineArgs(optionDefinitions);

if (!options.host) {
  throw new StackError("cli args has no host");
}

main(options.host, options.indexName, options.outDir);

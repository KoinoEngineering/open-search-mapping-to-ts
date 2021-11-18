import fs from "fs-extra";
import p from "prettier";
import { fetchMapping, generate } from "../src/utils/elastic";
export default async function main(mappingUrl: string, outFile: string = "generated/schema.ts") {
  return fetchMapping(mappingUrl)
    .then((m) => p.format(generate(m), { parser: "typescript" }))
    .then(async (ifStr) => {
      const splited = outFile.split("/");
      const outDir = splited.slice(0, splited.length - 1).join("/");
      return fs
        .pathExists(outDir)
        .then((exist) => {
          if (exist) {
            return void 0;
          } else {
            return fs.mkdirp(outDir);
          }
        })
        .then(() => ifStr);
    })
    .then(async (ifStr) => fs.writeFile(outFile, ifStr));
}

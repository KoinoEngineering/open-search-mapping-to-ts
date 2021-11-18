import p from "prettier";
import fs from "fs-extra";
import { fetchMapping, generate } from "../src/utils/elastic";
import { toPascal } from "./utils/string";
import urljoin from "url-join";
export default async function main(host: string, indexName: string = "_all", outDir: string = "generated") {
  return fetchMapping(host, indexName)
    .then((m) => {
      // eslint-disable-next-line no-console
      console.log(m.data);
      return m;
    })
    .then((m) => p.format(generate(m.data), { parser: "typescript" }))
    .then(async (ifStr) => {
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
    .then(async (ifStr) => fs.writeFile(urljoin(outDir, `${toPascal(indexName)}.ts`), ifStr));
}

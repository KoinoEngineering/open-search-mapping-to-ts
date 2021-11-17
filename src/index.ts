import p from "prettier";
import fs from "fs-extra";
import { fetchMapping, generate } from "~/src/utils/elastic";
import { toPascal } from "./utils/string";
const indexName = "rooms-ib-search2-with-schedules";
fetchMapping("http://localhost:8083", indexName)
  .then((m) => {
    // eslint-disable-next-line no-console
    console.log(m.data);
    return m;
  })
  .then((m) => p.format(generate(m.data), { parser: "typescript" }))
  .then(async (ifStr) => {
    return fs
      .pathExists("src/generated")
      .then((exist) => {
        if (exist) {
          return void 0;
        } else {
          return fs.mkdirp("src/generated");
        }
      })
      .then(() => ifStr);
  })
  .then(async (ifStr) => fs.writeFile(`src/generated/${toPascal(indexName)}.ts`, ifStr));

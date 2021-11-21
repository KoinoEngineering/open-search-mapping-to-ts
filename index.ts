import main from "./src";
import dotEnv from "dotenv";
dotEnv.config();

if (process.env.MAPPING_URL) {
  main(process.env.MAPPING_URL, process.env.OUT_FILE);
} else {
  // eslint-disable-next-line no-console
  console.log("MAPPING_URL is not set");
}

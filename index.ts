import main from "./src";
const url = "http://localhost:8083/rooms-ib-search2-with-schedules/_mapping?format=json";
// const url ="sample_mapping.json"
const outFile = "src/generated/rooms-ib-search2-with-schedules-axios.ts";
main(url, outFile);

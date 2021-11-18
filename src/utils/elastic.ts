import axios from "axios";
import fs from "fs-extra";
import _ from "lodash";
import { pascalCase } from "pascal-case";
import StackError from "../error/StackError";

export type ElasticMapping = {
  [k: string]: { mappings: Mapping };
};

export interface Mapping {
  properties: Properties;
}

export interface Properties {
  [key: string]: Property;
}

export interface Property {
  type: Types;
}

export type Types = "long" | "text" | "float" | "boolean";
export const AllTypes = Object.freeze<Types[]>(["long", "text", "float", "boolean"]);

/**
 * 与えられた値がTypesに含まれるかどうか判定する
 * 含まれていない方は未対応なので一時的にエラーを投げる
 * 必要なものがすべて対応されたらエラーは投げないようにする予定
 * @param x unknown
 * @returns x is Types or Not
 */
export function isTypes(x: unknown): x is Types {
  if (_.isString(x) && AllTypes.includes(x as Types)) {
    return true;
  } else {
    throw new StackError("typeが正しくないか未対応です");
  }
}

export async function fetchMapping(mappingUrl: string) {
  // 雑判定だがhttp(s)://で始まる場合はaxios
  // それ以外はfsで取得しに行く
  if (mappingUrl.match(/^http(s|):\/\//)) {
    return axios.get<ElasticMapping>(mappingUrl).then((r) => r.data);
  } else {
    if (mappingUrl.endsWith("json")) {
      return fs.readFile(mappingUrl).then((b) => {
        return JSON.parse(b.toString()) as ElasticMapping;
      });
    } else {
      throw new StackError("ファイルはJSON形式しか対応していません");
    }
  }
}

export const TypeMap = Object.freeze<{ [k in Types]: string }>({ long: "number", text: "string", float: "number", boolean: "boolean" });

export function generate(es: ElasticMapping) {
  return Object.entries(es)
    .map(([key, map]) => generateInterface(key, map.mappings))
    .join("\n\n");
}

function generateInterface(name: string, m: Mapping) {
  return `export interface ${pascalCase(name)} {
        ${Object.entries(m.properties)
          .filter(([pname, p]) => {
            if ("properties" in p) {
              // eslint-disable-next-line no-console
              console.log(`${name}.${pname}はオブジェクトです。現在は無視されます`);
              return true;
            } else {
              try {
                return isTypes(p.type);
              } catch (e) {
                throw new StackError(`${name}.${pname}でエラーが発生しました:${JSON.stringify(p)}`, e as Error);
              }
            }
          })
          .map(([key, p]) => `"${key}"? : ${TypeMap[p.type] || "any"}`)
          .join("\n")}
    }`;
}

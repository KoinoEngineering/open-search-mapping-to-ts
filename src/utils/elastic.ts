import axios from "axios";
import fs from "fs-extra";
import _ from "lodash";
import { pascalCase } from "pascal-case";
import { Options } from "..";
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

export type Property = Primitive | Mapping;

interface Primitive {
  type: Types;
}

export type Types = "long" | "text" | "float" | "boolean";
export const AllTypes = Object.freeze<Types[]>(["long", "text", "float", "boolean"]);
function isNestedObject(p: Property): p is Mapping {
  return "properties" in p;
}

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

export async function generate(es: ElasticMapping, options: Options) {
  return Promise.all(
    Object.entries(es).map(async ([key, map]) => {
      const thread: Promise<string>[] = [];
      thread.push(generateInterface(key, map.mappings, options, thread));
      return Promise.all(thread).then((ifList) => ifList.join("\n"));
    })
  ).then((ifList) => ifList.join("\n\n"));
}

async function generateInterface(name: string, m: Mapping, options: Options, thread: Promise<string>[] = []) {
  return `export interface ${pascalCase(name)} {
        ${Object.entries(m.properties)
          .map(([pname, p]) => {
            if (isNestedObject(p)) {
              const childName = pascalCase(name) + pascalCase(pname);
              // スレッドに子インターフェース作成タスクを詰めて、ここでは名前だけ返しておく
              thread.push(generateInterface(childName, p, options, thread));
              return `"${pname}"? : ${childName}`;
            } else {
              try {
                return `"${pname}"${options.requiredAll ? "" : "?"} : ${isTypes(p.type) ? TypeMap[p.type] : "any"}`;
              } catch (e) {
                throw new StackError(`${name}.${pname}でエラーが発生しました:${JSON.stringify(p)}`, e as Error);
              }
            }
          })
          .join("\n")}
    }`;
}

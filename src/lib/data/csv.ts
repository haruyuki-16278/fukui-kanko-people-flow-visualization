import {
  AggregatedData,
  KEYOF_AGGREGATED_DATA_BASE,
  ObjectClass,
} from "@/interfaces/aggregated-data.interface";
import { GraphSeries } from "@/interfaces/graph-series.interface";
import { Placement } from "@/interfaces/placement.interface";
import Papa from "papaparse";
import { isDateIncludedInRange } from "../date";

const getUrlPrefix = () => `${location.origin}${location.pathname}`;

async function getRawData(
  placement: Placement,
  objectClass: ObjectClass,
): Promise<AggregatedData[]> {
  const csvResponse = await fetch(getUrlPrefix() + `${placement}/${objectClass}.csv`);
  const csvRawText = await csvResponse.text();
  const csvFormattedText = csvRawText.replaceAll(/\n{2,}/g, "\n");

  const rawData = Papa.parse<AggregatedData>(csvFormattedText, { header: true }).data;
  return rawData;
}

function removeColumnFromRawData(
  rawData: AggregatedData[],
  exclude: Record<string, string[]>,
): AggregatedData[] {
  /** 作業用配列 */
  const work = [...rawData];

  const result = work.map((row) => {
    const workRow = { ...row };
    for (const /** `first second` の形になる */ key in workRow) {
      // 基本データの列は何もしない
      if ((KEYOF_AGGREGATED_DATA_BASE as string[]).includes(key)) continue;
      const isKeyMatchesExclude = (() => {
        const exclusionSet = new Set(Object.values(exclude).flat());
        // キーを単語に分割
        const keyParts = key.split(" ");
        
        // Other関連の特別処理
        const containsOther = keyParts.includes("Other");
        if (containsOther) {
          // carCategoriesにOtherが含まれているかチェック
          const hasCarCategoriesOther = exclude.carCategories?.includes("Other");
          
          // 他のカテゴリにOtherが含まれているかチェック
          const hasOtherCategoriesOther = Object.entries(exclude)
            .some(([category, values]) => category !== "carCategories" && values.includes("Other"));
          
          // carCategoriesにOtherがある場合：末尾が"Other"のものを排除
          if (hasCarCategoriesOther && keyParts[keyParts.length - 1] === "Other") {
            return true;
          }
          
          // 他のカテゴリにOtherがある場合：先頭が"Other"のものを排除
          if (hasOtherCategoriesOther && keyParts[0] === "Other") {
            return true;
          }
        }
        
        // 通常の除外処理：キーのいずれかの部分が除外リストに含まれていれば除外
        // ただし、Otherに関しては上記の特別処理で対応済みなので、それ以外の部分のみチェック
        return keyParts.some(keyPart => {
          if (keyPart === "Other") return false; // Otherは上で処理済み
          
          return exclusionSet.has(keyPart);
        });
      })();
      if (isKeyMatchesExclude) delete workRow[key];
    }

    // フィルタ後のデータで合計を計算して更新する
    workRow["total count"] = Object.entries(workRow)
      .filter(([key]) => !(KEYOF_AGGREGATED_DATA_BASE as string[]).includes(key))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .reduce((sum, [_, current]) => (sum += Number(current)), 0);
    return workRow;
  });

  return result;
}

export async function getData(
  placement: Placement,
  objectClass: ObjectClass,
  date: { from: Date; to: Date },
  exclude?: GraphSeries["exclude"],
): Promise<AggregatedData[]> {
  const rawData = await getRawData(placement, objectClass);

  let filteredData = [...rawData].filter((rawDataRow) =>
    isDateIncludedInRange(new Date(rawDataRow["aggregate from"]), date),
  );
  
  if (exclude) filteredData = removeColumnFromRawData(filteredData, exclude);
  
  return filteredData;
}

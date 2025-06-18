import {
  AggregatedData,
  KEYOF_AGGREGATED_DATA_BASE,
  ObjectClass,
} from "@/interfaces/aggregated-data.interface";
import { GraphSeries } from "@/interfaces/graph-series.interface";
import { Placement } from "@/interfaces/placement.interface";
import { isKeyMatchingAttribute } from "@/lib/utils";
import Papa from "papaparse";
import { isDateIncludedInRange } from "../date";

// APIレスポンスをキャッシュするためのオブジェクト
const licensePlateApiCache: Record<string, { timestamp: number, data: AggregatedData[] }> = {};
// キャッシュの有効期限（ミリ秒）
const CACHE_TTL = 60 * 60 * 1000;

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
      const isKeyMatchesExclude = Object.entries(exclude).some(
        ([category, excludedValues]) =>
          excludedValues.some((value) => isKeyMatchingAttribute(category, value, key)),
      );
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
  // ナンバープレートを取得する場合はAPIを使用
  if ((placement === "rainbow-line-parking-lot-1-gate" && objectClass === "LicensePlate") || (placement === "rainbow-line-parking-lot-2-gate" && objectClass === "LicensePlate")) {
    const toDate = new Date(date.to);
    toDate.setDate(toDate.getDate() + 1); // APIの仕様上

    const cacheKey = `${placement}_${objectClass}_${date.from.getTime()}_${toDate.getTime()}`;

    const now = Date.now();
    if (licensePlateApiCache[cacheKey] && (now - licensePlateApiCache[cacheKey].timestamp) < CACHE_TTL) {
      const rawData = licensePlateApiCache[cacheKey].data;
      return exclude ? removeColumnFromRawData(rawData, exclude) : rawData;
    }

    const rawData = Object.values((await (await fetch(`https://ktxs4d484a.execute-api.ap-northeast-3.amazonaws.com/prod/?placement=${placement}&objectClass=${objectClass}&dateFrom=${date.from.getTime()}&dateTo=${toDate.getTime() - 1}&likelihoodThreshold=0.75&matchingAttributes=2"`)).json() as {message: string, body: Record<string, AggregatedData>}).body);
    licensePlateApiCache[cacheKey] = {
      timestamp: now,
      data: rawData
    };
    return exclude ? removeColumnFromRawData(rawData, exclude) : rawData;
  }

  // 通常のCSVファイルからデータを取得
  const rawData = await getRawData(placement, objectClass);

  let filteredData = [...rawData].filter((rawDataRow) =>
    isDateIncludedInRange(new Date(rawDataRow["aggregate from"]), date),
  );
  
  if (exclude) filteredData = removeColumnFromRawData(filteredData, exclude);
  return filteredData;
}

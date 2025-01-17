import { AggregatedData } from "./aggregated-data.interface";

export const places = {
  "fukui-terminal": {
    placement: "fukui-station-east-entrance",
    text: "福井駅",
    targetObjects: ["Person", "Face"] as const as AggregatedData["object class"][],
  },
  tojinbo: {
    placement: "tojinbo-shotaro",
    text: "東尋坊",
    targetObjects: ["Person", "Face"] as const as AggregatedData["object class"][],
  },
  "rainbow-one": {
    placement: "rainbow-line-parking-lot-1-gate",
    text: "レインボーライン 第一駐車場",
    targetObjects: ["Face", "LisencePlate"] as const as AggregatedData["object class"][],
  },
  "rainbow-two": {
    placement: "rainbow-line-parking-lot-2-gate",
    text: "レインボーライン 第二駐車場",
    targetObjects: ["Face", "LisencePlate"] as const as AggregatedData["object class"][],
  },
} as const;
export type Place = keyof typeof places;
export type Placement = (typeof places)[Place]["placement"];
export const isPlace = (v: unknown): v is Place => Object.keys(places).includes(String(v));

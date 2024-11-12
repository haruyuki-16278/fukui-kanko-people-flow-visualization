export const places = {
  "fukui-terminal": "福井駅",
  tojinbo: "東尋坊",
  "rainbow-one": "レインボーライン 第一駐車場",
  "rainbow-two": "レインボーライン 第二駐車場",
} as const;
export type Place = keyof typeof places;
export const isPlace = (v: unknown): v is Place => Object.keys(places).includes(String(v));

export const graphs = {
  "detected-people": "単位時間あたりに人が検出された回数",
  "detected-face": "単位時間あたりに人の顔が検出された回数",
  "estimated-age": "推定された年齢の割合",
  "estimated-gender": "推定された性別の割合",
} as const;
export type Graph = keyof typeof graphs;
export const isGraph = (v: unknown): v is Graph => Object.keys(graphs).includes(String(v));

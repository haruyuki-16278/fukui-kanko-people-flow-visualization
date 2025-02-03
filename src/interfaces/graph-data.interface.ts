export type Count = { count: number };
export const isCount = (v: object): v is Count => {
  return "count" in v && typeof v["count"] === "number";
};

type Coordinates = "cartesian" | "poler";
type CartesianCharts = "bar";
type PolerCharts = "pie";

export type Data = {
  [coordinate in Coordinates]?: coordinate extends "cartesian"
    ? {
        [cartesianChart in CartesianCharts]: {
          [crossAxisValue: string]: {
            [idAttribute: string]: {
              count: number;
            };
          };
        };
      }
    : {
        [polerChart in PolerCharts]: {
          [idAttribute: string]: {
            count: number;
          };
        };
      };
};

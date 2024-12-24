"use client";

import { GraphIcon } from "@primer/octicons-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Props } from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const graphTypes = [
  "line",
  "area",
  "bar",
  "pie",
  "donut",
  "radialBar",
  "scatter",
  "bubble",
  "heatmap",
  "candlestick",
  "boxPlot",
  "radar",
  "polarArea",
  "rangeBar",
  "rangeArea",
  "treemap",
] as const;

/**
 * クライアントでApexChartのグラフを表示するコンポーネント
 * @param props Apex ChartのChartコンポーネントにわたすプロパティ
 */
export function Graph(
  props: Required<Pick<Props, "type" | "series" | "options">> & {
    size?: "large" | "medium" | "small";
  },
) {
  const [innerWidth, setInnerWidth] = useState(640);
  useEffect(() => {
    setInnerWidth(window.innerWidth);
  }, [setInnerWidth]);
  return (
    <div className={`relative grid h-fit w-[360px] place-content-center sm:h-[360px] sm:w-[480px]`}>
      <div className="absolute left-0 top-0 grid h-fit w-[360px] place-content-center sm:h-[360px] sm:w-[480px]">
        <GraphIcon className="fill-surface animate-pulse" size="large" />
      </div>
      <Chart
        className="absolute left-0 top-0 grid h-fit w-[360px] place-content-center bg-background sm:h-[360px] sm:w-[480px]"
        type={props?.type}
        series={props?.series}
        height={innerWidth <= 640 ? 270 : 360}
        width={innerWidth <= 640 ? 360 : 480}
        stroke={props?.type === "line" ? { curve: "smooth", width: 1 } : {}}
        options={{
          ...props?.options,
          chart: { ...props?.options?.chart, animations: { enabled: false } },
          dataLabels: {
            ...props.options.dataLabels,
            formatter: ["pie", "donut"].includes(props.type)
              ? (val, opts) => {
                  const name = opts.w.globals.labels[opts.seriesIndex];
                  return [name, Number(val).toFixed(1) + "%"] as unknown as string;
                }
              : undefined,
          },
        }}
      />
    </div>
  );
}

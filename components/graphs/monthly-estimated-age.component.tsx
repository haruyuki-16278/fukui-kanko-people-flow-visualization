import { Placement } from "@/interfaces/place.interface";
import { readFileSync } from "fs";
import Papa from "papaparse";
import { Card } from "../card.component";
import { Graph } from "../graph.component";
import { ageRanges, AggregatedData } from "@/interfaces/aggregated-data.interface";

const days = ["日", "月", "火", "水", "木", "金", "土"];
const dayColors = [
  "#f2bfbf",
  "transparent",
  "#f3f3f3",
  "transparent",
  "#f3f3f3",
  "transparent",
  "#b1e3fc",
];

export async function MonthlyEstimatedAgeGraph(props: {
  placement: Placement;
  year: number;
  month: number;
}) {
  const csvStr = readFileSync(
    `${process.cwd()}/data/people-flow-data/monthly/${props.placement}/Face/${props.year}/${props.year}-${props.month.toString().padStart(2, "0")}.csv`,
  ).toString();
  const data = Papa.parse<AggregatedData>(csvStr, { header: true }).data.slice(0, -1);
  // console.log(data);

  const firstDayDow = new Date(data[0]["aggregate from"]).getDay();
  const options = {
    series: Object.entries(ageRanges).map(([k, v]) => {
      return {
        name: v,
        data: data.map((w) =>
          Number(
            Object.entries(w).reduce((sum, [l, w]) => {
              if (l.endsWith(k)) sum += Number(w);
              return sum;
            }, 0),
          ),
        ),
      };
    }),
    xaxis: {
      categories: data.map((v) => {
        const date = new Date(v["aggregate from"]);
        return `${date.getMonth() + 1}/${date.getDate()} (${days[date.getDay()]})`;
      }),
    },
    yaxis: {
      title: {
        text: "割合 [%]",
      },
    },
    chart: {
      type: "bar" as const,
      stacked: true,
      stackType: "100%" as const,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end" as const,
      },
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
      column: {
        colors: [...dayColors.slice(firstDayDow), ...dayColors.slice(0, firstDayDow)],
        opacity: 0.5,
      },
    },
  };

  return (
    <Card
      title="推定された年齢の割合 日別"
      information="AIカメラによる顔検出結果をもとに集計しています"
      sourceUrl={`https://github.com/code4fukui/fukui-kanko-people-flow-data/blob/main/monthly/${props.placement}/Face/${props.year}/${props.year}-${props.month}.csv`}
    >
      <Graph type="bar" series={options.series} options={options}></Graph>
    </Card>
  );
}

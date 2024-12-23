"use server";
import { Placement } from "@/interfaces/place.interface";
import { readFileSync } from "fs";
import Papa from "papaparse";
import Card from "../card.component";
import { Graph } from "../graph.component";
import { AggregatedData, prefectures } from "@/interfaces/aggregated-data.interface";

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

export default async function MonthlyEstimatedPrefectureGraph(props: {
  placement: Placement;
  year: number;
  month: number;
}) {
  const csvStr = readFileSync(
    `${process.cwd()}/data/people-flow-data/monthly/${props.placement}/LicensePlate/${props.year}/${props.year}-${props.month}.csv`,
  ).toString();
  const data = Papa.parse<AggregatedData>(csvStr, { header: true }).data.slice(0, -1);
  // console.log(data);

  const firstDayDow = new Date(props.year, props.month - 1).getDay();
  const options = {
    series: Object.entries(prefectures).map(([k, v]) => {
      return {
        name: v,
        data: data.map((w) =>
          Number(
            Object.entries(w).reduce((sum, [l, u]) => {
              if (l.startsWith(k)) sum += Number(u);
              return sum;
            }, 0),
          ),
        ),
      };
    }),
    xaxis: {
      title: {
        text: "日付",
      },
      categories: data.map((v) => {
        const date = new Date(v["aggregate from"]);
        return `${date.getMonth() + 1}/${date.getDate()} (${days[date.getDay()]})`;
      }),
    },
    yaxis: {
      title: {
        text: "割合",
      },
    },
    chart: {
      type: "bar",
      stacked: true,
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
        borderRadiusApplication: "end",
      },
    },
    legend: {
      show: false,
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
    <Card title="検出されたナンバープレートの地域">
      <Graph type="bar" series={options.series} options={options}></Graph>
    </Card>
  );
}

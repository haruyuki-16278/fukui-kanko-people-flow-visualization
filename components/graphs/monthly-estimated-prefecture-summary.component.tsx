import { Placement } from "@/interfaces/place.interface";
import { readFileSync } from "fs";
import Papa from "papaparse";
import { Card } from "../card.component";
import { Graph } from "../graph.component";
import { AggregatedData, prefectures } from "@/interfaces/aggregated-data.interface";

export async function MonthlyEstimatedPrefectureSummaryGraph(props: {
  placement: Placement;
  year: number;
  month: number;
}) {
  const csvStr = readFileSync(
    `${process.cwd()}/data/people-flow-data/monthly/${props.placement}/LicensePlate/${props.year}/${props.year}-${props.month}.csv`,
  ).toString();
  const data = Papa.parse<AggregatedData>(csvStr, { header: true }).data.slice(0, -1);
  // console.log(data);

  const summary = Object.entries(prefectures)
    .map(([k, v]) => {
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
    })
    .map((byPrefecture) => ({
      name: byPrefecture.name,
      value: byPrefecture.data.reduce((sum, data) => (sum += data), 0),
    }));

  const options = {
    series: summary.map((v) => v.value),
    labels: summary.map((v) => v.name),
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
            },
          },
        },
      },
    },
  };

  return (
    <Card
      title="一ヶ月の累計台数 ナンバープレートの地域名別"
      information="AIカメラによるナンバープレートの検出・分析結果をもとに集計・分類しています"
    >
      <Graph type="donut" series={options.series} options={options} />
    </Card>
  );
}

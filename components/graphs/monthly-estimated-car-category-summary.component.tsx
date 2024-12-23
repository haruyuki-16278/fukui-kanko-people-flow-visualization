"use server";
import { Placement } from "@/interfaces/place.interface";
import { readFileSync } from "fs";
import Papa from "papaparse";
import Card from "../card.component";
import { Graph } from "../graph.component";
import { AggregatedData, carCategories } from "@/interfaces/aggregated-data.interface";

export default async function MonthlyEstimatedCarCategorySummaryGraph(props: {
  placement: Placement;
  year: number;
  month: number;
}) {
  const csvStr = readFileSync(
    `${process.cwd()}/public/people-flow-data/monthly/${props.placement}/LicensePlate/${props.year}/${props.year}-${props.month}.csv`,
  ).toString();
  const data = Papa.parse<AggregatedData>(csvStr, { header: true }).data.slice(0, -1);
  // console.log(data);

  const summary = Object.entries(carCategories)
    .map(([k, v]) => {
      return {
        name: v,
        data: data.map((w) =>
          Number(
            Object.entries(w).reduce((sum, [l, u]) => {
              if (l.endsWith(k)) sum += Number(u);
              return sum;
            }, 0),
          ),
        ),
      };
    })
    .map((byCategory) => ({
      name: byCategory.name,
      value: byCategory.data.reduce((sum, data) => (sum += data), 0),
    }));

  const options = {
    series: summary.map((v) => v.value),
    labels: summary.map((v) => v.name),
    chart: {
      type: "donut",
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
    <Card title="検出されたナンバープレートの地域">
      <Graph type="donut" series={options.series} options={options}></Graph>
    </Card>
  );
}

import { Place } from "@/interfaces/place.interface";
import { DataService } from "@/services/data.service";
import Card from "../card.component";
import { Graph } from "../graph.component";
import { aRegionFromRegion } from "@/interfaces/license-plate.interface";

export default async function EstimatedARegionGraph(props: { place: Place; date: Date }) {
  const dataService = new DataService();

  const year = props.date.getFullYear();
  const month = props.date.getMonth() + 1;
  const day = props.date.getDate();

  const data = (await dataService.get(props.place, year, month, day))
    .filter((row) => row[1] === "LicensePlate")
    .map((row) => aRegionFromRegion(row[7]))
    .filter((row) => typeof row !== "undefined")
    .reduce(
      (p: { answer: string; count: number }[][], c) => {
        if (!p[0].map((v) => v.answer).includes(c)) p[0].push({ answer: c, count: 0 });
        p[0][p[0].map((v) => v.answer).indexOf(c)].count += 1;
        return p;
      },
      [[]],
    )[0]
    .sort((a, b) =>
      a.answer === "不明" ? Infinity : b.answer === "不明" ? -Infinity : b.count - a.count,
    );

  const options = {
    series: data.map((v) => v.count),
    labels: data.map((v) => v.answer),
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
    <Card title="認識されたナンバープレートの地域の割合">
      <Graph type="donut" series={options.series} options={options} />
    </Card>
  );
}

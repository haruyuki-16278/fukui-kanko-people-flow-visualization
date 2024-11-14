import { Place } from "@/interfaces/place.interface";
import { DataService } from "@/services/data.service";
import Card from "../card.component";
import { Graph } from "../graph.component";

export default async function DetectedLisencePlateGraph(props: { place: Place; date: Date }) {
  const dataService = new DataService();

  const year = props.date.getFullYear();
  const month = props.date.getMonth() + 1;
  const day = props.date.getDate();

  const data = (await dataService.get(props.place, year, month, day)).filter(
    (row) => row[1] === "LicensePlate",
  );

  const licensePlateAt: number[] = (() => {
    const arr = [];
    for (let _ = 0; _ < 24; _++) arr.push(0);
    return arr;
  })();
  data.forEach((row) => (licensePlateAt[new Date(row[2]).getHours()] += 1));
  const options = {
    series: [
      {
        type: "column",
        data: licensePlateAt.map((v, i) => ({ x: `${i}時`, y: `${v}回` })),
      },
    ],
    labels: licensePlateAt.map((_, i) => (i % 3 === 0 ? `${i}時` : "")),
  };

  return (
    <Card title="単位時間あたりにナンバープレートが検出された回数">
      <p className="text-sm">{`合計: ${licensePlateAt.reduce((sum, v) => sum + v, 0)}回`}</p>
      <Graph type="bar" series={options.series} options={options} />
    </Card>
  );
}

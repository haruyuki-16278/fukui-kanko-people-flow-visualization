import { DataService, Place } from "@/services/data.service";
import Card from "../card.component";
import { Graph } from "../graph.component";

export default async function DetectedFaceGraph(props: { place: Place; date: Date }) {
  const dataService = new DataService();

  const year = props.date.getFullYear();
  const month = props.date.getMonth() + 1;
  const day = props.date.getDate();

  const data = (await dataService.get(props.place, year, month, day)).filter(
    (row) => row[1] === "Face",
  );

  const faceAt: number[] = (() => {
    const arr = [];
    for (let _ = 0; _ < 24; _++) arr.push(0);
    return arr;
  })();
  data.forEach((row) => (faceAt[new Date(row[2]).getHours()] += 1));
  const options = {
    series: [
      {
        type: "column",
        data: faceAt.map((v, i) => ({ x: `${i}時`, y: `${v}回` })),
      },
    ],
    labels: faceAt.map((_, i) => (i % 3 === 0 ? `${i}時` : "")),
  };

  return (
    <Card title="単位時間あたりに人の顔が検出された回数">
      <p className="text-sm">{`合計: ${faceAt.reduce((sum, v) => sum + v, 0)}回`}</p>
      <Graph type="bar" series={options.series} options={options} />
    </Card>
  );
}

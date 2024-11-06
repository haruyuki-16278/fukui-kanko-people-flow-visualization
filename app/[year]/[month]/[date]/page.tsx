import DetectedFaceGraph from "@/components/graphs/detected-face.component";
import DetectedPeopleGraph from "@/components/graphs/detected-people.component";
import EstimatedAgeGraph from "@/components/graphs/estimated-age.component";
import EstimatedGenderGraph from "@/components/graphs/estimated-gender.component";

const days = ["日", "月", "火", "水", "木", "金", "土"] as const;

export default async function byDate({
  params,
}: {
  params: Promise<{ year: string; month: string; date: string }>;
}) {
  const date = new Date(
    ((params) => `${params.year}-${params.month}-${params.date}`)(await params),
  );
  const dateStr = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}(${days[date.getDay()]})`;
  return (
    <>
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">福井駅でのAIカメラによる解析</h2>
        <p className="mb-4">{dateStr} 分</p>
        <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetectedFaceGraph place={"fukui-terminal"} date={date} />
          <DetectedPeopleGraph place={"fukui-terminal"} date={date} />
          <EstimatedAgeGraph place={"fukui-terminal"} date={date} />
          <EstimatedGenderGraph place={"fukui-terminal"} date={date} />
        </div>
      </article>
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">東尋坊でのAIカメラによる解析</h2>
        <p className="mb-4">{dateStr} 分</p>
        <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetectedFaceGraph place={"tojinbo"} date={date} />
          <DetectedPeopleGraph place={"tojinbo"} date={date} />
          <EstimatedAgeGraph place={"tojinbo"} date={date} />
          <EstimatedGenderGraph place={"tojinbo"} date={date} />
        </div>
      </article>
    </>
  );
}

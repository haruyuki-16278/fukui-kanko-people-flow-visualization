import DateNavigation from "@/components/date-navigation.component";
import DetectedFaceGraph from "@/components/graphs/detected-face.component";
import DetectedPeopleGraph from "@/components/graphs/detected-people.component";
import EstimatedAgeGraph from "@/components/graphs/estimated-age.component";
import EstimatedGenderGraph from "@/components/graphs/estimated-gender.component";
import { DateService } from "@/services/date.service";

export async function generateStaticParams() {
  const yesterday = DateService.yesterday();
  const routes = [];
  for (
    let i = new Date(DateService.minDate);
    i.getTime() < yesterday.getTime();
    i.setDate(i.getDate() + 1)
  ) {
    routes.push({
      year: i.getFullYear().toString(),
      month: (i.getMonth() + 1).toString().padStart(2, "0"),
      date: i.getDate().toString().padStart(2, "0"),
    });
  }

  return routes;
}

export default async function page({
  params,
}: {
  params: Promise<{ year: string; month: string; date: string }>;
}) {
  const date = new Date(
    ((params) => `${params.year}-${params.month}-${params.date}`)(await params),
  );
  return (
    <>
      <DateNavigation currentDate={date} className="mb-4"></DateNavigation>
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">福井駅でのAIカメラによる解析</h2>
        <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetectedPeopleGraph place={"fukui-terminal"} date={date} />
          <DetectedFaceGraph place={"fukui-terminal"} date={date} />
          <EstimatedAgeGraph place={"fukui-terminal"} date={date} />
          <EstimatedGenderGraph place={"fukui-terminal"} date={date} />
        </div>
      </article>
      <article className="mb-4 flex flex-col items-center p-4">
        <h2 className="mb-2 text-xl font-bold">東尋坊でのAIカメラによる解析</h2>
        <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetectedPeopleGraph place={"tojinbo"} date={date} />
          <DetectedFaceGraph place={"tojinbo"} date={date} />
          <EstimatedAgeGraph place={"tojinbo"} date={date} />
          <EstimatedGenderGraph place={"tojinbo"} date={date} />
        </div>
      </article>
    </>
  );
}

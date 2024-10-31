import DetectedFaceGraph from "@/components/graphs/detected-face.component";
import DetectedPeopleGraph from "@/components/graphs/detected-people.component";
import EstimatedAgeGraph from "@/components/graphs/estimated-age.component";
import EstimatedGenderGraph from "@/components/graphs/estimated-gender.component";

export default async function Home() {
  return (
    <>
      <h2 className="mb-4 text-xl font-bold">福井駅でのAIカメラによる解析</h2>
      <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DetectedFaceGraph place={"fukui-terminal"} date={new Date("2024-10-30")} />
        <DetectedPeopleGraph place={"fukui-terminal"} date={new Date("2024-10-30")} />
        <EstimatedAgeGraph place={"fukui-terminal"} date={new Date("2024-10-30")} />
        <EstimatedGenderGraph place={"fukui-terminal"} date={new Date("2024-10-30")} />
      </div>
    </>
  );
}

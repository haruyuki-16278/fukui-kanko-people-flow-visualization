import { MonthlyDetectedPersonGraph } from "@/components/graphs/monthly-detected-person.component";
import { MonthlyEstimatedAgeGraph } from "@/components/graphs/monthly-estimated-age.component";
import { MonthlyEstimatedCarCategorySummaryGraph } from "@/components/graphs/monthly-estimated-car-category-summary.component";
import { MonthlyEstimatedCarCategoryGraph } from "@/components/graphs/monthly-estimated-car-category.component";
import { MonthlyEstimatedGenderGraph } from "@/components/graphs/monthly-estimated-gender.component";
import { MonthlyEstimatedPrefectureSummaryGraph } from "@/components/graphs/monthly-estimated-prefecture-summary.component";
import { MonthlyEstimatedPrefectureGraph } from "@/components/graphs/monthly-estimated-prefecture.component";
import { MonthlyPageNavigation } from "@/components/monthly-page-navigation.component";
import { Placement, places } from "@/interfaces/place.interface";
import Link from "next/link";

export async function generateStaticParams() {
  const routes = [];
  for (const placement of Object.values(places).map((v) => v.placement)) {
    for (
      let i = new Date("2024-10-01");
      i.getTime() < new Date().getTime();
      i.setMonth(i.getMonth() + 1)
    ) {
      routes.push({
        placement: placement,
        year: i.getFullYear().toString(),
        month: (i.getMonth() + 1).toString().padStart(2, "0"),
      });
    }
  }

  return routes;
}

export default async function Page({
  params,
}: {
  params: Promise<{ placement: Placement; year: string; month: string }>;
}) {
  const date = new Date(((params) => `${params.year}-${params.month}-01`)(await params));
  return (
    <>
      <MonthlyPageNavigation
        placement={(await params).placement}
        year={date.getFullYear()}
        month={date.getMonth() + 1}
      />
      {(await params).placement === "fukui-station-east-entrance" ? (
        <article className="mb-4 flex flex-col items-center p-4">
          <h2 className="mb-2 text-xl font-bold">福井駅東口（観光案内所前）</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <MonthlyDetectedPersonGraph
              placement="fukui-station-east-entrance"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyDetectedPersonGraph>
            <MonthlyEstimatedGenderGraph
              placement="fukui-station-east-entrance"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedGenderGraph>
            <MonthlyEstimatedAgeGraph
              placement="fukui-station-east-entrance"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedAgeGraph>
          </div>
        </article>
      ) : (await params).placement === "tojinbo-shotaro" ? (
        <article className="mb-4 flex flex-col items-center p-4">
          <h2 className="mb-2 text-xl font-bold">東尋坊</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <MonthlyDetectedPersonGraph
              placement="tojinbo-shotaro"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyDetectedPersonGraph>
            <MonthlyEstimatedGenderGraph
              placement="tojinbo-shotaro"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedGenderGraph>
            <MonthlyEstimatedAgeGraph
              placement="tojinbo-shotaro"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedAgeGraph>
          </div>
        </article>
      ) : (await params).placement === "rainbow-line-parking-lot-1-gate" ? (
        <article className="mb-4 flex flex-col items-center p-4">
          <h2 className="mb-2 text-xl font-bold">レインボーライン第一駐車場</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <MonthlyEstimatedPrefectureGraph
              placement="rainbow-line-parking-lot-1-gate"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedPrefectureGraph>
            <MonthlyEstimatedPrefectureSummaryGraph
              placement="rainbow-line-parking-lot-1-gate"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedPrefectureSummaryGraph>
            <MonthlyEstimatedCarCategoryGraph
              placement="rainbow-line-parking-lot-1-gate"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedCarCategoryGraph>
            <MonthlyEstimatedCarCategorySummaryGraph
              placement="rainbow-line-parking-lot-1-gate"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedCarCategorySummaryGraph>
          </div>
        </article>
      ) : (await params).placement === "rainbow-line-parking-lot-2-gate" ? (
        <article className="mb-4 flex flex-col items-center p-4">
          <h2 className="mb-2 text-xl font-bold">レインボーライン第二駐車場</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <MonthlyEstimatedPrefectureGraph
              placement="rainbow-line-parking-lot-2-gate"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedPrefectureGraph>
            <MonthlyEstimatedPrefectureSummaryGraph
              placement="rainbow-line-parking-lot-2-gate"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedPrefectureSummaryGraph>
            <MonthlyEstimatedCarCategoryGraph
              placement="rainbow-line-parking-lot-2-gate"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedCarCategoryGraph>
            <MonthlyEstimatedCarCategorySummaryGraph
              placement="rainbow-line-parking-lot-2-gate"
              year={date.getFullYear()}
              month={date.getMonth() + 1}
            ></MonthlyEstimatedCarCategorySummaryGraph>
          </div>
        </article>
      ) : (
        <div>
          <p>表示するグラフがありません</p>
          <Link href="/">トップに戻る</Link>
        </div>
      )}
    </>
  );
}

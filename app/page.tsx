import { MonthlyDetectedPersonGraph } from "@/components/graphs/monthly-detected-person.component";
import { MonthlyEstimatedPrefectureGraph } from "@/components/graphs/monthly-estimated-prefecture.component";
import { ChevronRightIcon } from "@primer/octicons-react";
import Link from "next/link";

export default async function Home() {
  const date = new Date();
  return (
    <>
      <article className="flex flex-wrap justify-center gap-4">
        <div className="mb-4 flex flex-col items-center p-4">
          <h2 className="mb-2 text-xl font-bold">福井駅東口（観光案内所前）</h2>
          <MonthlyDetectedPersonGraph
            placement="fukui-station-east-entrance"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyDetectedPersonGraph>
          <Link
            href={`/fukui-station-east-entrance/monthly/${date.getFullYear()}/${date.getMonth() + 1}`}
            className="mt-4 flex items-center underline hover:font-bold hover:text-primary"
          >
            福井駅のデータを詳しく見る
            <ChevronRightIcon size={"medium"} />
          </Link>
        </div>
        <div className="mb-4 flex flex-col items-center p-4">
          <h2 className="mb-2 text-xl font-bold">東尋坊</h2>
          <MonthlyDetectedPersonGraph
            placement="tojinbo-shotaro"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyDetectedPersonGraph>
          <Link
            href={`/tojinbo-shotaro/monthly/${date.getFullYear()}/${date.getMonth() + 1}`}
            className="mt-4 flex items-center underline hover:font-bold hover:text-primary"
          >
            東尋坊のデータを詳しく見る
            <ChevronRightIcon size={"medium"} />
          </Link>
        </div>
        <div className="mb-4 flex flex-col items-center p-4">
          <h2 className="mb-2 text-xl font-bold">レインボーライン</h2>
          <MonthlyEstimatedPrefectureGraph
            placement="rainbow-line-parking-lot-1-gate"
            year={date.getFullYear()}
            month={date.getMonth() + 1}
          ></MonthlyEstimatedPrefectureGraph>
          <Link
            href={`/rainbow-line-parking-lot-1-gate/monthly/${date.getFullYear()}/${date.getMonth() + 1}`}
            className="mt-4 flex items-center underline hover:font-bold hover:text-primary"
          >
            レインボーライン第一駐車場のデータを詳しく見る
            <ChevronRightIcon size={"medium"} />
          </Link>
          <Link
            href={`/rainbow-line-parking-lot-2-gate/monthly/${date.getFullYear()}/${date.getMonth() + 1}`}
            className="mt-4 flex items-center underline hover:font-bold hover:text-primary"
          >
            レインボーライン第二駐車場のデータを詳しく見る
            <ChevronRightIcon size={"medium"} />
          </Link>
        </div>
      </article>
    </>
  );
}

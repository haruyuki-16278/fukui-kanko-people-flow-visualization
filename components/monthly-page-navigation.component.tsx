import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import Link from "next/link";

const startedAt = new Date("2024-10-01");
const latestMonth = (() => {
  const v = new Date();
  v.setDate(1);
  v.setHours(0);
  v.setMinutes(0);
  v.setSeconds(0);
  v.setMilliseconds(0);
  return v;
})();

export async function MonthlyPageNavigation(props: {
  year: string | number;
  month: string | number;
  className?: string;
}) {
  const current = new Date(`${props.year}-${props.month}-01`);
  const prevAvailable = startedAt.getTime() < current.getTime();
  const prevDate = (() => {
    const v = new Date(current);
    v.setMonth(v.getMonth() - 1);
    return v;
  })();
  const nextAvailable = latestMonth.getTime() > current.getTime();
  const nextDate = (() => {
    const v = new Date(current);
    v.setMonth(v.getMonth() + 1);
    return v;
  })();

  return (
    <nav className={`flex w-3/4 min-w-96 items-center justify-between ${props.className}`}>
      {prevAvailable ? (
        <Link
          className="group flex w-40 flex-shrink-[1] items-center justify-start text-primary underline transition-all hover:font-bold"
          href={`/monthly/${prevDate.getFullYear()}/${prevDate.getMonth() + 1}`}
        >
          <ChevronLeftIcon size={"medium"} className="group-hover:scale-110" />
          {`${prevDate.getFullYear()}年 ${prevDate.getMonth() + 1}月`}
        </Link>
      ) : (
        <span className="flex w-40 flex-shrink-[1] items-center justify-start text-gray-500">
          <ChevronLeftIcon size={"medium"} />
          以前のデータなし
        </span>
      )}
      <h2 className="flex-shrink-[1] text-center text-lg font-bold">
        {`${current.getFullYear()}年 ${current.getMonth() + 1}月`}
      </h2>
      {nextAvailable ? (
        <Link
          className="group flex w-40 flex-shrink-[1] items-center justify-end text-primary underline transition-all hover:font-bold"
          href={`/monthly/${nextDate.getFullYear()}/${nextDate.getMonth() + 1}`}
        >
          {`${nextDate.getFullYear()}年 ${nextDate.getMonth() + 1}月`}
          <ChevronRightIcon size={"medium"} className="group-hover:scale-110" />
        </Link>
      ) : (
        <span className="flex w-40 flex-shrink-[1] items-center justify-end text-gray-500">
          以後のデータなし
          <ChevronRightIcon size={"medium"} />
        </span>
      )}
    </nav>
  );
}

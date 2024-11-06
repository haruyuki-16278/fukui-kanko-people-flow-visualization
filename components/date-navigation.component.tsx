import { DateService } from "@/services/date.service";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import Link from "next/link";

export default async function DateNavigation(props: { currentDate: Date }) {
  const prevDate = ((currentDate) => {
    const res = new Date(currentDate);
    res.setDate(res.getDate() - 1);
    return res;
  })(props.currentDate);
  const prevDateStr = DateService.dateStrOf(prevDate, "/");
  const nextDate = ((currentDate) => {
    const res = new Date(currentDate);
    res.setDate(res.getDate() + 1);
    return res;
  })(props.currentDate);
  const nextDateStr = DateService.dateStrOf(nextDate, "/");

  return (
    <nav className="flex w-3/4 min-w-96 items-center justify-between">
      {prevDate.getTime() >= DateService.minDate.getTime() ? (
        <Link
          className="group flex w-40 flex-shrink-[1] items-center justify-start text-primary underline transition-all hover:font-bold"
          href={"/" + prevDateStr}
        >
          <ChevronLeftIcon size={"medium"} className="group-hover:scale-110" />
          {prevDateStr} {`(${DateService.dows[prevDate.getDay()]})`}
        </Link>
      ) : (
        <span className="flex w-40 flex-shrink-[1] items-center justify-start text-gray-500">
          <ChevronLeftIcon size={"medium"} />
          以前のデータなし
        </span>
      )}
      <h2 className="flex-shrink-[1] text-center text-lg font-bold">
        {DateService.dateStrOf(props.currentDate)}{" "}
        {`(${DateService.dows[props.currentDate.getDay()]})`}
      </h2>
      {nextDate.getTime() <= new Date().getTime() - 1000 * 60 * 60 * 24 ? (
        <Link
          className="group flex w-40 flex-shrink-[1] items-center justify-end text-primary underline transition-all hover:font-bold"
          href={"/" + nextDateStr}
        >
          {nextDateStr} {`(${DateService.dows[nextDate.getDay()]})`}
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

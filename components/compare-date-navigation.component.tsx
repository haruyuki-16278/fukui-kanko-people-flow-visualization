"use client";
import { DateService } from "@/services/date.service";
import { ChangeEvent } from "react";

export default function CompareDateNavigation(props: {
  currentDateStr: string;
  viewPosition: "left" | "right";
}) {
  const dow = DateService.dows[new Date(props.currentDateStr).getDay()];
  const onChangeDate = (ev: ChangeEvent<HTMLInputElement>) => {
    const newDate = ev.target.value;
    location.pathname = [
      ...location.pathname.split("/").map((v, i) => {
        if (i === 4 + (props.viewPosition === "left" ? 0 : 1)) return newDate;
        else return v;
      }),
    ].join("/");
  };

  return (
    <div className="flex w-full items-center justify-center">
      <input
        type="date"
        min={DateService.dateStrOf(DateService.minDate)}
        max={DateService.dateStrOf(new Date())}
        defaultValue={props.currentDateStr}
        onChange={onChangeDate}
      />
      <span className={dow === "土" ? "text-blue-500" : dow === "日" ? "text-red-500" : ""}>
        ({dow})
      </span>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

type WeekRange = { from: Date; to: Date } | undefined;

type Props =
  | {
      type: "week";
      start: WeekRange;
      end: WeekRange;
      setStart: (range: WeekRange) => void;
      setEnd: (range: WeekRange) => void;
    }
  | {
      type: "date";
      start: Date | undefined;
      end: Date | undefined;
      setStart: (date: Date | undefined) => void;
      setEnd: (date: Date | undefined) => void;
    };

/**
 * 日付を "YYYY/MM/DD" 形式で返す
 */
function formatDate(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * 週レンジを "YYYY/MM/DD ~ YYYY/MM/DD" 形式で返す
 */
function formatWeekRange(range: { from: Date; to: Date }) {
  return `${formatDate(range.from)} ~ ${formatDate(range.to)}`;
}

function getWeekRange(date: Date) {
  const startDay = new Date(date);
  startDay.setDate(date.getDate() - startDay.getDay());
  const endDay = new Date(startDay);
  endDay.setDate(startDay.getDate() + 6);
  return { from: startDay, to: endDay };
}

export const RangeSelector = (props: Props) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  return (
    <div className="flex flex-row gap-6 mb-6">
      <div className="flex flex-col gap-3">
        <Label className="px-1">開始</Label>
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48 justify-between font-normal">
              <span>
                {props.type === "week"
                  ? props.start
                    ? formatWeekRange(props.start)
                    : "Select week"
                  : props.start
                    ? formatDate(props.start)
                    : "Select date"}
              </span>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            {props.type === "week" ? (
              <Calendar
                mode="range"
                selected={props.start}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (date?.from) {
                    props.setStart(getWeekRange(date.from));
                    setOpenStart(false);
                  }
                }}
              />
            ) : (
              <Calendar
                mode="single"
                selected={props.start}
                captionLayout="dropdown"
                onSelect={(date) => {
                  props.setStart(date);
                  setOpenStart(false);
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label className="px-1">終了</Label>
        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48 justify-between font-normal">
              <span>
                {props.type === "week"
                  ? props.end
                    ? formatWeekRange(props.end)
                    : "Select week"
                  : props.end
                    ? formatDate(props.end)
                    : "Select date"}
              </span>
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            {props.type === "week" ? (
              <Calendar
                mode="range"
                selected={props.end}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (date?.from) {
                    props.setEnd(getWeekRange(date.from));
                    setOpenEnd(false);
                  }
                }}
              />
            ) : (
              <Calendar
                mode="single"
                selected={props.end}
                captionLayout="dropdown"
                onSelect={(date) => {
                  props.setEnd(date);
                  setOpenEnd(false);
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

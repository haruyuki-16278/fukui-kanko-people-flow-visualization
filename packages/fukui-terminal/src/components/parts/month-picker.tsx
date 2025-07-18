import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

const months = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

export interface MonthPickerProps {
  onChange?: (date: Date) => void;
  className?: string;
  selected?: Date;
  minDate?: Date;
}

export function MonthPicker({ onChange, className, selected, minDate }: MonthPickerProps) {
  const [year, setYear] = React.useState(new Date().getFullYear());

  const selectedMonth =
    selected && selected.getFullYear() === year ? selected.getMonth() : undefined;

  const handleMonthClick = (monthIndex: number) => {
    if (onChange) {
      onChange(new Date(year, monthIndex, 1));
    }
  };

  return (
    <div className={cn("p-4 w-fit", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => setYear((y) => y - 1)}>
          &lt;
        </Button>
        <span className="font-semibold">{year}年</span>
        <Button variant="ghost" size="icon" onClick={() => setYear((y) => y + 1)}>
          &gt;
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {months.map((m, i) => {
          // minDateが指定されている場合、その年のminDateより前の月はdisabled
          const isDisabled =
            minDate &&
            (year < minDate.getFullYear() ||
              (year === minDate.getFullYear() && i < minDate.getMonth()));
          return (
            <Button
              key={m}
              variant={selectedMonth === i ? "default" : "outline"}
              onClick={() => handleMonthClick(i)}
              className={cn("w-16", selectedMonth === i && "bg-black text-white")}
              disabled={isDisabled}
            >
              {m}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

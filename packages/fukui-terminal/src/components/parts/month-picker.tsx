import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  value?: Date;
  onChange?: (date: Date) => void;
  year?: number;
  className?: string;
  selectedMonthIndex?: number;
  selected?: Date;
}

export function MonthPicker({
  value,
  onChange,
  year: initialYear = new Date().getFullYear(),
  className,
  selectedMonthIndex,
  selected,
}: MonthPickerProps) {
  const [year, setYear] = React.useState(initialYear);
  const selectedMonth =
    selected && selected.getFullYear() === year
      ? selected.getMonth()
      : typeof selectedMonthIndex === "number"
        ? selectedMonthIndex
        : value?.getFullYear() === year
          ? value.getMonth()
          : null;

  const handleMonthClick = (monthIndex: number) => {
    if (onChange) {
      onChange(new Date(year, monthIndex, 1));
    }
  };

  return (
    <Card className={cn("p-4 w-fit", className)}>
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
        {months.map((m, i) => (
          <Button
            key={m}
            variant={selectedMonth === i ? "default" : "outline"}
            onClick={() => handleMonthClick(i)}
            className={cn("w-16", selectedMonth === i && "bg-black text-white")}
          >
            {m}
          </Button>
        ))}
      </div>
    </Card>
  );
}

import { updateSeriesProperty } from "@/components/parts/series-config-card.component";
import { Checkbox } from "@/components/ui/checkbox";
import { GraphSeries } from "@/interfaces/graph-series.interface";
import { cn } from "@/lib/utils";

interface FilterCheckboxProps {
  attributeKey: string;
  itemKey: string;
  label: string;
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  className?: string;
}

export function FilterCheckbox({
  attributeKey,
  itemKey,
  label,
  series,
  notify,
  className,
}: FilterCheckboxProps) {
  return (
    <label className={cn("flex flex-row items-center gap-x-2", className)}>
      <Checkbox
        onCheckedChange={(v) =>
          notify(
            updateSeriesProperty(
              [
                "exclude",
                series.exclude !== undefined
                  ? v
                    ? // truthyなら表示する→excludeからは外す
                      {
                        ...series.exclude,
                        [attributeKey]: [
                          ...series.exclude[attributeKey].filter(
                            (excludeItem) => excludeItem !== itemKey,
                          ),
                        ],
                      }
                    : // falsyなら表示しない→excludeに含める
                      {
                        ...series.exclude,
                        [attributeKey]: [...(series.exclude[attributeKey] ?? []), itemKey],
                      }
                  : v
                    ? undefined
                    : { [attributeKey]: [itemKey] },
              ],
              series,
            ),
          )
        }
        className="block"
        checked={!series.exclude?.[attributeKey]?.includes(itemKey)}
      />
      <span>{label}</span>
    </label>
  );
}

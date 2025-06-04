import { Checkbox } from "@/components/ui/checkbox";
import { GraphSeries } from "@/interfaces/graph-series.interface";

interface FilterCheckboxProps {
  attributeKey: string;
  itemKey: string;
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries;
}

export function FilterCheckbox({
  attributeKey,
  itemKey,
  series,
  notify,
  updateSeriesProperty,
}: FilterCheckboxProps) {
  return (
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
  );
}

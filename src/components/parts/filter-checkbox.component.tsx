import { updateSeriesProperty } from "@/components/parts/series-config-card.component";
import { Checkbox } from "@/components/ui/checkbox";
import { GraphSeries } from "@/interfaces/graph-series.interface";

interface FilterCheckboxProps {
  attributeKey: string;
  itemKey: string;
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
}

export function FilterCheckbox({ attributeKey, itemKey, series, notify }: FilterCheckboxProps) {
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

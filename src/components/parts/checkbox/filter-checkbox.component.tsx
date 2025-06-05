import { Checkbox } from "@/components/ui/checkbox";
import { GraphSeries } from "@/interfaces/graph-series.interface";

interface Props {
  attributeKey: string;
  itemKey: string;
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries;
}

export function handleFilterCheckboxChange(
  series: GraphSeries,
  attributeKey: string,
  itemKey: string,
  isChecked: boolean,
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries,
): GraphSeries {
  return updateSeriesProperty(
    [
      "exclude",
      series.exclude !== undefined
        ? isChecked
          ? // truthyなら表示する→excludeからは外す
            {
              ...series.exclude,
              [attributeKey]: [
                ...series.exclude[attributeKey].filter((excludeItem) => excludeItem !== itemKey),
              ],
            }
          : // falsyなら表示しない→excludeに含める
            {
              ...series.exclude,
              [attributeKey]: [...(series.exclude[attributeKey] ?? []), itemKey],
            }
        : isChecked
          ? undefined
          : { [attributeKey]: [itemKey] },
    ],
    series,
  );
}

export function FilterCheckbox({
  attributeKey,
  itemKey,
  series,
  notify,
  updateSeriesProperty,
}: Props) {
  return (
    <Checkbox
      onCheckedChange={(v) =>
        notify(handleFilterCheckboxChange(series, attributeKey, itemKey, !!v, updateSeriesProperty))
      }
      className="block"
      checked={!series.exclude?.[attributeKey]?.includes(itemKey)}
    />
  );
}

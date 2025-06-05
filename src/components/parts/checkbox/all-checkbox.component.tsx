import { Checkbox } from "@/components/ui/checkbox";
import { GraphSeries } from "@/interfaces/graph-series.interface";

interface Props {
  attributeKey: string;
  itemKey: string[];
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries;
}

export function handleAllCheckboxChange(
  series: GraphSeries,
  attributeKey: string,
  itemKey: string[],
  isChecked: boolean,
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries,
): GraphSeries {
  return updateSeriesProperty(
    [
      "exclude",
      isChecked
        ? { ...series.exclude, [attributeKey]: [] } // 全チェックON
        : {
            ...series.exclude,
            [attributeKey]: itemKey,
          }, // 全チェックOFF
    ],
    series,
  );
}

export function AllCheckbox({
  attributeKey,
  itemKey,
  series,
  notify,
  updateSeriesProperty,
}: Props) {
  return (
    <Checkbox
      onCheckedChange={(v) =>
        notify(handleAllCheckboxChange(series, attributeKey, itemKey, !!v, updateSeriesProperty))
      }
      className="block"
      checked={!series.exclude?.[attributeKey]?.length}
    />
  );
}

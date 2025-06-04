import { Checkbox } from "@/components/ui/checkbox";
import { GraphSeries } from "@/interfaces/graph-series.interface";

interface AllCheckboxProps {
  attributeKey: string;
  itemKey: string[];
  series: GraphSeries;
  notify: (series: GraphSeries) => void;
  updateSeriesProperty: <Key extends keyof GraphSeries>(
    [key, value]: [Key, GraphSeries[Key]],
    series: GraphSeries,
  ) => GraphSeries;
}

export function AllCheckbox({
  attributeKey,
  itemKey,
  series,
  notify,
  updateSeriesProperty,
}: AllCheckboxProps) {
  return (
    <Checkbox
      onCheckedChange={(v) =>
        notify(
          updateSeriesProperty(
            [
              "exclude",
              v
                ? { ...series.exclude, [attributeKey]: [] } // 全チェックON
                : {
                    ...series.exclude,
                    [attributeKey]: itemKey,
                  }, // 全チェックOFF
            ],
            series,
          ),
        )
      }
      className="block"
      checked={!series.exclude?.[attributeKey]?.length}
    />
  );
}

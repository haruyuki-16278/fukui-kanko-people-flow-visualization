import { OpenStar } from "@/components/parts/open-star.component";
import { SeriesConfigCard } from "@/components/parts/series-config-card.component";
import { ShareDialogTrigger } from "@/components/parts/share-dialog.component";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
  ATTRIBUTES,
  attributeValueText,
  JAPANESE_ATTRIBUTE_NAME,
  ObjectClassAttribute,
} from "@/interfaces/aggregated-data.interface";
import { defaultSeriesName, GraphSeries } from "@/interfaces/graph-series.interface";
import { getData } from "@/lib/data/csv";
import { floorDate, getDateStringRange } from "@/lib/date";
import { useLocalStars } from "@/lib/hooks/local-stars";
import { useRecord } from "@/lib/hooks/record";
import { digest, PartiallyRequired } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { GraphIcon, PlusIcon, StarFillIcon, StarIcon } from "@primer/octicons-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

function isSeriesValid(
  series: GraphSeries,
): series is PartiallyRequired<GraphSeries, "placement" | "objectClass"> {
  return (
    series.placement !== undefined &&
    series.objectClass !== undefined &&
    (series.graphType === "simple" ? true : series.focusedAttribute !== undefined)
  );
}

function getDefaultDateRange(): DateRange {
  return {
    from: (() => {
      const from = floorDate(new Date());
      from.setDate(from.getDate() - 14);
      return from;
    })(),
    to: (() => {
      const to = floorDate(new Date());
      to.setDate(to.getDate() - 1);
      return to;
    })(),
  };
}

const getChartConfig = (
  seriesAll: { [id: string]: GraphSeries },
  data: Record<string, string | number>[],
): ChartConfig => {
  if (seriesAll && data && Object.keys(data.at(-1) ?? {}).length > 1) {
    const config: ChartConfig = {};
    Object.keys(data.at(-1) ?? {}).forEach((k) => {
      if (k === "date") return;
      const [id, attributeKey] = k.split("#");
      const series = seriesAll[id];
      if (series === undefined) return id;
      let label = series.name ?? defaultSeriesName(series);
      if (attributeKey !== undefined && attributeKey !== "" && series.focusedAttribute)
        label += " " + attributeValueText(series.focusedAttribute, attributeKey);
      config[k] = {
        label,
      };
    });
    return config;
  } else return {};
};

export default function App() {
  const { stars, appendStar, removeStar } = useLocalStars();
  const [dirty, setDirty] = useState(false);
  const [title, setTitle] = useState<string | undefined>(
    new URL(location.href).searchParams.get("starTitle") ?? undefined,
  );
  const [seriesAll, setSeries, removeSeries] = useRecord<GraphSeries>(
    (() => {
      const starSeriesAll = new URL(location.href).searchParams.get("starSeriesAll");
      return starSeriesAll !== null ? JSON.parse(starSeriesAll) : undefined;
    })(),
  );
  const [isSeriesAllValid, setIsSeriesAllValid] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange());
  const [data, setData] = useState<Record<string, string | number>[] | undefined>(undefined);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [dataDigest, setDataDigest] = useState<string | undefined>(undefined);

  const onClickAddSeries = () => {
    setSeries({ graphType: "simple", show: true });
  };
  const onClickRemoveSeries = (id: string) => {
    removeSeries(id);
    const newData = data
      ? [
          ...data.map((row) => {
            const newRow = { ...row };
            Object.keys(newRow).forEach((key) => {
              if (key.includes(id)) delete newRow[key];
            });
            return newRow;
          }),
        ]
      : [];
    setData(newData);
  };

  const onClickApply = useCallback(async () => {
    setDirty(false);
    if (
      dateRange === undefined ||
      dateRange.from === undefined ||
      dateRange.to === undefined ||
      seriesAll === undefined
    ) {
      setData(undefined);
      return;
    }
    let newData: (Record<string, string | number> & { date: string })[] = getDateStringRange(
      dateRange as { from: Date; to: Date },
    ).map((v) => ({ date: v }));

    // 実データを取得して処理する
    for await (const [id, series] of Object.entries(seriesAll)) {
      if (series.placement === undefined || series.objectClass === undefined) return;

      const rawData = await getData(
        series.placement,
        series.objectClass,
        dateRange as { from: Date; to: Date },
        series.exclude,
      );

      if (series.graphType === "simple") {
        newData = newData.map((newDataRow) => {
          const rawDataRowTheDay = rawData.find((rawDataRow) => {
            return String(rawDataRow["aggregate from"].slice(0, 10)) === newDataRow.date;
          });
          const theDayCount = Number(rawDataRowTheDay?.["total count"]);
          return {
            ...newDataRow,
            [id]: isNaN(theDayCount) ? 0 : theDayCount,
          };
        });
      } else if (series.focusedAttribute) {
        const orientedData: (Record<string, string | number> & { "aggregate from": string })[] =
          rawData.map((rawDataRow) => {
            if (series.focusedAttribute === undefined)
              throw new Error("invalid focused attribute value.");
            const list = ATTRIBUTES[series.focusedAttribute];
            const data: Record<string, string | number> & { "aggregate from": string } = {
              "aggregate from": rawDataRow["aggregate from"],
            };
            Object.keys(list)
              .filter((listitem) => {
                if (!series.exclude || !series.focusedAttribute) return true;
                if (!series.exclude[series.focusedAttribute]) return true;
                return !series.exclude[series.focusedAttribute].includes(listitem);
              })
              .map((listitem) => ({
                [`${series.id}#${listitem}`]: Object.keys(rawDataRow)
                  // TODO: 厳密でないフィルタなので、もっと壊れづらいものを考える
                  .filter((key) => key.startsWith(listitem) || key.endsWith(listitem))
                  .map((key) => Number(rawDataRow[key]))
                  .reduce((sum, current) => (sum += current), 0),
              }))
              .forEach((obj) =>
                Object.entries(obj).forEach(([k, v]) => {
                  data[k] = v;
                }),
              );
            return data;
          });
        newData = newData.map((newDataRow) => ({
          ...newDataRow,
          ...(() => {
            const orientedDataItem = {
              ...(orientedData.find(
                (orientedDataRow) =>
                  orientedDataRow["aggregate from"].slice(0, 10) === newDataRow.date,
              ) as Record<string, string | number>),
            };
            delete orientedDataItem?.["aggregate from"];
            return orientedDataItem;
          })(),
        }));
      }
    }
    setData(newData);
    setChartConfig(getChartConfig(seriesAll, newData));
  }, [dateRange, seriesAll]);

  useEffect(() => {
    if (Object.values(seriesAll).every(isSeriesValid)) {
      setIsSeriesAllValid(true);
      onClickApply();
    } else {
      setDirty(true);
      setIsSeriesAllValid(false);
    }
  }, [seriesAll]);

  useEffect(() => {
    digest(JSON.stringify(data)).then(setDataDigest);
  }, [data]);

  return (
    <>
      <aside className="relative flex h-[calc(100svh_-_96px)] min-h-[calc(100svh_-_96px)] w-72 flex-col items-center gap-y-4 overflow-y-auto border-r-2 px-2">
        <section className="min-h-fit w-full overflow-x-hidden">
          <h2 className="text-lg font-bold">⭐️ お気に入り</h2>
          {Object.keys(stars).length > 0 ? (
            Object.entries(stars).map(([starTitle, starSeriesAll], i) => (
              <OpenStar
                key={`${i}${starTitle}`}
                title={starTitle}
                seriesAll={starSeriesAll}
                removeStar={removeStar}
              />
            ))
          ) : (
            <p className="pl-2">お気に入りがありません</p>
          )}
        </section>
        <section className="w-full">
          <h2 className="mb-2 text-lg font-bold">📅 期間</h2>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(v) => {
              setDateRange(v);
              setDirty(true);
            }}
            disabled={{
              before: new Date("2024-10-17"),
              after: (() => {
                const from = new Date();
                from.setDate(from.getDate() - 1);
                return from;
              })(),
            }}
            className="mx-auto w-fit rounded-md border"
          />
        </section>
        <section className="w-full flex-grow">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold">📈 系統</h2>
            <Button variant="default" size="icon" onClick={onClickAddSeries}>
              <PlusIcon size="medium" />
            </Button>
          </div>
          <div className="flex w-full flex-col gap-y-2 px-1">
            {Object.entries(seriesAll).map(([id, series]) => (
              <SeriesConfigCard
                key={id}
                series={series}
                notify={(nextSeries) => setSeries(nextSeries)}
                onRemoveClick={() => onClickRemoveSeries(id)}
              />
            ))}
          </div>
        </section>
        <section className="sticky bottom-0 flex w-full justify-center bg-[rgb(from_hsl(var(--background))_r_g_b_/_0.8)] py-4 backdrop-blur-sm">
          <Button
            onClick={() => onClickApply()}
            className="mx-auto"
            disabled={!(dirty && isSeriesAllValid)}
          >
            <GraphIcon size="medium" />
            グラフに反映
          </Button>
        </section>
      </aside>
      <article className="flex-glow flex h-[calc(100svh_-_96px)] min-h-[calc(100svh_-_96px)] w-[calc(100%_-_288px)] flex-col items-center justify-center">
        <div className="flex h-12 w-full gap-x-2 pl-4">
          <Input
            placeholder="グラフタイトル"
            onChange={(ev) => setTitle(ev.target.value !== null ? ev.target.value : undefined)}
            defaultValue={title}
            disabled={Object.values(seriesAll).length === 0}
          />
          <Button
            className="shrink-0"
            variant="outline"
            size="icon"
            disabled={
              Object.values(seriesAll).length === 0 ||
              (title !== undefined && title !== "" && Object.keys(stars).includes(title))
            }
            onClick={() => appendStar(title, seriesAll)}
          >
            {title !== undefined && title !== "" && Object.keys(stars).includes(title) ? (
              <StarFillIcon fill="hsl(var(--star))" size="medium" />
            ) : (
              <StarIcon fill="hsl(var(--star))" size="medium" />
            )}
          </Button>
          <ShareDialogTrigger
            disabled={!seriesAll || Object.values(seriesAll).length === 0}
            title={title}
            seriesAll={seriesAll}
          />
        </div>
        {!dirty && data && Object.keys(data.at(-1) ?? {}).length > 1 ? (
          <ChartContainer
            key={dataDigest}
            config={chartConfig}
            className="h-[calc(100svh_-_96px)] min-h-[calc(100svh_-_96px_-_48px)] w-full flex-grow"
          >
            <BarChart
              data={data}
              stackOffset={
                Object.values(seriesAll).every((item) => item.graphType === "ratio")
                  ? "expand"
                  : "none"
              }
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} tickMargin={7} axisLine={false} />
              <YAxis
                type="number"
                tickLine={true}
                tickCount={10}
                domain={[0, (dataMax: number) => Math.floor(dataMax)]}
              />
              {Object.keys(data.at(-1) ?? {})
                .filter((key) => key !== "date")
                .map((key) => [key, ...key.split("#")])
                .map(([key, id, attributeKey], i) => (
                  <Bar
                    type="linear"
                    key={key}
                    dataKey={key}
                    stackId={id}
                    name={
                      seriesAll
                        ? (() => {
                            const series = seriesAll[id];
                            if (!series) return undefined;
                            return series.name === undefined || series.name === ""
                              ? defaultSeriesName(series)
                              : series.name;
                          })() + attributeKey
                          ? JAPANESE_ATTRIBUTE_NAME[attributeKey as ObjectClassAttribute]
                          : ""
                        : key
                    }
                    fill={`hsl(var(--chart-${(i % 5) + 1}))`}
                    radius={id.split("#")[1] === "" ? 2 : 0}
                  />
                ))}
              <ChartTooltip
                cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
                content={<ChartTooltipContent className="bg-white" />}
              />
              {Object.keys(data[0]).length <= 10 ? (
                <ChartLegend content={<ChartLegendContent />} />
              ) : undefined}
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="flex-glow my-auto">グラフに表示するデータをサイドバーで設定して下さい</p>
        )}
      </article>
    </>
  );
}

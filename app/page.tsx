"use client";

import { SeriesConfigCard } from "@/components/parts/series-config-card.component";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  ageRanges,
  AggregatedData,
  carCategories,
  DetailAttributeKey,
  genders,
  ObjectClass,
  prefectures,
} from "@/interfaces/aggregated-data.interface";
import { GraphSeries, GraphType } from "@/interfaces/graph-series.interface";
import { Placement } from "@/interfaces/place.interface";
import { GraphIcon, PlusIcon } from "@primer/octicons-react";
import Papa from "papaparse";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function Home() {
  const [data, setData] = useState<Record<string, string | number>[] | undefined>(undefined);
  const chartConfig = (): ChartConfig => {
    if (series && data && Object.keys(data[0]).length > 1) {
      const config: ChartConfig = {};
      Object.keys(data[0]).forEach((k) => {
        if (k === "date") return;
        const [id, attributeKey] = k.split("#");
        const idSeries = series.find((v) => v.id === id);
        let label = idSeries?.name ?? k;
        if (attributeKey !== "" && idSeries && idSeries.focusedAttribute)
          label +=
            idSeries.focusedAttribute === "ageRanges"
              ? " " + ageRanges[attributeKey as keyof typeof ageRanges]
              : idSeries.focusedAttribute === "genders"
                ? " " + genders[attributeKey as keyof typeof genders]
                : idSeries.focusedAttribute === "prefectures"
                  ? " " + prefectures[attributeKey as keyof typeof prefectures]
                  : idSeries.focusedAttribute === "carCategories"
                    ? " " + carCategories[attributeKey as keyof typeof carCategories]
                    : "";
        config[k] = {
          label,
        };
      });
      return config;
    } else return {};
  };

  const [date, setDate] = useState<DateRange | undefined>({
    from: (() => {
      const from = new Date();
      from.setMilliseconds(0);
      from.setSeconds(0);
      from.setMinutes(0);
      from.setHours(0);
      from.setDate(from.getDate() - 14);
      return from;
    })(),
    to: (() => {
      const to = new Date();
      to.setMilliseconds(0);
      to.setSeconds(0);
      to.setMinutes(0);
      to.setHours(0);
      to.setDate(to.getDate() - 1);
      return to;
    })(),
  });

  const [series, setSeries] = useState<GraphSeries[] | undefined>(undefined);
  const onClickAddSeries = () => {
    const newSeries = series ? [...series] : [];
    newSeries.push({ id: crypto.randomUUID(), graphType: "simple" });
    setSeries(newSeries);
  };
  const onClickRemoveSeries = (id: string) => {
    const newSeries = series ? [...series.filter((v) => v.id !== id)] : [];
    setSeries(newSeries);
  };

  const prepareSeries = (id: string) => {
    if (!series) throw new Error("series state is falsy");
    const newSeries = [...series];
    const index = newSeries.findIndex((v) => v.id === id);
    if (index < 0) throw new Error("unknown series id");
    return [newSeries, index] as const;
  };

  const setShow = (id: string, show: boolean) => {
    const [newSeries, index] = prepareSeries(id);
    newSeries[index].show = show;
    setSeries(newSeries);
  };
  const setName = (id: string, name: string | undefined) => {
    const [newSeries, index] = prepareSeries(id);
    newSeries[index].name = name;
    setSeries(newSeries);
  };
  const setGraphType = (id: string, graphType: GraphType) => {
    const [newSeries, index] = prepareSeries(id);
    newSeries[index].graphType = graphType;
    setSeries(newSeries);
  };
  const setFocusedAttribute = (id: string, focusedAttribute: DetailAttributeKey | undefined) => {
    const [newSeries, index] = prepareSeries(id);
    newSeries[index].focusedAttribute = focusedAttribute;
    setSeries(newSeries);
  };
  const setPlacement = (id: string, placement: Placement | undefined) => {
    const [newSeries, index] = prepareSeries(id);
    newSeries[index].placement = placement;
    setSeries(newSeries);
  };
  const setObjectClass = (id: string, objectClass: ObjectClass | undefined) => {
    const [newSeries, index] = prepareSeries(id);
    newSeries[index].objectClass = objectClass;
    setSeries(newSeries);
  };
  const setExclude = (id: string, exclude: GraphSeries["exclude"]) => {
    const [newSeries, index] = prepareSeries(id);
    newSeries[index].exclude = exclude;
    setSeries(newSeries);
  };

  const onClickApply = async () => {
    if (!date || !date.from || !date.to || !series) {
      setData(undefined);
      return;
    }
    let newData: (Record<string, string | number> & { date: string })[] = [];
    for (const i = new Date(date.from); i <= date.to; i.setDate(i.getDate() + 1))
      newData.push({
        date: `${i.getFullYear()}-${(i.getMonth() + 1).toString().padStart(2, "0")}-${i.getDate().toString().padStart(2, "0")}`,
      });

    for await (const item of series.filter((v) => v.show)) {
      if (!item.objectClass || !item.placement) return;

      const csvStr = await (
        await fetch(`${window.location.origin}/${item.placement}/${item.objectClass}.csv`)
      ).text();

      const rawData = Papa.parse<AggregatedData>(csvStr, { header: true }).data.map(
        (rawDataRow) => {
          if (item.exclude === undefined) return rawDataRow;
          else {
            const filteredRow = { ...rawDataRow };
            Object.keys(filteredRow).forEach((key) => {
              const isKeyMatch = key
                .split(" ")
                .some((keyPart) =>
                  item.exclude
                    ? Object.values(item.exclude).some((exclude) =>
                        exclude.some((excludeItem) => keyPart === excludeItem),
                      )
                    : false,
                );
              if (isKeyMatch) delete filteredRow[key];
            });
            filteredRow["total count"] = Object.entries(filteredRow)
              .filter(
                ([k]) =>
                  ![
                    "placement",
                    "object class",
                    "aggregate from",
                    "aggregate to",
                    "total count",
                  ].includes(k),
              )
              .reduce((sum, current) => (sum += Number(current[1])), 0);
            return filteredRow;
          }
        },
      );
      if (item.graphType === "simple") {
        newData = newData.map((newDataRow) => ({
          ...newDataRow,
          [item.id]:
            Number(
              rawData.find(
                (rawDataRow) =>
                  String(rawDataRow["aggregate from"]).slice(0, 10) === newDataRow.date,
              )?.["total count"],
            ) ?? 0,
        }));
      } else if (item.focusedAttribute) {
        const orientedData: (Record<string, string | number> & { "aggregate from": string })[] =
          rawData.map((rawDataRow) => {
            let list;
            switch (item.focusedAttribute) {
              case "ageRanges":
                list = ageRanges;
                break;
              case "genders":
                list = genders;
                break;
              case "prefectures":
                list = prefectures;
                break;
              case "carCategories":
                list = carCategories;
                break;
              default:
                throw new Error("invalid focuced attribute");
            }
            const data: Record<string, string | number> & { "aggregate from": string } = {
              "aggregate from": rawDataRow["aggregate from"],
            };
            Object.keys(list)
              .map((listitem) => ({
                [`${item.id}#${listitem}`]:
                  Object.keys(rawDataRow)
                    // TODO: 厳密でないフィルタなので、もっと壊れづらいものを考える
                    .filter((key) => key.startsWith(listitem) || key.endsWith(listitem))
                    .map((key) => Number(rawDataRow[key]))
                    .reduce((sum, current) => (sum += current), 0) /
                  (item.graphType === "stack" ? 1 : rawDataRow["total count"] / 100),
              }))
              .forEach((obj) => Object.entries(obj).forEach(([k, v]) => (data[k] = v)));
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
  };

  return (
    <>
      <aside className="relative flex h-[calc(100svh_-_96px)] min-h-[calc(100svh_-_96px)] w-72 flex-col items-center gap-y-4 overflow-y-auto border-r-2 px-2">
        <section className="w-full">
          <h2 className="mb-2 text-lg font-bold">📅 期間</h2>
          <Calendar
            mode="range"
            selected={date}
            onSelect={(v) => {
              setDate(v);
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
            <Button variant="outline" size="icon" onClick={onClickAddSeries}>
              <PlusIcon size="medium" />
            </Button>
          </div>
          <div className="flex w-full flex-col gap-y-2 px-1">
            {series?.map((series) => (
              <SeriesConfigCard
                key={series.id}
                setShow={(v) => setShow(series.id, v)}
                setName={(v) => setName(series.id, v)}
                setGraphType={(v) => setGraphType(series.id, v)}
                setFocusedAttribute={(v) => setFocusedAttribute(series.id, v)}
                setPlacement={(v) => setPlacement(series.id, v)}
                setObjectClass={(v) => setObjectClass(series.id, v)}
                setExclude={(v) => setExclude(series.id, v)}
                onRemoveClick={() => onClickRemoveSeries(series.id)}
              />
            ))}
          </div>
        </section>
        <section className="sticky bottom-0 flex w-full justify-center bg-[rgb(from_hsl(var(--background))_r_g_b_/_0.8)] py-4 backdrop-blur-sm">
          <Button onClick={() => onClickApply()} className="mx-auto">
            <GraphIcon size="medium" />
            グラフに反映
          </Button>
        </section>
      </aside>
      {data && Object.keys(data[0]).length > 1 ? (
        <ChartContainer
          config={chartConfig()}
          className="h-[calc(100svh_-_96px)] min-h-[calc(100svh_-_96px)] w-[calc(100%_-_48px_-_288px)] flex-grow"
        >
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} tickMargin={7} axisLine={false} />
            <YAxis
              type="number"
              tickLine={true}
              tickCount={10}
              domain={[0, (dataMax: number) => Math.floor(dataMax)]}
            />
            {Object.keys(data[0])
              .filter((key) => key !== "date")
              .map((id, i) => (
                <Bar
                  type="linear"
                  key={id}
                  dataKey={id}
                  stackId={id.split("#")[0]}
                  name={(series ? series.find((item) => item.id === id)?.name : undefined) ?? id}
                  fill={`hsl(var(--chart-${(i % 5) + 1}))`}
                  radius={id.split("#")[1] === "" ? 2 : 0}
                />
              ))}
            <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white" />} />
            {Object.keys(data[0]).length <= 10 ? (
              <ChartLegend content={<ChartLegendContent />} />
            ) : undefined}
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex-glow flex h-[calc(100svh_-_96px)] min-h-[calc(100svh_-_96px)] w-[calc(100%_-_48px_-_288px)] items-center justify-center">
          <p>グラフに表示するデータをサイドバーで設定して下さい</p>
        </div>
      )}
    </>
  );
}

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
  AggregatedData,
  DetailAttributeKey,
  ObjectClass,
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
        config[k] = {
          label: series.find((v) => v.id === k)?.name ?? k,
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
  const onAddSeriesClick = () => {
    const newSeries = series ? [...series] : [];
    newSeries.push({ id: crypto.randomUUID(), graphType: "simple" });
    setSeries(newSeries);
  };
  const onRemoveSeriesClick = (id: string) => {
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
      console.log("139", item.id);

      const csvStr = await (
        await fetch(`${window.location.origin}/${item.placement}/${item.objectClass}.csv`)
      ).text();

      const rawData = Papa.parse<AggregatedData>(csvStr, { header: true }).data;
      newData = newData.map((newDataRow) => ({
        ...newDataRow,
        [item.id]:
          Number(
            rawData.find(
              (rawDataRow) => String(rawDataRow["aggregate from"]).slice(0, 10) === newDataRow.date,
            )?.["total count"],
          ) ?? 0,
      }));
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
            <Button variant="outline" size="icon" onClick={onAddSeriesClick}>
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
                onRemoveClick={() => onRemoveSeriesClick(series.id)}
              />
            ))}
          </div>
        </section>
        <section className="sticky bottom-0 flex w-full justify-center bg-background py-4">
          <Button onClick={() => onClickApply()} className="mx-auto">
            <GraphIcon size="medium" />
            グラフに反映
          </Button>
        </section>
      </aside>
      {data && data.length > 0 ? (
        <ChartContainer
          config={chartConfig()}
          className="h-[calc(100svh_-_96px)] min-h-[calc(100svh_-_96px)] w-[calc(100%_-_48px_-_288px)] flex-grow"
        >
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} tickMargin={7} axisLine={false} />
            <YAxis type="number" tickLine={true} tickCount={10} />
            {Object.keys(data[0])
              .filter((k) => k !== "date")
              .map((k, i) => (
                <Bar
                  type="linear"
                  key={k}
                  dataKey={k}
                  name={(series ? series.find((item) => item.id === k)?.name : undefined) ?? k}
                  fill={`hsl(var(--chart-${i + 1}))`}
                  radius={2}
                />
              ))}
            <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white" />} />
            <ChartLegend content={<ChartLegendContent />} />
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

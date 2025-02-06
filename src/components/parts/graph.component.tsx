import {
  JAPANESE_ATTRIBUTE_NAME,
  ObjectClassAttribute,
} from "@/interfaces/aggregated-data.interface";
import { ChartGroup, getChartConfig } from "@/interfaces/graph-data.interface";
import { defaultSeriesName, GraphSeries } from "@/interfaces/graph-series.interface";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

function MultiChartContainer(props: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        `grid overflow-hidden grid-cols-[repeat(auto-fill,_minmax(50%,_1fr))] w-full h-full ${props.className}`,
      )}
    >
      {props.children}
    </div>
  );
}

const RADIAN = Math.PI / 180;
const CustomizedLabel = (props: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
}) => {
  const attributeKey = props.name.split("#").at(-1);
  const radius = props.innerRadius + (props.outerRadius - props.innerRadius) * 0.5;
  const x = props.cx + radius * Math.cos(-props.midAngle * RADIAN);
  const y = props.cy + radius * Math.sin(-props.midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > props.cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-bold drop-shadow"
    >
      {props.percent > 0.05 ? `${attributeKey} ${(props.percent * 100).toFixed(1)}%` : undefined}
    </text>
  );
};

interface Props {
  chartGroup: ChartGroup;
  seriesAll: Record<string, GraphSeries>;
  className?: string;
}
export function Graph({ chartGroup, seriesAll, className }: Props) {
  return (
    <MultiChartContainer className={className}>
      {Object.keys(chartGroup)
        .filter(
          (chartId) =>
            chartId !== "cartesian" || Object.keys(chartGroup[chartId].at(-1) ?? {}).length > 1,
        )
        .map((chartId) => (
          <ChartContainer
            key={chartId}
            config={getChartConfig(seriesAll, chartGroup[chartId], chartId)}
            className="w-full h-full first:col-span-2"
          >
            {chartId === "cartesian" ? (
              <BarChart data={chartGroup[chartId]}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={"date"} tickLine={false} tickMargin={7} axisLine={false} />
                <YAxis type="number" tickLine={true} tickCount={10} />
                {Object.keys(chartGroup[chartId].at(-1) ?? {})
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
                {Object.keys(chartGroup[chartId][0]).length <= 10 ? (
                  <ChartLegend content={<ChartLegendContent />} />
                ) : undefined}
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={chartGroup[chartId]}
                  cx="50%"
                  cy="50%"
                  fill="#8884d8"
                  labelLine={false}
                  label={CustomizedLabel}
                >
                  {chartGroup[chartId].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={{ fillOpacity: 0.4, stroke: "hsl(var(--primary))" }}
                  content={<ChartTooltipContent className="bg-white" />}
                />
                {Object.keys(chartGroup[chartId]).length <= 10 ? (
                  <ChartLegend content={<ChartLegendContent />} />
                ) : undefined}
              </PieChart>
            )}
          </ChartContainer>
        ))}
    </MultiChartContainer>
  );
}

"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Benchmark } from "./types/benchmark";
import { Filters } from "./types/filters";

const chartConfig = {
  minimum: {
    label: "minimum",
    color: "hsl(var(--chart-1))",
  },
  median: {
    label: "median",
    color: "hsl(var(--chart-2))",
  },
  maximum: {
    label: "maximum",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function CompareChart({
  benchmarks, filter
}: {
  benchmarks: Benchmark[] | undefined;
  filter: Filters | undefined;
}) {
  const chartData =
    benchmarks?.map((benchmark) => ({
      name: benchmark.name,
      minimum: filter ? benchmark.metrics[filter.metrics]?.minimum : 0,
      median: filter ? benchmark.metrics[filter.metrics]?.median : 0,
      maximum: filter ? benchmark.metrics[filter.metrics]?.maximum : 0,
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{filter?.metrics}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="name"
              tickLine={true}
              tickMargin={3}
              minTickGap={0}
              axisLine={false}
            />
            <YAxis
              scale={"auto"}
              dataKey="maximum"
              allowDataOverflow={false}
              axisLine={true}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Line
              dataKey="minimum"
              stroke="var(--color-minimum)"
              strokeWidth={2}
            />
            <Line
              dataKey="median"
              stroke="var(--color-median)"
              strokeWidth={2}
            />
            <Line
              dataKey="maximum"
              stroke="var(--color-maximum)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

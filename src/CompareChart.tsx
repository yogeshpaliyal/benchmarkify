"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Benchmark } from "./types/benchmark"
const chartData = [
  { name: "startupCompilationBaselineProfiles", minimum: 1096.115833, maximum: 1414.014947, median: 1161.0081765 },
  { name: "startupCompilationNone", minimum: 1489.099687, maximum: 2170.634582, median: 1685.6467699999998 },
]

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
} satisfies ChartConfig

export function CompareChart({ benchmarks }: { benchmarks: Benchmark[] | undefined }) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Compare benchmark</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="minimum" fill="var(--color-minimum)" radius={4} />
            <Bar dataKey="maximum" fill="var(--color-maximum)" radius={4} />
            <Bar dataKey="median" fill="var(--color-median)" radius={4} />

          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

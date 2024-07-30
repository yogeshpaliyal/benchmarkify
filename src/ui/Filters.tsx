import { Benchmark } from "@/types/benchmark";
import * as React from "react";
import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filters } from "@/types/filters";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function FiltersSelector({
  benchmarks,
  filters,
  setFilters,
}: {
  benchmarks: Benchmark[] | undefined;
  filters: Filters | undefined;
  setFilters: (filter: Filters) => void;
}) {
  const metrics: string[] = React.useMemo(() => {
    const metrics = new Set<string>();
    benchmarks?.forEach((benchmark) => {
      Object.keys(benchmark.metrics).forEach((metric) => {
        metrics.add(metric);
      });
    });
    return Array.from(metrics);
  }, [benchmarks]);

  React.useEffect(() => {
    if (filters || !benchmarks?.length || !metrics?.length) {
      return;
    }
    setFilters({
      benchmarkNames: benchmarks?.map((benchmark) => benchmark.name) ?? [],
      metrics: metrics?.[0] ?? "",
    });
  }, [benchmarks]);

  return (
    <div className="flex gap-[10px] max-sm:flex-col max-lg:flex-col pb-4 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button   variant="outline">Select Benchmarks</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Benchmarks</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {benchmarks?.map((benchmark) => {
            return (
              <DropdownMenuCheckboxItem
                key={benchmark.name}
                checked={
                  filters?.benchmarkNames.includes(benchmark.name) ?? false
                }
                onCheckedChange={(checked) => {
                  let newBenchmarks = [...(filters?.benchmarkNames ?? [])];
                  if (checked) {
                    newBenchmarks.push(benchmark.name);
                  } else {
                    newBenchmarks.splice(
                      newBenchmarks.indexOf(benchmark.name),
                      1
                    );
                  }
                  setFilters({
                    ...(filters ?? { benchmarkNames: [], metrics: "" }),
                    benchmarkNames: newBenchmarks,
                  });
                }}
              >
                {benchmark.name}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Select Metrics</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Metrics</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters?.metrics}
            onValueChange={(newValue) => {
              setFilters({
                ...(filters ?? { benchmarkNames: [], metrics: "" }),
                metrics: newValue,
              });
            }}
          >
            {metrics?.map((metric) => {
              return (
                <DropdownMenuRadioItem key={metric} value={metric}>
                  {metric}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

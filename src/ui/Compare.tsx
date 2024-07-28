import { Button } from "@/components/ui/button";
import { Benchmark } from "@/types/benchmark";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";

export function Compare({
  benchmarks,
}: {
  benchmarks: Benchmark[] | undefined;
}) {
  const [selectedMetric, setSelectedMetric] = useState<string | undefined>();
  const [selectedBaseBenchmarks, setSelectedBaseBenchmarks] = useState<
    Benchmark | undefined
  >();
  const [selectedAfterBenchmarks, setSelectedAfterBenchmarks] = useState<
    Benchmark | undefined
  >();

  const metrics: string[] = useMemo(() => {
    const metrics = new Set<string>();
    benchmarks?.forEach((benchmark) => {
      Object.keys(benchmark.metrics).forEach((metric) => {
        metrics.add(metric);
      });
    });
    return Array.from(metrics);
  }, [benchmarks]);

  const benchmarkNames: string[] = useMemo(() => {
    const bm = new Set<string>();
    benchmarks?.forEach((benchmark) => bm.add(benchmark.name));
    return Array.from(bm);
  }, [benchmarks]);

  return (
    <Dialog
      onOpenChange={(open: boolean) => {
        if (!open) {
          setSelectedMetric(undefined);
          setSelectedBaseBenchmarks(undefined);
          setSelectedAfterBenchmarks(undefined);
        }
      }}
    >
      <DialogTrigger>
        <Button>Compare</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compare</DialogTitle>
          <DialogDescription>
            Select the Base and Compare benchmarks and the metric to compare
          </DialogDescription>
        </DialogHeader>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedBaseBenchmarks?.name ?? "Select Base Benchmark"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={selectedBaseBenchmarks?.name}>
              {benchmarks?.map((benchmark) => {
                return (
                  <DropdownMenuRadioItem
                    key={benchmark.name}
                    value={benchmark.name}
                    onSelect={() => {
                      setSelectedBaseBenchmarks(benchmark);
                    }}
                  >
                    {benchmark.name}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedAfterBenchmarks?.name ?? "Select Compare Benchmark"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={selectedAfterBenchmarks?.name}>
              {benchmarks?.map((benchmark) => {
                return (
                  <DropdownMenuRadioItem
                    key={benchmark.name}
                    value={benchmark.name}
                    onSelect={() => {
                      setSelectedAfterBenchmarks(benchmark);
                    }}
                  >
                    {benchmark.name}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedMetric ?? "Select Metric"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedMetric}
              onValueChange={(newValue) => {
                setSelectedMetric(newValue);
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
        {selectedMetric &&
          selectedBaseBenchmarks &&
          selectedAfterBenchmarks && (
            <Result
              base={selectedBaseBenchmarks}
              after={selectedAfterBenchmarks}
              metric={selectedMetric}
            />
          )}
      </DialogContent>
    </Dialog>
  );
}

function Result({
  base,
  after,
  metric,
}: {
  base: Benchmark;
  after: Benchmark;
  metric: string;
}) {
  const minDiff = base.metrics[metric].minimum - after.metrics[metric].minimum;
  const medianDiff = base.metrics[metric].median - after.metrics[metric].median;
  const maxDiff = base.metrics[metric].maximum - after.metrics[metric].maximum;

  return (
    <div>
      <div>
        {base.name} vs {after.name} {metric}
      </div>
      <div>
        <div>
          Minimum = {minDiff > 0 ? "Base is faster" : "After is faster"}
        </div>
        <div>
          Median = {medianDiff > 0 ? "Base is faster" : "After is faster"}
        </div>
        <div>
          Maximum = {maxDiff > 0 ? "Base is faster" : "After is faster"}
        </div>
      </div>
    </div>
  );
}

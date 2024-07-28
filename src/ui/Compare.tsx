import { Button } from "@/components/ui/button";
import { Benchmark } from "@/types/benchmark";
import { useMemo, useState } from "react";
import { ArrowDown } from "@phosphor-icons/react";
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
import { twMerge } from "tailwind-merge";
import { FormLabel } from "@/components/ui/form";

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
        <Button>Compare Benchmarks</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compare Benchmarks</DialogTitle>
          <DialogDescription>
            Select the Base and Benchmark to compare and the metric.
          </DialogDescription>
        </DialogHeader>

        <BenchmarkSelector
          label="Base Benchmark"
          benchmarks={benchmarks}
          selectedBenchmark={selectedBaseBenchmarks}
          setSelectedBenchmark={setSelectedBaseBenchmarks}
        />

        <BenchmarkSelector
          label="After Benchmark"
          benchmarks={benchmarks}
          selectedBenchmark={selectedAfterBenchmarks}
          setSelectedBenchmark={setSelectedAfterBenchmarks}
        />

        <div className="w-full flex flex-col">
          {!!selectedMetric ? <h6>Metric</h6> : ""}
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
        </div>

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

function BenchmarkSelector({
  selectedBenchmark,
  label,
  benchmarks,
  setSelectedBenchmark,
}: {
  setSelectedBenchmark: (benchmark: Benchmark) => void;
  benchmarks: Benchmark[] | undefined;
  selectedBenchmark: Benchmark | undefined;
  label: string;
}) {
  return (
    <div className="w-full flex flex-col">
      {!!selectedBenchmark ? <h6>{label}</h6> : ""}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectedBenchmark?.name ?? "Select " + label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selectedBenchmark?.name}>
            {benchmarks?.map((benchmark) => {
              return (
                <DropdownMenuRadioItem
                  key={benchmark.name}
                  value={benchmark.name}
                  onSelect={() => {
                    setSelectedBenchmark(benchmark);
                  }}
                >
                  {benchmark.name}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
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
  return (
    <div className="flex flex-col gap-4">
      <h2 className="w-full text-center text-xl">
        <b>Comparision</b>
      </h2>
      <div className="flex gap-4 flex-col">
        <ResultLine
          name={"Minimum"}
          before={base.metrics[metric].minimum}
          after={after.metrics[metric].minimum}
        />
        <ResultLine
          name={"Median"}
          before={base.metrics[metric].median}
          after={after.metrics[metric].median}
        />
        <ResultLine
          name={"Maximum"}
          before={base.metrics[metric].maximum}
          after={after.metrics[metric].maximum}
        />
      </div>
    </div>
  );
}

function ResultLine({
  name,
  before,
  after,
}: {
  name: string;
  before: number;
  after: number;
}) {
  const diff = after - before;
  const diffPercentage = Math.abs((diff / ((after + before) / 2)) * 100);
  let conditionalStyling = "";
  let conditionalText = "";

  switch (true) {
    case diff > 0:
      conditionalStyling = "bg-red-500";
      conditionalText = "worse";
      break;
    case diff < 0:
      conditionalStyling = "bg-green-500";
      conditionalText = "better";
      break;
    default:
      conditionalStyling = "bg-yellow-500";
      conditionalText = "same";
  }

  return (
    <div className="gap-2 flex flex-row flex-wrap">
      {"-"} <b>{name}</b>: After performed <b>{diffPercentage.toFixed(2)}% </b>
      <div
        className={twMerge(
          conditionalStyling,
          "text-white",
          "inline",
          "px-1",
          "rounded"
        )}
      >
        <b>{conditionalText}</b>
      </div>
      {Math.abs(diff).toFixed(2)} ms
    </div>
  );
}

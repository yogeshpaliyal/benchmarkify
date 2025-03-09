import { Button } from "@/components/ui/button";
import { Benchmark } from "@/types/benchmark";
import React, { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { twMerge } from "tailwind-merge";
import { calculateAndPrintMetrics, ErrorObj } from "@/utils/benchmarkCompare";

export function SmartCompare({
  result: superResult,
}: {
  result: Record<string, any>;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-[100%]" variant={"secondary"}>
          More insights
        </Button>
      </DialogTrigger>
      <DialogContent
        className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
      >
        <DialogHeader>
          <DialogTitle>More insights</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Table>
          <TableBody>
            {Object.keys(superResult).map((key) => {
              //@ts-ignore
              let result = superResult[key] as any;
              return (
                <TableRow>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell>{"" + result}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

function RenderErrors({ errors }: { errors: ErrorObj[] }) {
  if (errors.length <= 0) {
    return (
      <div
        className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
        role="alert"
      >
        Benchmarks are comparable
      </div>
    );
  }

  return errors.map(({ message, type }) => {
    switch (type) {
      case "error":
        return (
          <div
            className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            {message}{" "}
          </div>
        );
        break;
      case "warning":
        return (
          <div
            className="p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
            role="alert"
          >
            {message}
          </div>
        );
        break;
    }
  });
}

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
  const [open, setOpen] = React.useState(false);

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
        <Button className="w-[100%]">Compare Benchmarks</Button>
      </DialogTrigger>
      <DialogContent
        className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
      >
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {selectedMetric ?? "Select Metric"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {metrics?.map((metric) => {
                      return (
                        <CommandItem
                          key={metric}
                          value={metric}
                          onSelect={(currentValue) => {
                            setSelectedMetric(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedMetric === metric
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {metric}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="w-full flex flex-col">
      {!!selectedBenchmark ? <h6>{label}</h6> : ""}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open}>
            {selectedBenchmark?.name ?? "Select " + label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {benchmarks?.map((benchmark) => (
                  <CommandItem
                    key={benchmark.name}
                    value={benchmark.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setSelectedBenchmark(benchmark);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === benchmark.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {benchmark.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
  const {
    result: superResult,
    errors,
    compare,
  } = calculateAndPrintMetrics(
    base.metrics[metric].runs,
    after.metrics[metric].runs
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="w-full text-center text-xl">
        <b>Comparision</b>
      </h2>
      <div className="flex gap-4 flex-col">
        <RenderErrors errors={errors} />
        {compare.map((comp) => (
          <ResultLine
            shouldCompare={!!comp.shouldCompare}
            name={comp.label}
            before={comp.before}
            after={comp.after}
          />
        ))}

        <SmartCompare result={superResult} />
        <Button
          className="w-[100%] py-0 h-0"
          variant={"link"}
          onClick={() =>
            window.open(
              "https://github.com/measure-sh/measure/blob/main/android/benchmarks/README.md",
              "_blank"
            )
          }
        >
          Calculated using: measure benchmark script
        </Button>
      </div>
    </div>
  );
}

function ResultLine({
  name,
  before,
  after,
  shouldCompare = false,
}: {
  name: string;
  before: number;
  after: number;
  shouldCompare: boolean;
}) {
  if (!shouldCompare) {
    return (
      <div className="gap-2 flex flex-row flex-wrap">
        {"-"} <b>{name}</b>: Before: <b> {before} </b> : After:
        <b> {after} </b>
        <div
          className={twMerge("text-white", "inline", "px-1", "rounded")}
        ></div>
      </div>
    );
  }

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

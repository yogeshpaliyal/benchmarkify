import { useContext, useEffect, useMemo, useState } from "react";
import "./App.css";
import { CompareChart } from "./CompareChart";
import { Textarea } from "@/components/ui/textarea";
import { Benchmark, calculateAverage } from "./types/benchmark";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BenchmarkTable } from "./BenchmarkTable";
import sampleBenchmarks from "../samplebaseline.json";
import { FiltersSelector } from "./ui/Filters";
import { Filters } from "./types/filters";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { Compare } from "./ui/Compare";

function App({ json }: { json: string | undefined }) {
  const [benchmarks, setBenchmarks] = useState<Benchmark[] | undefined>([]);

  const [rawInput, setRawInput] = useState<string | undefined>(json);
  const [filter, setFilter] = useState<Filters | undefined>();
  const [selectedTab, setSelectedTab] = useState<string | undefined>("charts");
  const [searchParams] = useSearchParams();

  const benchmarkFromRequest = searchParams.get("benchmarks");
  const filtersQueryP = searchParams.get("filters");

  useEffect(() => {
    if (benchmarkFromRequest) {
      try {
        setRawInput(JSON.stringify(JSON.parse(benchmarkFromRequest), null, 2));
      } catch (e) {
        console.error(e);
      }
    }
  }, [benchmarkFromRequest]);

  useEffect(() => {
    if (filtersQueryP) {
      try {
        setFilter(JSON.parse(filtersQueryP));
      } catch (e) {
        console.error(e);
      }
    }
  }, [filtersQueryP]);

  const [localBenchmarks, setLocalBenchmarks] = useState<
    Record<string, string | undefined> | undefined
  >();

  useEffect(() => {
    const localBenchMarksStr = localStorage.getItem("benchmarks");
    if (localBenchMarksStr) {
      try {
        setLocalBenchmarks(JSON.parse(localBenchMarksStr));
      } catch (e) {
        console.error(e);
      }
    }
  });

  useEffect(() => {
    try {
      const value = JSON.parse(rawInput ?? "");
      const benchmarksWithAverage = value.benchmarks.map(
        (benchmark: Benchmark) => {
          const metricsWithAverage = Object.keys(benchmark.metrics).reduce(
            (acc, key) => {
              const metric = benchmark.metrics[key];
              const average = calculateAverage(metric.runs);
              acc[key] = { ...metric, average };
              return acc;
            },
            {} as Record<string, any>
          );
          return { ...benchmark, metrics: metricsWithAverage };
        }
      );
      setBenchmarks(benchmarksWithAverage);
    } catch (e) {
      setBenchmarks([]);
      console.error(e);
    }
  }, [rawInput]);

  const [filteredBenchmarks, setFilteredBenchmarks] = useState<
    Benchmark[] | undefined
  >([]);

  useEffect(() => {
    setFilteredBenchmarks(
      benchmarks?.filter((benchmark) =>
        filter?.benchmarkNames.includes(benchmark.name)
      )
    );
  }, [filter, benchmarks]);

  const validateJson = (json: any) => {
    const sampleJson = sampleBenchmarks;
    const isValidContext =
      JSON.stringify(Object.keys(json.context)) ===
      JSON.stringify(Object.keys(sampleJson.context));
    const isValidBenchmarks = json.benchmarks.every((benchmark: any) => {
      return (
        JSON.stringify(Object.keys(benchmark)) ===
        JSON.stringify(Object.keys(sampleJson.benchmarks[0]))
      );
    });
    return isValidContext && isValidBenchmarks;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const json = JSON.parse(content);
          if (validateJson(json)) {
            setRawInput(content);
          } else {
            alert("Invalid JSON structure");
          }
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-dvh">
      <div className="md:flex flex-row flex-1 w-full">
        <div className="flex flex-1 flex-col p-4">
          <div className="w-full flex flex-row gap-2 pb-4 max-md:flex-col">
            <Select
              onValueChange={(selectedItem) =>
                setRawInput(localBenchmarks?.[selectedItem])
              }
            >
              <SelectTrigger className="md:w-[180px]">
                <SelectValue placeholder="Select Saved Benchmark" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Benchmarks</SelectLabel>
                  {localBenchmarks &&
                    Object.keys(localBenchmarks)?.map((localBenchmark) => {
                      return (
                        <SelectItem value={localBenchmark}>
                          {localBenchmark}
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className=" flex max-sm:flex-col gap-2">
              <Button
                className="max-md:flex-1"
                variant={"outline"}
                onClick={() => {
                  let value = window.prompt("Save Baseline profile", "");
                  if (value) {
                    const localBenchMarksStr =
                      localStorage.getItem("benchmarks");
                    let localBenchMarks: Record<string, string | undefined> =
                      {};
                    if (localBenchMarksStr) {
                      localBenchMarks = JSON.parse(localBenchMarksStr);
                    }
                    localBenchMarks[value] = rawInput;
                    localStorage.setItem(
                      "benchmarks",
                      JSON.stringify(localBenchMarks, null, 2)
                    );
                    setLocalBenchmarks(localBenchMarks);
                  }
                }}
              >
                Save
              </Button>
              <Button
                className="max-md:flex-1"
                variant={"outline"}
                onClick={() => setRawInput("")}
              >
                Clear
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            className="mb-4 hover:bg-gray-200 focus:bg-gray-300"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Upload JSON File
          </Button>
          <input
            id="fileInput"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Textarea
            className="flex-1"
            value={rawInput}
            placeholder="Paste Benchmark JSON here"
            onChange={(e) => {
              setRawInput(e.currentTarget.value);
            }}
          />
        </div>
        <div className="flex flex-[2] justify-around content-around p-4">
          <div className="w-full flex flex-col">
            <div className="w-full flex flex-row max-sm:flex-col justify-between">
              <FiltersSelector
                benchmarks={benchmarks}
                filters={filter}
                setFilters={setFilter}
              />

              <div className="flex gap-[8px] max-sm:flex-col max-lg:flex-col pb-4">
                <Compare benchmarks={benchmarks} />
                <Button
                  onClick={() => {
                    const url = new URL("https://github.yogeshpaliyal.com/benchmarkify/#/result/");
                    url.searchParams.set(
                      "benchmarks",
                      JSON.stringify(JSON.parse(rawInput ?? ""))
                    );
                    url.searchParams.set(
                      "filters",
                      JSON.stringify(filter) ?? ""
                    );
                    navigator.clipboard.writeText(url.toString()).then(() => {
                      console.log("New URL", url.toString());
                      alert("Link copied to clipboard");
                    });
                  }}
                >
                  {" "}
                  Share{" "}
                </Button>
              </div>
            </div>

            <Tabs
              onValueChange={setSelectedTab}
              defaultValue="charts"
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              {selectedTab == "charts" && (
                <TabsContent className="flex-1 flex" value="charts">
                  <div className="flex-1 flex">
                    <CompareChart
                      filter={filter}
                      benchmarks={filteredBenchmarks}
                    />
                  </div>
                </TabsContent>
              )}
              {selectedTab == "table" && (
                <TabsContent value="table" className="flex-1 flex">
                  <div className="flex-1 flex flex-row overflow-hidden">
                    <BenchmarkTable
                      benchmarks={filteredBenchmarks}
                      filters={filter}
                    />
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

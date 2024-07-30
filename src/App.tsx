import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { CompareChart } from "./CompareChart";
import { Textarea } from "@/components/ui/textarea";
import { Benchmark } from "./types/benchmark";
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
import { ModeToggle } from "./ui/mode-toggle";
import GithubIcon from "./assets/github-mark";
import { useSearchParams } from "react-router-dom";
import { Compare } from "./ui/Compare";

function App() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[] | undefined>([]);
  const [rawInput, setRawInput] = useState<string | undefined>(
    JSON.stringify(sampleBenchmarks, null, 2)
  );
  const [filter, setFilter] = useState<Filters | undefined>();
  const [searchParams] = useSearchParams();

  const benchmarkFromRequest = searchParams.get("benchmarks");
  const filtersQueryP = searchParams.get("filters");

  useEffect(() => {
    if (benchmarkFromRequest) {
      try {
        setRawInput(benchmarkFromRequest);
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
      setBenchmarks(value.benchmarks);
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

  return (
    <div className="flex flex-col ">
      <div className="flex flex-row w-full justify-between p-4">
        <h1 className="text-4xl font-bold text-center ">BenchMarkify 📈</h1>
        <div className="flex flex-wrap sm:space-y-4 md:space-y-0 md:space-x-4 mx-4 justify-end">
          <ModeToggle />
          <a
            className="content-center"
            href="https://github.com/yogeshpaliyal/benchmarkify"
            target="_blank"
          >
            <GithubIcon />
          </a>
        </div>
      </div>
      <div className="md:flex flex-row flex-1 w-full">
        <div className="flex flex-1 flex-col p-4" style={{ flex: 1 }}>
          <div className="w-full flex flex-row gap-2 pb-4 max-md:flex-col">
            <Select
              onValueChange={(selectedItem) =>
                setRawInput(localBenchmarks?.[selectedItem])
              }
            >
              <SelectTrigger className="md:w-[180px] ">
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
          <Textarea
            className="flex-1"
            value={rawInput}
            placeholder="Paste Benchmark JSON here"
            onChange={(e) => {
              setRawInput(e.currentTarget.value);
            }}
          />
        </div>
        <div
          className="flex flex-1 justify-around content-around p-4"
          style={{ flex: 2 }}
        >
          <div className="w-full">
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
                    const url = new URL(window.location.href);
                    url.searchParams.set("benchmarks", rawInput ?? "");
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

            <Tabs defaultValue="charts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              <TabsContent value="charts">
                <div className=" ">
                  <CompareChart
                    filter={filter}
                    benchmarks={filteredBenchmarks}
                  />
                </div>
              </TabsContent>
              <TabsContent value="table">
                <BenchmarkTable
                  benchmarks={filteredBenchmarks}
                  filters={filter}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="text-center p-4 text-xs">
        {" "}
        Created By{" "}
        <a href="https://github.com/yogeshpaliyal" target="_blank">
          Yogesh Paliyal
        </a>{" "}
      </div>
    </div>
  );
}

export default App;

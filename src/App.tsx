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
import githubLogo from "./assets/github-mark.svg";

function App() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[] | undefined>([]);

  useEffect(() => {
    try {
      setBenchmarks(sampleBenchmarks.benchmarks);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const defaultFilter = useMemo(() => {
    return {
      benchmarkNames: benchmarks?.map((benchmark) => benchmark.name) ?? [],
      metrics: "timeToInitialDisplayMs",
    };
  }, [benchmarks]);

  const [filter, setFilter] = useState<Filters>(defaultFilter);

  const [filteredBenchmarks, setFilteredBenchmarks] = useState<
    Benchmark[] | undefined
  >([]);

  useEffect(() => {
    setFilter(defaultFilter);
  }, [benchmarks]);

  useEffect(() => {
    setFilteredBenchmarks(
      benchmarks?.filter((benchmark) =>
        filter.benchmarkNames.includes(benchmark.name)
      )
    );
  }, [filter]);

  return (
    <div className="flex flex-col h-dvh w-dvw">
      <div className="flex flex-row w-full justify-between p-4">
        <h1 className="text-4xl font-bold text-center ">BenchMarkify 📈</h1>
        <a className="content-center" href="https://github.com/yogeshpaliyal/BenchMarkify" target="_blank">
        <img
          src={githubLogo}
          height={32}
          width={32}
          className="Github Logo"
          alt="logo"
        />
        </a>
      </div>
      <div className="md:flex flex-row flex-1 w-full">
        <div className="flex-1 p-4" style={{ flex: 1 }}>
          <Textarea
            className=" h-full"
            defaultValue={JSON.stringify(sampleBenchmarks, null, 2)}
            placeholder="Paste Benchmark JSON here"
            onChange={(e) => {
              try {
                const value = JSON.parse(e.currentTarget.value);
                setFilteredBenchmarks(value.benchmarks);
                setBenchmarks(value.benchmarks);
              } catch (e) {
                console.error(e);
              }
            }}
          />
        </div>
        <div
          className="flex flex-1 h-full justify-around content-around p-8"
          style={{ flex: 2 }}
        >
          <div className="w-full">
            <FiltersSelector
              benchmarks={benchmarks}
              filters={filter}
              setFilters={setFilter}
            />

            <Tabs defaultValue="charts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              <TabsContent value="charts">
                <CompareChart benchmarks={filteredBenchmarks} />
              </TabsContent>
              <TabsContent value="table">
                <BenchmarkTable benchmarks={filteredBenchmarks} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="text-center p-4 text-xs"> Created By Yogesh Paliyal </div>
    </div>
  );
}

export default App;

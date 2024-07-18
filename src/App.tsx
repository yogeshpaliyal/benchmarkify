import { useState } from "react";
import "./App.css";
import { CompareChart } from "./CompareChart";
import { Textarea } from "@/components/ui/textarea";
import { Benchmark } from "./types/benchmark";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BenchmarkTable } from "./BenchmarkTable";

function App() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[] | undefined>([]);

  return (
    <div className="flex h-screen flex-col">
    <h1 className="text-4xl font-bold text-center m-4">Benchmark Comparison</h1>
    <div className="flex flex-row flex-1 w-dvw h-full">
      <div className="flex-1 p-8" style={{ flex: 1 }}>
        <Textarea
          className=" h-full"
          placeholder="Paste Benchmark JSON here"
          onChange={(e) => {
            try {
              const value = JSON.parse(e.currentTarget.value);
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
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <BenchmarkTable benchmarks={benchmarks} />
            </TabsContent>
            <TabsContent value="charts">
              <CompareChart benchmarks={benchmarks} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;

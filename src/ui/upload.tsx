import { useContext, useEffect, useState } from "react";
import { UploadIcon, FileJson } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast"
import sampleData from "../../samplebaseline.json";
import { BenchmarkContext as BenchmarkData } from "../types/benchmark";
import { useNavigate } from "react-router-dom";

export interface UploadProps {
  setRawInput: (json: string) => void;
}

export function Upload({ setRawInput }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  //   const { toast } = useToast()
  let navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const setData = (json: string) => {
    setRawInput(json);
    navigate("/result");
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      await handleFile(file);
    } else {
      //   toast({
      //     title: "Invalid file",
      //     description: "Please upload a JSON file containing benchmark results.",
      //     variant: "destructive",
      //   })
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Basic validation
      if (
        !json.benchmarks ||
        !Array.isArray(json.benchmarks) ||
        !json.deviceInfo
      ) {
        throw new Error("Invalid benchmark data format");
      }

      const benchmarkData: BenchmarkData = {
        benchmarks: json.benchmarks.map((benchmark: any) => ({
          name: benchmark.name || "Unnamed Benchmark",
          timestamp: benchmark.timestamp || new Date().toISOString(),
          metrics: benchmark.metrics.map((metric: any) => ({
            name: metric.name || "Unnamed Metric",
            value: metric.value || 0,
            unit: metric.unit || "",
          })),
        })),
        ...json.context,
      };

      setData(json);
      //   toast({
      //     title: "Success",
      //     description: "Benchmark data loaded successfully.",
      //   })
    } catch (error) {
      console.error(error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to parse benchmark data. Please check the file format.",
      //     variant: "destructive",
      //   })
    }
  };

  const loadSampleData = () => {
    setData(JSON.stringify(sampleData, null, 2));

    // toast({
    //   title: "Sample Data Loaded",
    //   description: "Sample benchmark data has been loaded for preview.",
    // })
  };

  return (
    <div className="space-y-4">
      <Card
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center ${
          isDragging ? "border-primary bg-muted" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <UploadIcon className="h-8 w-8 text-muted-foreground" />
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Upload benchmark results</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your JSON file here, or click to select a file
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <label className="cursor-pointer">
                Select File
                <input
                  type="file"
                  className="hidden"
                  accept="application/json"
                  onChange={handleFileInput}
                />
              </label>
            </Button>
            <Button variant="outline" onClick={loadSampleData}>
              Load Sample Data
            </Button>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <FileJson className="h-6 w-6 text-blue-500" />
          <div className="space-y-1">
            <h4 className="font-medium">
              Where to find the benchmark JSON file?
            </h4>
            <p className="text-sm text-muted-foreground">
              1. Run your macrobenchmark tests in Android Studio
              <br />
              2. Navigate to your project's{" "}
              <code className="rounded bg-muted px-1">
                app/build/outputs/benchmarkData/
              </code>{" "}
              directory
              <br />
              3. Find the JSON file with your benchmark results (usually named
              like{" "}
              <code className="rounded bg-muted px-1">
                com.example.benchmark-metadata.json
              </code>
              )
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

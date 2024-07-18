import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Benchmark } from "./types/benchmark";

export function BenchmarkTable({
  benchmarks,
}: {
  benchmarks: Benchmark[] | undefined;
}) {

    const tableData = benchmarks?.map((benchmark) => ({
        name: benchmark.name,
        minimum: benchmark.metrics.timeToInitialDisplayMs.minimum,
        median: benchmark.metrics.timeToInitialDisplayMs.median,
        maximum: benchmark.metrics.timeToInitialDisplayMs.maximum,
      })) || []
    

  return (<Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Name</TableHead>
        <TableHead>Minimum</TableHead>
        <TableHead>Median</TableHead>
        <TableHead className="text-right">Maximum</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      
      {tableData.map((item) => (
        <TableRow>
         <TableCell className="font-medium">{item.name}</TableCell>
         <TableCell>{item.minimum}</TableCell>
         <TableCell>{item.median}</TableCell>
         <TableCell className="text-right">{item.maximum}</TableCell>
         </TableRow>
      ))}
      
    </TableBody>
  </Table>);
}

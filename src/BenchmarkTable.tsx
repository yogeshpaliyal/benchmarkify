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
import { Filters } from "./types/filters";

export function BenchmarkTable({
  benchmarks,
  filters
}: {
  benchmarks: Benchmark[] | undefined;
  filters: Filters | undefined;
}) {

    const tableData = benchmarks?.map((benchmark) => ({
        name: benchmark.name,
        minimum: filters ? benchmark.metrics[filters.metrics].minimum : 0,
        median: filters ? benchmark.metrics[filters.metrics].median : 0,
        maximum: filters ? benchmark.metrics[filters.metrics].maximum : 0,
        average: filters ? benchmark.metrics[filters.metrics].average : 0,
      })) || []
    

  return (
  <div className="flex-1 w-0">
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead >Name</TableHead>
        <TableHead>Minimum</TableHead>
        <TableHead>Median</TableHead>
        <TableHead >Maximum</TableHead>
        <TableHead >Average</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      
      {tableData.map((item) => (
        <TableRow>
         <TableCell className="font-medium">{item.name}</TableCell>
         <TableCell>{item.minimum}</TableCell>
         <TableCell>{item.median}</TableCell>
         <TableCell>{item.maximum}</TableCell>
         <TableCell>{item.average}</TableCell>
         </TableRow>
      ))}
      
    </TableBody>
  </Table>
  </div>);
}

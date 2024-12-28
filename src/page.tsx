import { Upload, UploadProps } from "./ui/upload";

export default function Page(props: UploadProps) {
  return (
    <div className="container py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Benchmarkify</h1>
          <p className="text-lg text-muted-foreground">
            Visualize and analyze Android macrobenchmark results with ease
          </p>
        </div>
        <Upload {...props}/>
      </div>
    </div>
  );
}

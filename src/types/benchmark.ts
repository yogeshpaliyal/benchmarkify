export interface BenchmarkContext {
    context: {
        build: {
            brand: string;
            device: string;
            fingerprint: string;
            model: string;
            version: {
                sdk: number;
            };
        };
        cpuCoreCount: number;
        cpuLocked: boolean;
        cpuMaxFreqHz: number;
        memTotalBytes: number;
        sustainedPerformanceModeEnabled: boolean;
    };
    benchmarks: Benchmark[];
}


export interface Benchmark {
    name: string;
    params: Record<string, unknown>;
    className: string;
    totalRunTimeNs: number;
    metrics: Record<string, Metric>;
    sampledMetrics: Record<string, unknown>;
    warmupIterations: number;
    repeatIterations: number;
    thermalThrottleSleepSeconds: number;
}

export interface Metric {
    minimum: number;
    maximum: number;
    median: number;
    runs: number[];
}

import * as math from "mathjs";
import { Series } from "pandas-js";

const MIN_BENCHMARK_ITERATIONS = 30;

export function calculateAndPrintMetrics(
  dataBefore: number[],
  dataAfter: number[]
): BenchmarkResult {
  return calculateAndPrintMetrics2(
    new Series(dataBefore),
    new Series(dataAfter)
  );
}

export interface BenchmarkResult {
  varianceRatio: number;
  confidenceLevel: number;
  alphaLevel: number;
  zScore: any;
  pooledEstimateOfCommonStd: number | math.Complex;
  standardError: any;
  marginOfError: number;
  confidenceIntervalRange: number;
  confidenceIntervalOfMeanDifference: number[];
  confidenceIntervalOfMeanPercentChange: number[];
}

function calculateAndPrintMetrics2(
  dataBefore: Series,
  dataAfter: Series
): BenchmarkResult {
  const iterationCountBefore = dataBefore.length;
  const iterationCountAfter = dataAfter.length;
  verifyMinimumIterations(iterationCountBefore);
  verifyMinimumIterations(iterationCountAfter);

  const meanBefore = math.round(dataBefore.mean(), 3);
  const meanAfter = math.round(dataAfter.mean(), 3);

  const stdBefore = math.round(dataBefore.std(), 3);
  const stdAfter = math.round(dataAfter.std(), 3);

  const medianBefore = math.round(dataBefore.median(), 3);
  const medianAfter = math.round(dataAfter.median(), 3);

  const varianceBefore = math.round(math.square(stdBefore), 3);
  const varianceAfter = math.round(math.square(stdAfter), 3);

  const coefficientOfVariationBefore = math.round(stdBefore / meanBefore, 3);
  const coefficientOfVariationAfter = math.round(stdAfter / meanAfter, 3);
  checkCoefficientOfVariation(dataBefore, "before");
  checkCoefficientOfVariation(dataAfter, "after");

  const varianceRatio = varianceAfter / varianceBefore;
  checkVarianceRatio(dataBefore, dataAfter);

  const confidenceLevel = 0.95;
  const alphaLevel = math.round((1 - confidenceLevel) / 2, 3);
  const zScore = math.round(ppfNormal(alphaLevel), 2) as any;
  const pooledVariance =
    ((iterationCountAfter - 1) * varianceAfter +
      (iterationCountBefore - 1) * varianceBefore) /
    (iterationCountAfter + iterationCountBefore - 2);
  console.log(
    "pooledVariance",
    iterationCountAfter,
    varianceAfter,
    iterationCountBefore,
    varianceBefore,
    pooledVariance
  );
  const pooledEstimateOfCommonStd = math.round(math.sqrt(pooledVariance), 3);
  const standardError = math.round(
    math.sqrt(
      pooledVariance / iterationCountAfter +
        pooledVariance / iterationCountBefore
    ),
    3
  ) as any;
  const marginOfError = math.round(zScore * standardError, 3);
  const confidenceIntervalRange = math.round(marginOfError * 2, 3);

  const confidenceIntervalOfMeanDifferenceLower = math.round(
    meanAfter - meanBefore - marginOfError,
    3
  );
  const confidenceIntervalOfMeanDifferenceUpper = math.round(
    meanAfter - meanBefore + marginOfError,
    3
  );
  const confidenceIntervalOfMeanDifference = [
    confidenceIntervalOfMeanDifferenceLower,
    confidenceIntervalOfMeanDifferenceUpper,
  ];
  const confidenceIntervalOfMeanPercentChangeLower = math.round(
    (confidenceIntervalOfMeanDifference[0] / meanBefore) * 100,
    3
  );
  const confidenceIntervalOfMeanPercentChangeUpper = math.round(
    (confidenceIntervalOfMeanDifference[1] / meanAfter) * 100,
    3
  );
  const confidenceIntervalOfMeanPercentChange = [
    confidenceIntervalOfMeanPercentChangeLower,
    confidenceIntervalOfMeanPercentChangeUpper,
  ];

  printTable(
    ["Metric", "Before", "After"],
    ["Mean", meanBefore, meanAfter],
    ["Standard Deviation", stdBefore, stdAfter],
    ["Median", medianBefore, medianAfter],
    ["Variance", varianceBefore, varianceAfter],
    [
      "Coefficient of Variation",
      coefficientOfVariationBefore,
      coefficientOfVariationAfter,
    ]
  );

  printTable(
    ["Metric", "Value"],
    ["Variance Ratio", varianceRatio],
    ["Confidence Level", confidenceLevel],
    ["Alpha Level", alphaLevel],
    ["Z Score", zScore],
    ["Pooled Estimate of Common Standard Deviation", pooledEstimateOfCommonStd],
    ["Standard Error", standardError],
    ["Error Margin", marginOfError],
    ["Confidence Interval Range", confidenceIntervalRange],
    ["Mean Difference", meanAfter - meanBefore],
    [
      "Confidence Interval of Mean Difference",
      confidenceIntervalOfMeanDifference,
    ],
    [
      "Confidence Interval of Mean Percent Change",
      confidenceIntervalOfMeanPercentChange,
    ]
  );

  return {
    varianceRatio,
    confidenceLevel,
    alphaLevel,
    zScore,
    pooledEstimateOfCommonStd,
    standardError,
    marginOfError,
    confidenceIntervalRange,
    confidenceIntervalOfMeanDifference,
    confidenceIntervalOfMeanPercentChange,
  };
}

// Define the mean and standard deviation
const mean = 0;
const stdDev = 1;

// Define the cumulative distribution function (CDF) for the normal distribution
const cdfNormal = (x: any) =>
  0.5 * (1 + math.erf((x - mean) / (stdDev * Math.sqrt(2))));

// Define the Percent Point Function (PPF) as the inverse of the CDF
const ppfNormal = (p: any) => math.inv(cdfNormal(p));

function printTable(header: string[], ...data: any[]): void {
  const colWidth = header.map((_, i) =>
    Math.max(...data.map((row) => String(row[i]).length), header[i].length)
  );
  const headerRow = header
    .map((title, i) => title.padEnd(colWidth[i]))
    .join(" | ");
  console.log();
  console.log("-".repeat(headerRow.length));
  console.log(headerRow);
  console.log("-".repeat(headerRow.length));
  data.forEach((row) => {
    const rowStr = row
      .map((item: any, i: number) => String(item).padEnd(colWidth[i]))
      .join(" | ");
    console.log(rowStr);
  });
}

function verifyMinimumIterations(iterations: number): void {
  if (iterations < MIN_BENCHMARK_ITERATIONS) {
    console.error(
      `Error: At least ${MIN_BENCHMARK_ITERATIONS} iterations required for analysis.`
    );
    //process.exit(1);
  }
}

function checkCoefficientOfVariation(data: Series, label: string): void {
  const cv = data.std() / data.mean();
  if (cv > 0.06) {
    console.warn(
      `Warning: Coefficient of variation for "${label}" is higher than 6%: ${(
        cv * 100
      ).toFixed(3)}%`
    );
  }
}

function checkVarianceRatio(dataBefore: Series, dataAfter: Series): void {
  const cvBefore = dataBefore.std() / dataBefore.mean();
  const cvAfter = dataAfter.std() / dataAfter.mean();
  if (cvBefore / cvAfter < 0.5 || cvBefore / cvAfter > 2) {
    console.warn(
      `Warning: Variance ratio is more than double: ${(
        (cvBefore / cvAfter) *
        100
      ).toFixed(3)}%`
    );
  }
}

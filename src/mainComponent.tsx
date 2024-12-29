import React, { useEffect, useState } from "react";
import { Shell } from "./ui/shell.tsx";
import Page from "./page.tsx";
import App from "./App.tsx";
import { Filters } from "./types/filters.ts";
import { useSearchParams } from "react-router-dom";

interface Props {
  rawInput: string | undefined;
  setRawInput: (rawInput: string) => void;
}

export const DataContext = React.createContext<Props | undefined>(undefined);

export default function DataComponent() {
  const [rawInput, setRawInput] = useState<string | undefined>();
  const [filter, setFilter] = useState<Filters | undefined>();
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

  let content: React.ReactElement;
  if (rawInput) {
    content = <App json={rawInput} resetJson={() => setRawInput(undefined)} filters={filter}/>;
  } else {
    content = <Page setRawInput={setRawInput} />;
  }

  return <Shell>{content}</Shell>;
}

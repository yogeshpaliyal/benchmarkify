import React, { useState } from "react";
import { Shell } from "./ui/shell.tsx";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
} from "react-router-dom";
import Page from "./page.tsx";
import App from "./App.tsx";

interface Props {
  rawInput: string | undefined;
  setRawInput: (rawInput: string) => void;
}

export const DataContext = React.createContext<Props | undefined>(undefined);

export default function DataComponent() {
  const [rawInput, setRawInput] = useState<string | undefined>();

  return (
    <Shell>
      <BrowserRouter basename="benchmarkify">
        <Routes>
          <Route path="/" index element={<Page setRawInput={setRawInput} />} />
          <Route path="result" element={<App json={rawInput} />} />
        </Routes>
      </BrowserRouter>
    </Shell>
  );
}

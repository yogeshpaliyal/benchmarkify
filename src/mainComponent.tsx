import React, { useState } from "react";
import { Shell } from "./ui/shell.tsx";
import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter,
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
    // <Shell>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Shell />}>
            <Route index element={<Page setRawInput={setRawInput} />} />
            <Route path="/result" element={<App json={rawInput} />} />
          </Route>
        </Routes>
      </HashRouter>
    // </Shell>
  );
}

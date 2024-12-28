import React, { useState } from "react";
import { Shell } from "./ui/shell.tsx";
import Page from "./page.tsx";
import App from "./App.tsx";

interface Props {
  rawInput: string | undefined;
  setRawInput: (rawInput: string) => void;
}

export const DataContext = React.createContext<Props | undefined>(undefined);

export default function DataComponent() {
  const [rawInput, setRawInput] = useState<string | undefined>();

  let content: React.ReactElement;
  if (rawInput) {
    content = <App json={rawInput} resetJson={() => setRawInput(undefined)} />;
  } else {
    content = <Page setRawInput={setRawInput} />;
  }

  return <Shell>{content}</Shell>;
}

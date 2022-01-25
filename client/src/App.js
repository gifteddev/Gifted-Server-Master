import React from "react";
import { AppProvider } from "@shopify/polaris";
import AppRouter from "./AppRouter";
import enTranslations from "@shopify/polaris/locales/en.json";
import "./App.css";

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <AppRouter />
    </AppProvider>
  );
}

export default App;

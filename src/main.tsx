import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "react-query";

import "@radix-ui/themes/styles.css";
import "./styles/theme-config.css";

import App from "./components/App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Theme accentColor="teal">
			<QueryClientProvider client={new QueryClient()}>
				<App />
			</QueryClientProvider>
		</Theme>
	</React.StrictMode>,
);

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pkgJSON from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		__APP_VERSION__: JSON.stringify(pkgJSON.version),
	},
});

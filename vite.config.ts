import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pkgJSON from "./package.json";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		__APP_VERSION__: JSON.stringify(pkgJSON.version),
	},
	build: {
		sourcemap: false,
		rollupOptions: {
			maxParallelFileOps: 2,
			cache: false,
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
				inlineDynamicImports: false,
				sourcemapIgnoreList: (relativeSourcePath) => {
					const normalizedPath = path.normalize(relativeSourcePath);
					return normalizedPath.includes("node_modules");
				},
			},
		},
	},
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss()
  ],
  resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 3000,
		host: true,
		open: true,
	},
	build: {
		outDir: "dist",
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
					charts: ["recharts"],
					ui: ["lucide-react", "sonner"],
				},
			},
		},
	},
	optimizeDeps: {
		include: ["react", "react-dom", "lucide-react", "recharts", "sonner"],
	},
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
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
    sourcemap: mode === 'development', // Only enable sourcemaps in development
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ["react", "react-dom", "react-router-dom"],
          
          // Ant Design UI library and its icons (tree-shakeable imports will help)
          ui: ["antd", "@ant-design/icons", "sonner"],
          
          // Map libraries (heaviest chunk, loaded separately)
          map: ["leaflet", "react-leaflet"],
          
          // Charts library
          charts: ["recharts"],
          
          // Lucide icons (will be removed if we remove the package)
          'lucide-icons': ["lucide-react"],
          
          // All Radix UI components grouped together
          radix: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-menubar",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console logs in production
        drop_debugger: mode === 'production',
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "lucide-react", "recharts", "sonner", "antd", "leaflet", "react-leaflet"],
  },
}))
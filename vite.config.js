/**
 * Vite Configuration - Sanya Bansal Portfolio
 * 
 * This configuration file sets up Vite for optimal development and production builds.
 * It includes React plugin support and deployment-ready settings for various platforms.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 * @since 2025-09-30
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for React portfolio application
export default defineConfig({
  // Enable React plugin for JSX support and fast refresh
  plugins: [react()],
  
  // Base public path - use relative path for GitHub Pages
  base: './',
  
  // Build configuration for production
  build: {
    // Output directory for built files
    outDir: 'dist',
    
    // Directory for static assets within outDir
    assetsDir: 'assets',
    
    // Generate sourcemaps for debugging (disable for production)
    sourcemap: false,
    
    // Minification options
    minify: 'terser',
    
    // Rollup build options
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Group React-related dependencies
          react: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    
    // Asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Chunk size warning limit (in KB)
    chunkSizeWarningLimit: 1000
  },
  
  // Development server configuration
  server: {
    // Port for development server
    port: 5173,
    
    // Automatically open browser
    open: true,
    
    // Enable HTTPS for local development (optional)
    // https: true,
    
    // Host configuration
    host: 'localhost'
  },
  
  // Preview server configuration (for production preview)
  preview: {
    port: 4173,
    open: true
  },
  
  // Define environment variables
  define: {
    // App version from package.json
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})

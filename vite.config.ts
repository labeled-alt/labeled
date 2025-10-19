import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Let Vite pre-bundle dependencies (including lucide-react) for proper ESM handling in dev
});

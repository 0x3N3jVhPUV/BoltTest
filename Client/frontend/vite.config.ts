import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Determine if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
<<<<<<< HEAD
      '/api': isProduction ? 'https://your-production-api-url.com' : 'http://localhost:5000'
    }
  },
  build: {
    // Add any production-specific build options here
    outDir: 'dist',
    sourcemap: !isProduction, // Generate sourcemaps only in development
  }
})
=======
      '/api': 'http://localhost:5000',
    },
  },
  build: {
    outDir: 'dist', 
  },
});
>>>>>>> 9fe5e93d7691fc730f4ec31494a3bbf42ae7cdd2

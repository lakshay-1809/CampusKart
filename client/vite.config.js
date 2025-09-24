import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    define: {
        'process.env.VITE_SERVER_URL': JSON.stringify(process.env.VITE_SERVER_URL),
    },
});

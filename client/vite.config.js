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
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/admin/auth': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/admin/users': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/admin/requests': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/admin/complaints': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/admin/dashboard': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            }
        }
    }
});

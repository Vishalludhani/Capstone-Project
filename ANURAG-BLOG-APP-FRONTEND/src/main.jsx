import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Register a global request interceptor for Axios.
// This interceptor automatically intercepts all outbound HTTP requests made by the frontend.
// It replaces any hardcoded 'http://localhost:6767' API host with the environment-specified
// 'VITE_API_URL' value (used in production), while preserving the local address for development.
axios.interceptors.request.use((config) => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:6767';
    if (config.url && config.url.startsWith('http://localhost:6767')) {
        config.url = config.url.replace('http://localhost:6767', apiBaseUrl);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
    <App />
)

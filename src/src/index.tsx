// src/main.tsx (atau src/index.tsx yang paling luar)
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Arahkan ke App yang ada di dalam src/src
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
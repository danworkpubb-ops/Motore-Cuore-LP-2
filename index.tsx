import React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * BRIDGE GLOBALE: Inizializzazione Chiavi API.
 * Questo blocco garantisce che l'SDK Google GenAI trovi la chiave API corretta.
 * Mappa VITE_API_KEY (da Vercel/Vite) su process.env.API_KEY (richiesto dall'SDK).
 */
if (typeof window !== 'undefined') {
  // Inizializza la gerarchia process.env globale se mancante
  (window as any).process = (window as any).process || {};
  (window as any).process.env = (window as any).process.env || {};

  try {
    // Recupera la configurazione del Proxy AI
    const env = (import.meta as any).env;
    const proxyUrl = env?.VITE_PROXY_URL;
    const siteId = env?.VITE_SITE_ID;

    if (proxyUrl && siteId) {
      console.log("Configurazione AI Proxy: Rilevata e collegata correttamente.");
    } else {
      if (!proxyUrl) console.warn("Attenzione: VITE_PROXY_URL non trovata.");
      if (!siteId) console.warn("Attenzione: VITE_SITE_ID non trovata.");
    }
  } catch (err) {
    console.error("Errore nel bridge ambientale:", err);
  }
}

import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// src/config.ts

export const PROXY_URL = (import.meta as any).env?.VITE_PROXY_URL || 
                         (process.env as any).VITE_PROXY_URL || 
                         'https://genera-lp.vercel.app';

export const OWNER_ID = (import.meta as any).env?.VITE_OWNER_ID || 
                        (process.env as any).VITE_OWNER_ID;

export const SITE_ID = (import.meta as any).env?.VITE_SITE_ID || 
                       (process.env as any).VITE_SITE_ID;

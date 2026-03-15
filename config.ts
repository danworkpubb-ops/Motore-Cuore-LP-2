
/**
 * Centralized configuration for environment variables.
 * Handles fallbacks between AI Studio and Vercel environments.
 */

export const CONFIG = {
    // Vite standard: variables must start with VITE_ to be exposed to the client
    // We use import.meta.env which is the official Vite way.
    PROXY_URL: (import.meta as any).env?.VITE_PROXY_URL || "",
    SITE_ID: (import.meta as any).env?.VITE_SITE_ID || "",
    
    SUPABASE_URL: 
        (import.meta as any).env?.VITE_SUPABASE_URL || 
        'https://fqsxjyizachjqpxncdmf.supabase.co',
        
    SUPABASE_ANON_KEY: 
        (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxc3hqeWl6YWNoanFweG5jZG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mzk3OTAsImV4cCI6MjA4ODExNTc5MH0.lGvYSqOynu9HEN6Xd86L5cBT1pwNogW09UTuJ4TULjg'
};

// Diagnostic helper to see exactly what's happening in the browser console
export const checkConfig = () => {
    const status = {
        aiProxy: CONFIG.PROXY_URL ? "Presente ✅" : "MANCANTE ❌",
        siteId: CONFIG.SITE_ID ? "Presente ✅" : "MANCANTE ❌",
        supabaseUrl: CONFIG.SUPABASE_URL ? "Presente ✅" : "MANCANTE ❌",
        supabaseKey: CONFIG.SUPABASE_ANON_KEY ? "Presente ✅" : "MANCANTE ❌",
    };
    console.log("[Config Diagnostic]", status);
    return status;
};

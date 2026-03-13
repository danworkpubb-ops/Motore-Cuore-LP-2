
/**
 * Centralized configuration for environment variables.
 * Handles fallbacks between AI Studio and Vercel environments.
 */

export const CONFIG = {
    // Vite standard: variables must start with VITE_ to be exposed to the client
    // We use import.meta.env which is the official Vite way.
    GEMINI_API_KEY: 
        (import.meta as any).env?.VITE_API_KEY || 
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        (import.meta as any).env?.GEMINI_API_KEY ||
        // Fallback to process.env for environments that inject it (like our preview)
        (typeof process !== 'undefined' ? process.env?.VITE_API_KEY : "") ||
        (typeof process !== 'undefined' ? process.env?.API_KEY : "") ||
        "",
    
    SUPABASE_URL: 
        (import.meta as any).env?.VITE_SUPABASE_URL || 
        'https://fqsxjyizachjqpxncdmf.supabase.co',
        
    SUPABASE_ANON_KEY: 
        (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxc3hqeWl6YWNoanFweG5jZG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mzk3OTAsImV4cCI6MjA4ODExNTc5MH0.lGvYSqOynu9HEN6Xd86L5cBT1pwNogW09UTuJ4TULjg'
};

// Diagnostic helper to see exactly what's happening in the browser console
export const checkConfig = () => {
    const rawKey = CONFIG.GEMINI_API_KEY;
    const isPresent = !!rawKey && rawKey !== "undefined" && rawKey !== "null" && rawKey.trim() !== "";
    
    const status = {
        gemini: isPresent ? `Caricata (${rawKey.substring(0,4)}...${rawKey.substring(rawKey.length - 4)})` : "MANCANTE ❌",
        supabaseUrl: CONFIG.SUPABASE_URL ? "Presente ✅" : "MANCANTE ❌",
        supabaseKey: CONFIG.SUPABASE_ANON_KEY ? "Presente ✅" : "MANCANTE ❌",
        debug_info: {
            key_length: rawKey?.length || 0,
            is_string_undefined: rawKey === "undefined",
            is_string_null: rawKey === "null"
        }
    };
    console.log("[Config Diagnostic]", status);
    return status;
};

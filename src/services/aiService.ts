// src/services/aiService.ts

export const generateAIContent = async (userPrompt: string) => {
  // 1. Recupera i dati iniettati dalla piattaforma (con fallback automatico)
  const proxyUrl = (import.meta as any).env.VITE_PROXY_URL || 'https://genera-lp.vercel.app';
  const userId = (import.meta as any).env.VITE_OWNER_ID;

  const systemPrompt = `
Agisci come un esperto Senior Web Designer e Copywriter specializzato in conversioni.
Il tuo compito è generare il codice HTML completo di una sezione landing page moderna, pulita e responsive.

REGOLE TECNICHE:
1. Usa esclusivamente Tailwind CSS per lo styling (non scrivere CSS esterno).
2. Usa icone di Lucide (rappresentate come classi o elementi SVG semplici).
3. Il design deve essere "Mobile First".
4. Restituisci SOLO il codice HTML contenuto dentro un ipotetico <div> principale.
5. NON aggiungere spiegazioni, blocchi di codice markdown (\`\`\`) o commenti.

REGOLE DI DESIGN:
- Usa una palette di colori moderna (es. Slate, Indigo, Emerald).
- Includi una Hero Section con un titolo accattivante (H1), un sottotitolo persuasivo e un pulsante di Call to Action (CTA).
- Se pertinente, aggiungi una sezione "Caratteristiche" con icone.
- Usa font sans-serif puliti.

PROMPT DELL'UTENTE:
${userPrompt}
`;

  // 2. Chiama la piattaforma (il ponte)
  const response = await fetch(`${proxyUrl.replace(/\/$/, '')}/api/ai/generate-landing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: systemPrompt,
      userId: userId // Fondamentale per il controllo dei limiti
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Se la piattaforma risponde con errore (es. limiti raggiunti)
    throw new Error(data.error || "Errore nella generazione");
  }

  return data.content; // Qui c'è l'HTML generato da Gemini
};

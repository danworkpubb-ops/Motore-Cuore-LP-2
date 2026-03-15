// src/services/aiService.ts

export const generateAIContent = async (userPrompt: string) => {
  // Queste variabili vengono iniettate automaticamente durante il deploy dalla piattaforma
  const platformUrl = (import.meta as any).env.VITE_PROXY_URL;
  const ownerId = (import.meta as any).env.VITE_OWNER_ID;

  if (!platformUrl || !ownerId) {
    throw new Error("Configurazione piattaforma mancante.");
  }

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

  const response = await fetch(`${platformUrl}/api/ai/generate-landing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: systemPrompt,
      userId: ownerId // Questo permette alla piattaforma di scalare i crediti all'utente corretto
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Errore durante la generazione AI");
  }

  return data.content; // Restituisce il codice HTML/Tailwind generato
};
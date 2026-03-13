
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ProductDetails, GeneratedContent, FormFieldConfig, Testimonial, UiTranslation, PageTone, AIImageStyle } from "../types";

const DISCLAIMER_BASE = "Il nostro sito web agisce esclusivamente come affiliato e si concentra sulla promozione dei prodotti tramite campagne pubblicitarie. Non ci assumiamo alcuna responsabilità per la spedizione, la qualità o qualsiasi altra questione riguardante i prodotti venduti tramite link di affiliazione. Ti preghiamo di notare che le immagini utilizzate a scopo illustrativo potrebbero non corrispondere alla reale immagine del prodotto acquistato. Ti invitiamo a contattare il servizio assistenza clienti dopo aver inserito i dati nel modulo per chiedere qualsiasi domanda o informazione sul prodotto prima di confermare l’ordine. Ti informiamo inoltre che i prodotti in omaggio proposti sul sito possono essere soggetti a disponibilità limitata, senza alcuna garanzia di disponibilità da parte del venditore che spedisce il prodotto. Ricorda che, qualora sorgessero problemi relativi alle spedizioni o alla qualità dei prodotti, la responsabilità ricade direttamente sull’azienda fornitrice.";

export const TIKTOK_SLIDER_HTML = `
<style>
    .slider-containerv8 {
        position: relative;
        width: 100%;
        overflow-x: auto;
        display: flex;
        align-items: center;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        padding: 40px 10px;
        overscroll-behavior-x: contain;
    }
    .sliderv8 {
        display: flex;
        gap: 15px;
        padding-right: 40px;
    }
    .slidev8 {
        flex: 0 0 75%;
        max-width: 320px;
        scroll-snap-align: center;
        scroll-snap-stop: always;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        will-change: transform;
        transform: translateZ(0);
    }
    @media screen and (min-width: 769px){
        .slidev8 {
            flex: 0 0 25%;
            max-width: 260px;
        }
    }
    .tiktok-videov8 {
        width: 100%;
        height: auto;
        aspect-ratio: 9 / 16;
        border-radius: 15px;
        display: block;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        background: #000;
        object-fit: cover;
    }
    .slider-containerv8::-webkit-scrollbar { height: 4px; }
    .slider-containerv8::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .slider-containerv8::-webkit-scrollbar-track { background: transparent; }
    .with-borderv8 {
        padding: 4px;
        border-radius: 18px;
        background: linear-gradient(0deg, #fe2d52, #28ffff);
        width: 100%;
        pointer-events: none; /* Assicura che i tocchi passino al video/slider */
    }
    .with-borderv8 > video { pointer-events: auto; }
</style>
<div class="slider-containerv8">
    <div class="sliderv8">
        <div class="slidev8">
           <div class="with-borderv8">
            <video class="tiktok-videov8" playsinline loop muted preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/o/v/0e7bd7ed6340476b9b94ab12a8e5ab12.mp4">
            </video>
            </div>
        </div>
        <div class="slidev8">
            <div class="with-borderv8">
            <video class="tiktok-videov8" playsinline loop muted preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/o/v/d4dfdd955f2840b1b63b223ecc77cafd.mp4" type="video/mp4">
            </video>
            </div>
        </div>
        <div class="slidev8">
            <div class="with-borderv8">
            <video class="tiktok-videov8" playsinline loop muted preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/o/v/171162a47d1b44f1a042656ad7f85d02.mp4" type="video/mp4">
            </video>
            </div>
        </div>
        <div class="slidev8">
            <div class="with-borderv8">
            <video class="tiktok-videov8" playsinline loop muted preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/o/v/d8d1ca1c53114802a2d840e57fcd7e75.mp4" type="video/mp4">
            </video>
            </div>
        </div>
    </div>
</div>
<script>
    (function() {
        const videos = document.querySelectorAll(".tiktok-videov8");
        
        // Interaction: click to toggle mute/play
        videos.forEach(v => {
            v.addEventListener('click', () => {
                if (v.paused) v.play();
                else v.pause();
                v.muted = false; // Attiva l'audio alla prima interazione
            });
        });

        // Smart loading/playback via IntersectionObserver
        if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.6 });

            videos.forEach(v => obs.observe(v));
        } else {
            // Fallback for older browsers
            videos.forEach(v => v.play().catch(() => {}));
        }
    })();
</script>
`;

const COMMON_UI_DEFAULTS: Partial<UiTranslation> = {
    reviews: "Recensioni",
    offer: "Offerta",
    cardErrorTitle: "Attenzione",
    cardErrorMsg: "Al momento non possiamo accettare pagamenti con carta. Scegli come procedere:",
    switchToCod: "Paga comodamente alla consegna",
    mostPopular: "Più scelto",
    giveUpOffer: "Rinuncia all'offerta e allo sconto",
    confirmCod: "Conferma Contrassegno",
    card: "Carta di Credito",
    cod: "Pagamento alla Consegna",
    paymentMethod: "Metodo di Pagamento",
    shippingInfo: "Dati per la Spedizione",
    checkoutHeader: "Checkout",
    completeOrder: "Completa l'Ordine",
    backToShop: "Torna allo Shop",
    socialProof: "e altre {x} persone hanno acquistato.",
    shippingInsurance: "Assicurazione Spedizione",
    gadgetLabel: "Aggiungi Gadget",
    shippingInsuranceDescription: "Pacco protetto contro furto e smarrimento.",
    gadgetDescription: "Aggiungilo al tuo ordine.",
    freeLabel: "Gratis",
    summaryProduct: "Prodotto:",
    summaryShipping: "Spedizione:",
    summaryInsurance: "Assicurazione:",
    summaryGadget: "Gadget:",
    summaryTotal: "Totale:",
    socialProofAction: "ha appena acquistato",
    socialProofFrom: "da",
    socialProofBadgeName: "Alessandro",
    onlyLeft: "Solo {x} rimasti a magazzino",
    original: "Originale",
    express: "Espresso",
    warranty: "Garanzia",
    certified: "Acquisto verificato",
    techDesign: "Tecnologia & Design",
    secure: "Sicuro",
    returns: "Resi",
    orderReceived: "OK!",
    orderReceivedMsg: "Ordine Ricevuto.",
    discountLabel: "-50%",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Termini & Condizioni",
    cookiePolicy: "Cookie Policy",
    rightsReserved: "Tutti i diritti riservati.",
    generatedPageNote: "Pagina generata.",
    assistantMessage: "Ciao! Compila il modulo, ci vorrà solo un minuto.",
    localizedCities: ["Roma", "Milano", "Napoli", "Torino", "Palermo", "Genova", "Bologna", "Firenze", "Bari", "Catania"],
    localizedNames: ["Alessandro", "Marco", "Giulia", "Luca", "Sofia", "Alessandro", "Francesca", "Matteo", "Chiara", "Lorenzo"],
    timelineOrdered: "Ordinato",
    timelineReady: "Ordine Pronto",
    timelineDelivered: "Consegnato",
    thankYouTitle: "Grazie per il tuo acquisto {name}!",
    thankYouMsg: "Il tuo ordine è stato ricevuto. Un nostro consulente ti contatterà a breve al numero {phone}."
};

/**
 * Fixed to strictly follow API key usage guidelines.
 * Always initializes GoogleGenAI with process.env.API_KEY.
 */
const getAIInstance = () => {
    // Priority: process.env (bridged in index.tsx) > import.meta.env
    const apiKey = 
        (typeof process !== 'undefined' && (process.env.GEMINI_API_KEY || process.env.API_KEY)) ||
        (import.meta as any).env?.VITE_GEMINI_API_KEY || 
        (import.meta as any).env?.GEMINI_API_KEY ||
        (import.meta as any).env?.VITE_API_KEY || 
        (import.meta as any).env?.API_KEY;

    if (!apiKey) {
        throw new Error("API Key non trovata. Assicurati di aver impostato VITE_GEMINI_API_KEY nelle variabili d'ambiente di Vercel.");
    }
    return new GoogleGenAI({ apiKey });
};

export const getLanguageConfig = (lang: string) => {
    const configs: Record<string, { currency: string; locale: string; country: string; currencyPos: 'before' | 'after' }> = {
        'Italiano': { currency: '€', locale: 'it-IT', country: 'Italia', currencyPos: 'before' },
        'Rumeno': { currency: 'lei', locale: 'ro-RO', country: 'Romania', currencyPos: 'after' },
        'Slovacco': { currency: '€', locale: 'sk-SK', country: 'Slovacchia', currencyPos: 'after' },
        'Sloveno': { currency: '€', locale: 'sl-SI', country: 'Slovenia', currencyPos: 'after' },
        'Croato': { currency: '€', locale: 'hr-HR', country: 'Croazia', currencyPos: 'after' },
        'Greco': { currency: '€', locale: 'el-GR', country: 'Grecia', currencyPos: 'after' },
        'Bulgaro': { currency: 'лв', locale: 'bg-BG', country: 'Bulgaria', currencyPos: 'after' },
        'Ungherese': { currency: 'Ft', locale: 'hu-HU', country: 'Ungheria', currencyPos: 'after' },
        'Austriaco': { currency: '€', locale: 'de-AT', country: 'Austria', currencyPos: 'after' },
        'Lituano': { currency: '€', locale: 'lt-LT', country: 'Lituania', currencyPos: 'after' },
        'Republica ceca': { currency: 'Kč', locale: 'cs-CZ', country: 'Repubblica Ceca', currencyPos: 'after' },
        'Spagnolo': { currency: '€', locale: 'es-ES', country: 'Spagna', currencyPos: 'after' },
        'Portoghese': { currency: '€', locale: 'pt-PT', country: 'Portogallo', currencyPos: 'after' },
        'Tedesco': { currency: '€', locale: 'de-DE', country: 'Germania', currencyPos: 'after' },
        'Lettonia': { currency: '€', locale: 'lv-LV', country: 'Lettonia', currencyPos: 'after' },
        'Francese': { currency: '€', locale: 'fr-FR', country: 'Francia', currencyPos: 'after' },
        'Inglese (Regno Unito)': { currency: '£', locale: 'en-GB', country: 'Regno Unito', currencyPos: 'before' },
        'Inglese (Americano)': { currency: '$', locale: 'en-US', country: 'Stati Uniti', currencyPos: 'before' },
        'Olandese': { currency: '€', locale: 'nl-NL', country: 'Paesi Bassi', currencyPos: 'after' },
        'Svedese': { currency: 'kr', locale: 'sv-SE', country: 'Svezia', currencyPos: 'after' },
        'Serbo': { currency: 'din', locale: 'sr-RS', country: 'Serbia', currencyPos: 'after' },
    };
    return configs[lang] || configs['Italiano'];
};

const cleanJson = (text: any) => {
    if (typeof text !== 'string') return '{}';
    let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;
    let endChar = '';
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        startIdx = firstBrace;
        endChar = '}';
    } else if (firstBracket !== -1) {
        startIdx = firstBracket;
        endChar = ']';
    }
    if (startIdx !== -1) {
        const lastIdx = cleaned.lastIndexOf(endChar);
        if (lastIdx !== -1) {
            return cleaned.substring(startIdx, lastIdx + 1);
        }
    }
    return cleaned;
};

/**
 * Helper to call Gemini with retry logic for transient errors (like 503).
 */
const callGeminiWithRetry = async (fn: () => Promise<any>, maxRetries = 3): Promise<any> => {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (err: any) {
            lastError = err;
            const isTransient = err.message?.includes("503") || 
                               err.message?.includes("high demand") || 
                               err.message?.includes("UNAVAILABLE") ||
                               err.message?.includes("429") ||
                               err.message?.includes("Too Many Requests");
            
            if (isTransient && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1500 + Math.random() * 1000;
                console.warn(`Gemini API busy/rate-limited. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw err;
        }
    }
    throw lastError;
};

export const generateLandingPage = async (product: ProductDetails, reviewCount: number): Promise<GeneratedContent> => {
    const ai = getAIInstance();
    const targetLang = product.language || 'Italiano';
    const langConfig = getLanguageConfig(targetLang);
    
    const paragraphLengthPrompt = product.paragraphLength === 'medium' 
        ? "Each paragraph (feature description) must be at least 30 words long."
        : "Each paragraph (feature description) must be at least 50 words long.";

    const prompt = `
    Generate a high-converting landing page JSON for a product with the following details:
    Name: ${product.name}
    Niche: ${product.niche}
    Target: ${product.targetAudience}
    Description: ${product.description}
    Tone: ${product.tone}
    Language: ${targetLang}
    Features Count: ${product.featureCount || 3}
    Currency Symbol: ${langConfig.currency}

    Instructions:
    - All text content must be in ${targetLang}.
    - ${paragraphLengthPrompt}
    - IMPORTANT: In the feature descriptions, identify the key points and format them in bold using HTML <b>tags</b> (e.g., <b>punto fondamentale</b>).
    - MANDATORY: DO NOT use generic slogans like "Miglior Scelta 2023" or "Prodotto scelto da migliaia".
    - Instead, focus on product-specific benefits and clear calls to action.
    - FORBIDDEN: Do not mention dates like "2023" or "2024" in marketing slogans.
    - Provide 10 real common cities and 10 common names for localizedCities and localizedNames for ${langConfig.country}.
    - IMPORTANT: Include a "boxContent" object with a title like "Cosa Trovi nella Confezione?" (translated) and an array of items (exactly what's in the box, e.g., "1x Prodotto", "Manuale d'istruzioni").
    - IMPORTANT: Include a "variants" object. If the product naturally has variants (colors, sizes, models), enable it and provide 2-3 options. If not, set enabled to false.
    - IMPORTANT: Include a "bottomOffer" section for a special price block at the end of the page.
      - bottomOffer.title: Must be "${product.name} Oggi" (translated)
      - bottomOffer.subtitle: A persuasive short text.
      - bottomOffer.scarcityText: Must be "OFFERTA VALIDA SOLO PER OGGI" (translated)
      - bottomOffer.ctaText: A long persuasive button text like "Acquista Ora e Rivoluziona i Tuoi Lavori con Sconto del 50%" (personalized for this specific product niche, translated).
      - bottomOffer.features: MUST be an array of exactly 3 objects with "title" and "subtitle" (e.g., "Fast Shipping", "Risk-Free Trial", "12-Month Warranty") translated into ${targetLang}.
    - IMPORTANT: In uiTranslation, include a "socialProof" field with the phrase "and {x} other people have purchased" translated into ${targetLang}. Use "{x}" as the placeholder for the number.
    - IMPORTANT: In uiTranslation, include a "onlyLeft" field with a scarcity phrase like "Solo {x} rimasti a magazzino" translated into ${targetLang}. Use "{x}" as the placeholder for the number.
    - IMPORTANT: In uiTranslation, include a "certified" field with the phrase "Acquisto verificato" translated into ${targetLang}.
    - IMPORTANT: In uiTranslation, translate all form labels (nameLabel, phoneLabel, emailLabel, addressLabel, cityLabel, provinceLabel, capLabel, addressNumberLabel) into ${targetLang}.
    - IMPORTANT: In uiTranslation, include an "offer" field translated into ${targetLang} (e.g., "Offerta").
    - IMPORTANT: In uiTranslation, include an "assistantMessage" field translated into ${targetLang} (e.g., "Ciao! Compila il modulo, ci vorrà solo un minuto.").
    - IMPORTANT: In uiTranslation, include a "thankYouTitle" field translated into ${targetLang} (e.g., "Grazie per il tuo acquisto {name}!"). Use "{name}" as the placeholder.
    - IMPORTANT: In uiTranslation, include a "thankYouMsg" field translated into ${targetLang} (e.g., "Il tuo ordine è stato ricevuto. Un nostro consulente ti contatterà a breve al numero {phone}."). Use "{phone}" as the placeholder.
    - Follow the GeneratedContent interface structure strictly.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    headline: { type: Type.STRING },
                    subheadline: { type: Type.STRING },
                    ctaText: { type: Type.STRING },
                    ctaSubtext: { type: Type.STRING },
                    announcements: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                text: { type: Type.STRING },
                                icon: { type: Type.STRING }
                            },
                            required: ["text", "icon"]
                        }
                    },
                    featuresSectionTitle: { type: Type.STRING },
                    benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                    features: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                showCta: { type: Type.BOOLEAN }
                            },
                            required: ["title", "description"]
                        }
                    },
                    boxContent: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            items: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["title", "items"]
                    },
                    variants: {
                        type: Type.OBJECT,
                        properties: {
                            enabled: { type: Type.BOOLEAN },
                            title: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        label: { type: Type.STRING },
                                        price: { type: Type.STRING }
                                    },
                                    required: ["id", "label"]
                                }
                            }
                        },
                        required: ["enabled", "title", "options"]
                    },
                    bottomOffer: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            subtitle: { type: Type.STRING },
                            ctaText: { type: Type.STRING },
                            scarcityText: { type: Type.STRING },
                            features: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        subtitle: { type: Type.STRING }
                                    },
                                    required: ["title", "subtitle"]
                                }
                            }
                        },
                        required: ["title", "subtitle", "ctaText", "scarcityText"]
                    },
                    uiTranslation: { 
                        type: Type.OBJECT,
                        properties: {
                            reviews: { type: Type.STRING },
                            offer: { type: Type.STRING },
                            checkoutHeader: { type: Type.STRING },
                            completeOrder: { type: Type.STRING },
                            shippingInsurance: { type: Type.STRING },
                            shippingInsuranceDescription: { type: Type.STRING },
                            gadgetLabel: { type: Type.STRING },
                            gadgetDescription: { type: Type.STRING },
                            paymentMethod: { type: Type.STRING },
                            cod: { type: Type.STRING },
                            card: { type: Type.STRING },
                            shippingInfo: { type: Type.STRING },
                            secure: { type: Type.STRING },
                            returns: { type: Type.STRING },
                            original: { type: Type.STRING },
                            express: { type: Type.STRING },
                            warranty: { type: Type.STRING },
                            certified: { type: Type.STRING },
                            techDesign: { type: Type.STRING },
                            orderReceived: { type: Type.STRING },
                            orderReceivedMsg: { type: Type.STRING },
                            discountLabel: { type: Type.STRING },
                            privacyPolicy: { type: Type.STRING },
                            termsConditions: { type: Type.STRING },
                            cookiePolicy: { type: Type.STRING },
                            rightsReserved: { type: Type.STRING },
                            generatedPageNote: { type: Type.STRING },
                            assistantMessage: { type: Type.STRING },
                            nameLabel: { type: Type.STRING },
                            phoneLabel: { type: Type.STRING },
                            emailLabel: { type: Type.STRING },
                            addressLabel: { type: Type.STRING },
                            cityLabel: { type: Type.STRING },
                            capLabel: { type: Type.STRING },
                            provinceLabel: { type: Type.STRING },
                            addressNumberLabel: { type: Type.STRING },
                            legalDisclaimer: { type: Type.STRING },
                            thankYouTitle: { type: Type.STRING },
                            thankYouMsg: { type: Type.STRING },
                            socialProofAction: { type: Type.STRING },
                            socialProofFrom: { type: Type.STRING },
                            socialProofBadgeName: { type: Type.STRING },
                            socialProof: { type: Type.STRING },
                            onlyLeft: { type: Type.STRING },
                            summaryProduct: { type: Type.STRING },
                            summaryShipping: { type: Type.STRING },
                            summaryInsurance: { type: Type.STRING },
                            summaryGadget: { type: Type.STRING },
                            summaryTotal: { type: Type.STRING },
                            localizedCities: { type: Type.ARRAY, items: { type: Type.STRING } },
                            localizedNames: { type: Type.ARRAY, items: { type: Type.STRING } },
                            timelineOrdered: { type: Type.STRING },
                            timelineReady: { type: Type.STRING },
                            timelineDelivered: { type: Type.STRING }
                        }
                    },
                    price: { type: Type.STRING },
                    originalPrice: { type: Type.STRING },
                },
                required: ["headline", "subheadline", "ctaText", "benefits", "features", "uiTranslation", "announcements", "boxContent", "bottomOffer"]
            }
        }
    }));

    const responseText = response.text || '{}';
    const baseContent = JSON.parse(cleanJson(responseText)) as any;
    
    const randomSocialProofCount = Math.floor(Math.random() * (1500 - 401) + 401);
    const names = baseContent.uiTranslation?.localizedNames || COMMON_UI_DEFAULTS.localizedNames || [];
    const randomName = names.length > 0 ? names[Math.floor(Math.random() * names.length)] : "Alessandro";

    return {
        ...baseContent,
        language: targetLang,
        currency: langConfig.currency,
        niche: product.niche,
        templateId: 'gadget-cod',
        colorScheme: 'blue',
        backgroundColor: '#ffffff',
        buttonColor: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200',
        checkoutButtonColor: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200',
        announcementBgColor: '#0f172a',
        announcementTextColor: '#ffffff',
        showLiveAssistant: true,
        showCardPayment: true,
        stockConfig: { enabled: true, quantity: 13, textOverride: baseContent.uiTranslation?.onlyLeft || "Solo {x} rimasti a magazzino" },
        socialProofConfig: { enabled: true, intervalSeconds: 10, maxShows: 4 },
        socialProofCount: randomSocialProofCount,
        showSocialProofBadge: true,
        showDeliveryTimeline: true,
        extraLandingHtml: TIKTOK_SLIDER_HTML, 
        insuranceConfig: { enabled: true, label: baseContent.uiTranslation?.shippingInsurance || "Assicurazione Spedizione", cost: "4.90", defaultChecked: true },
        gadgetConfig: { enabled: true, label: baseContent.uiTranslation?.gadgetLabel || "Gadget Omaggio", cost: "0.00", defaultChecked: true },
        boxContent: {
            enabled: true,
            title: baseContent.boxContent?.title || "Cosa Trovi nella Confezione?",
            items: baseContent.boxContent?.items || []
        },
        variants: {
            enabled: baseContent.variants?.enabled || false,
            title: baseContent.variants?.title || "Scegli la tua variante:",
            options: baseContent.variants?.options || [],
            defaultId: baseContent.variants?.options?.[0]?.id
        },
        bottomOffer: {
            enabled: true,
            ...baseContent.bottomOffer,
            features: baseContent.bottomOffer?.features?.length > 0 ? baseContent.bottomOffer.features : [
                { title: "Spedizione Veloce", subtitle: "Consegna in 24/48 ore" },
                { title: "Prova Senza Rischi", subtitle: "30 giorni soddisfatti o rimborsati" },
                { title: "Garanzia 12 Mesi", subtitle: "Sostituzione immediata" }
            ]
        },
        formConfiguration: [
            { id: 'name', label: baseContent.uiTranslation?.nameLabel || 'Nome e Cognome', enabled: true, required: true, type: 'text', width: 12, validationType: 'none' },
            { id: 'phone', label: baseContent.uiTranslation?.phoneLabel || 'Telefono', enabled: true, required: true, type: 'tel', width: 12, validationType: 'numeric' },
            { id: 'email', label: baseContent.uiTranslation?.emailLabel || 'Email', enabled: false, required: false, type: 'email', width: 12, validationType: 'none' },
            { id: 'address', label: baseContent.uiTranslation?.addressLabel || 'Indirizzo', enabled: true, required: true, type: 'text', width: 9, validationType: 'none' },
            { id: 'address_number', label: baseContent.uiTranslation?.addressNumberLabel || 'N° Civico', enabled: true, required: true, type: 'text', width: 3, validationType: 'numeric' },
            { id: 'city', label: baseContent.uiTranslation?.cityLabel || 'Città', enabled: true, required: true, type: 'text', width: 8, validationType: 'none' },
            { id: 'province', label: baseContent.uiTranslation?.provinceLabel || 'Provincia (Sigla)', enabled: true, required: true, type: 'text', width: 4, validationType: 'alpha' },
            { id: 'cap', label: baseContent.uiTranslation?.capLabel || 'CAP', enabled: true, required: true, type: 'text', width: 12, validationType: 'numeric' },
        ],
        uiTranslation: {
            ...COMMON_UI_DEFAULTS,
            ...baseContent.uiTranslation,
            socialProofBadgeName: randomName,
            currencyPos: langConfig.currencyPos,
            legalDisclaimer: baseContent.uiTranslation?.legalDisclaimer || DISCLAIMER_BASE,
        } as UiTranslation
    };
};

export const translateLandingPage = async (content: GeneratedContent, targetLang: string): Promise<GeneratedContent> => {
    const ai = getAIInstance();
    const langConfig = getLanguageConfig(targetLang);

    // Helper to translate a specific chunk of text or object
    const translateChunk = async (chunk: any, description: string): Promise<any> => {
        const prompt = `
        TASK: Translate the following JSON object into ${targetLang} for a high-converting landing page.
        CONTEXT: ${description}
        TONE: Persuasive, professional, and culturally adapted for ${langConfig.country}.
        CURRENCY: Use "${langConfig.currency}" for any prices mentioned.
        SOCIAL PROOF: Ensure the "socialProof" field in uiTranslation is translated as "and {x} other people have purchased" in ${targetLang}, keeping the "{x}" placeholder.
        SCARCITY: Translate the "onlyLeft" field in uiTranslation accurately into ${targetLang}, ensuring the "{x}" placeholder is preserved and refers to the number of items left.
        VERIFICATION: Ensure the "certified" field in uiTranslation is translated as "Acquisto verificato" in ${targetLang}.
        THANK YOU PAGE: Ensure "thankYouTitle" preserves the "{name}" placeholder, and "thankYouMsg" preserves the "{phone}" placeholder. If "headline" contains "{name}", preserve it. If "subheadline" contains "{phone}", preserve it.
        
        MANDATORY: 
        - DO NOT skip any fields.
        - Maintain the exact same JSON structure.
        - Translate all string values.
        - If the text contains HTML tags like <b>, preserve them.
        
        JSON to translate:
        ${JSON.stringify(chunk)}
        `;

        const response = await callGeminiWithRetry(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        }));

        return JSON.parse(cleanJson(response.text || '{}'));
    };

    // 1. Translate Hero & Basic Info
    const heroChunk = await translateChunk({
        headline: content.headline,
        subheadline: content.subheadline,
        ctaText: content.ctaText,
        ctaSubtext: content.ctaSubtext,
        announcements: content.announcements?.map(a => a.text)
    }, "Hero section and main call to action");

    // 2. Translate Features (one by one for 100% accuracy)
    const translatedFeatures = await Promise.all(content.features.map(async (f, i) => {
        return await translateChunk(
            { title: f.title, description: f.description },
            `Feature number ${i + 1} description`
        );
    }));

    // 3. Translate Benefits & Box Content
    const benefitsAndBox = await translateChunk({
        benefits: content.benefits,
        boxContent: content.boxContent
    }, "Product benefits list and what's inside the box");

    // 4. Translate UI Elements & Bottom Offer
    const uiAndOffer = await translateChunk({
        uiTranslation: { ...COMMON_UI_DEFAULTS, ...content.uiTranslation },
        bottomOffer: {
            ...content.bottomOffer,
            features: content.bottomOffer?.features?.length > 0 ? content.bottomOffer.features : [
                { title: "Spedizione Veloce", subtitle: "Consegna in 24/48 ore" },
                { title: "Prova Senza Rischi", subtitle: "30 giorni soddisfatti o rimborsati" },
                { title: "Garanzia 12 Mesi", subtitle: "Sostituzione immediata" }
            ]
        },
        variants: content.variants,
        formConfiguration: content.formConfiguration?.map(f => ({ id: f.id, label: f.label }))
    }, "Checkout UI labels, legal text, final offer section, and form labels");

    // 5. Translate Testimonials (Translate the first 12, which are the most important)
    let translatedTestimonials = content.testimonials || [];
    if (translatedTestimonials.length > 0) {
        const toTranslate = translatedTestimonials.slice(0, 12);
        const testimonialsChunk = await translateChunk(toTranslate.map(t => ({
            name: t.name,
            role: t.role,
            title: t.title,
            text: t.text,
            date: t.date
        })), "Customer testimonials and reviews. Adapt names and roles (cities) to be realistic for " + langConfig.country);
        
        const translatedArray = Array.isArray(testimonialsChunk) ? testimonialsChunk : (testimonialsChunk.testimonials || []);
        
        translatedTestimonials = translatedArray.map((t: any, i: number) => ({
            ...translatedTestimonials[i],
            ...t
        })).concat(translatedTestimonials.slice(12));
    }

    // 6. Localized Cities and Names (Special generation for the target country)
    const localizationPrompt = `Generate 10 common real cities and 10 common real first names for ${langConfig.country}. Return as JSON: { "cities": [], "names": [] }`;
    const locResponse = await callGeminiWithRetry(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: localizationPrompt,
        config: { responseMimeType: "application/json" }
    }));
    const locData = JSON.parse(cleanJson(locResponse.text || '{}'));

    // Reconstruct the final content
    return {
        ...content,
        language: targetLang,
        currency: langConfig.currency,
        headline: heroChunk.headline,
        subheadline: heroChunk.subheadline,
        ctaText: heroChunk.ctaText,
        ctaSubtext: heroChunk.ctaSubtext,
        announcements: content.announcements?.map((a, i) => ({
            ...a,
            text: heroChunk.announcements?.[i] || a.text
        })),
        features: content.features.map((f, i) => ({
            ...f,
            title: translatedFeatures[i].title,
            description: translatedFeatures[i].description
        })),
        benefits: benefitsAndBox.benefits,
        boxContent: benefitsAndBox.boxContent,
        uiTranslation: {
            ...uiAndOffer.uiTranslation,
            localizedCities: locData.cities || uiAndOffer.uiTranslation.localizedCities,
            localizedNames: locData.names || uiAndOffer.uiTranslation.localizedNames,
            currencyPos: langConfig.currencyPos
        },
        testimonials: translatedTestimonials,
        bottomOffer: uiAndOffer.bottomOffer,
        variants: uiAndOffer.variants,
        stockConfig: {
            ...content.stockConfig,
            textOverride: uiAndOffer.uiTranslation.onlyLeft || content.stockConfig.textOverride
        },
        formConfiguration: content.formConfiguration?.map(field => {
            let translatedLabel = field.label;
            const translatedField = uiAndOffer.formConfiguration?.find((f: any) => f.id === field.id);
            if (translatedField && translatedField.label) {
                translatedLabel = translatedField.label;
            } else {
                if (field.id === 'name' && uiAndOffer.uiTranslation?.nameLabel) translatedLabel = uiAndOffer.uiTranslation.nameLabel;
                if (field.id === 'phone' && uiAndOffer.uiTranslation?.phoneLabel) translatedLabel = uiAndOffer.uiTranslation.phoneLabel;
                if (field.id === 'email' && uiAndOffer.uiTranslation?.emailLabel) translatedLabel = uiAndOffer.uiTranslation.emailLabel;
                if (field.id === 'address' && uiAndOffer.uiTranslation?.addressLabel) translatedLabel = uiAndOffer.uiTranslation.addressLabel;
                if (field.id === 'city' && uiAndOffer.uiTranslation?.cityLabel) translatedLabel = uiAndOffer.uiTranslation.cityLabel;
                if (field.id === 'province' && uiAndOffer.uiTranslation?.provinceLabel) translatedLabel = uiAndOffer.uiTranslation.provinceLabel;
                if (field.id === 'cap' && uiAndOffer.uiTranslation?.capLabel) translatedLabel = uiAndOffer.uiTranslation.capLabel;
                if (field.id === 'address_number' && uiAndOffer.uiTranslation?.addressNumberLabel) translatedLabel = uiAndOffer.uiTranslation.addressNumberLabel;
            }
            
            return {
                ...field,
                label: translatedLabel
            };
        })
    };
};

/**
 * Generates customer reviews.
 * Optimized to generate up to 300 reviews. 
 * The first 100 are detailed, the rest can be concise (without long text).
 */
export const generateReviews = async (product: ProductDetails, language: string, count: number): Promise<Testimonial[]> => {
    const ai = getAIInstance();
    const today = new Date();
    const dateStr = today.toLocaleDateString('it-IT');
    const referenceImages = (product.images || []).filter(img => img.startsWith('data:image'));

    const allReviews: Testimonial[] = [];
    const target = Math.min(count, 300); // Increased target to 300
    
    let currentStart = 0;
    while (currentStart < target) {
        // Determine if this batch is for detailed or filler reviews
        const isFiller = currentStart >= 100;
        const batchSize = isFiller ? 50 : 25; // Filler reviews are smaller, so we can request more at once
        const remaining = target - currentStart;
        const batchToGen = Math.min(remaining, batchSize);
        
        const contentsParts: any[] = [];
        const promptText = `
        TASK: Generate EXACTLY ${batchToGen} unique and realistic customer reviews for the product "${product.name}" in ${language}.

        CONTEXT:
        - Description: "${product.description}"
        - Current Date: ${dateStr}
        
        Instructions:
        - Return ONLY a JSON Array of EXACTLY ${batchToGen} objects.
        - Each review must have a unique tone, unique name, and unique city.
        - ${isFiller ? "MANDATORY: These are filler reviews. Keep the 'text' field EMPTY or extremely short (max 5 words)." : "Focus on different product-specific aspects (speed, quality, ease of use)."}
        - MANDATORY: The verification status is ALWAYS "Acquisto verificato" (translate this to ${language}).
        - Dates should be formatted as "DD MMM YYYY".
        - Each review needs name, title, rating (4-5 stars), text, and date.`;

        contentsParts.push({ text: promptText });

        if (referenceImages.length > 0) {
            const refImg = referenceImages[Math.floor(Math.random() * referenceImages.length)];
            const base64Data = refImg.split(',')[1];
            const mimeType = refImg.split(';')[0].split(':')[1];
            contentsParts.push({
                inlineData: { data: base64Data, mimeType: mimeType }
            });
        }

        try {
            const response = await callGeminiWithRetry(() => ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: { parts: contentsParts },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                title: { type: Type.STRING },
                                text: { type: Type.STRING },
                                role: { type: Type.STRING },
                                rating: { type: Type.NUMBER },
                                date: { type: Type.STRING },
                                images: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["name", "text", "rating", "date"]
                        }
                    }
                }
            }));

            const responseText = response.text || '[]';
            const parsed = JSON.parse(cleanJson(responseText));
            if (Array.isArray(parsed)) {
                allReviews.push(...parsed);
            }
        } catch (e) {
            console.error(`Failed to parse reviews batch starting at ${currentStart}:`, e);
        }
        
        currentStart += batchToGen;
    }

    return allReviews;
};

export const generateActionImages = async (product: ProductDetails, styles: AIImageStyle[], count: number, customPrompt?: string): Promise<string[]> => {
    const ai = getAIInstance();
    const referenceImages = (product.images || []).filter(img => img.startsWith('data:image'));

    // Eseguiamo le generazioni in sequenza per evitare errori 429 (Too Many Requests)
    // sui piani a pagamento che hanno limiti di concorrenza rigidi per le immagini.
    const results: (string | null)[] = [];
    
    for (let i = 0; i < count; i++) {
        const style = styles[i % styles.length];
        const stylePrompts: Record<AIImageStyle, string> = {
            'lifestyle': 'Place the product in a realistic home or outdoor environment with natural lighting and human interaction.',
            'technical': 'Professional studio close-up focusing on premium textures, materials and mechanical details.',
            'informative': 'Clear commercial product shot, perfectly centered, showing the full object with no distractions.'
        };

        const promptText = `TASK: Generate a professional ultra-high quality ${style} photograph for the product "${product.name}".
        
        Product Context: "${product.description}"
        ${customPrompt ? `SPECIFIC USER REQUEST: "${customPrompt}"` : ''}
        
        Visual Style: ${stylePrompts[style]}.
        Ensure the lighting is cinematic and the colors are vibrant but realistic.
        
        CRITICAL INSTRUCTIONS:
        1. The generated image MUST be based heavily on the provided reference image. Maintain the exact same product design, shape, and core features. Do not invent a completely different product.
        2. If you include any text, labels, or writing in the generated image, it MUST be in the following language: ${product.language || 'Italiano'}.`;

        const contentsParts: any[] = [{ text: promptText }];
        
        if (referenceImages.length > 0) {
            const refImg = referenceImages[i % referenceImages.length];
            const base64Data = refImg.split(',')[1];
            const mimeType = refImg.split(';')[0].split(':')[1];
            
            contentsParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            });
        }

        try {
            const response = await callGeminiWithRetry(() => ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: contentsParts },
                config: {
                    imageConfig: { aspectRatio: "1:1" }
                }
            }));

            const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
            if (part?.inlineData?.data) {
                results.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            } else {
                results.push(null);
            }
        } catch (err) {
            console.error(`AI Image generation task ${i} failed:`, err);
            results.push(null);
        }
        
        // Aggiungiamo un piccolo ritardo tra una generazione e l'altra per sicurezza
        if (i < count - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    return results.filter(img => img !== null) as string[];
};

export const rewriteLandingPage = async (content: GeneratedContent, tone: PageTone): Promise<GeneratedContent> => {
    const ai = getAIInstance();
    
    const textFields = {
        headline: content.headline,
        subheadline: content.subheadline,
        ctaText: content.ctaText,
        ctaSubtext: content.ctaSubtext,
        benefits: content.benefits,
        features: content.features.map(f => ({ title: f.title, description: f.description })),
        announcements: content.announcements?.map(a => a.text),
        boxContent: content.boxContent,
        bottomOffer: {
            ...content.bottomOffer,
            features: content.bottomOffer?.features?.length > 0 ? content.bottomOffer.features : [
                { title: "Spedizione Veloce", subtitle: "Consegna in 24/48 ore" },
                { title: "Prova Senza Rischi", subtitle: "30 giorni soddisfatti o rimborsati" },
                { title: "Garanzia 12 Mesi", subtitle: "Sostituzione immediata" }
            ]
        }
    };

    const targetLang = content.language || 'Italiano';
    const prompt = `Rewrite the following landing page content to have a ${tone} tone in ${targetLang}: ${JSON.stringify(textFields)}
    
    IMPORTANT: If "headline" contains "{name}", preserve the "{name}" placeholder in the rewritten text.
    IMPORTANT: If "subheadline" contains "{phone}", preserve the "{phone}" placeholder in the rewritten text.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    headline: { type: Type.STRING },
                    subheadline: { type: Type.STRING },
                    ctaText: { type: Type.STRING },
                    ctaSubtext: { type: Type.STRING },
                    benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                    features: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING }
                            }
                        }
                    },
                    boxContent: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            items: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    },
                    bottomOffer: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            subtitle: { type: Type.STRING },
                            ctaText: { type: Type.STRING },
                            scarcityText: { type: Type.STRING },
                            features: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        subtitle: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    },
                    announcements: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    }));

    const translated = JSON.parse(cleanJson(response.text || '{}'));

    return {
        ...content,
        ...translated,
        features: content.features.map((f, i) => ({
            ...f,
            title: translated.features?.[i]?.title || f.title,
            description: translated.features?.[i]?.description || f.description
        })),
        announcements: content.announcements?.map((a, i) => ({
            ...a,
            text: translated.announcements?.[i] || a.text
        }))
    };
};

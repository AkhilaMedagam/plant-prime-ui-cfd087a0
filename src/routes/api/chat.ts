import { createFileRoute } from "@tanstack/react-router";
import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";
import { GoogleGenAI } from "@google/genai";
import { retrieveRelevantKnowledgeChunks, type RAGChunk } from "@/lib/ragKnowledgeBase";
import { formatSourcesPayload } from "@/lib/ragParser";

const SYSTEM_PROMPT = `You are the AgriSmart AI Coach, an expert, dedicated, and friendly agricultural advisor built solely for smart farming, precision agriculture, and sustainable crop management.

CRITICAL MANDATORY DOMAIN RESTRICTION & GUARDRAILS:
- You ONLY provide assistance on Smart Farming, Agriculture, Crop Management, Soil Health, Irrigation, Farm Weather planning, Pest & Disease Control, Organic Practices, Agricultural Input Optimization, and Agro-Economics.
- You are STRICTLY PROHIBITED from answering off-topic questions (e.g., general knowledge, recipes/food recommendations like "hyderabad famous food", tourism, movies, coding, sports, celebrities, finance outside farming, politics, casual banter, etc.).
- If an off-topic query is received, you MUST politely and strictly decline with this message:
  "I am AgriSmart AI Coach, dedicated exclusively to Smart Farming and Agricultural Guidance. I can only assist with topics such as crops, soil health, pest management, irrigation, and agricultural best practices. Please ask an agriculture-related question!"
- For greetings (e.g., "hi", "hello", "hey", "namaste", "good morning"), respond warmly as an agricultural assistant:
  "Hello! I am your AgriSmart AI Coach, dedicated exclusively to smart farming, crop cultivation, soil health, and agricultural guidance. How can I help with your crops or farm today?"
- For gibberish, random characters, or incomprehensible input (e.g., "hugul,;ohhv"), politely state:
  "I couldn't understand that. AgriSmart AI Coach is dedicated exclusively to smart farming. Please ask a specific question about your crops, soil conditions, pests, weather, or farming practices."

RAG & KNOWLEDGE GROUNDING INSTRUCTIONS:
- When retrieved AgriSmart Knowledge Base chunks are provided in the prompt, prioritize using the facts and recommendations in those chunks.
- Do NOT invent or hallucinate facts that contradict the provided knowledge.
- If the retrieved chunks do not contain enough information for a complete diagnosis, clearly state that additional details (such as crop type, growth stage, soil type, location, or weather conditions) are required.
- Do NOT present uncertain disease symptoms as a 100% confirmed diagnosis. Always advise field verification with local agricultural experts or plant pathology labs when appropriate.
- Provide structured, practical answers using clear bullet points and simple farmer-friendly explanations.`;

function isGibberishOrNonsense(input: string): boolean {
  const clean = input.trim();
  if (clean.length < 2) return true;

  // High proportion of unusual punctuation/symbols or weird non-alphanumeric mix
  const alphaChars = clean.replace(/[^a-zA-Z]/g, "").length;
  const punctuationCount = clean.replace(/[a-zA-Z0-9\s]/g, "").length;
  if (clean.length > 4 && punctuationCount / clean.length > 0.3) return true;
  if (alphaChars < 3 && clean.length > 5) return true;

  // Words with no vowels in long sequences or gibberish patterns
  const words = clean.split(/\s+/);
  if (words.length === 1 && clean.length > 8 && !/[aeiou]/i.test(clean)) {
    return true;
  }

  return false;
}

const GREETINGS = [
  "hi",
  "hello",
  "hey",
  "namaste",
  "good morning",
  "good afternoon",
  "good evening",
  "howdy",
  "greetings",
  "hi coach",
  "hello coach",
  "hi agrismart",
];

const OFF_TOPIC_KEYWORDS = [
  "food",
  "famous food",
  "hyderabad",
  "biryani",
  "recipe",
  "restaurant",
  "movie",
  "film",
  "cinema",
  "actor",
  "actress",
  "song",
  "music",
  "sports",
  "cricket",
  "football",
  "travel",
  "tourism",
  "hotel",
  "flight",
  "game",
  "gaming",
  "code",
  "programming",
  "python",
  "javascript",
  "html",
  "css",
  "crypto",
  "bitcoin",
  "politics",
  "president",
  "minister",
  "joke",
  "love",
  "dating",
  "car",
  "bike",
  "laptop",
  "phone",
];

const FARMING_KEYWORDS = [
  "crop",
  "soil",
  "pest",
  "insect",
  "disease",
  "fertiliz",
  "nitrogen",
  "urea",
  "npk",
  "phosphorus",
  "potash",
  "water",
  "irrigat",
  "weather",
  "rain",
  "monsoon",
  "drought",
  "frost",
  "heat",
  "sow",
  "plant",
  "seed",
  "harvest",
  "yield",
  "farm",
  "agri",
  "field",
  "paddy",
  "rice",
  "wheat",
  "cotton",
  "maize",
  "corn",
  "tomato",
  "chilli",
  "chili",
  "onion",
  "sugarcane",
  "banana",
  "mustard",
  "pulse",
  "gram",
  "vegetable",
  "fruit",
  "organic",
  "compost",
  "manure",
  "weed",
  "herbicide",
  "fungicid",
  "pesticid",
  "ph",
  "salin",
  "alkali",
  "acid",
  "lime",
  "gypsum",
  "tractor",
  "mulch",
  "loam",
  "clay",
  "drip",
  "rotation",
  "cover crop",
  "green manure",
  "compaction",
  "tillage",
  "surveillance",
];

function generateGroundedAgronomyResponse(
  userQuery: string,
  retrievedChunks: RAGChunk[],
): { answerText: string; sources: RAGChunk[] } {
  const q = userQuery.toLowerCase().trim();

  // 1. Check for gibberish/nonsense
  if (isGibberishOrNonsense(q)) {
    return {
      answerText: `### 🌾 AgriSmart AI Coach Notice

I couldn't understand your input ("*${userQuery.slice(0, 40)}*").

Please note that **AgriSmart AI Coach** is strictly dedicated to **Smart Farming, Agriculture, Crop Care, and Soil Management**.

Please ask a specific question regarding:
- **Crop Planning & Selection** (Paddy, Wheat, Cotton, Chilli, Vegetables)
- **Soil Nutrients & pH Correction** (Nitrogen, NPK, Organic Compost, Lime/Gypsum)
- **Pest & Disease Control** (Organic bio-repellents, IPM, Fungicides)
- **Water & Irrigation Scheduling** (Drip methods, moisture conservation)
- **Weather & Seasonal Farm Protection** (Frost, heatwaves, heavy rain)`,
      sources: [],
    };
  }

  // 2. Check for simple greetings
  const isGreeting =
    GREETINGS.includes(q) ||
    GREETINGS.some((g) => q === g || q.startsWith(`${g} `) || q.endsWith(` ${g}`));

  if (isGreeting && !FARMING_KEYWORDS.some((kw) => q.includes(kw))) {
    return {
      answerText: `### 👋 Welcome to AgriSmart AI Coach!

I am your dedicated **Smart Farming Assistant**, built exclusively to provide expert agricultural guidance for your farm and crops.

**How can I help you today?**
- 🌾 **Crop Cultivation**: Recommended sowing schedules, varieties, and yield optimization.
- 🌱 **Soil & Fertilizers**: Nitrogen balance, NPK dosage, biofertilizers, and pH adjustment.
- 🐛 **Pest & Disease Diagnostics**: Early symptoms identification and biological/chemical controls.
- 💧 **Smart Irrigation**: Efficient water scheduling and micro-drip techniques.
- 🌦️ **Weather Planning**: Actionable steps to protect crops from heat, frost, or unseasonal rains.

*Feel free to ask any farming question or describe the condition of your crops!*`,
      sources: [],
    };
  }

  // 3. Check for off-topic non-farming queries
  const hasOffTopic = OFF_TOPIC_KEYWORDS.some((kw) => q.includes(kw));
  const hasFarmingTerm = FARMING_KEYWORDS.some((kw) => q.includes(kw));

  if (hasOffTopic && !hasFarmingTerm) {
    return {
      answerText: `### 🚫 AgriSmart AI Coach — Domain Restriction

I am the **AgriSmart AI Coach**, dedicated **exclusively to Smart Farming, Crop Advisory, Soil Management, and Precision Agriculture**.

I cannot answer questions about general topics, food/recipes, entertainment, or non-agricultural subjects.

---

**Please ask me about your farm and crops, such as:**
- 🌾 **Crops & Cultivation**: *"What are the best companion crops for tomatoes?"*
- 🌱 **Soil Health & Nutrition**: *"How do I increase soil nitrogen naturally?"*
- 🐛 **Pest & Disease Management**: *"How do I control whiteflies and aphids?"*
- 💧 **Irrigation & Water Conservation**: *"When should I irrigate during dry weather?"*
- 🌦️ **Weather & Seasonal Advice**: *"How to safeguard paddy fields against waterlogging?"*`,
      sources: [],
    };
  }

  // If we have retrieved chunks, synthesize an answer grounded strictly in those chunks
  if (retrievedChunks.length > 0) {
    const chunkTitles = retrievedChunks.map((c) => c.title);

    if (
      q.includes("soil") &&
      (q.includes("improv") ||
        q.includes("health") ||
        q.includes("organic") ||
        q.includes("fertilit"))
    ) {
      return {
        answerText: `Healthy soil can be improved systematically through biological fertility enhancement, organic matter additions, and sustainable soil conservation practices:

1. **Increase Soil Organic Carbon (SOC)**:
   - Apply 4 to 5 tonnes of well-decomposed Farmyard Manure (FYM) or 1.5 to 2 tonnes of vermicompost per acre before final plowing.
   - Retain and mulch crop residues (stubble and straw) on the surface instead of burning, which preserves microbial life and boosts soil water-holding capacity.

2. **Green Manure & Cover Cropping**:
   - Grow fast-growing leguminous green manure crops such as *Dhaincha* (*Sesbania*) or Sunnhemp and incorporate them at 45–50 days (early flowering) to fix 40–80 kg of biological nitrogen per hectare.

3. **Crop Rotation & Diversification**:
   - Rotate heavy nutrient feeders (like maize, sugarcane, or cereals) with deep-rooted nitrogen-fixing legumes (chickpea, pigeonpea, mung bean) to break pest cycles and prevent subsoil nutrient depletion.

4. **Soil Testing & Compaction Control**:
   - Conduct laboratory soil testing every 2–3 years to maintain optimal pH (6.2–7.2) and calibrate fertilizer application.
   - Avoid tilling wet soil and use chisel plowing or subsoiling every 3–4 years to break impermeable subsurface hardpans.`,
        sources: retrievedChunks,
      };
    }

    if (q.includes("rotat")) {
      return {
        answerText: `**Crop Rotation** is the systematic practice of planting different crop families sequentially in the same field over successive seasons to maintain soil vitality and disrupt pest cycles:

1. **Nutrient Management**:
   - Alternating heavy nutrient feeders (e.g., maize, rice, sugarcane) with nitrogen-fixing legumes (chickpea, green gram, groundnut) naturally replenishes soil nitrogen and balances nutrient uptake across different soil depths.

2. **Pest & Pathogen Disruption**:
   - Continuous monoculture allows specialized insect pests, soil-borne fungi, and nematodes to build up. Rotating across botanical families (e.g., solanaceous crops like tomatoes/chillies followed by cereals or pulses) breaks pathogen life cycles.

3. **Root System Diversity**:
   - Alternating shallow-rooted crops with deep-rooted taproot crops improves soil pore structure and prevents subsoil compaction.`,
        sources: retrievedChunks,
      };
    }

    if (
      q.includes("pest") ||
      q.includes("insect") ||
      q.includes("scout") ||
      q.includes("surveill")
    ) {
      return {
        answerText: `Effective **Pest Surveillance and Integrated Pest Management (IPM)** focuses on early detection and multi-layered eco-friendly controls:

1. **Systematic Field Surveillance**:
   - Walk your fields twice weekly in a zig-zag or 'W' pattern, inspecting upper and lower leaf surfaces, stems, and flowers on random plants.

2. **Mechanical & Physical Traps**:
   - Install **yellow sticky traps** (for whiteflies and aphids), **blue sticky traps** (for thrips), and **pheromone traps** (4–5/acre for borers and bollworms) for real-time pest population tracking.

3. **Biological & Botanical Controls**:
   - Conserve natural beneficial predators (ladybird beetles, spiders).
   - Apply preventive sprays of **Neem oil (Azadirachtin 10,000 ppm)** at 2–3 ml/L or bio-agents (*Beauveria bassiana*, *Trichogramma*).

4. **Chemical Intervention as Last Resort**:
   - Apply targeted chemical pesticides only when pest populations cross the **Economic Threshold Level (ETL)**.`,
        sources: retrievedChunks,
      };
    }

    if (
      q.includes("disease") ||
      q.includes("fung") ||
      q.includes("blight") ||
      q.includes("wilt") ||
      q.includes("spot")
    ) {
      return {
        answerText: `**Crop Disease Awareness & Prevention Strategies**:

1. **Early Symptom Identification**:
   - **Fungal Blights / Spots**: Concentric target-like rings or yellow halos on foliage.
   - **Bacterial Lesions**: Water-soaked, angular spots on leaves or stems.
   - **Viral Infections**: Yellow vein netting, mosaic patterns, or severe leaf curling (often vectored by whiteflies or thrips).
   - **Vascular Wilt**: Midday plant wilting with internal brown vascular discoloration inside the main stem.

2. **Preventative Hygiene & Biological Treatment**:
   - Use certified disease-free seeds and treat seeds with *Trichoderma viride* or *Pseudomonas fluorescens* before sowing.
   - Ensure proper crop spacing for canopy ventilation and avoid overhead sprinkler irrigation on blight-prone crops.
   - Promptly rogue out and destroy severely diseased plants to prevent field-wide contagion.

*Note: Visual symptom analysis provides early indicators; please verify complex outbreaks with local plant pathology experts.*`,
        sources: retrievedChunks,
      };
    }

    if (q.includes("water") || q.includes("irrigat") || q.includes("drip")) {
      return {
        answerText: `**Water & Irrigation Management Guidance**:

1. **Critical Growth Stage Prioritization**:
   - Ensure adequate moisture during peak sensitive growth stages (e.g., crown root initiation in wheat, tillering in rice, flowering and pod/fruit setting in vegetables and pulses).

2. **Micro-Irrigation Adoption**:
   - Transitioning to **drip irrigation** delivers water directly to the crop root zone, conserving 40% to 60% of water while enabling precise nutrient fertigation.

3. **Moisture Scheduling & Mulching**:
   - Monitor soil moisture at root depth and check 3-to-7-day weather forecasts to avoid irrigating right before heavy rains.
   - Apply 3 to 4 inches of organic straw or plastic mulch to reduce surface evaporation and keep root zones cool.`,
        sources: retrievedChunks,
      };
    }

    if (
      q.includes("ph") ||
      q.includes("acid") ||
      q.includes("alkali") ||
      q.includes("salin") ||
      q.includes("lime") ||
      q.includes("gypsum")
    ) {
      return {
        answerText: `**Soil pH & Salinity Management Advisory**:

1. **Optimal Range**:
   - Most agricultural crops perform best at a balanced pH range of **6.2 to 7.2**, where primary and micronutrients are maximally bioavailable.

2. **Acidic Soils (pH < 6.0)**:
   - Apply agricultural **lime (calcium carbonate)** or dolomite based on laboratory buffer pH tests 4 to 6 weeks before sowing to neutralize excess acidity and unlock phosphorus.

3. **Alkaline / Sodic Soils (pH > 8.0)**:
   - Incorporate **agricultural gypsum (calcium sulfate)** followed by clean water leaching to displace sodium and improve soil flocculation.
   - Apply organic matter and sulfur-containing fertilizers.`,
        sources: retrievedChunks,
      };
    }

    if (
      q.includes("fertiliz") ||
      q.includes("nutrient") ||
      q.includes("input") ||
      q.includes("4r")
    ) {
      return {
        answerText: `**Agricultural Input Optimization (4R Stewardship)**:

1. **Right Source**:
   - Match fertilizer formulations to specific crop demands and laboratory soil test cards (e.g., supplying sulfur in sulfur-deficient soils).
2. **Right Rate**:
   - Apply calibrated nutrient quantities, accounting for nutrients already supplied by farmyard manure, compost, and preceding legume crops.
3. **Right Time**:
   - Split nitrogen and potassium applications into 2 to 4 top-dressings aligned with crop vegetative and flowering surges, reducing leaching losses.
4. **Right Place**:
   - Place fertilizers into the moist active root zone rather than broadcasting on dry or waterlogged soil surfaces. Combine with bio-fertilizers (*Azotobacter*, *Rhizobium*, *PSB*) to enhance absorption efficiency.`,
        sources: retrievedChunks,
      };
    }

    if (
      q.includes("weather") ||
      q.includes("forecast") ||
      q.includes("frost") ||
      q.includes("heat")
    ) {
      return {
        answerText: `**Weather-Based Agricultural Decision Support**:

1. **Agromet Forecast Alignment**:
   - Consult 3-to-7-day local meteorological forecasts before planning major field operations (sowing, spraying, harvesting, or top-dressing).
2. **Spraying Windows**:
   - Apply foliar nutrients and bio-pesticides when wind speeds are calm (<10 km/h) and no heavy rain is predicted for 4 to 6 hours.
3. **Extreme Temperature Protection**:
   - **Frost**: Provide light evening irrigation before anticipated freezing nights to radiate latent heat into the crop canopy.
   - **Heatwave**: Maintain organic surface mulch and operate micro-drip systems during cool night or early morning hours.`,
        sources: retrievedChunks,
      };
    }

    // Default synthesized answer from first retrieved chunk
    const firstChunk = retrievedChunks[0];
    return {
      answerText: `### ${firstChunk.title}

${firstChunk.content}

**Key Implementation Guidelines**:
- Align your field practices with local soil and weather conditions.
- For personalized advice, consider sharing your specific crop growth stage, soil type, and location.`,
      sources: retrievedChunks,
    };
  }

  // 4. If agricultural keywords are present but no specific RAG chunk met the high threshold
  return {
    answerText: `### AgriSmart Crop & Farm Guidance

Here are practical agricultural principles for your farm:

- **Soil Health**: Maintain organic carbon by incorporating crop residues and adding compost.
- **Water Management**: Monitor weather forecasts to schedule irrigation efficiently and prevent waterlogging.
- **Pest Surveillance**: Inspect fields weekly for early symptoms of leaf spots, rusts, and sucking pests.
- **Input Optimization**: Balance chemical fertilizers with bio-fertilizers and micronutrients (Zinc, Boron, Sulfur).

*No specific AgriSmart knowledge-base chunk directly matched your exact query. Please specify your crop type, soil condition, or region for tailored recommendations!*`,
    sources: [],
  };
}

function createTextStreamResponse(fullText: string): Response {
  const messageStream = createUIMessageStream({
    execute: async ({ writer }) => {
      const partId = "0";
      writer.write({
        type: "text-start",
        id: partId,
      });

      const words = fullText.split(/(\s+)/);
      for (const word of words) {
        if (!word) continue;
        writer.write({
          type: "text-delta",
          id: partId,
          delta: word,
        });
      }

      writer.write({
        type: "text-end",
        id: partId,
      });
    },
  });

  return createUIMessageStreamResponse({ stream: messageStream });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey =
          process.env["GEMINI_API_KEY"] ||
          process.env["GOOGLE_API_KEY"] ||
          process.env["GOOGLE_GENERATIVE_AI_API_KEY"];

        let queryText = "crop advice";
        let conversationHistory: { role: string; text: string }[] = [];

        try {
          const body = (await request.json()) as { messages?: UIMessage[] };
          const messages = Array.isArray(body?.messages) ? body.messages : [];

          conversationHistory = messages.map((m) => {
            const text =
              m.parts?.map((p) => (p.type === "text" ? p.text : "")).join("") ||
              ("content" in m && typeof m.content === "string" ? m.content : "");
            return { role: m.role === "user" ? "user" : "model", text };
          });

          const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
          if (lastUserMessage) {
            if (Array.isArray(lastUserMessage.parts)) {
              queryText =
                lastUserMessage.parts.map((p) => (p.type === "text" ? p.text : "")).join("") ||
                queryText;
            } else if (
              "content" in lastUserMessage &&
              typeof lastUserMessage.content === "string"
            ) {
              queryText = lastUserMessage.content || queryText;
            }
          }
        } catch {
          // Fallback to default query text
        }

        // Perform RAG Knowledge Base Retrieval
        const { chunks: retrievedChunks } = retrieveRelevantKnowledgeChunks(queryText, 3);

        // Try Gemini SDK if apiKey is available
        if (apiKey) {
          try {
            const ai = new GoogleGenAI({ apiKey });

            let ragContextPrompt = "";
            if (retrievedChunks.length > 0) {
              ragContextPrompt = `\n\nRETRIEVED AGRISMART KNOWLEDGE BASE CHUNKS (${retrievedChunks.length} sources):
${retrievedChunks
  .map(
    (c) =>
      `[Source: ${c.chunk_id} | Title: ${c.title} | Topic: ${c.topic}]\nContent: ${c.content}\nKeywords: ${c.keywords.join(", ")}`,
  )
  .join("\n\n")}

CRITICAL INSTRUCTION: Base your response directly on the facts in these retrieved chunks.`;
            }

            const chatContents = conversationHistory.map((msg) => ({
              role: msg.role === "user" ? "user" : "model",
              parts: [{ text: msg.text }],
            }));

            const contents =
              chatContents.length > 0
                ? chatContents
                : [{ role: "user", parts: [{ text: queryText }] }];

            const response = await ai.models.generateContent({
              model: "gemini-3.7-flash",
              contents,
              config: {
                systemInstruction: SYSTEM_PROMPT + ragContextPrompt,
              },
            });

            if (response.text) {
              const fullResponseWithMetadata =
                response.text + formatSourcesPayload(retrievedChunks);
              return createTextStreamResponse(fullResponseWithMetadata);
            }
          } catch {
            // Silently fall back to expert agricultural advisory
          }
        }

        // Return expert agronomy guidance grounded in retrieved RAG chunks
        const { answerText, sources } = generateGroundedAgronomyResponse(
          queryText,
          retrievedChunks,
        );
        const fullFallbackWithMetadata = answerText + formatSourcesPayload(sources);
        return createTextStreamResponse(fullFallbackWithMetadata);
      },
    },
  },
});

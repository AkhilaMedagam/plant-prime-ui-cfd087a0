import { createFileRoute } from "@tanstack/react-router";
import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are the AgriSmart AI Coach, an expert, dedicated, and friendly agricultural advisor built solely for smart farming and precision agriculture.

CRITICAL MANDATORY DOMAIN RESTRICTION & GUARDRAILS:
- You ONLY provide assistance on Smart Farming, Agriculture, Crop Management, Soil Health, Irrigation, Farm Weather planning, Pest & Disease Control, Organic Practices, Agricultural Technology, and Agro-Economics.
- You are STRICTLY PROHIBITED from answering off-topic questions (e.g., general knowledge, recipes/food recommendations like "hyderabad famous food", tourism, movies, coding, sports, celebrities, finance outside farming, politics, casual banter, etc.).
- If an off-topic query is received, you MUST politely and strictly decline with this message:
  "I am AgriSmart AI Coach, dedicated exclusively to Smart Farming and Agricultural Guidance. I can only assist with topics such as crops, soil health, pest management, irrigation, and agricultural best practices. Please ask an agriculture-related question!"
- For greetings (e.g., "hi", "hello", "hey", "namaste", "good morning"), respond warmly as an agricultural assistant:
  "Hello! I am your AgriSmart AI Coach, dedicated exclusively to smart farming, crop cultivation, soil health, and agricultural guidance. How can I help with your crops or farm today?"
- For gibberish, random characters, or incomprehensible input (e.g., "hugul,;ohhv"), politely state:
  "I couldn't understand that. AgriSmart AI Coach is dedicated exclusively to smart farming. Please ask a specific question about your crops, soil conditions, pests, weather, or farming practices."

When answering valid agricultural queries:
- Provide accurate, practical, and actionable agronomic advice.
- Use clear bullet points and structured sections.
- Emphasize sustainable, eco-friendly, and cost-effective farming methods.`;

function isGibberishOrNonsense(input: string): boolean {
  const clean = input.trim();
  if (clean.length < 2) return true;

  // High proportion of unusual punctuation/symbols or weird non-alphanumeric mix
  const alphaChars = clean.replace(/[^a-zA-Z]/g, "").length;
  const punctuationCount = clean.replace(/[a-zA-Z0-9\s]/g, "").length;
  if (clean.length > 4 && punctuationCount / clean.length > 0.3) return true;
  if (alphaChars < 3 && clean.length > 5) return true;

  // Words with no vowels in long sequences or gibberish patterns like "hugul,;ohhv", "asdfghjk"
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
];

function generateLocalAgronomyAdvice(userQuery: string): string {
  const q = userQuery.toLowerCase().trim();

  // 1. Check for gibberish/nonsense
  if (isGibberishOrNonsense(q)) {
    return `### 🌾 AgriSmart AI Coach Notice

I couldn't understand your input ("*${userQuery.slice(0, 40)}*").

Please note that **AgriSmart AI Coach** is strictly dedicated to **Smart Farming, Agriculture, Crop Care, and Soil Management**.

Please ask a specific question regarding:
- **Crop Planning & Selection** (Paddy, Wheat, Cotton, Chilli, Vegetables)
- **Soil Nutrients & pH Correction** (Nitrogen, NPK, Organic Compost, Lime/Gypsum)
- **Pest & Disease Control** (Organic bio-repellents, IPM, Fungicides)
- **Water & Irrigation Scheduling** (Drip methods, moisture conservation)
- **Weather & Seasonal Farm Protection** (Frost, heatwaves, heavy rain)`;
  }

  // 2. Check for simple greetings
  const isGreeting =
    GREETINGS.includes(q) ||
    GREETINGS.some((g) => q === g || q.startsWith(`${g} `) || q.endsWith(` ${g}`));

  if (isGreeting && !FARMING_KEYWORDS.some((kw) => q.includes(kw))) {
    return `### 👋 Welcome to AgriSmart AI Coach!

I am your dedicated **Smart Farming Assistant**, built exclusively to provide expert agricultural guidance for your farm and crops.

**How can I help you today?**
- 🌾 **Crop Cultivation**: Recommended sowing schedules, varieties, and yield optimization.
- 🌱 **Soil & Fertilizers**: Nitrogen balance, NPK dosage, biofertilizers, and pH adjustment.
- 🐛 **Pest & Disease Diagnostics**: Early symptoms identification and biological/chemical controls.
- 💧 **Smart Irrigation**: Efficient water scheduling and micro-drip techniques.
- 🌦️ **Weather Planning**: Actionable steps to protect crops from heat, frost, or unseasonal rains.

*Feel free to ask any farming question or describe the condition of your crops!*`;
  }

  // 3. Check for off-topic non-farming queries
  const hasOffTopic = OFF_TOPIC_KEYWORDS.some((kw) => q.includes(kw));
  const hasFarmingTerm = FARMING_KEYWORDS.some((kw) => q.includes(kw));

  if (hasOffTopic && !hasFarmingTerm) {
    return `### 🚫 AgriSmart AI Coach — Domain Restriction

I am the **AgriSmart AI Coach**, dedicated **exclusively to Smart Farming, Crop Advisory, Soil Management, and Precision Agriculture**.

I cannot answer questions about general topics, food/recipes, entertainment, or non-agricultural subjects.

---

**Please ask me about your farm and crops, such as:**
- 🌾 **Crops & Cultivation**: *"What are the best companion crops for tomatoes?"*
- 🌱 **Soil Health & Nutrition**: *"How do I increase soil nitrogen naturally?"*
- 🐛 **Pest & Disease Management**: *"How do I control whiteflies and aphids?"*
- 💧 **Irrigation & Water Conservation**: *"When should I irrigate during dry weather?"*
- 🌦️ **Weather & Seasonal Advice**: *"How to safeguard paddy fields against waterlogging?"*`;
  }

  // 4. Detailed Agricultural Handlers
  if (
    q.includes("nitrogen") ||
    q.includes("fertiliz") ||
    q.includes("nutrient") ||
    q.includes("urea") ||
    q.includes("npk")
  ) {
    return `### Soil Nutrient & Nitrogen Management Advisory

To improve soil nitrogen and fertility naturally and effectively:

1. **Organic Amendments**:
   - Apply well-decomposed **Farmyard Manure (FYM)** or **Vermicompost** at 4–5 tonnes per acre before sowing.
   - Plant green manure legumes (e.g., *Dhaincha* / Sesbania or Sunnhemp) and incorporate them into the soil 45 days after sowing.

2. **Biofertilizers**:
   - Treat seeds with *Rhizobium* (for legumes/pulses) or *Azotobacter* / *Azospirillum* (for cereals like wheat and paddy).

3. **Split Fertilizer Application**:
   - Rather than applying synthetic nitrogen all at once, apply in 3 splits (basal, tillering/vegetative, and panicle initiation) to reduce leaching and volatilization.
   - Use **Neem-coated Urea** to ensure slow-release absorption.

4. **Soil Testing**:
   - Conduct a comprehensive soil health test before large-scale fertilizer application to avoid nutrient imbalances.`;
  }

  if (
    q.includes("tomato") ||
    q.includes("vegetable") ||
    q.includes("fruit") ||
    q.includes("summer")
  ) {
    return `### Summer Vegetable & Tomato Protection Advisory

Key guidelines for high-yield summer vegetable cultivation and tomato care:

1. **Common Pests & Early Defense**:
   - **Whiteflies & Aphids**: Transmit leaf curl virus. Install yellow sticky traps (10/acre) and spray **Neem oil (10,000 ppm at 3ml/L)** preventatively.
   - **Fruit Borer (*Helicoverpa*)**: Set up pheromone traps and spray *Bacillus thuringiensis* (Bt) or Spinosad during egg-hatch stages.

2. **Heat & Blossom End Rot Management**:
   - Ensure consistent moisture levels; erratic watering prevents calcium absorption, leading to bottom-rot in tomatoes.
   - Apply light foliar calcium nitrate spray (0.5%) during fruit setting.
   - Use 30–50% shade nets or straw mulching during extreme peak daytime heat.

3. **Pruning & Staking**:
   - Stake indeterminate tomato plants to improve air circulation, prevent soil-borne fungi, and simplify harvesting.`;
  }

  if (
    q.includes("crop") ||
    q.includes("season") ||
    q.includes("plant") ||
    q.includes("sow") ||
    q.includes("wheat") ||
    q.includes("paddy") ||
    q.includes("rice")
  ) {
    return `### Seasonal Crop Planning Advisory

Key recommendations for seasonal crop selection and field establishment:

1. **Rabi (Winter Season - Oct to Mar)**:
   - **Wheat**: Best sown in mid-November. Ensure crown root initiation (CRI) irrigation at 21 days.
   - **Mustard / Chickpea**: Low water requirements; highly suitable for loam to sandy loam soils.

2. **Kharif (Monsoon Season - Jun to Oct)**:
   - **Paddy / Rice**: Requires clayey water-retentive soils and 1100–1400 mm moisture.
   - **Cotton / Maize**: Requires deep, well-drained loamy or black cotton soils.

3. **Zaid (Summer Season - Mar to Jun)**:
   - **Vegetables & Melons**: Cucumber, watermelon, bitter gourd, and okra thrive with drip irrigation.

*Tip: Always practice crop rotation (e.g., cereal followed by a legume) to break pest cycles and replenish nitrogen.*`;
  }

  if (
    q.includes("pest") ||
    q.includes("insect") ||
    q.includes("disease") ||
    q.includes("blight") ||
    q.includes("fungus") ||
    q.includes("spray")
  ) {
    return `### Integrated Pest & Disease Management (IPM)

Recommended actionable steps for pest and disease suppression:

1. **Cultural & Physical Controls**:
   - Install **yellow and blue sticky traps** (10–12 per acre) to monitor aphids, whiteflies, and thrips.
   - Set up **pheromone traps** (4–5 per acre) for early detection of bollworms and fruit borers.

2. **Biological Sprays**:
   - Spray **Neem oil (Azadirachtin 10,000 ppm)** at 2–3 ml/litre of water as a preventative repellent.
   - Use *Trichoderma viride* or *Pseudomonas fluorescens* for seed and soil treatment against root rot and wilt.

3. **Spray Guidelines**:
   - Spray during calm morning (6:00 AM – 9:30 AM) or late afternoon hours to prevent foliar evaporation and drift.
   - Avoid spraying during active flowering if pollinators (bees) are present.`;
  }

  if (
    q.includes("ph") ||
    q.includes("acid") ||
    q.includes("alkali") ||
    q.includes("salin") ||
    q.includes("lime") ||
    q.includes("gypsum")
  ) {
    return `### Soil pH & Salinity Correction Advisory

Maintaining optimal soil pH (6.2–7.2) is critical for maximum nutrient bioavailability:

1. **Acidic Soils (pH < 6.0)**:
   - Apply agricultural **lime (Calcium carbonate)** or **Dolomite lime** (if magnesium is also deficient) at 1–2 tonnes/acre, mixed 4–6 weeks before sowing.
   - Boost organic matter through compost to buffer future acidity.

2. **Alkaline / Sodic Soils (pH > 8.0)**:
   - Incorporate **Agricultural Gypsum (Calcium Sulfate)** followed by thorough field leaching to flush excess sodium.
   - Use sulfur-based fertilizers (e.g., Ammonium Sulfate, Single Super Phosphate).

3. **Salinity Management**:
   - Install adequate drainage channels to prevent shallow water table rise.
   - Grow salt-tolerant cover crops like *Dhaincha* (Sesbania) or Barley during fallow periods.`;
  }

  if (
    q.includes("weed") ||
    q.includes("herbicide") ||
    q.includes("intercultur") ||
    q.includes("grass")
  ) {
    return `### Integrated Weed Management Advisory

Effective weed management strategy balancing mechanical, cultural, and chemical controls:

1. **Preventative & Cultural Practices**:
   - Ensure clean seed beds through pre-sowing stale seedbed techniques.
   - Maintain optimal crop density to shade out germinating weed seeds.
   - Use organic straw mulching (3–4 inches) or UV-stabilized plastic mulch in high-value row crops.

2. **Mechanical & Manual Control**:
   - Perform wheel-hoeing or power weeder operation at 15–20 days and 35–40 days after sowing before weeds establish deep root systems.

3. **Herbicide Guidelines**:
   - **Pre-emergence**: Apply within 48 hours of sowing with adequate soil moisture (e.g., Pendimethalin).
   - **Post-emergence**: Spray during early weed growth (2–3 leaf stage); use flood-jet nozzles to minimize crop drift.`;
  }

  if (
    q.includes("weather") ||
    q.includes("rain") ||
    q.includes("frost") ||
    q.includes("heat") ||
    q.includes("storm") ||
    q.includes("flood")
  ) {
    return `### Weather Resilient Crop Advisory

Agro-meteorological protection measures for fluctuating weather conditions:

1. **Heavy Rain / Waterlogging Warning**:
   - Clear field drainage channels immediately; excess standing water over 24–48 hours induces root hypoxia and fungal wilts.
   - Apply a foliar potassium and fungicide spray once water recedes to boost recovery.

2. **Frost & Extreme Cold Protection**:
   - Provide light evening irrigation; moist soil retains heat better than dry soil.
   - Create smoke smoldering rings around windward boundaries during freezing nights.

3. **Heatwave & Drought Conditions**:
   - Operate drip systems during early morning or nighttime hours.
   - Spray 1% potassium chloride (KCl) or anti-transpirant sprays to reduce canopy moisture loss.`;
  }

  if (
    q.includes("cotton") ||
    q.includes("sugarcane") ||
    q.includes("corn") ||
    q.includes("maize") ||
    q.includes("banana") ||
    q.includes("chilli") ||
    q.includes("chili") ||
    q.includes("onion")
  ) {
    return `### Specialized Cash & Horticultural Crop Advisory

Key growth recommendations for your target crop:

1. **Cotton**:
   - Monitor for sucking pests (Jassids, Thrips, Whitefly) during the first 60 days.
   - Nip terminal shoots at 80–90 days to stimulate sympodial (fruiting) branch expansion.

2. **Chilli & Onion**:
   - For Chilli: Prevent Anthracnose fruit rot and Thrips leaf curl with early bio-repellents and Copper Oxychloride (2.5g/L).
   - For Onion: Provide sulfur (20–25 kg/acre) to enhance pungency, bulb firmness, and storage shelf-life.

3. **Maize & Corn**:
   - Monitor closely for Fall Armyworm (*Spodoptera frugiperda*); apply neem cake or *Bacillus thuringiensis* into whorls if young larvae appear.`;
  }

  if (
    q.includes("organic") ||
    q.includes("bio") ||
    q.includes("compost") ||
    q.includes("natural") ||
    q.includes("pesticide free")
  ) {
    return `### Sustainable & Organic Farming Advisory

Core principles for regenerative and organic agricultural systems:

1. **Liquid Bio-Formulations**:
   - **Jeevamrutha / Panchagavya**: Apply with irrigation water at 200 litres/acre twice a month to stimulate beneficial soil microbes.
   - **Agniastra / Dashaparni Kashayam**: Highly effective herbal sprays for broad-spectrum insect repellency.

2. **Composting & Carbon Sequestration**:
   - Layer dry carbon materials (straw, stalks) with nitrogen-rich greens (cow dung, green leaves) at a 30:1 C:N ratio.
   - Maintain 50% moisture and turn compost every 15 days for rapid aerobic decomposition.

3. **Biological Disease Antagonists**:
   - Enrich Farmyard Manure with *Trichoderma harzianum* (1 kg per 100 kg manure) 10 days before field application to eliminate soil pathogens.`;
  }

  if (q.includes("water") || q.includes("irrigat") || q.includes("dry") || q.includes("drought")) {
    return `### Irrigation & Water Conservation Advisory

Water management guidelines for optimal crop growth:

1. **Critical Moisture Stages**:
   - Prioritize irrigation during flowering, grain filling, and fruit set to prevent significant yield loss.
2. **Drip & Micro-Irrigation**:
   - Drip irrigation can reduce water usage by 40–60% while increasing fertilizer efficiency through fertigation.
3. **Mulching**:
   - Apply 3–4 inches of organic straw or plastic mulch to conserve root-zone soil moisture and suppress weed competition.`;
  }

  // 5. If it contains general agricultural words, provide general farm guidance
  if (hasFarmingTerm) {
    return `### AgriSmart Crop & Farm Guidance

Here are practical agricultural principles for your farm:

- **Soil Health**: Maintain organic carbon by incorporating crop residues and adding compost.
- **Water Management**: Monitor weather forecasts to schedule irrigation efficiently and prevent waterlogging.
- **Pest Surveillance**: Inspect fields weekly for early symptoms of leaf spots, rusts, and sucking pests.
- **Input Optimization**: Balance chemical fertilizers with bio-fertilizers and micronutrients (Zinc, Boron, Sulfur).

*Please specify your crop type, soil condition, or region for tailored recommendations!*`;
  }

  // 6. Unrecognized or non-farming query fallback
  return `### 🌾 AgriSmart AI Coach Notice

I am specialized strictly in **Smart Farming, Crop Management, Soil Health, and Precision Agriculture**.

I couldn't identify a farming-related topic in your question. Please ask about:
- Crop health, sowing schedules, or disease symptoms
- Soil test interpretation, fertilizers, or pH correction
- Pest control, organic formulations, or irrigation methods`;
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

        // Try Gemini SDK if apiKey is available
        if (apiKey) {
          try {
            const ai = new GoogleGenAI({ apiKey });
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
                systemInstruction: SYSTEM_PROMPT,
              },
            });

            if (response.text) {
              return createTextStreamResponse(response.text);
            }
          } catch {
            // Silently fall back to expert agricultural advisory
          }
        }

        // Return expert agronomy guidance
        const fallbackText = generateLocalAgronomyAdvice(queryText);
        return createTextStreamResponse(fallbackText);
      },
    },
  },
});

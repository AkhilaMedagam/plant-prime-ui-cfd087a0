export interface RAGChunk {
  chunk_id: string;
  title: string;
  topic: string;
  content: string;
  keywords: string[];
}

export const AGRISMART_RAG_KNOWLEDGE_BASE: RAGChunk[] = [
  {
    chunk_id: "chunk_01",
    title: "AgriSmart Platform Overview & Mission",
    topic: "AgriSmart Overview",
    content:
      "AgriSmart is an AI-powered smart agriculture platform designed to help farmers, agronomists, and growers make timely, data-driven decisions. The platform supports farmers across multiple agricultural pillars, including crop selection and management, soil health enhancement, weather-based planning, integrated pest and disease surveillance, water and irrigation efficiency, and agricultural input optimization. AgriSmart operates on the philosophy of sustainable farming: maximizing crop yield and farm profitability while preserving soil biology and natural resources. Digital guidance from AgriSmart serves as a decision-support tool to be used alongside field inspections and local agricultural extension advice.",
    keywords: [
      "AgriSmart",
      "smart farming",
      "precision agriculture",
      "digital agriculture",
      "farm advisory",
      "crop planning",
      "sustainable farming",
      "decision support",
      "overview",
    ],
  },
  {
    chunk_id: "chunk_02",
    title: "Fundamental Principles of Crop & Farm Guidance",
    topic: "Crop and Farm Guidance",
    content:
      "Successful crop production requires matching crop varieties with regional climate, season, and soil characteristics. Key principles include: (1) Selecting high-quality, certified seeds suited to the local agro-climatic zone; (2) Timely sowing according to regional weather windows; (3) Managing nutrient and water inputs progressively across growth stages (germination, vegetative, flowering, grain/fruit filling, and maturity); and (4) Regular field scouting to detect nutrient deficiencies, weed competition, and pest pressure early. Because agricultural recommendations vary by crop duration, variety, soil fertility status, and local weather conditions, farming practices must be customized rather than treated as one-size-fits-all.",
    keywords: [
      "crop guidance",
      "farming principles",
      "certified seeds",
      "sowing window",
      "crop growth stages",
      "vegetative phase",
      "flowering stage",
      "grain filling",
      "crop scouting",
      "field management",
    ],
  },
  {
    chunk_id: "chunk_03",
    title: "Soil Health & Biological Fertility",
    topic: "Soil Health",
    content:
      "Healthy soil is a living biological ecosystem containing minerals, organic matter, water, air, and billions of beneficial microorganisms (bacteria, fungi, actinomycetes, earthworms). Key indicators of healthy soil include good crumb structure (aggregation), high water-holding capacity, good internal drainage, neutral to slightly acidic/alkaline pH (6.0 to 7.5), and active microbial biomass. Soil health directly determines how effectively plants can absorb water and nutrients. Degraded soils with low biological activity show poor root penetration, nutrient lock-up, surface crusting, and rapid moisture loss. Improving soil health requires regular organic matter additions, balanced fertilization, reduced soil compaction, and crop diversification.",
    keywords: [
      "soil health",
      "soil fertility",
      "soil biology",
      "soil structure",
      "soil aggregation",
      "water retention",
      "microorganisms",
      "earthworms",
      "microbial biomass",
      "soil degradation",
    ],
  },
  {
    chunk_id: "chunk_04",
    title: "Soil Testing Methodology & Nutrient Diagnosis",
    topic: "Soil Testing",
    content:
      "Soil testing is the scientific laboratory analysis of representative field soil samples to determine chemical and physical properties. A standard soil test analyzes pH, electrical conductivity (EC / salinity), organic carbon percentage, available primary macronutrients (Nitrogen, Phosphorus, Potassium), secondary nutrients (Sulfur, Calcium, Magnesium), and essential micronutrients (Zinc, Iron, Manganese, Copper, Boron). Soil testing should be conducted every 2 to 3 years, preferably during fallow periods before seasonal sowing and before applying new fertilizers. Soil test results form the baseline for soil-test-based fertilizer recommendations, preventing both under-fertilization (yield loss) and over-fertilization (input waste, soil degradation, and water contamination).",
    keywords: [
      "soil testing",
      "soil test card",
      "soil sampling",
      "soil analysis",
      "nutrient status",
      "soil fertility test",
      "macronutrients",
      "micronutrients",
      "NPK testing",
      "soil testing frequency",
    ],
  },
  {
    chunk_id: "chunk_05",
    title: "Soil Organic Matter & Soil Organic Carbon (SOC)",
    topic: "Soil Organic Matter",
    content:
      "Soil organic matter (SOM) is composed of decaying plant residues, decomposed animal manures, and living soil organisms. Soil Organic Carbon (SOC) represents the carbon component of this matter and serves as the primary metric of soil fertility. Maintaining target SOC levels (ideally above 0.75% to 1.0% in tropical and subtropical soils) enhances the soil's Cation Exchange Capacity (CEC), allowing it to retain and deliver fertilizer nutrients to roots. Increasing organic matter significantly improves soil water retention (a 1% increase in SOC can hold tens of thousands of liters of additional water per hectare), buffers soil against sudden pH shifts, and prevents surface soil erosion.",
    keywords: [
      "soil organic matter",
      "SOM",
      "soil organic carbon",
      "SOC",
      "soil carbon",
      "cation exchange capacity",
      "CEC",
      "moisture retention",
      "humus",
      "soil fertility enhancement",
    ],
  },
  {
    chunk_id: "chunk_06",
    title: "Compost & Farmyard Manure (FYM) Application",
    topic: "Compost and Farmyard Manure",
    content:
      "Farmyard manure (FYM) and compost are organic soil amendments prepared by decomposing livestock dung, urine, crop refuse, and vegetable waste. Well-rotted FYM and vermicompost provide a steady, slow release of macronutrients and trace minerals while feeding beneficial earthworms and microbes. Application guidelines include: (1) Apply 4 to 5 tonnes of well-decomposed FYM or 1.5 to 2 tonnes of vermicompost per acre before final plowing; (2) Incorporate manure evenly into the top 10 to 15 cm of soil 2 to 4 weeks before sowing; and (3) Avoid using fresh, unfermented manure, which can generate root-damaging heat, introduce viable weed seeds, and harbor harmful pathogens.",
    keywords: [
      "farmyard manure",
      "FYM",
      "compost",
      "vermicompost",
      "organic manure",
      "soil amendment",
      "organic matter application",
      "decomposition",
      "soil conditioning",
      "organic nutrients",
    ],
  },
  {
    chunk_id: "chunk_07",
    title: "Crop Residue Management & Zero Burning",
    topic: "Crop Residue Management",
    content:
      "Crop residue management involves recycling stubble, stalks, and straw left in the field after harvest instead of burning them. Burning crop residues destroys valuable topsoil organic carbon, kills beneficial soil microbes, depletes Nitrogen and Sulfur, and causes severe air pollution. Recommended practices include: (1) Mulching residues on the soil surface to reduce evaporation, cool the root zone, and suppress weeds; (2) Shredding and incorporating residues into the soil using rotary tillers or disc harrows; and (3) Utilizing direct-seeding machinery (such as Happy Seeders, Super Seeders, or Zero-Till drills) to sow seeds directly through stubble, conserving soil moisture and fuel.",
    keywords: [
      "crop residue",
      "stubble management",
      "residue burning",
      "straw incorporation",
      "surface mulching",
      "zero tillage",
      "Happy Seeder",
      "in-situ decomposition",
      "soil moisture conservation",
    ],
  },
  {
    chunk_id: "chunk_08",
    title: "Green Manure & Cover Cropping Systems",
    topic: "Green Manure and Cover Crops",
    content:
      "Green manuring is the practice of growing fast-growing, nitrogen-fixing leguminous crops specifically to incorporate them into the soil while they are still green and succulent. Common green manure crops include Dhaincha (Sesbania aculeata), Sunnhemp (Crotalaria juncea), and Cowpea. These crops are sown before the main crop and incorporated into the soil at the 45-to-50-day stage (early flowering) using a disc plow. Green manuring adds 15 to 25 tonnes of green biomass per hectare, fixes 40 to 80 kg of atmospheric nitrogen naturally, improves soil aeration, and softens heavy or compacted soils. Non-leguminous cover crops can also be grown to protect bare soil from monsoon erosion and nutrient runoff.",
    keywords: [
      "green manure",
      "cover crops",
      "Dhaincha",
      "Sesbania",
      "Sunnhemp",
      "Crotalaria",
      "biological nitrogen fixation",
      "green biomass",
      "soil aeration",
      "erosion control",
    ],
  },
  {
    chunk_id: "chunk_09",
    title: "Crop Rotation Principles & Rotational Benefits",
    topic: "Crop Rotation",
    content:
      "Crop rotation is the systematic practice of planting different crop families sequentially in the same field over successive seasons. Continuous monoculture (growing the exact same crop season after season) depletes specific nutrient layers, encourages persistent soil-borne diseases, and causes pest build-up. Effective rotation strategies include: (1) Alternating deep-rooted crops (cotton, pigeonpea) with shallow-rooted crops (cereals, leafy vegetables); (2) Alternating heavy nutrient feeders (maize, sugarcane, rice) with nitrogen-fixing legumes (chickpea, mung bean, groundnut); and (3) Rotating between different botanical families (e.g., rotating solanaceous crops like tomato or chilli with grasses or legumes) to interrupt pathogen and nematode life cycles.",
    keywords: [
      "crop rotation",
      "sequential cropping",
      "monoculture",
      "soil-borne diseases",
      "nematode control",
      "legume rotation",
      "nutrient depletion",
      "diversification",
      "cropping patterns",
    ],
  },
  {
    chunk_id: "chunk_10",
    title: "Soil Compaction, Hardpans & Responsible Tillage",
    topic: "Soil Compaction and Tillage",
    content:
      "Soil compaction occurs when heavy farm machinery, continuous shallow plowing at the same depth, or excessive traffic presses soil particles tightly together, destroying pore space. This forms an impermeable hardpan beneath the plow layer (subsoil compaction), restricting downward root growth, reducing water infiltration, and causing surface waterlogging. Management practices include: (1) Avoiding tilling or driving machinery over wet soil; (2) Using a chisel plow or subsoiler every 3 to 4 years to break subsurface hardpans; (3) Practicing reduced or zero tillage (conservation tillage) to preserve soil structure and earthworm channels; and (4) Growing deep-rooted taproot crops (like radish, mustard, or pigeonpea) to biologically aerate dense soil layers.",
    keywords: [
      "soil compaction",
      "hardpan",
      "subsoiling",
      "chisel plow",
      "zero tillage",
      "conservation tillage",
      "soil pore space",
      "water infiltration",
      "root restriction",
      "soil aeration",
    ],
  },
  {
    chunk_id: "chunk_11",
    title: "Soil pH Balance, Acidity, Alkalinity & Reclamation",
    topic: "Soil pH Management",
    content:
      "Soil pH measures soil acidity or alkalinity on a scale of 0 to 14, with 6.2 to 7.2 being the optimal range for most agricultural crops. In acidic soils (pH < 6.0), nutrients like Phosphorus, Calcium, and Magnesium become locked up, while Aluminum and Manganese can reach toxic levels; acidic soils are reclaimed by applying agricultural lime (calcium carbonate) or dolomite based on laboratory buffer pH tests. In alkaline/sodic soils (pH > 8.0), micronutrients like Iron, Zinc, and Manganese become unavailable, and high sodium causes soil dispersion; sodic soils are reclaimed by applying agricultural gypsum (calcium sulfate) followed by fresh water flushing. Soil amendments must always be calculated from accredited soil test reports.",
    keywords: [
      "soil pH",
      "soil acidity",
      "soil alkalinity",
      "alkaline soil",
      "sodic soil",
      "liming",
      "agricultural lime",
      "agricultural gypsum",
      "nutrient lock-up",
      "soil reclamation",
    ],
  },
  {
    chunk_id: "chunk_12",
    title: "Water Conservation, Irrigation Scheduling & Drip Systems",
    topic: "Water and Irrigation Management",
    content:
      "Efficient water management prevents both crop water stress and waterlogging while conserving agricultural groundwater. Critical irrigation concepts include: (1) Prioritizing water application during critical growth stages (such as crown root initiation in wheat, tillering/panicle initiation in rice, and flowering/pod-setting in legumes); (2) Transitioning from flood/basin irrigation to micro-irrigation systems (drip and sprinkler), which deliver water directly to the active root zone, saving 40% to 60% water and enabling fertigation; and (3) Scheduling irrigation based on soil moisture monitoring (feeling soil texture at root depth or using tensiometers) and upcoming weather forecasts to avoid irrigating right before rain. Over-irrigation causes root suffocation, fungal root rot, and nutrient leaching.",
    keywords: [
      "water management",
      "irrigation scheduling",
      "drip irrigation",
      "micro-irrigation",
      "sprinkler",
      "critical growth stages",
      "water conservation",
      "fertigation",
      "moisture stress",
      "over-irrigation",
    ],
  },
  {
    chunk_id: "chunk_13",
    title: "Field Pest Surveillance & Integrated Pest Management (IPM)",
    topic: "Pest Surveillance",
    content:
      "Pest surveillance is the routine, systematic inspection of farm fields to detect insect pests before they cause economic damage. Farmers should walk fields twice weekly in a zig-zag or 'W' pattern, checking leaves (top and underside), stems, and flowers on random plants. Integrated Pest Management (IPM) prioritizes eco-friendly controls: (1) Cultural control: Crop rotation, intercropping, and trap crops (e.g., marigold around tomato); (2) Mechanical control: Installing yellow sticky traps for whiteflies/aphids, blue traps for thrips, and pheromone traps for borers; (3) Biological control: Conserving beneficial predators (ladybird beetles, spiders) and using bio-agents (Trichogramma, Beauveria bassiana, Neem oil formulations); and (4) Chemical control: Used only as a targeted last resort when pest density crosses the Economic Threshold Level (ETL).",
    keywords: [
      "pest surveillance",
      "crop scouting",
      "integrated pest management",
      "IPM",
      "economic threshold level",
      "ETL",
      "sticky traps",
      "pheromone traps",
      "biological control",
      "Neem oil",
      "bio-pesticides",
    ],
  },
  {
    chunk_id: "chunk_14",
    title: "Crop Disease Diagnostics & Prevention Strategies",
    topic: "Crop Disease Awareness",
    content:
      "Crop diseases are caused by fungal, bacterial, viral, or phytoplasma pathogens. Common symptoms include: (1) Leaf spots with concentric rings or halos (fungal leaf blights); (2) Water-soaked, angular lesions (bacterial spots); (3) Mosaic patterns, yellow vein netting, or upward/downward leaf curling (viral diseases, often transmitted by whiteflies or thrips); (4) Midday wilting with brown vascular discoloration inside stems (Fusarium fungal wilt); and (5) White powdery coatings on leaf surfaces (Powdery Mildew). Preventive management includes using certified disease-free seed, practicing seed treatment with bio-fungicides (like Trichoderma viride), ensuring wide crop spacing for canopy aeration, avoiding overhead irrigation on blight-prone crops, and immediately removing and destroying infected plants. Symptom-based visual diagnosis is indicative and should be verified with local plant pathologists.",
    keywords: [
      "crop diseases",
      "plant pathology",
      "leaf spots",
      "fungal blight",
      "bacterial wilt",
      "viral mosaic",
      "leaf curl",
      "powdery mildew",
      "Trichoderma",
      "seed treatment",
      "disease prevention",
    ],
  },
  {
    chunk_id: "chunk_15",
    title: "Agricultural Input Optimization & 4R Nutrient Stewardship",
    topic: "Agricultural Input Optimization",
    content:
      "Optimizing agricultural inputs (fertilizers, manures, seeds, and water) ensures maximum return on investment while safeguarding farm ecology. The universally accepted framework is 4R Nutrient Stewardship: (1) Right Source: Matching fertilizer type to crop need and soil test results (e.g., using sulfate forms in sulfur-deficient soils); (2) Right Rate: Applying only the amount needed by the crop, crediting nutrients from manure and legumes; (3) Right Time: Splitting nitrogen and potassium applications into 2 to 4 top-dressings matching peak crop uptake rather than dumping 100% basal; and (4) Right Place: Placing fertilizer in the moist root zone rather than broadcasting on dry surfaces or floodwaters where nutrients volatilize or leach. Combining synthetic fertilizers with bio-fertilizers (Azotobacter, Rhizobium, PSB) increases nutrient use efficiency.",
    keywords: [
      "input optimization",
      "4R nutrient stewardship",
      "split application",
      "fertilizer efficiency",
      "bio-fertilizers",
      "Rhizobium",
      "PSB",
      "nutrient balance",
      "basal application",
      "top-dressing",
    ],
  },
  {
    chunk_id: "chunk_16",
    title: "Weather-Based Farming Decisions & Climate Adaptation",
    topic: "Weather-Based Farming Decisions",
    content:
      "Weather conditions (temperature, precipitation, relative humidity, wind speed, cloud cover) dictate daily farm operations. Farmers should align activities with localized 3-to-7-day agromet forecasts: (1) Sowing & Planting: Schedule when soil temperature and moisture are optimal, avoiding sowing before expected torrential downpours; (2) Spraying Operations: Spray bio-pesticides or foliar nutrients during calm winds (<10 km/h) and moderate temperatures (<30°C) when rain is not forecast for 4 to 6 hours; (3) Fertilizer Application: Top-dress before gentle rain or scheduled irrigation, never before heavy storm warnings; and (4) Frost & Extreme Heat Protection: Apply light evening irrigation before anticipated frost nights to radiate heat, and maintain organic mulch to buffer root temperature during heatwaves. Real-time weather data must come from certified meteorological services.",
    keywords: [
      "weather-based farming",
      "agromet forecast",
      "spray timing",
      "frost protection",
      "heatwave management",
      "rainfall planning",
      "weather resilience",
      "wind drift",
      "climate smart agriculture",
    ],
  },
  {
    chunk_id: "chunk_17",
    title: "Visual Field Observations of Soil Health",
    topic: "Field Soil Health Observation",
    content:
      "Farmers can evaluate soil physical and biological condition through direct on-field visual and tactile observations: (1) Earthworm Population: Count earthworms and channels in a 20 cm cube of topsoil (active presence indicates healthy biological life); (2) Soil Structure & Aggregation: Healthy soil crumbles into porous, rounded aggregates resembling cottage cheese rather than hard, blocky clods or loose dust; (3) Water Infiltration: Water should soak into the soil within minutes after rain; persistent surface puddling indicates compaction or hardpan formation; (4) Soil Odor: Healthy, biologically active soil smells earthy and fresh (due to geosmin produced by actinomycetes), while foul or sour odors indicate waterlogged anaerobic conditions; and (5) Root Penetration: Plant roots should grow deep and branch outward freely without bending horizontally at shallow depths.",
    keywords: [
      "soil observation",
      "soil health indicators",
      "earthworms",
      "soil smell",
      "geosmin",
      "soil aggregation",
      "crumb structure",
      "root penetration",
      "infiltration test",
      "visual soil assessment",
    ],
  },
  {
    chunk_id: "chunk_18",
    title: "Sustainable Agriculture & Regenerative Farming Practices",
    topic: "Sustainable Agriculture",
    content:
      "Sustainable agriculture balances high crop productivity with ecological stewardship and long-term farm viability. Core practices include: (1) Minimum Soil Disturbance: Reducing unnecessary deep plowing to protect fungal hyphae networks and prevent erosion; (2) Continuous Soil Cover: Keeping soil covered year-round using living crops, cover crops, or organic mulches; (3) Crop Diversification: Integrating multi-cropping, intercropping (e.g., maize with legumes), agroforestry, and multi-year crop rotations; (4) Integrated Nutrient & Pest Management: Replacing high-toxicity chemical dependencies with organic manures, biofertilizers, and biological pest controls; and (5) Accurate Record-Keeping: Documenting input costs, dates of operations, rainfall events, and final harvest yields to track cost of production and farm profitability over time.",
    keywords: [
      "sustainable agriculture",
      "regenerative farming",
      "soil conservation",
      "minimum tillage",
      "continuous soil cover",
      "intercropping",
      "agro-ecology",
      "farm records",
      "ecological stewardship",
    ],
  },
  {
    chunk_id: "chunk_19",
    title: "Personalized Farming Guidance & Context Factors",
    topic: "Personalized Farming Guidance",
    content:
      "Effective agricultural advisory must be customized to specific field parameters. When formulating farming guidance, the following context factors must be evaluated: (1) Crop Name & Variety: Different varieties (short-duration vs. long-duration, hybrid vs. indigenous) have distinct water and fertilizer requirements; (2) Growth Stage: A seedling requires different care than a flowering or fruit-bearing plant; (3) Soil Type & Texture: Sandy soils require frequent light irrigation and split fertilizer dosing, whereas clay soils require drainage management; (4) Geographical Location & Agro-Climatic Zone: Temperature regimes, day lengths, and endemic pest pressures vary across regions; and (5) Current Weather & Season: Recent rainfall or forecasted heatwaves dictate immediate spraying or irrigation timing. Farmers should provide these details when seeking digital advice.",
    keywords: [
      "personalized guidance",
      "context-aware farming",
      "crop variety",
      "growth stage",
      "soil texture",
      "agro-climatic zone",
      "tailored advisory",
      "farming parameters",
      "field history",
    ],
  },
  {
    chunk_id: "chunk_20",
    title: "AgriSmart AI Farming Assistant Operational Standards & Guardrails",
    topic: "AgriSmart AI Farming Assistant",
    content:
      "The AgriSmart AI Farming Assistant (AI Coach) is an interactive advisory tool designed to deliver science-based agronomic guidance grounded in the verified RAG knowledge base. Operational standards include: (1) Grounded Answers: Prioritizing retrieved agricultural chunks to prevent hallucination; (2) Safety Guardrails: Avoiding hazardous or unverified chemical dosage recommendations; (3) Explicit Uncertainty: Acknowledging that visual symptom analysis is consultative and cannot provide a 100% conclusive disease diagnosis; (4) Clarification Seeking: Proactively asking follow-up questions when critical information (such as crop name, growth stage, soil type, or location) is omitted; (5) No Guarantees: Never promising guaranteed crop yields or financial returns, as outcomes depend on uncontrolled weather and field dynamics; and (6) Expert Referral: Encouraging farmers to consult local agricultural university extension officers, Krishi Vigyan Kendras (KVK), or certified agronomists for emergency field inspections and regulated treatments.",
    keywords: [
      "AgriSmart AI Coach",
      "AI farming assistant",
      "RAG guardrails",
      "agricultural safety",
      "uncertainty acknowledgment",
      "expert referral",
      "Krishi Vigyan Kendra",
      "KVK",
      "grounded AI",
    ],
  },
];

const STOP_WORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "did",
  "do",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "itself",
  "just",
  "me",
  "more",
  "most",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "s",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "t",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Searches the RAG knowledge base using hybrid keyword and semantic-concept matching.
 * Returns only the most relevant chunks (1 to 3 max), or an empty array if query is off-topic/generic.
 */
export function retrieveRelevantKnowledgeChunks(
  query: string,
  maxChunks = 3,
): { chunks: RAGChunk[]; queryTerms: string[] } {
  const clean = query.trim().toLowerCase();
  const queryTokens = tokenize(clean);

  if (queryTokens.length === 0) {
    return { chunks: [], queryTerms: [] };
  }

  const scoredChunks = AGRISMART_RAG_KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;
    const chunkTitleLower = chunk.title.toLowerCase();
    const chunkTopicLower = chunk.topic.toLowerCase();
    const chunkContentLower = chunk.content.toLowerCase();
    const chunkKeywordsLower = chunk.keywords.map((k) => k.toLowerCase());

    // Exact phrase match in title or topic
    if (chunkTitleLower.includes(clean) || chunkTopicLower.includes(clean)) {
      score += 35;
    }

    // Direct match against topics or keywords
    chunkKeywordsLower.forEach((kw) => {
      if (clean.includes(kw) || kw.includes(clean)) {
        score += 25;
      }
    });

    // Token overlap scoring
    queryTokens.forEach((token) => {
      if (chunkTitleLower.includes(token)) score += 12;
      if (chunkTopicLower.includes(token)) score += 10;
      if (chunkKeywordsLower.some((k) => k.includes(token))) score += 8;
      if (chunkContentLower.includes(token)) score += 2;
    });

    return { chunk, score };
  });

  // Sort by highest score
  scoredChunks.sort((a, b) => b.score - a.score);

  // Minimum relevance threshold to avoid returning irrelevant chunks for non-farming or unrelated questions
  const MIN_SCORE_THRESHOLD = 14;

  const relevant = scoredChunks
    .filter((item) => item.score >= MIN_SCORE_THRESHOLD)
    .slice(0, maxChunks)
    .map((item) => item.chunk);

  return { chunks: relevant, queryTerms: queryTokens };
}

export interface RAGAnswerResult {
  answer: string;
  chunks: RAGChunk[];
  isGrounded: boolean;
}

/**
 * Core AgriSmart RAG answering function.
 * Flow: User Question -> Semantic Retrieval -> Retrieve Top Chunks -> Grounded Answer Synthesis
 */
export function queryAgriSmartRAG(question: string): RAGAnswerResult {
  const clean = question.trim();
  if (!clean) {
    return {
      answer: "Please ask a specific agriculture or farming question.",
      chunks: [],
      isGrounded: false,
    };
  }

  const { chunks } = retrieveRelevantKnowledgeChunks(clean, 3);

  // If no relevant chunks matched the query
  if (chunks.length === 0) {
    return {
      answer:
        "The requested information is not available in the current AgriSmart knowledge base. Please ask a question related to crop management, soil fertility, pH correction, irrigation scheduling, pest surveillance, green manuring, or weather-based farm planning.",
      chunks: [],
      isGrounded: false,
    };
  }

  const q = clean.toLowerCase();

  // Grounded answer synthesis based on retrieved chunks
  if (
    q.includes("soil") &&
    (q.includes("improv") ||
      q.includes("health") ||
      q.includes("organic") ||
      q.includes("fertilit") ||
      q.includes("carbon"))
  ) {
    return {
      answer: `**Improving Soil Health & Fertility** (Based on AgriSmart Knowledge Base):

1. **Boost Soil Organic Carbon (SOC)**: Apply 4–5 tonnes of well-decomposed Farmyard Manure (FYM) or 1.5–2 tonnes of vermicompost per acre. Retain and mulch crop residues instead of burning.
2. **Green Manuring**: Grow leguminous green manure crops like *Dhaincha* (*Sesbania*) or Sunnhemp and incorporate at 45–50 days to fix 40–80 kg of atmospheric nitrogen/ha.
3. **Crop Rotation**: Rotate heavy nutrient feeders (maize, rice, sugarcane) with deep-rooted nitrogen-fixing pulses (chickpea, mung bean) to restore soil vitality.
4. **Alleviate Compaction**: Conduct soil testing every 2–3 years and use chisel plowing every 3–4 years to break subsurface hardpans.`,
      chunks,
      isGrounded: true,
    };
  }

  if (q.includes("rotat")) {
    return {
      answer: `**Crop Rotation Guidelines & Benefits**:

1. **Nutrient Balance**: Alternating heavy feeders with nitrogen-fixing legumes naturally restores nitrogen and balances nutrient absorption across varying root depths.
2. **Disrupt Pests & Pathogens**: Continuous monoculture builds up specialized pests and soil-borne pathogens. Rotating botanical families (e.g., solanaceous crops like tomatoes followed by pulses or cereals) interrupts pest life cycles.
3. **Soil Structure**: Combining shallow-rooted crops with deep taproot crops improves soil aeration and prevents compaction.`,
      chunks,
      isGrounded: true,
    };
  }

  if (
    q.includes("pest") ||
    q.includes("insect") ||
    q.includes("scout") ||
    q.includes("surveill") ||
    q.includes("ipm")
  ) {
    return {
      answer: `**Field Pest Surveillance & Integrated Pest Management (IPM)**:

1. **Routine Surveillance**: Walk fields twice weekly in a 'W' or zig-zag pattern, inspecting leaves (top and underside), stems, and flowers.
2. **Physical & Sticky Traps**: Deploy yellow sticky traps for whiteflies/aphids, blue traps for thrips, and pheromone traps (4–5/acre) for borers.
3. **Biological Repellents**: Spray Neem oil (Azadirachtin 10,000 ppm at 2–3 ml/L) or apply bio-agents (*Trichogramma*, *Beauveria bassiana*).
4. **Targeted Chemical Control**: Use chemical pesticides strictly as a last resort only when pest counts exceed the Economic Threshold Level (ETL).`,
      chunks,
      isGrounded: true,
    };
  }

  if (
    q.includes("disease") ||
    q.includes("fung") ||
    q.includes("blight") ||
    q.includes("wilt") ||
    q.includes("spot") ||
    q.includes("mildew")
  ) {
    return {
      answer: `**Crop Disease Diagnostics & Preventive Management**:

1. **Symptom Recognition**:
   - *Fungal Leaf Blight*: Concentric target-like rings with yellow halos.
   - *Bacterial Lesions*: Angular, water-soaked spots on foliage.
   - *Viral Infections*: Yellow vein clearing, mosaic patterns, or leaf curling (transmitted by whiteflies/thrips).
   - *Vascular Wilt*: Midday wilting with internal brown vascular discoloration inside stems.
2. **Prevention & Hygiene**: Treat certified seeds with *Trichoderma viride* or *Pseudomonas fluorescens*. Ensure wide spacing for canopy ventilation and avoid overhead sprinkler watering on blight-prone foliage.
3. **Expert Verification**: Visual diagnostics are indicative; always consult local agricultural extension officers or plant pathology labs for emergency outbreaks.`,
      chunks,
      isGrounded: true,
    };
  }

  if (q.includes("water") || q.includes("irrigat") || q.includes("drip") || q.includes("drought")) {
    return {
      answer: `**Water Conservation & Irrigation Scheduling**:

1. **Critical Growth Stages**: Prioritize irrigation during moisture-sensitive phases (e.g., crown root initiation in wheat, tillering in rice, and flowering/pod-set in vegetables).
2. **Micro-Irrigation (Drip Systems)**: Deliver water directly to the crop root zone to conserve 40% to 60% water while enabling precision fertigation.
3. **Weather Alignment & Mulching**: Check 3–7 day rain forecasts to prevent over-irrigation. Apply 3–4 inches of organic straw or plastic mulch to reduce surface evaporation.`,
      chunks,
      isGrounded: true,
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
      answer: `**Soil pH & Salinity Reclamation**:

1. **Optimal Range**: Target a pH of **6.2 to 7.2** for maximum nutrient bioavailability.
2. **Acidic Soils (pH < 6.0)**: Apply agricultural lime (calcium carbonate) or dolomite based on laboratory buffer pH tests 4–6 weeks before sowing to unlock phosphorus.
3. **Alkaline/Sodic Soils (pH > 8.0)**: Apply agricultural gypsum (calcium sulfate) followed by fresh water leaching to displace excess sodium and restore soil structure.`,
      chunks,
      isGrounded: true,
    };
  }

  if (
    q.includes("fertiliz") ||
    q.includes("nutrient") ||
    q.includes("4r") ||
    q.includes("urea") ||
    q.includes("npk") ||
    q.includes("input")
  ) {
    return {
      answer: `**Agricultural Input Optimization (4R Nutrient Stewardship)**:

1. **Right Source**: Match fertilizer type to crop demands and soil test card data (e.g., apply sulfur in sulfur-deficient soils).
2. **Right Rate**: Calculate exact crop nutrient requirements and deduct nutrient contributions from FYM, compost, and previous legume crops.
3. **Right Time**: Split nitrogen and potassium applications into 2 to 4 top-dressings aligned with vegetative and flowering surges to avoid leaching.
4. **Right Place**: Place fertilizers into the moist root zone rather than broadcasting on dry or waterlogged surfaces. Combine with bio-fertilizers (*Azotobacter*, *Rhizobium*, *PSB*).`,
      chunks,
      isGrounded: true,
    };
  }

  if (
    q.includes("weather") ||
    q.includes("forecast") ||
    q.includes("frost") ||
    q.includes("heat") ||
    q.includes("rain")
  ) {
    return {
      answer: `**Weather-Based Agricultural Decision Support**:

1. **Agromet Forecast Alignment**: Consult 3-to-7-day meteorological forecasts before sowing, spraying, top-dressing, or harvesting.
2. **Spraying Window**: Apply foliar bio-pesticides or nutrients during calm wind conditions (<10 km/h) with no rain forecast for 4–6 hours.
3. **Temperature Extremes**:
   - *Frost*: Provide light evening irrigation before cold nights to release latent heat into the crop canopy.
   - *Heatwaves*: Maintain straw mulching and operate micro-drip systems during cool night or early morning hours.`,
      chunks,
      isGrounded: true,
    };
  }

  // Default synthesis using top retrieved chunk
  const topChunk = chunks[0];
  return {
    answer: `**${topChunk.title}** (${topChunk.topic}):

${topChunk.content}

*Key agricultural recommendation: Align field operations with local soil test results and weather forecasts.*`,
    chunks,
    isGrounded: true,
  };
}

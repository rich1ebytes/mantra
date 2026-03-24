import prisma from "../config/prisma.js";

const SAMPLE_ARTICLES = [
  // ─── INDIA ───
  {
    title: "India Launches Next-Generation Satellite Navigation System",
    summary: "ISRO successfully deploys advanced NavIC satellite to bolster India's indigenous positioning system coverage across the Asia-Pacific region.",
    content: `India's space agency ISRO has achieved another milestone with the successful deployment of its next-generation navigation satellite. The new satellite, part of the NavIC constellation, promises improved accuracy and expanded coverage across the Asia-Pacific region.\n\nThe launch took place from the Satish Dhawan Space Centre in Sriharikota, with the satellite reaching its designated orbit within hours. Officials confirmed that all systems are functioning nominally.\n\nThis advancement positions India among a select group of nations with independent satellite navigation capabilities, reducing dependence on GPS and other foreign systems. The improved accuracy will benefit sectors ranging from agriculture to disaster management.`,
    thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
    originCode: "IN",
    categorySlug: "technology",
    tags: ["isro", "space", "satellite", "navic"],
  },
  {
    title: "Mumbai Metro Line 3 Opens to Public After Years of Construction",
    summary: "The Aqua Line connecting Colaba to SEEPZ begins commercial operations, expected to serve over 1.7 million commuters daily.",
    content: `Mumbai's long-awaited Metro Line 3, also known as the Aqua Line, has finally opened its doors to the public. The underground corridor stretching from Colaba in South Mumbai to SEEPZ in the north is expected to transform the city's transportation landscape.\n\nThe 33.5-kilometer line features 27 stations and passes through some of Mumbai's most congested areas, including key business districts and residential neighborhoods. Officials estimate it will serve over 1.7 million commuters daily once fully operational.\n\nCommuters who used the line on its first day reported smooth operations and praised the modern station design, air-conditioned coaches, and seamless connectivity with existing rail networks.`,
    thumbnail: "https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=800&q=80",
    originCode: "IN",
    categorySlug: "technology",
    tags: ["mumbai", "metro", "infrastructure", "transport"],
  },
  {
    title: "Indian Premier League Announces Expanded 2026 Season Format",
    summary: "The BCCI confirms a new 94-match schedule with the addition of a pre-season tournament and extended playoff rounds.",
    content: `The Board of Control for Cricket in India has unveiled the format for the 2026 IPL season, featuring a significantly expanded schedule. The new format includes a pre-season mini-tournament and an extended playoff structure.\n\nThe changes aim to increase fan engagement while providing more competitive matches. Team owners have largely welcomed the move, citing increased revenue opportunities and greater exposure for emerging talent.\n\nCritics, however, have raised concerns about player fatigue and the already congested international cricket calendar. The BCCI has responded by implementing mandatory rest periods and expanded squad sizes.`,
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    originCode: "IN",
    categorySlug: "sports",
    tags: ["ipl", "cricket", "bcci", "sports"],
  },
  {
    title: "India's Renewable Energy Capacity Crosses 200 GW Milestone",
    summary: "The country reaches a landmark achievement in its clean energy transition, driven by rapid solar and wind installations.",
    content: `India has crossed the 200 GW mark in installed renewable energy capacity, a significant milestone in the nation's ambitious clean energy transition. Solar power accounts for the largest share, followed by wind, biomass, and small hydro projects.\n\nThe achievement comes ahead of schedule, with the government's original target set for 2027. Analysts attribute the acceleration to favorable policy frameworks, declining technology costs, and increased private sector participation.\n\nThe milestone reinforces India's position as one of the world's leading renewable energy markets and brings the country closer to its goal of achieving 500 GW of non-fossil fuel capacity by 2030.`,
    thumbnail: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    originCode: "IN",
    categorySlug: "business",
    tags: ["renewable", "energy", "solar", "climate"],
  },
  {
    title: "Bollywood Blockbuster Breaks Opening Weekend Records",
    summary: "The sci-fi epic becomes the highest-grossing opening weekend in Indian cinema history with over ₹250 crore worldwide.",
    content: `A new Bollywood sci-fi epic has shattered opening weekend records, collecting over ₹250 crore worldwide in its first three days. The film's spectacular visual effects and compelling storyline have drawn audiences in record numbers.\n\nThe film's success represents a growing trend of Indian audiences embracing homegrown sci-fi content, a genre traditionally dominated by Hollywood productions. Industry experts see this as a turning point for Indian cinema's global ambitions.\n\nCritics have praised the film's technical achievements while noting its engaging narrative that balances spectacle with emotional depth. The production reportedly employed cutting-edge visual effects techniques developed by Indian studios.`,
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    originCode: "IN",
    categorySlug: "entertainment",
    tags: ["bollywood", "cinema", "box-office", "sci-fi"],
  },

  // ─── UNITED STATES ───
  {
    title: "Federal Reserve Signals Cautious Approach to Interest Rate Changes",
    summary: "Fed Chair indicates the central bank will take a measured approach, citing mixed economic signals and persistent inflation concerns.",
    content: `The Federal Reserve has signaled a cautious approach to any future interest rate adjustments, with the Fed Chair emphasizing the need for more economic data before making policy changes. The announcement came during a closely watched press conference following the latest Federal Open Market Committee meeting.\n\nMarkets reacted with modest gains as investors interpreted the stance as neither hawkish nor dovish. Bond yields remained relatively stable, suggesting traders had largely priced in the decision.\n\nEconomists noted that the Fed is navigating a complex environment where labor market strength coexists with persistent inflation in certain sectors, particularly housing and services.`,
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    originCode: "US",
    categorySlug: "business",
    tags: ["federal-reserve", "interest-rates", "economy", "inflation"],
  },
  {
    title: "NASA Artemis Program Completes Key Lunar Gateway Module Test",
    summary: "The space agency successfully tests the power and propulsion element of the Lunar Gateway station in preparation for sustained Moon missions.",
    content: `NASA has completed a critical test of the Lunar Gateway's Power and Propulsion Element, bringing the agency one step closer to establishing a permanent human presence around the Moon. The test validated the module's solar electric propulsion system and communication capabilities.\n\nThe Lunar Gateway will serve as a staging point for crewed missions to the lunar surface and eventually as a waypoint for deeper space exploration. International partners including ESA, JAXA, and CSA are contributing modules to the station.\n\nThe successful test clears the way for the module's launch, currently scheduled for later this year aboard a commercial rocket.`,
    thumbnail: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80",
    originCode: "US",
    categorySlug: "science",
    tags: ["nasa", "artemis", "moon", "space"],
  },
  {
    title: "Major Tech Companies Announce Joint AI Safety Research Initiative",
    summary: "Leading technology firms pledge $2 billion toward collaborative research on responsible artificial intelligence development.",
    content: `Several of the world's largest technology companies have announced a joint initiative to fund and conduct AI safety research. The consortium has pledged $2 billion over five years to study and mitigate potential risks associated with advanced artificial intelligence systems.\n\nThe initiative will focus on areas including AI alignment, robustness testing, interpretability research, and the development of standardized safety benchmarks. An independent advisory board of academic researchers and ethicists will oversee the program.\n\nThe announcement comes amid growing public and regulatory scrutiny of AI development practices, with multiple governments considering or implementing new regulatory frameworks for artificial intelligence.`,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    originCode: "US",
    categorySlug: "technology",
    tags: ["ai", "safety", "technology", "research"],
  },
  {
    title: "NBA Season Reaches Midpoint with Surprise Contenders Emerging",
    summary: "Several underdog teams have defied preseason predictions, reshaping the playoff picture across both conferences.",
    content: `The NBA season has reached its midpoint with several surprise contenders shaking up the playoff race. Teams that were largely overlooked in preseason predictions have emerged as legitimate threats, thanks to breakout performances from young players and savvy mid-season acquisitions.\n\nIn the Eastern Conference, the standings are historically tight, with only a few games separating the top eight seeds. The Western Conference has seen a similar reshuffling, with traditional powerhouses facing unexpected challenges.\n\nAnalysts point to improved player development programs, strategic roster construction, and innovative coaching as factors behind the league's increasing parity.`,
    thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    originCode: "US",
    categorySlug: "sports",
    tags: ["nba", "basketball", "playoffs", "sports"],
  },
  {
    title: "US Healthcare System Adopts Standardized Digital Health Records",
    summary: "New federal mandate requires all healthcare providers to transition to a unified electronic health record system by 2028.",
    content: `The US Department of Health and Human Services has announced a sweeping mandate requiring all healthcare providers to adopt a standardized electronic health record system by 2028. The initiative aims to eliminate the fragmentation that has long plagued American healthcare data management.\n\nUnder the new framework, patient records will be interoperable across providers, hospitals, and insurance companies, enabling seamless care coordination. The government will provide $15 billion in implementation grants to assist smaller practices and rural health facilities.\n\nHealthcare professionals have largely welcomed the move, though concerns remain about data privacy, cybersecurity, and the logistical challenges of migrating legacy systems.`,
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    originCode: "US",
    categorySlug: "health",
    tags: ["healthcare", "digital-health", "policy", "technology"],
  },

  // ─── UNITED KINGDOM ───
  {
    title: "London Unveils Ambitious Plan to Become Carbon Neutral by 2035",
    summary: "The Mayor announces a comprehensive climate strategy including expanded public transit, building retrofits, and urban green spaces.",
    content: `London's Mayor has unveiled an ambitious plan to make the capital carbon neutral by 2035, five years ahead of the national target. The comprehensive strategy encompasses transportation, building efficiency, renewable energy adoption, and urban greening initiatives.\n\nKey measures include the expansion of the Ultra Low Emission Zone to cover all of Greater London, mandatory energy retrofits for commercial buildings, and the creation of 200 new urban parks and green corridors. The plan also calls for the electrification of the entire bus fleet by 2030.\n\nThe initiative is backed by a £10 billion investment package combining public funds, private investment, and green bonds. Environmental groups have praised the plan's ambition while cautioning that implementation will require unprecedented coordination.`,
    thumbnail: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    originCode: "GB",
    categorySlug: "world",
    tags: ["london", "climate", "carbon-neutral", "green"],
  },
  {
    title: "Premier League Transfer Window Sees Record-Breaking Activity",
    summary: "English football clubs collectively spend over £3 billion during the winter transfer window, setting a new global record.",
    content: `The Premier League's winter transfer window has closed with record-breaking expenditure, as English clubs collectively spent over £3 billion on player acquisitions. The spending spree was driven by several top clubs seeking reinforcements for their title and Champions League campaigns.\n\nThe headline deals included several marquee signings from European leagues, with multiple transfer fees exceeding £80 million. The spending disparity between the Premier League and other European leagues continues to widen, raising concerns about competitive balance in continental competitions.\n\nFinancial Fair Play regulations have been tested by the scale of investment, with governing bodies indicating they will closely scrutinize club accounts in the coming months.`,
    thumbnail: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
    originCode: "GB",
    categorySlug: "sports",
    tags: ["premier-league", "football", "transfers", "sports"],
  },
  {
    title: "UK Biotech Firm Announces Breakthrough in Alzheimer's Treatment",
    summary: "Clinical trials show a new antibody therapy can slow cognitive decline by 40% in early-stage Alzheimer's patients.",
    content: `A British biotechnology company has announced promising results from Phase 3 clinical trials of a new Alzheimer's treatment. The antibody therapy demonstrated a 40% reduction in cognitive decline among early-stage Alzheimer's patients over an 18-month trial period.\n\nThe treatment works by targeting and clearing toxic protein aggregates in the brain that are believed to drive the progression of the disease. Unlike previous approaches, the new therapy showed minimal side effects, with fewer than 5% of participants experiencing brain swelling.\n\nRegulatory submissions are expected within the coming months, with the company seeking accelerated approval pathways in both the UK and EU. If approved, it would represent one of the most significant advances in Alzheimer's treatment in decades.`,
    thumbnail: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    originCode: "GB",
    categorySlug: "health",
    tags: ["alzheimers", "biotech", "medicine", "research"],
  },
  {
    title: "British Museum Launches Immersive Digital Exhibition Platform",
    summary: "The iconic institution introduces VR and AR experiences allowing global visitors to explore collections remotely.",
    content: `The British Museum has launched an innovative digital exhibition platform that combines virtual reality and augmented reality technologies to bring its vast collections to a global audience. The platform allows users to explore detailed 3D scans of artifacts, walk through virtual gallery spaces, and interact with educational content.\n\nThe initiative represents a significant investment in digital accessibility, enabling people who cannot visit London to experience the museum's treasures. The platform features curated tours led by museum experts and interactive timelines that contextualize artifacts within their historical periods.\n\nThe launch has been met with enthusiasm from educators worldwide, who see the platform as a valuable teaching resource that brings history to life in ways traditional textbooks cannot.`,
    thumbnail: "https://images.unsplash.com/photo-1565060299509-89e89b4d5e9b?w=800&q=80",
    originCode: "GB",
    categorySlug: "entertainment",
    tags: ["museum", "digital", "vr", "culture"],
  },
  {
    title: "Oxford University Study Reveals Ocean Currents Shifting Faster Than Expected",
    summary: "Research shows key Atlantic circulation patterns are weakening at twice the previously estimated rate due to polar ice melt.",
    content: `Researchers at Oxford University have published findings showing that critical Atlantic Ocean circulation patterns are weakening at approximately twice the rate previously estimated. The study, based on decades of oceanographic data and advanced climate models, suggests that polar ice melt is accelerating changes to the Atlantic Meridional Overturning Circulation.\n\nThe AMOC plays a vital role in regulating European and North American weather patterns, transporting warm water northward and helping maintain temperate climates in Western Europe. A significant weakening could lead to more extreme weather events, altered rainfall patterns, and rising sea levels along certain coastlines.\n\nThe research team emphasized the urgency of reducing greenhouse gas emissions, noting that the window for preventing the most severe consequences is narrowing faster than previously thought.`,
    thumbnail: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80",
    originCode: "GB",
    categorySlug: "science",
    tags: ["climate", "ocean", "research", "oxford"],
  },

  // ─── MORE INDIA ───
  {
    title: "India's UPI Processes Record 20 Billion Transactions in January",
    summary: "The digital payment platform hits a new monthly high, cementing India's position as a global leader in real-time digital payments.",
    content: `India's Unified Payments Interface has processed a record 20 billion transactions in January 2026, marking yet another milestone for the world's most successful real-time payment system. The transaction value exceeded ₹25 lakh crore, reflecting the deep penetration of digital payments across the country.\n\nThe growth has been driven by increasing adoption in tier-2 and tier-3 cities, as well as the expansion of UPI to international markets. Several countries have expressed interest in adopting similar systems, with India actively exporting the UPI framework.\n\nExperts note that UPI's success demonstrates how public digital infrastructure can drive financial inclusion at scale, providing a model that developing nations worldwide are seeking to replicate.`,
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    originCode: "IN",
    categorySlug: "business",
    tags: ["upi", "fintech", "digital-payments", "india"],
  },
  {
    title: "New Study Links Air Pollution to Rising Respiratory Issues in Delhi NCR",
    summary: "Researchers find a 35% increase in chronic respiratory conditions over the past five years in the National Capital Region.",
    content: `A comprehensive health study conducted across Delhi NCR has revealed a 35% increase in chronic respiratory conditions over the past five years, with air pollution identified as the primary contributing factor. The study tracked over 50,000 residents across multiple age groups and socioeconomic backgrounds.\n\nThe findings show that children and elderly residents are disproportionately affected, with asthma diagnoses among children under 12 rising by 45%. The study also documented a concerning increase in previously rare conditions among younger adults.\n\nPublic health officials have called for urgent action, recommending stricter emission standards, expanded green cover, and improved public health infrastructure to address the growing crisis.`,
    thumbnail: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80",
    originCode: "IN",
    categorySlug: "health",
    tags: ["pollution", "health", "delhi", "environment"],
  },

  // ─── MORE US ───
  {
    title: "SpaceX Starship Completes First Commercial Satellite Deployment Mission",
    summary: "The fully reusable rocket successfully deploys 40 broadband satellites in a landmark flight for commercial spaceflight.",
    content: `SpaceX's Starship rocket has completed its first commercial satellite deployment mission, successfully placing 40 broadband satellites into orbit. Both the booster and upper stage were recovered, marking a major achievement for the fully reusable launch system.\n\nThe mission represents a turning point in the commercial space industry, as Starship's enormous payload capacity and low per-launch cost could fundamentally reshape the satellite deployment market. Industry analysts estimate the cost per kilogram to orbit has dropped by an order of magnitude compared to traditional rockets.\n\nCompeting launch providers are now accelerating their own reusable rocket programs in response, while satellite operators are redesigning their spacecraft to take advantage of the increased payload capacity.`,
    thumbnail: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80",
    originCode: "US",
    categorySlug: "technology",
    tags: ["spacex", "starship", "space", "satellites"],
  },
  {
    title: "Broadway Sees Surge in Attendance with New Wave of Original Productions",
    summary: "Original musicals and plays drive a 25% increase in ticket sales compared to last season, signaling a creative renaissance.",
    content: `Broadway is experiencing a remarkable resurgence, with ticket sales up 25% compared to the previous season. The growth is being driven by a wave of original productions that have captured audience imagination and critical acclaim.\n\nIndustry insiders attribute the renaissance to a new generation of diverse playwrights and composers bringing fresh perspectives to the stage. Several shows have tackled contemporary themes including technology's impact on society, immigration stories, and climate change, resonating strongly with younger audiences.\n\nThe economic impact extends beyond the theater district, with restaurants, hotels, and tourism businesses in Midtown Manhattan all reporting increased activity correlated with the Broadway boom.`,
    thumbnail: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
    originCode: "US",
    categorySlug: "entertainment",
    tags: ["broadway", "theater", "arts", "culture"],
  },
  {
    title: "Breakthrough Gene Therapy Shows Promise for Type 1 Diabetes",
    summary: "A single-dose gene therapy enables patients to produce insulin naturally for the first time in early clinical trials.",
    content: `Researchers have reported groundbreaking results from early clinical trials of a gene therapy for Type 1 diabetes. The treatment, delivered as a single injection, has enabled trial participants to produce their own insulin for the first time, potentially eliminating the need for daily insulin injections.\n\nThe therapy works by reprogramming certain pancreatic cells to function as insulin-producing beta cells, effectively reversing the autoimmune damage that characterizes Type 1 diabetes. In the trial, 8 out of 10 participants achieved insulin independence for at least six months.\n\nWhile larger trials are needed, the results have generated significant excitement in the medical community. If validated, the therapy could transform the lives of millions of people living with Type 1 diabetes worldwide.`,
    thumbnail: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
    originCode: "US",
    categorySlug: "science",
    tags: ["gene-therapy", "diabetes", "medicine", "breakthrough"],
  },
  {
    title: "US Housing Market Shows Signs of Stabilization After Volatile Year",
    summary: "Home prices plateau in major metropolitan areas as mortgage rates ease and inventory gradually increases.",
    content: `The US housing market is showing signs of stabilization after a turbulent period marked by rapid price increases and affordability concerns. Data from major metropolitan areas indicates that home prices have plateaued, with some markets even experiencing modest declines.\n\nThe shift is attributed to a combination of factors including slightly lower mortgage rates, increasing housing inventory from new construction, and a cooling of investor speculation in the residential market. First-time homebuyers, who were largely priced out during the boom, are beginning to re-enter the market.\n\nReal estate economists caution that the stabilization is uneven, with coastal cities and tech hubs experiencing different dynamics than Sun Belt markets. However, the overall trend suggests a more balanced market is emerging.`,
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    originCode: "US",
    categorySlug: "business",
    tags: ["housing", "real-estate", "economy", "mortgage"],
  },

  // ─── MORE UK ───
  {
    title: "UK Government Launches National Digital Skills Program",
    summary: "A £500 million initiative aims to train 2 million workers in AI, data science, and cybersecurity by 2028.",
    content: `The UK government has launched a comprehensive digital skills program backed by £500 million in funding. The initiative aims to train 2 million workers in high-demand technology fields including artificial intelligence, data science, cybersecurity, and cloud computing by 2028.\n\nThe program will be delivered through partnerships between universities, technology companies, and further education colleges across the country. It includes fully funded bootcamps, apprenticeships, and online courses designed to be accessible to career changers and those from underrepresented backgrounds.\n\nIndustry leaders have welcomed the initiative, noting that the UK faces a shortage of approximately 500,000 tech workers. The program is expected to contribute significantly to the country's economic competitiveness in the global digital economy.`,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    originCode: "GB",
    categorySlug: "technology",
    tags: ["digital-skills", "education", "ai", "uk"],
  },
  {
    title: "Scottish Whisky Exports Reach Record High Amid Asian Demand",
    summary: "Scotch whisky exports surpass £7 billion for the first time, with strong growth in Japan, South Korea, and India.",
    content: `Scottish whisky exports have reached a record £7 billion, driven by surging demand across Asian markets. Japan, South Korea, and India have emerged as the fastest-growing markets, with premium and single malt categories showing particular strength.\n\nThe Scotch Whisky Association attributes the growth to rising affluence in Asian markets, a growing appreciation for premium spirits, and successful marketing campaigns that have positioned Scotch as a luxury product. Distilleries across Scotland are expanding production capacity to meet projected future demand.\n\nThe export milestone comes as welcome news for the Scottish economy, with the whisky industry supporting over 40,000 jobs and contributing significantly to rural communities where many distilleries are located.`,
    thumbnail: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80",
    originCode: "GB",
    categorySlug: "business",
    tags: ["whisky", "exports", "scotland", "trade"],
  },
  {
    title: "UK Researchers Develop Low-Cost Water Purification Technology",
    summary: "A new solar-powered filtration system could provide clean drinking water to millions in developing nations at a fraction of current costs.",
    content: `Engineers at Imperial College London have developed a revolutionary water purification system that uses solar energy to produce clean drinking water at a fraction of the cost of existing technologies. The device, small enough to be portable, can purify up to 100 liters of contaminated water per day.\n\nThe technology combines advanced membrane filtration with solar-thermal heating, eliminating the need for electricity or chemical treatments. In field tests conducted in sub-Saharan Africa, the device successfully removed 99.9% of harmful bacteria and parasites from contaminated water sources.\n\nThe research team is now working with international development organizations to scale production. They estimate that the device could provide clean water to communities for less than one penny per liter, potentially transforming access to safe drinking water in the developing world.`,
    thumbnail: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
    originCode: "GB",
    categorySlug: "science",
    tags: ["water", "technology", "innovation", "health"],
  },

  // ─── WORLD / POLITICS ───
  {
    title: "Global Summit on Ocean Conservation Yields Historic Agreement",
    summary: "192 nations commit to protecting 40% of the world's oceans by 2035 in a landmark environmental accord.",
    content: `A historic global summit on ocean conservation has concluded with 192 nations agreeing to protect 40% of the world's oceans by 2035. The agreement, described as the most significant ocean protection accord ever reached, establishes a framework for creating marine protected areas, reducing pollution, and combating illegal fishing.\n\nThe summit, which brought together heads of state, marine scientists, and environmental organizations, also established a $50 billion fund to support developing nations in implementing ocean protection measures. Small island developing states, which are disproportionately affected by ocean degradation, played a central role in negotiations.\n\nEnvironmental organizations have cautiously praised the agreement while emphasizing that its success will depend on enforcement mechanisms and the political will of signatory nations to follow through on their commitments.`,
    thumbnail: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80",
    originCode: "GB",
    categorySlug: "world",
    tags: ["ocean", "conservation", "climate", "global"],
  },
  {
    title: "International Space Station Marks 25 Years of Continuous Habitation",
    summary: "The orbital laboratory celebrates a quarter-century milestone of uninterrupted human presence in space.",
    content: `The International Space Station has reached a historic milestone, marking 25 years of continuous human habitation. Since November 2000, the station has been home to rotating crews from 19 different countries, hosting over 3,000 scientific experiments across disciplines ranging from biology to materials science.\n\nTo commemorate the anniversary, space agencies worldwide held synchronized events celebrating the station's contributions to science and international cooperation. Current crew members conducted a live broadcast from orbit, sharing their daily routines and reflecting on the station's legacy.\n\nAs planning continues for the ISS's eventual decommissioning, its legacy of international collaboration and scientific discovery will inform the next generation of space stations being developed by both government agencies and private companies.`,
    thumbnail: "https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=800&q=80",
    originCode: "US",
    categorySlug: "world",
    tags: ["iss", "space", "milestone", "science"],
  },
];

/**
 * Generate a deterministic slug (no random suffix for seeds)
 */
function seedSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

/**
 * Seed sample articles into the database
 */
async function seedArticles() {
  console.log("🌱 Starting article seed...\n");

  // Get or create system user
  let systemUser = await prisma.user.findUnique({ where: { username: "mantra-news-bot" } });
  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        id: "00000000-0000-0000-0000-000000000000",
        email: "bot@mantra.news",
        username: "mantra-news-bot",
        displayName: "Mantra News Bot",
        role: "ADMIN",
      },
    });
    console.log("📰 Created system news bot user");
  }

  // Fetch all origins and categories
  const origins = await prisma.origin.findMany();
  const categories = await prisma.category.findMany();

  if (origins.length === 0 || categories.length === 0) {
    console.error("❌ No origins or categories found. Please seed those first.");
    return;
  }

  const originMap = Object.fromEntries(origins.map((o) => [o.code, o.id]));
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  let created = 0;
  let skipped = 0;

  for (const article of SAMPLE_ARTICLES) {
    const originId = originMap[article.originCode];
    const categoryId = categoryMap[article.categorySlug];

    if (!originId || !categoryId) {
      console.warn(`  ⚠️  Skipping "${article.title}" — origin=${article.originCode} or category=${article.categorySlug} not found`);
      skipped++;
      continue;
    }

    const slug = seedSlug(article.title);

    // Check for existing article by slug
    const exists = await prisma.article.findUnique({ where: { slug } });
    if (exists) {
      console.log(`  ⏭️  Already exists: "${article.title}"`);
      skipped++;
      continue;
    }

    const contentText = article.content.replace(/<[^>]*>/g, "");
    const words = contentText.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    await prisma.article.create({
      data: {
        title: article.title,
        slug,
        summary: article.summary,
        content: article.content,
        thumbnail: article.thumbnail,
        sourceUrl: `seed-${slug}`,
        authorId: systemUser.id,
        originId,
        categoryId,
        tags: article.tags,
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // random within last 7 days
        readingTime,
        viewsCount: Math.floor(Math.random() * 500) + 50,
        likesCount: Math.floor(Math.random() * 100) + 10,
      },
    });

    console.log(`  ✅ Created: "${article.title}"`);
    created++;
  }

  console.log(`\n🌱 Seed complete: ${created} created, ${skipped} skipped`);
}

seedArticles()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

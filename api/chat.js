import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

const SYSTEM_PROMPT = `You are a factual assistant on Kosta Karathanasopoulos's portfolio website. Answer questions from recruiters and visitors about his background.

Rules:
- State facts only. Do not editorialize, praise, or hype. No "impressive", "excellent", "strong", "showcases", etc.
- Keep answers short: 1-3 sentences for simple questions, a brief list for complex ones.
- Use plain language. No em dashes, no filler phrases like "It's worth noting" or "What makes this interesting".
- If you don't know, say "I don't have that information" and suggest emailing Kosta.
- Do not invent information beyond what is listed below.

Here is everything you know about Kosta:

---

# PERSONAL
- Name: Kosta Karathanasopoulos
- Email: kostakarathanasopoulos@gmail.com
- Location: Providence, RI (originally from Brisbane, Australia)
- GitHub: github.com/kostakarathana
- LinkedIn: linkedin.com/in/kosta-karathanasopoulos-2b93b6226
- Currently seeking: Software engineering and quantitative finance / computational modeling roles

# EDUCATION
## Brown University — Providence, RI
- Degree: B.S. Applied Mathematics–Computer Science
- GPA: 3.85
- Graduation: May 2028
- Athletics: Brown Men's Crew (D1 Athlete), 20+ hours/week commitment alongside full course load
- Clubs: Quantitative Trading at Brown, Full Stack at Brown, Brown Builders, Brown Chess Club
- Coursework: Data Structures & Algorithms, Linear Algebra, Probability, AI, Ethical AI, Game Design, Statistical Inference, Systems Programming, Computational Linear Algebra, Machine Learning

## The Southport School — Southport, QLD, Australia
- Queensland Certificate of Education
- ATAR: 99.55 (top 0.45% nationally)
- Graduated: November 2023
- Leadership: School Prefect, House Captain, Rowing Vice Captain, Tennis Captain

# EXPERIENCE

## Founding Engineer / Co-founder — Spike | New York City | Jan 2025 – Present
- Architecting the core React frontend and user experience. Secured $150,000 in angel funding.
- Accelerated product development by adopting AI-native workflows (Cursor, Copilot) to rapidly prototype and iterate on complex UI states
- Optimizing technical architecture to support high-throughput interactions between users and autonomous backend systems

## Goldman Sachs Emerging Leaders | Jan 2026 – Apr 2026
- Creating a mutual fund analysis tool with a React/TS frontend coupled with a FastAPI/Python backend
- Leveraging OpenAI API to provide qualitative insights into users' investment strategy

## Research Assistant — AI/ML Robustness | Brown University, SWRL/LUNAR | Jan 2025 – Dec 2025
- Designed red-teaming strategies to stress-test LLMs, identifying prompt patterns that trigger hallucinations in agentic decision loops
- Co-authored a paper on linguistic bias (SVO/OVS triad) in modern text-to-image models

## Software Engineer Intern — Hats by the Hundred (E-Commerce) | Nov 2023 – Sep 2024
- Designed an autonomous sales agent (RAG-based) using internal support data that now generates $80K in annual revenue
- Analyzed Shopify customer data to identify conversion patterns and optimize the UX for maximum engagement

# PROJECTS

## PresidentialBrief
Full-stack SaaS delivering personalized AI-generated weekly news briefs via email. User auth, cron jobs, OpenAI content generation. Tech: Next.js, TypeScript, PostgreSQL, OpenAI, Prisma.

## Spike (Platform)
Prediction market platform with dashboards, leaderboards, clubs, admin panels. Tech: Next.js, React 19, FastAPI, PostgreSQL, Tailwind.

## RoadsAndSearch (Public)
Interactive visualizer for 6 pathfinding algorithms (BFS, DFS, Dijkstra, A*, Greedy Best-First, Bidirectional) on a procedurally generated 1000x1000 town. Tech: Vanilla JavaScript, HTML5 Canvas.

## PartSelect Chat Agent (Public)
AI chat agent for appliance parts with scraped product data, compatibility checks, installation guides, intent classification via Deepseek LLM. Tech: React, Node.js, Deepseek, BeautifulSoup.

## Habit Forest
Visual habit tracker where habits grow as L-system trees when maintained and decay through 50 stages when neglected. Tech: Next.js, TypeScript, Zustand, Canvas API, Framer Motion.

## YouTube Focus Mode
Chrome extension that hides entertainment content on YouTube while preserving educational videos. Tech: JavaScript, Chrome Manifest V3.

## Voice AI Assistant (Public)
Voice-to-text AI assistant on Cloudflare Workers with Whisper STT and Llama 3.3. Tech: TypeScript, Cloudflare Workers.

## TikTok View Predictor
Novel power-law decay model for predicting TikTok video views. Tech: FastAPI, React, Playwright, Gemini Vision.

## Go AI — Parallel MCTS
Go game AI achieving 88.3% win rate using Root Parallel MCTS with 8 workers. Tech: Python, PyTorch, Multiprocessing.

## CoinClicker (Public) — 1st Place, $7,500
Smart contract gaming lottery on Flare Network. Tech: Solidity, Flare Network, JavaScript.

## Scratchoff (Public) — 2nd Place, $3,000
Blockchain scratch-off game on Polkadot. Tech: JavaScript, Smart Contracts, Polkadot.

## Goldman ELS Calculator (Public)
Financial calculator for mutual fund investments using CAPM model. Tech: React, Node.js, Express.

## Markov Decision Simulator (Public)
Browser-based MDP solver/simulator. Tech: JavaScript, HTML5 Canvas.

## Wikipedia Random Walk (Public)
Category-aware random walk on Wikipedia with D3 force layout. Tech: D3.js, MediaWiki API.

## Tetris (Public)
Feature-complete Tetris with procedural sound generation. Tech: Python, Pygame, NumPy.

## YOLOV8 Rowing Analysis (Public)
Real-time pose estimation overlay for rowing videos using YOLOv8. Tech: Python, YOLOv8, OpenCV.

## Rowing Telemetry Tools (Public)
Animated stats overlay from rowing telemetry. Tech: Python, Matplotlib, FFmpeg.

# SKILLS
Languages: Python, JavaScript/TypeScript, C++, Java, Bash, SQL
Tools/Tech: Git, React Native, RAG, Agentic Patterns, Cursor, GitHub Copilot, OpenAI API, Linux, Shopify+, NumPy, Pandas

# AWARDS
- 1st Place — Easy A x Flare x XRPL Hackathon ($7,500)
- 2nd Place — Harvard x Polkadot Hackathon ($3,000)
- Honorable Mention — Algorand Hackathon
- Australian Rowing National Championships — Double Scull
- Queensland State Champion — Single, Double, and Quad Scull

# CERTIFICATIONS
- Yale Financial Markets (Coursera)
- Stanford Machine Learning Specialization

# OTHER
- D1 rower at Brown (20+ hrs/wk), originally from Brisbane, Australia
- Interests: quantitative finance, AI/ML, prediction markets
- Co-founder of Spike, secured $150K in angel funding

---

Respond with facts from the above. No opinions, no superlatives, no hype.`;

// In-memory stores (reset on cold starts — fine for a portfolio site)
const conversations = new Map();
const rateLimits = new Map();
const WEEKLY_LIMIT = 10;

function getRateLimit(ip) {
    const now = Date.now();
    let entry = rateLimits.get(ip);
    if (!entry || now >= entry.resetAt) {
        entry = { count: 0, resetAt: now + 7 * 24 * 60 * 60 * 1000 };
        rateLimits.set(ip, entry);
    }
    return entry;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, sessionId } = req.body || {};

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.headers['x-real-ip']
        || req.socket?.remoteAddress
        || 'unknown';

    const limit = getRateLimit(ip);

    if (limit.count >= WEEKLY_LIMIT) {
        const hoursLeft = Math.ceil((limit.resetAt - Date.now()) / (1000 * 60 * 60));
        return res.status(429).json({
            error: `You've reached the weekly limit of ${WEEKLY_LIMIT} messages. Resets in ~${hoursLeft} hours. Email kostakarathanasopoulos@gmail.com for more info.`,
            remaining: 0,
        });
    }

    limit.count++;

    let history = conversations.get(sessionId) || [];
    history.push({ role: 'user', content: message });

    if (history.length > 20) {
        history = history.slice(-20);
    }

    try {
        const response = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 512,
            temperature: 0,
            system: SYSTEM_PROMPT,
            messages: history,
        });

        const reply = response.content[0].text;
        history.push({ role: 'assistant', content: reply });
        conversations.set(sessionId, history);

        return res.status(200).json({ reply, remaining: WEEKLY_LIMIT - limit.count });
    } catch (err) {
        console.error('Claude API error:', err.message);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
}

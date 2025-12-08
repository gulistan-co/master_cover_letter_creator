const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

const patterns = require('./patterns.json');

const ARC_ATHENA_SYSTEM_PROMPT = `
You are Arc Athena Copilot, an embedded ChatGPT-like assistant for Zora Tokhi’s job search engine.

You know:
- The Arc Athena module system: GPCA pillar, Vital Voices pillar, kickers, synthesis patterns, 13 sectors, routing table, and the JD Intelligence Engine.
- The canonical sentence anchors from the client-side banks in index.html and the execution protocol described across README.md and PT 1 SYSTEM ZORA_COVER_LETTER_SYSTEM (1).md.

The Inviolable Code:
- No em dashes.
- No long listy sentences; keep things punchy.
- Never start sentences with “At” or “When.”
- Kicker must be indented when drafting letters.
- One page maximum for letters.

Priorities:
- Preserve Zora’s established voice from GPCA and Vital Voices anchors.
- Use analytical, systems oriented language, not gushy nonprofit fluff.
- Keep numeric metrics (GPCA and Vital Voices) intact unless explicitly changed.

Execution protocol for letter edits:
- Generate 90 percent from anchors and 10 percent surgical edits near the end of 2–3 sentences, synthesis paragraph, and 1–2 JD keywords woven in.
- If asked to rewrite, change only what is needed for clarity and JD alignment; do not rewrite entire paragraphs unless requested.

Modes:
- mode = "default": discuss strategy, sector choices, and career moves concisely and practically.
- mode = "jd": interpret the pasted JD, identify what the role is really about, and suggest the best sector routing and variables.
- mode = "letter": refine sentences or paragraphs that will go into the final letter; aggressively enforce the Inviolable Code and avoid generic AI phrases.

Always be blunt, practical, and encouraging while avoiding corporate clichés.
`;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '.')));

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const summarizeText = (text, limit = 800) => {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > limit ? `${cleaned.slice(0, limit)}...` : cleaned;
};

const fallbackAnalyze = (jdText) => {
  const text = (jdText || '').toLowerCase();

  let role = '';
  const rolePatterns = [
    /(?:position|role|title):\s*([^\n]+)/i,
    /(?:job title|position title):\s*([^\n]+)/i,
    /^([^\n]+?)(?:\s+at\s+|\s+-\s+)/im
  ];
  for (let pattern of rolePatterns) {
    const match = jdText.match(pattern);
    if (match) {
      role = match[1].trim();
      break;
    }
  }
  if (!role) {
    const lines = jdText.split('\n').filter(l => l.trim().length > 0);
    role = lines[0]?.trim().substring(0, 80) || '';
  }

  let org = '';
  const orgPatterns = [
    /(?:company|organization|org):\s*([^\n]+)/i,
    /(?:at|join|with)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s+is\s+|\s+in\s+|\.|,)/,
    /([A-Z][A-Za-z0-9\s&.]{2,30})\s+is\s+(?:seeking|looking|hiring)/
  ];
  for (let pattern of orgPatterns) {
    const match = jdText.match(pattern);
    if (match) {
      org = match[1].trim();
      break;
    }
  }

  const sectorKeywords = {
    'Climate/ESG': ['climate', 'esg', 'sustainability', 'environmental', 'carbon', 'renewable', 'green energy', 'net zero', 'decarbonization', 'clean energy'],
    'AI/Tech': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'neural', 'algorithm', 'data science', 'software', 'engineering', 'platform'],
    'Partnerships/BD': ['partnerships', 'business development', 'bd', 'strategic partnerships', 'alliance', 'channel', 'ecosystem', 'stakeholder engagement'],
    'Program Mgmt': ['program manager', 'program management', 'project manager', 'pmo', 'agile', 'scrum', 'delivery', 'implementation'],
    'Operations': ['operations', 'ops', 'operational', 'process', 'efficiency', 'logistics', 'supply chain', 'execution'],
    'Think Tank/Policy': ['policy', 'think tank', 'research institute', 'public policy', 'advocacy', 'regulatory', 'government affairs', 'legislation'],
    'Human Rights': ['human rights', 'humanitarian', 'refugee', 'asylum', 'democracy', 'freedom', 'civil society', 'civil liberties', 'justice'],
    'Impact Investing': ['impact investing', 'social impact', 'impact fund', 'blended finance', 'impact measurement', 'sri', 'esg investing', 'social finance'],
    'Communications': ['communications', 'comms', 'public relations', 'pr', 'media', 'content', 'storytelling', 'brand', 'marketing'],
    'Membership': ['membership', 'member services', 'association', 'trade association', 'professional organization', 'community'],
    'Research/Strategy': ['research', 'strategy', 'strategic', 'analysis', 'insights', 'market research', 'competitive intelligence', 'consulting'],
    'Fintech': ['fintech', 'financial technology', 'payments', 'blockchain', 'crypto', 'defi', 'banking technology', 'digital banking'],
    'Grants/Dev': ['grants', 'development', 'fundraising', 'donor', 'philanthropy', 'foundation', 'grantmaking', 'resource development']
  };

  let bestSector = 'Partnerships/BD';
  let maxScore = 0;

  Object.entries(sectorKeywords).forEach(([sector, keywords]) => {
    let score = 0;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) score += matches.length;
    });
    if (score > maxScore) {
      maxScore = score;
      bestSector = sector;
    }
  });

  let orgInsight = '';
  const insightPatterns = [
    /(?:mission|vision|purpose|about us):\s*([^.!?]+[.!?])/i,
    /(?:we|our organization|our company)\s+(is|are)\s+([^.!?]+[.!?])/i,
    /(?:our mission is to|we aim to|we work to|we strive to)\s+([^.!?]+[.!?])/i
  ];
  for (let pattern of insightPatterns) {
    const match = jdText.match(pattern);
    if (match) {
      orgInsight = match[1] || match[2] || match[0];
      orgInsight = orgInsight.trim().substring(0, 200);
      break;
    }
  }

  return {
    role,
    org,
    sector: bestSector,
    orgInsight,
    template: null,
    routing: null,
    themes: [],
    confidence: maxScore > 3 ? 'HIGH' : maxScore > 1 ? 'MEDIUM' : 'LOW'
  };
};

const patternContext = () => {
  const lines = patterns.map(p => `${p.sector}: ${p.fragments.join(' | ')}`);
  return lines.join(' ');
};

app.post('/api/jd-analyze', async (req, res) => {
  const { jdText } = req.body || {};
  if (!jdText || !jdText.trim()) {
    res.status(400).json({ error: 'jdText is required' });
    return;
  }

  const fallback = fallbackAnalyze(jdText);
  if (!openai) {
    res.json({ analysis: fallback, source: 'fallback' });
    return;
  }

  try {
    const prompt = `Parse the following JD into a JSON object with keys role, org, sector, template, routing, themes (1-3 short phrases), and orgInsight (one sentence). Use existing Arc Athena sectors and routing table logic. Keep numbers intact. Patterns: ${patternContext()}. JD: """${jdText}"""`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: ARC_ATHENA_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]
    });

    const content = completion.choices[0]?.message?.content || '';
    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (innerErr) {
          parsed = null;
        }
      }
    }

    const analysis = parsed && parsed.role ? { ...fallback, ...parsed } : fallback;
    res.json({ analysis, source: parsed ? 'ai' : 'fallback' });
  } catch (error) {
    res.json({ analysis: fallback, source: 'fallback', error: 'ai_unavailable' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages = [], mode = 'default', jdText = '', assembledLetter = '', sector = '' } = req.body || {};
  if (!messages.length) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }
  if (!openai) {
    res.status(503).json({ error: 'OpenAI not configured' });
    return;
  }

  const convo = [];
  convo.push({ role: 'system', content: ARC_ATHENA_SYSTEM_PROMPT });

  if (jdText) {
    convo.push({ role: 'user', content: `JD summary: ${summarizeText(jdText, 700)}` });
  }

  if (sector) {
    convo.push({ role: 'assistant', content: `Current sector and routing context: ${sector}. Keep recommendations inside Arc Athena routing.` });
  }

  if (mode === 'letter' && assembledLetter) {
    convo.push({ role: 'user', content: `Here is the current assembled letter draft. When editing, change as little as possible and obey the Inviolable Code. ${summarizeText(assembledLetter, 1200)}` });
  }

  const modeDirective = mode === 'letter'
    ? 'Mode letter: suggest concrete edits or replacements for specific sentences. Preserve numerical details and role titles. Avoid abstract advice.'
    : mode === 'jd'
      ? 'Mode jd: interpret the JD, highlight what the role is about, and propose sector routing and variables succinctly.'
      : 'Mode default: keep guidance concise and practical.';

  convo.push({ role: 'assistant', content: `Pattern fragments you can reference: ${patternContext()}` });
  convo.push({ role: 'assistant', content: modeDirective });

  messages.forEach(msg => {
    if (msg && msg.role && msg.content) {
      convo.push({ role: msg.role, content: msg.content });
    }
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: convo
    });

    const reply = completion.choices[0]?.message?.content || '';
    res.json({ reply });
  } catch (error) {
    res.status(503).json({ error: 'Copilot unavailable' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Arc Athena server running on port ${PORT}`);
});

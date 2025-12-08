# Arc-Athena Cover Letter Expert System

Built on 300+ applications. Forensically extracted.

## 🚀 Quick Deploy to GitHub Pages (5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Name it: `arc-athena` (or whatever you want)
3. Make it **Public**
4. **Do NOT** initialize with README
5. Click "Create repository"

### Step 2: Upload Files

**Option A: Via GitHub Web Interface (Easiest)**

1. On your new repo page, click "uploading an existing file"
2. Drag and drop `index.html` and this `README.md`
3. Commit directly to `main` branch

**Option B: Via Git (If you have Git installed)**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/arc-athena.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo Settings
2. Click "Pages" in the left sidebar
3. Under "Source", select `main` branch and `/ (root)` folder
4. Click "Save"
5. Wait 1-2 minutes

### Step 4: Access Your App

Your app will be live at:
```
https://YOUR-USERNAME.github.io/arc-athena/
```

## 🚀 One-Click Backend Deploy on Render

Use Render to host the Node backend (serves the static front end and the AI endpoints).

1. Create a free Render account at https://render.com.
2. Click **New +** → **Blueprint** and point it to your GitHub repo containing this project.
3. Render will auto-detect `render.yaml`; accept the defaults (Node web service, `npm install`, `npm start`).
4. In the service settings, add an environment variable `OPENAI_API_KEY` with your key.
5. Deploy. Render will build and serve `index.html` from the same service at your generated URL.

> Tip: If you want the front end on GitHub Pages and the backend on Render, deploy Pages first, then set `window.API_BASE_URL = 'https://your-render-service.onrender.com'` near the top of `index.html` so the UI calls the remote API.

## 📝 Embed in Notion

Once deployed:

1. Copy your GitHub Pages URL
2. In Notion, type `/embed`
3. Paste your URL
4. Resize to full width

## 🛠 How It Works

### JD Intelligence Engine
- Paste any job description
- Auto-extracts: Role, Organization, Sector, Mission
- Confidence scoring (HIGH/MEDIUM/LOW)
- 130+ sector keywords across 13 categories
- Optional OpenAI-backed JD parsing via `/api/jd-analyze` with fallback to the local keyword engine

### Complete Module System
- **13 Sectors**: Climate/ESG, AI/Tech, Partnerships, Program Mgmt, Operations, Think Tank, Human Rights, Impact Investing, Communications, Membership, Research/Strategy, Fintech, Grants/Dev
- **All PT_1 Modules**: GPCA-PARTNERSHIPS, GPCA-STRATEGY, GPCA-ESG, GPCA-OPERATIONS, GPCA-AI-TECH
- **All VV Modules**: VV-CRISIS, VV-COMMS, VV-PROGRAM, VV-TECH, VV-PORT+TECH
- **8 Kickers**: Philosophical statements for each sector type
- **5 Synthesis Patterns**: Org-specific nexus statements

### The Inviolable Code
1. NO EM-DASHES
2. NO LONG LISTY SENTENCES
3. NEVER START WITH "At" OR "When"
4. KICKER MUST BE INDENTED
5. ONE PAGE MAXIMUM

### Assembly Protocol
1. Paste JD → Analyze
2. Review auto-populated fields
3. Click "Assemble Letter"
4. Copy or Download
5. Apply to job in 90 seconds

## 📦 What's Included

- `index.html` - Complete standalone app (no build required)
- All React dependencies via CDN
- Tailwind CSS for styling
- All sentence anchors, routing tables, and modules
- JD parsing intelligence
- Copy/download functionality

## 🔧 Tech Stack

- React 18 (via CDN)
- Tailwind CSS (via CDN)
- Babel Standalone (for JSX compilation)
- Vanilla JavaScript
- Zero build process
- Zero npm dependencies

## 🎨 Features

- Dark mode UI (Arc-Athena aesthetic)
- Real-time JD analysis
- Sector auto-detection
- Template assembly engine
- Quality checklist
- One-click copy/download
- Mobile responsive
- Notion-embeddable
- Copilot tab for in-app ChatGPT constrained by Arc Athena rules

## 🖥 Local Server

1. Set `OPENAI_API_KEY` in your environment for AI-backed features.
2. Run `npm install` once.
3. Start the backend with `npm start` and open `index.html` in the same root (served statically by `server.js`).

## 📄 License

Built for Zora Tokhi's job search empire.

---

*Capital follows conviction. But only when it is made legible through systems that last.*

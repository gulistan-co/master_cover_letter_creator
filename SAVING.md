# Saving this version of Arc Athena

Need to capture the current `index.html` and `README.md` exactly as served? Use any of the methods below. Pick whichever is easiest for where you're running the app.

## 1) From inside the app UI (no terminal)
- Open Arc Athena in your browser.
- In the header, click **Save index.html** and **Save README**.
- Your browser will download the exact files currently served by the app.

## 2) From the running server (terminal)
If you started the local backend (`npm start`):
```bash
curl -O http://localhost:3000/index.html
curl -O http://localhost:3000/README.md
```
This pulls the files the backend is serving right now.

## 3) From the GitHub repository (terminal)
If the code is pushed to GitHub, fetch the current main-branch snapshot:
```bash
curl -O https://raw.githubusercontent.com/YOUR-USERNAME/arc-athena/main/index.html
curl -O https://raw.githubusercontent.com/YOUR-USERNAME/arc-athena/main/README.md
```
Replace `YOUR-USERNAME` (and branch/path if different) as needed.

## 4) Clone the entire repo for a frozen snapshot
```bash
git clone https://github.com/YOUR-USERNAME/arc-athena.git
cd arc-athena
git log --oneline   # inspect commits
```
Keep this clone as your saved copy or create a tag to mark the state:
```bash
git tag -a saved-$(date +%Y%m%d) -m "Saved snapshot"
git push origin saved-$(date +%Y%m%d)
```

## 5) One-command archive from this repo
If you're in this repository locally, run:
```bash
npm run save
```
This creates `arc-athena-snapshot.tar.gz` with the key app files, excluding `node_modules`.

## 6) Zip up the served files (manual archive)
If you just want a quick zip from your local checkout without npm:
```bash
zip arc-athena-snapshot.zip index.html README.md patterns.json render.yaml server.js package.json package-lock.json
```
You now have a portable archive of the current version.

---
Choose the path that matches your environment—UI buttons if you're in the browser, `curl` if you have a URL, or Git if you want full history.

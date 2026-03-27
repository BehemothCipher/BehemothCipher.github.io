# CipherBuilds Server

Backend for the CipherBuilds commission form. When a user submits a commission request, this server automatically generates a personalized contract PDF and emails it to them — and notifies you at the same time.

---

## How It Works

1. User fills out the commission form on behemothlab.dev
2. Form POSTs to this server
3. Server generates a personalized contract PDF with their name, email, and tier pre-filled
4. Contract is emailed to the client automatically
5. You get a notification email with their details

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/BehemothCipher/cipherbuilds-server
cd cipherbuilds-server
npm install
```

### 2. Set Up Gmail App Password

You need a Gmail App Password — NOT your regular Gmail password.

1. Go to your Google Account → Security
2. Make sure 2-Step Verification is ON
3. Go to Security → App Passwords
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password it generates

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```
GMAIL_USER=behemothcipher@gmail.com
GMAIL_APP_PASSWORD=your_16_char_password
PORT=3000
```

### 4. Run Locally

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## Deploy to Render (Free)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) and sign up (free)
3. Click **New → Web Service**
4. Connect your GitHub repo
5. Set these:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add your environment variables under **Environment**:
   - `GMAIL_USER` = behemothcipher@gmail.com
   - `GMAIL_APP_PASSWORD` = your app password
7. Deploy — Render gives you a URL like `https://cipherbuilds-server.onrender.com`
8. Update `SERVER_URL` in your `portfolio.html` to match that URL

---

## API Endpoints

### POST /commission
Sends a personalized contract PDF to the client.

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "tier": "Mid-Level App ($300–$700)",
  "message": "I need a dashboard for my store"
}
```

### POST /contact
Forwards a general contact message to your Gmail.

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "topic": "Product question",
  "message": "Does the System Kit work on Windows 10?"
}
```

### GET /
Health check — returns `{ status: "CipherBuilds server running" }`

---

## File Structure

```
cipherbuilds-server/
├── server.js          — Express server, routes, email logic
├── generateContract.js — PDF contract generator (pdfkit)
├── package.json
├── .env.example       — Copy to .env and fill in your credentials
├── .gitignore         — Keeps .env and node_modules out of GitHub
└── README.md
```

---

© BehemothCipher · CipherBuilds · behemothlab.dev

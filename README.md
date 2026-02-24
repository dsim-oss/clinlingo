# ClinLingo

**Clinical communication, any language.**

The clinical phrasebook built for chiropractors, PTs, and rehab providers. Specialty-specific phrases in the languages hospitals overlook.

## Quick Deploy to Vercel

### Option 1: CLI (fastest)
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# From this directory
vercel

# Follow the prompts — it will deploy in ~30 seconds
# You'll get a URL like: clinlingo.vercel.app
```

### Option 2: GitHub + Vercel Dashboard
1. Push this folder to a new GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Deploy — no config needed

### Option 3: Drag & Drop
1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the `landing` folder into the browser
3. Done

## Custom Domain

After deploying, add your custom domain in Vercel:
1. Go to your project settings → Domains
2. Add `clinlingo.com` (or whatever you register)
3. Update DNS as instructed

## Waitlist Backend

The form currently logs to console. To collect emails, options include:

### Quick: Google Sheets (free)
Use a Google Apps Script webhook to receive form submissions.

### Better: Airtable
POST to Airtable API from a Vercel serverless function.

### Best: Your own API
Create `/api/waitlist.js` in this project:
```js
export default async function handler(req, res) {
  const { email } = JSON.parse(req.body);
  // Save to your database of choice
  res.status(200).json({ success: true });
}
```

## Project Structure
```
landing/
├── index.html      ← Landing page (everything in one file)
├── package.json    ← Project metadata
├── vercel.json     ← Deployment config
└── README.md       ← You are here
```

## Next Steps
- [ ] Register clinlingo.com domain
- [ ] Deploy to Vercel
- [ ] Connect waitlist to email collection (Airtable/Sheets)
- [ ] Build the full React app (clinlingo.jsx already exists)
- [ ] Add Polish language pack
- [ ] Set up analytics (Plausible or Vercel Analytics)

---

Built by Active Health · © 2026

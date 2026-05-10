# 🔑 Setup Guide - AI Documentation Generator

## Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)
5. **Important**: Save it immediately - you won't see it again!

## Step 2: Add API Key to Project

1. Create `.env` file in project root:
```bash
cp .env.example .env
```

2. Open `.env` and add your key:
```
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3001
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 AI Documentation Generator running on http://localhost:3001
📝 Upload route files to generate OpenAPI documentation
```

## Step 5: Test It

1. Open http://localhost:3001 in your browser
2. Upload the `sample-routes.js` file
3. Click "Generate Documentation"
4. Download the generated YAML

## 💰 Pricing

- **GPT-4o-mini**: ~$0.02 per generation
- **First $5 free** with new OpenAI accounts
- Very affordable for demo purposes

## 🚀 Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variable: `OPENAI_API_KEY`
5. Deploy!

## 🔒 Security Note

- Never commit `.env` file to Git
- Keep your API key secret
- Use environment variables in production

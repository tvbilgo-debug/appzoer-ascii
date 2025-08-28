# Google OAuth Quick Setup Guide

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project**:
   - Click on the project dropdown at the top
   - Click "New Project"
   - Name it "ASCII Generator" or similar
   - Click "Create"

3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and click "Enable"

4. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name: "ASCII Generator"
   - Add authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click "Create"

5. **Copy the credentials**:
   - You'll get a Client ID and Client Secret
   - Copy both values

## Step 2: Update Environment Variables

Replace the placeholder values in `.env.local` with your actual credentials:

```env
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
```

## Step 3: Restart the Server

```bash
npm run dev
```

## Step 4: Test

1. Go to `http://localhost:3000`
2. Click "Sign up for free"
3. You should now see "Continue with Google" button
4. Click it to test the OAuth flow

## Troubleshooting

- **"client_id is required"**: Make sure you've added the credentials to `.env.local`
- **"Invalid redirect"**: Ensure the redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
- **"Page not found"**: Make sure the server is running on port 3000

## Current Status

- ✅ Credentials login working
- ❌ Google OAuth needs real credentials
- ❌ GitHub OAuth not configured

## Next Steps

1. Follow the steps above to get real Google OAuth credentials
2. Replace the placeholder values in `.env.local`
3. Restart the server
4. Test the Google login button

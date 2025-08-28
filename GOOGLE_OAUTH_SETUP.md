# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)

## Step 2: Update Environment Variables

Add your Google OAuth credentials to `.env.local`:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Step 3: Test the Setup

1. Restart your development server
2. Click "Continue with Google" in the login dialog
3. You should be redirected to Google's OAuth consent screen

## Troubleshooting

- Make sure the redirect URI matches exactly
- Check that the Google+ API is enabled
- Verify your client ID and secret are correct
- Ensure your app is running on the correct port (3000)

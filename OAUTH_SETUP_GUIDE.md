# OAuth Setup Guide

## Current Status
- ✅ **Credentials Login**: Working (test@example.com / test123)
- ❌ **Google OAuth**: Not configured
- ❌ **GitHub OAuth**: Not configured

## How to Enable OAuth Providers

### 1. Google OAuth Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
5. **Copy credentials** to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

### 2. GitHub OAuth Setup

1. **Go to GitHub Developer Settings**: https://github.com/settings/developers
2. **Create a new OAuth App**:
   - Click "New OAuth App"
   - Fill in the details:
     - Application name: "ASCII Generator"
     - Homepage URL: `http://localhost:3000`
     - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. **Copy credentials** to `.env.local`:
   ```env
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

### 3. Enable OAuth Providers

1. **Uncomment the providers** in `src/lib/auth.ts`:
   ```typescript
   GoogleProvider({
     clientId: process.env.GOOGLE_CLIENT_ID!,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
   }),
   GithubProvider({
     clientId: process.env.GITHUB_CLIENT_ID!,
     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
   })
   ```

2. **Restart the development server**:
   ```bash
   npm run dev
   ```

## Testing

1. **Credentials Login**: Use `test@example.com` / `test123`
2. **Google OAuth**: Click "Continue with Google" (after setup)
3. **GitHub OAuth**: Click "Continue with GitHub" (after setup)

## Troubleshooting

- **"client_id is required"**: Make sure you've added the credentials to `.env.local`
- **"Page not found"**: Ensure the redirect URIs match exactly
- **"Invalid redirect"**: Check that the callback URLs are correct

## Current Working Features

- ✅ User registration and login with email/password
- ✅ Session management
- ✅ Database storage
- ✅ ASCII converter functionality
- ✅ Landing page and navigation

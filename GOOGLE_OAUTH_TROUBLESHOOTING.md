# Google OAuth Troubleshooting Guide

## Error: "Access blocked: Authorization Error"

This error occurs when Google OAuth is not properly configured. Here's how to fix it:

## Step 1: Complete Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to https://console.cloud.google.com/
2. Make sure you're in the correct project
3. If no project exists, create one named "ASCII Generator"

### 1.2 Enable Required APIs
1. Go to "APIs & Services" → "Library"
2. Search for and enable these APIs:
   - **Google+ API** (or Google Identity)
   - **Google Identity and Access Management (IAM) API**

### 1.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "ASCII Generator"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Add test users (your email) if in testing mode
6. Save and continue

### 1.4 Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name: "ASCII Generator"
5. **CRITICAL**: Add these Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/auth/callback/google
   ```
6. Click "Create"
7. **Copy both Client ID and Client Secret**

## Step 2: Update Environment Variables

Replace your `.env.local` with real credentials:

```env
GOOGLE_CLIENT_ID="your-real-client-id-from-google-console"
GOOGLE_CLIENT_SECRET="your-real-client-secret-from-google-console"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
JWT_SECRET="your-jwt-secret-key-change-this-in-production"
```

## Step 3: Common Issues & Solutions

### Issue 1: "Access blocked: Authorization Error"
**Solution**: 
- Complete OAuth consent screen setup
- Add your email as test user
- Make sure APIs are enabled

### Issue 2: "Invalid redirect URI"
**Solution**:
- Check that redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- No extra spaces or characters

### Issue 3: "OAuth client was not found"
**Solution**:
- Use real credentials, not placeholder values
- Make sure you're in the correct Google Cloud project

### Issue 4: "API not enabled"
**Solution**:
- Enable Google+ API or Google Identity API
- Wait a few minutes for changes to propagate

## Step 4: Test the Setup

1. **Restart your server**:
   ```bash
   npm run dev
   ```

2. **Test OAuth flow**:
   - Go to `http://localhost:3000`
   - Click "Sign up for free"
   - Click "Continue with Google"
   - Should redirect to Google OAuth consent screen

## Step 5: Verification Checklist

- [ ] Google Cloud project created
- [ ] APIs enabled (Google+ API, IAM API)
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Redirect URI added correctly
- [ ] Real credentials copied to `.env.local`
- [ ] Server restarted
- [ ] Test user added (if in testing mode)

## Alternative: Use Credentials Login

If Google OAuth continues to have issues, you can use the working credentials login:

- **Email**: `test@example.com`
- **Password**: `test123`

This login method is fully functional and doesn't require external OAuth setup.

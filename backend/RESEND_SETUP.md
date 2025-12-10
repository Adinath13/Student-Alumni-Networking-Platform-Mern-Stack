# Resend Email Service Setup Guide

## Why Resend?

**Problem:** Render blocks outbound SMTP connections on ports 465 and 587, causing Gmail SMTP to fail with `Connection timeout` errors.

**Solution:** Resend uses HTTPS API instead of SMTP ports, which works perfectly on Render.

---

## Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Click **"Sign Up"** (free account)
3. Verify your email address
4. Log in to your dashboard

---

## Step 2: Get Your API Key

1. In Resend dashboard, go to **"API Keys"**
2. Click **"Create API Key"**
3. Give it a name (e.g., "Student Network Production")
4. Select **"Sending access"** permission
5. Click **"Add"**
6. **Copy the API key** (starts with `re_`)
   - ⚠️ **Important:** Save it now! You won't be able to see it again

---

## Step 3: Configure Local Environment

Update your local `.env` file:

```env
# For local development, you can use either Gmail or Resend

# Option 1: Keep using Gmail locally (recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=adixxx.0x69@gmail.com
EMAIL_PASSWORD=ptfdgdgzcfjpemkn

# Option 2: Use Resend locally (if you want to test)
# EMAIL_SERVICE=resend
# RESEND_API_KEY=re_your_api_key_here
# EMAIL_FROM=onboarding@resend.dev
```

---

## Step 4: Configure Render Environment

### Add Environment Variables in Render Dashboard

1. Go to your Render service: [studentnetwork-1](https://dashboard.render.com)
2. Click on your backend service
3. Go to **"Environment"** tab
4. Add these environment variables:

```
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev
```

**Important Notes:**
- Use `onboarding@resend.dev` for testing (Resend's test email)
- For production, you'll need to verify your own domain
- Remove or keep the old `EMAIL_USER` and `EMAIL_PASSWORD` (they won't be used when `EMAIL_SERVICE=resend`)

---

## Step 5: Deploy to Render

After adding the environment variables:

1. Render will automatically redeploy
2. Or manually trigger a deploy from the Render dashboard
3. Wait for deployment to complete

---

## Step 6: Test Email Sending

### Test Verification Email

1. Register a new user on your site
2. Check your inbox for the verification email
3. Verify the email looks good and the button works

### Test Password Reset

1. Go to "Forgot Password"
2. Enter your email
3. Check inbox for OTP email
4. Verify OTP code works

---

## Resend Free Tier Limits

✅ **100 emails per day**  
✅ **3,000 emails per month**  
✅ **Unlimited API keys**  
✅ **Email analytics**  
✅ **Webhook support**

This is more than enough for development and small production apps!

---

## Using Your Own Domain (Optional)

For production, you may want to use your own domain instead of `onboarding@resend.dev`:

1. In Resend dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `studentnetwork.com`)
4. Add the DNS records Resend provides
5. Wait for verification (usually a few minutes)
6. Update `EMAIL_FROM` to use your domain:
   ```env
   EMAIL_FROM=noreply@studentnetwork.com
   ```

---

## Troubleshooting

### Email not sending?

1. **Check API key**: Make sure it starts with `re_` and is correct
2. **Check environment variable**: Verify `EMAIL_SERVICE=resend` in Render
3. **Check logs**: Look for Resend API errors in Render logs
4. **Check Resend dashboard**: View sent emails and errors

### Emails going to spam?

1. Use Resend's test email (`onboarding@resend.dev`) for testing
2. For production, verify your own domain
3. Add SPF, DKIM, and DMARC records (Resend provides these)

### Rate limit exceeded?

- Free tier: 100/day, 3,000/month
- Upgrade to paid plan if needed
- Or use multiple API keys for different environments

---

## How It Works

### Local Development (Gmail)
```
Your App → Gmail SMTP (port 465) → Recipient
```
✅ Works locally  
❌ Blocked on Render

### Production (Resend)
```
Your App → Resend API (HTTPS) → Recipient
```
✅ Works locally  
✅ Works on Render

---

## Environment Variable Summary

### Local (.env)
```env
EMAIL_SERVICE=gmail
EMAIL_USER=adixxx.0x69@gmail.com
EMAIL_PASSWORD=ptfdgdgzcfjpemkn
```

### Render (Production)
```env
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev
```

---

## Next Steps

1. ✅ Sign up for Resend
2. ✅ Get API key
3. ✅ Add to Render environment variables
4. ✅ Deploy and test
5. ✅ (Optional) Verify your own domain

---

## Support

- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Resend Support**: [resend.com/support](https://resend.com/support)
- **API Reference**: [resend.com/docs/api-reference](https://resend.com/docs/api-reference)

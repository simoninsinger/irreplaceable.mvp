# API Setup Guide for Real Job Data

## 🚀 Quick Start - Get Thousands of Real Jobs

### 1. Adzuna API Setup (FREE - 1000 requests/month)

**Step 1: Get Free API Credentials**
1. Go to: https://developer.adzuna.com/signup  
2. Register for a free account
3. You'll receive:
   - `app_id` (your application ID)
   - `app_key` (your secret key)

**Step 2: Add to Environment Variables**
Add these to your Vercel environment variables or `.env.local`:

```env
ADZUNA_APP_ID=your_app_id_here
ADZUNA_APP_KEY=your_app_key_here
```

**Step 3: Deploy**
Once added, your site will start fetching real jobs from Adzuna's database of 3+ million jobs!

---

## 🔧 Advanced Job Sources (Optional)

### 2. JSearch API (RapidAPI) - Indeed, LinkedIn, Glassdoor
- **Free Tier**: 2500 requests/month
- **Setup**: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
- Add to env: `JSEARCH_API_KEY=your_key`

### 3. Jobs API by APILayer
- **Free Tier**: 1000 requests/month  
- **Setup**: https://apilayer.com/marketplace/jobs-api
- Add to env: `APILAYER_API_KEY=your_key`

### 4. TheWorlds API
- **Free Tier**: 500 requests/month
- **Setup**: https://rapidapi.com/worldapi/api/theworlds
- Add to env: `THEWORLDS_API_KEY=your_key`

---

## 🎯 Environment Variables Summary

Add these to Vercel → Settings → Environment Variables:

```env
# Required for real jobs
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

# Optional for more job sources
JSEARCH_API_KEY=your_jsearch_key
APILAYER_API_KEY=your_apilayer_key  
THEWORLDS_API_KEY=your_theworlds_key

# For job refresh automation
CRON_SECRET=your_random_secret_key

# Email notifications  
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
```

---

## ✅ Verification

1. **Check API Status**: Visit `/api/jobs` - you should see real job listings
2. **Monitor Usage**: Track API calls in your provider dashboards
3. **Test Filters**: Try searching for "nurse", "electrician", "teacher"

---

## 📊 Expected Results

With all APIs configured:
- **5,000+ jobs per day** from multiple sources
- **Real application links** to company websites
- **Live salary data** and job requirements
- **AI-resistance scoring** for each position
- **Automatic daily updates**

## 🔄 Refresh Schedule

Jobs automatically refresh:
- **Adzuna**: Every 6 hours (high-priority jobs)
- **Other APIs**: Every 12 hours
- **Cleanup old jobs**: Every 24 hours

Ready to get started? Sign up for Adzuna first - it's the fastest way to get real jobs live on your site!
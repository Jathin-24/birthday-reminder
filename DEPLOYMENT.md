# Birthday Reminder App - Deployment Guide

## 🎯 What You'll Deploy

A production-ready birthday reminder app with:
- ✅ User authentication
- ✅ Birthday management dashboard
- ✅ Automatic daily email reminders at 9 AM IST
- ✅ PostgreSQL database (Supabase - Free tier)
- ✅ Email via Gmail (Free)
- ✅ Hosting on Vercel (Free tier)

---

## 📋 Prerequisites

Before deploying, make sure you have:

1. **GitHub Account** - [Sign up here](https://github.com/signup)
2. **Vercel Account** - [Sign up here](https://vercel.com/signup)
3. **Supabase Account** - [Sign up here](https://supabase.com)
4. **Gmail Account** with App Password set up

---

## 🗄️ Step 1: Set Up Database (Supabase)

### 1.1 Create a New Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `birthday-reminder`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., Mumbai for India)
4. Click **"Create new project"** (takes ~2 minutes)

### 1.2 Get Your Database URL
1. In your project, go to **Settings** → **Database**
2. Scroll to **Connection String** → **URI**
3. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual database password
5. **Save this URL** - you'll need it for Vercel

### 1.3 Run Database Migration
1. Update your local `.env` with the Supabase URL:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.xxx.supabase.co:5432/postgres"
   ```

2. Run the migration:
   ```bash
   npx prisma migrate deploy
   ```

---

## 🐙 Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - Birthday Reminder App"
```

### 2.2 Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository:
   - **Name**: `birthday-reminder`
   - **Visibility**: Private (recommended)
   - **Don't** initialize with README
3. Click **"Create repository"**

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR-USERNAME/birthday-reminder.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 3: Deploy to Vercel

### 3.1 Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `birthday-reminder`
4. Click **"Import"**

### 3.2 Configure Environment Variables
Before deploying, add these environment variables:

Click **"Environment Variables"** and add:

| Name | Value | Where to get it |
|------|-------|----------------|
| `DATABASE_URL` | `postgresql://postgres:...` | From Supabase (Step 1.2) |
| `AUTH_SECRET` | Your secret from `.env` | Copy from local `.env` |
| `EMAIL_USER` | `rangammabheemavarapu@gmail.com` | Your Gmail |
| `EMAIL_PASS` | `pqhb rmdt zlto jglz` | Your Gmail App Password |
| `CRON_SECRET` | Your secret from `.env` | Copy from local `.env` |

### 3.3 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://birthday-reminder-xxx.vercel.app`

---

## ⏰ Step 4: Enable Cron Jobs (Automatic Reminders)

### 4.1 Verify Cron Configuration
The `vercel.json` file already configures daily reminders at **9:00 AM IST**.

### 4.2 Enable Cron on Vercel
1. Go to your project on Vercel
2. Click **"Settings"** → **"Cron Jobs"**
3. You should see:
   - **Path**: `/api/cron/daily-reminder`
   - **Schedule**: `30 3 * * *` (9 AM IST)
   - **Status**: Active ✅

**Note**: Vercel automatically authenticates cron jobs, so no secret needed!

---

## ✅ Step 5: Test Your Deployment

### 5.1 Test the Website
1. Visit your Vercel URL
2. Register a new account
3. Add a birthday
4. Verify it appears on the dashboard

### 5.2 Test Email Reminders
1. Add a birthday for tomorrow
2. Wait until 9 AM IST the next day
3. Check your email inbox

**Or test immediately:**
1. Add a birthday for TODAY
2. Manually trigger the cron:
   ```bash
   curl "https://your-app.vercel.app/api/cron/daily-reminder?secret=YOUR_CRON_SECRET"
   ```

---

## 🎨 Optional Enhancements

### 1. Custom Domain
1. Go to Vercel → **Settings** → **Domains**
2. Add your custom domain (e.g., `birthdays.yourdomain.com`)

### 2. Additional Reminder Options

**Option A: WhatsApp Reminders** (via Twilio)
- Free tier: 1,000 messages/month
- [Twilio WhatsApp Setup](https://www.twilio.com/docs/whatsapp)

**Option B: SMS Reminders** (via Twilio)
- Free trial credits
- [Twilio SMS Setup](https://www.twilio.com/docs/sms)

**Option C: Push Notifications** (via OneSignal)
- Free tier: 10,000 subscribers
- [OneSignal Setup](https://onesignal.com/)

### 3. Advanced Features
- **Recurring reminders**: 1 week before, 1 day before
- **Custom messages**: Let users write birthday wishes
- **Gift suggestions**: AI-powered gift ideas
- **Calendar sync**: Export to Google Calendar

---

## 🐛 Troubleshooting

### Emails Not Sending?
1. Check Gmail App Password is correct
2. Verify `EMAIL_USER` and `EMAIL_PASS` in Vercel env vars
3. Check Vercel logs: **Deployments** → **View Function Logs**

### Cron Not Running?
1. Verify `vercel.json` is in the root directory
2. Check **Settings** → **Cron Jobs** shows the job
3. Vercel cron requires a **Pro plan** for custom schedules (but daily is free!)

### Database Errors?
1. Verify `DATABASE_URL` is correct
2. Run migrations: `npx prisma migrate deploy`
3. Check Supabase dashboard for connection issues

---

## 📊 Monitoring

### View Logs
1. Go to Vercel Dashboard
2. Click your project → **Deployments**
3. Click latest deployment → **View Function Logs**
4. Filter by `/api/cron/daily-reminder` to see reminder logs

### Check Email Status
- Emails sent successfully will show in logs
- Failed emails will show error messages

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| **Vercel** | 100 GB bandwidth/month | $20/month (Pro) |
| **Supabase** | 500 MB database, 2 GB bandwidth | $25/month (Pro) |
| **Gmail** | Unlimited (personal use) | N/A |
| **Total** | **$0/month** | Optional upgrades |

---

## 🎉 You're Done!

Your birthday reminder app is now:
- ✅ Live on the internet
- ✅ Sending automatic daily reminders at 9 AM IST
- ✅ Completely free to run
- ✅ Scalable for thousands of users

**Next Steps:**
1. Share the URL with friends and family
2. Add your own birthdays
3. Enjoy never forgetting a birthday again! 🎂

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. View Vercel function logs
3. Check Supabase database connection
4. Verify all environment variables are set correctly

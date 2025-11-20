// Trigger the daily reminder API
// Run with: node scripts/trigger-reminder.js

const CRON_SECRET = process.env.CRON_SECRET || 'tn9c/X2Yhs8N08w6UJnCYQy3vyV3Wf9RwAoWjSVLPUg='
const API_URL = 'http://localhost:3000'

async function triggerReminder() {
    console.log('🔔 Triggering Daily Reminder API...\n')

    try {
        const url = `${API_URL}/api/cron/daily-reminder?secret=${encodeURIComponent(CRON_SECRET)}`
        console.log(`Calling: ${url}\n`)

        const response = await fetch(url)
        const data = await response.json()

        console.log('Status:', response.status)
        console.log('Response:', JSON.stringify(data, null, 2))

        if (response.ok) {
            console.log('\n✅ Success!')
            if (data.sent > 0) {
                console.log(`📧 Sent ${data.sent} reminder email(s)`)
            } else {
                console.log('ℹ️  No birthdays today, no emails sent')
            }
        } else {
            console.log('\n❌ Error:', data.error)
        }
    } catch (error) {
        console.error('❌ Failed to trigger reminder:', error.message)
        console.log('\n⚠️  Make sure your dev server is running: npm run dev')
    }
}

triggerReminder()

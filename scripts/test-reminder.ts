// Test the daily reminder endpoint
// Run with: npx tsx scripts/test-reminder.ts

const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-here'
const API_URL = process.env.API_URL || 'http://localhost:3000'

async function testReminder() {
    console.log('Testing daily reminder endpoint...\n')

    try {
        const response = await fetch(`${API_URL}/api/cron/daily-reminder?secret=${CRON_SECRET}`)
        const data = await response.json()

        console.log('Status:', response.status)
        console.log('Response:', JSON.stringify(data, null, 2))

        if (response.ok) {
            console.log('\n✅ Reminder check completed successfully!')
        } else {
            console.log('\n❌ Error:', data.error)
        }
    } catch (error) {
        console.error('❌ Failed to test reminder:', error)
    }
}

testReminder()

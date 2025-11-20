// Test email sending immediately with a birthday for TODAY
// Run with: npx tsx scripts/test-email-today.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testEmailToday() {
    console.log('📧 Testing Email for Birthday TODAY\n')
    console.log('='.repeat(50))

    try {
        // Get or create test user
        const testEmail = 'jathin.d.lalith.work@gmail.com'
        const testPassword = 'TestPassword123'

        let user = await prisma.user.findUnique({
            where: { email: testEmail }
        })

        if (!user) {
            const hashedPassword = await bcrypt.hash(testPassword, 10)
            user = await prisma.user.create({
                data: {
                    name: 'Jathin Test User',
                    email: testEmail,
                    password: hashedPassword,
                }
            })
            console.log(`✅ Created user: ${testEmail}`)
        } else {
            console.log(`✅ User exists: ${testEmail}`)
        }

        // Create birthday for TODAY
        const today = new Date()
        console.log(`\n📅 Creating birthday for TODAY: ${today.toLocaleDateString()}`)
        console.log(`   Month: ${today.getMonth() + 1}, Day: ${today.getDate()}`)

        // Check if birthday for today already exists
        const existingTodayBirthday = await prisma.birthday.findFirst({
            where: {
                userId: user.id,
                name: 'Test Person (Today)'
            }
        })

        let birthday
        if (existingTodayBirthday) {
            birthday = await prisma.birthday.update({
                where: { id: existingTodayBirthday.id },
                data: { date: today }
            })
            console.log(`✅ Updated existing birthday to today`)
        } else {
            birthday = await prisma.birthday.create({
                data: {
                    name: 'Test Person (Today)',
                    date: today,
                    userId: user.id,
                }
            })
            console.log(`✅ Created new birthday for today`)
        }

        // Check email configuration
        console.log('\n🔧 Checking email configuration...')
        const emailUser = process.env.EMAIL_USER
        const emailPass = process.env.EMAIL_PASS
        const cronSecret = process.env.CRON_SECRET

        console.log(`   EMAIL_USER: ${emailUser || '❌ NOT SET'}`)
        console.log(`   EMAIL_PASS: ${emailPass ? '✅ Set (hidden)' : '❌ NOT SET'}`)
        console.log(`   CRON_SECRET: ${cronSecret || '❌ NOT SET'}`)

        if (!emailUser || !emailPass) {
            console.log('\n❌ ERROR: Email credentials not configured!')
            console.log('\nTo send emails, add these to your .env file:')
            console.log('   EMAIL_USER=your-gmail@gmail.com')
            console.log('   EMAIL_PASS=your-16-char-app-password')
            console.log('\nTo get a Gmail App Password:')
            console.log('   1. Go to https://myaccount.google.com/security')
            console.log('   2. Enable 2-Step Verification')
            console.log('   3. Go to App Passwords')
            console.log('   4. Generate a new app password for "Mail"')
            console.log('   5. Copy the 16-character password to .env')
            await prisma.$disconnect()
            return
        }

        // Now trigger the reminder API
        console.log('\n🚀 Triggering reminder API...')
        console.log('\nMake sure your dev server is running (npm run dev)')
        console.log('Then run this command in another terminal:\n')
        console.log(`   curl "http://localhost:3000/api/cron/daily-reminder?secret=${cronSecret}"\n`)
        console.log('Or visit this URL in your browser:')
        console.log(`   http://localhost:3000/api/cron/daily-reminder?secret=${cronSecret}`)

        console.log('\n' + '='.repeat(50))
        console.log('✅ Setup complete! Birthday for TODAY has been created.')
        console.log(`📧 Email should be sent to: ${testEmail}`)
        console.log('\nNow trigger the API endpoint to send the email!')

    } catch (error) {
        console.error('\n❌ Test failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testEmailToday()

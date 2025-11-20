// Comprehensive test for the birthday reminder system
// Run with: npx tsx scripts/test-full-system.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testFullSystem() {
    console.log('🎂 Birthday Reminder System - Full Test\n')
    console.log('='.repeat(50))

    try {
        // Step 1: Create test user
        console.log('\n📝 Step 1: Creating test user...')
        const testEmail = 'jathin.d.lalith.work@gmail.com'
        const testPassword = 'TestPassword123'

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email: testEmail }
        })

        if (user) {
            console.log(`✅ User already exists: ${testEmail}`)
        } else {
            const hashedPassword = await bcrypt.hash(testPassword, 10)
            user = await prisma.user.create({
                data: {
                    name: 'Jathin Test User',
                    email: testEmail,
                    password: hashedPassword,
                }
            })
            console.log(`✅ Created new user: ${testEmail}`)
            console.log(`   Password: ${testPassword}`)
        }

        // Step 2: Create birthday for tomorrow
        console.log('\n🎈 Step 2: Creating birthday for tomorrow...')
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Check if birthday already exists
        const existingBirthday = await prisma.birthday.findFirst({
            where: {
                userId: user.id,
                name: 'Test Person'
            }
        })

        let birthday
        if (existingBirthday) {
            // Update existing birthday to tomorrow
            birthday = await prisma.birthday.update({
                where: { id: existingBirthday.id },
                data: { date: tomorrow }
            })
            console.log(`✅ Updated existing birthday to tomorrow`)
        } else {
            birthday = await prisma.birthday.create({
                data: {
                    name: 'Test Person',
                    date: tomorrow,
                    userId: user.id,
                }
            })
            console.log(`✅ Created new birthday for tomorrow`)
        }

        console.log(`   Name: ${birthday.name}`)
        console.log(`   Date: ${tomorrow.toLocaleDateString()}`)
        console.log(`   Month: ${tomorrow.getMonth() + 1}, Day: ${tomorrow.getDate()}`)

        // Step 3: Check current birthdays
        console.log('\n📅 Step 3: Checking birthdays in database...')
        const allBirthdays = await prisma.birthday.findMany({
            where: { userId: user.id },
            include: { user: true }
        })

        console.log(`   Total birthdays for user: ${allBirthdays.length}`)
        allBirthdays.forEach((b, i) => {
            const date = new Date(b.date)
            console.log(`   ${i + 1}. ${b.name} - ${date.toLocaleDateString()}`)
        })

        // Step 4: Test reminder logic (simulate tomorrow)
        console.log('\n🔔 Step 4: Testing reminder logic...')
        const tomorrowMonth = tomorrow.getMonth() + 1
        const tomorrowDay = tomorrow.getDate()

        const birthdaysToRemind = await prisma.birthday.findMany({
            include: {
                user: true
            }
        })

        const matchingBirthdays = birthdaysToRemind.filter(b => {
            const birthDate = new Date(b.date)
            return birthDate.getMonth() + 1 === tomorrowMonth &&
                birthDate.getDate() === tomorrowDay
        })

        console.log(`   Birthdays matching tomorrow (${tomorrowMonth}/${tomorrowDay}): ${matchingBirthdays.length}`)

        if (matchingBirthdays.length > 0) {
            console.log('   ✅ Birthday found for tomorrow!')
            matchingBirthdays.forEach(b => {
                console.log(`      - ${b.name} for user ${b.user.email}`)
            })
        } else {
            console.log('   ⚠️  No birthdays found for tomorrow')
        }

        // Step 5: Test email configuration
        console.log('\n📧 Step 5: Checking email configuration...')
        const emailUser = process.env.EMAIL_USER
        const emailPass = process.env.EMAIL_PASS
        const cronSecret = process.env.CRON_SECRET

        console.log(`   EMAIL_USER: ${emailUser ? '✅ Set' : '❌ Not set'}`)
        console.log(`   EMAIL_PASS: ${emailPass ? '✅ Set' : '❌ Not set'}`)
        console.log(`   CRON_SECRET: ${cronSecret ? '✅ Set' : '❌ Not set'}`)

        if (!emailUser || !emailPass) {
            console.log('\n⚠️  WARNING: Email credentials not configured!')
            console.log('   Set EMAIL_USER and EMAIL_PASS in .env to send emails')
        }

        // Step 6: Instructions for manual testing
        console.log('\n🧪 Step 6: Manual Testing Instructions')
        console.log('='.repeat(50))
        console.log('\nTo test the reminder API endpoint, run:')
        console.log(`\n   curl "http://localhost:3000/api/cron/daily-reminder?secret=${cronSecret || 'YOUR_SECRET'}"`)
        console.log('\nOr use the test script:')
        console.log('   npx tsx scripts/test-reminder.ts')
        console.log('\nTo test in the browser:')
        console.log('   1. Start dev server: npm run dev')
        console.log('   2. Login with:')
        console.log(`      Email: ${testEmail}`)
        console.log(`      Password: ${testPassword}`)
        console.log('   3. View the birthday on the dashboard')
        console.log('\n' + '='.repeat(50))

        console.log('\n✅ Full system test completed successfully!')

    } catch (error) {
        console.error('\n❌ Test failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testFullSystem()

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

export async function GET(request: Request) {
    // Get secret from query parameter
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1 // JS months are 0-indexed

    try {
        // Fetch all birthdays and filter in memory
        const birthdays = await prisma.birthday.findMany({
            include: {
                user: true
            }
        })

        const todaysBirthdays = birthdays.filter(b => {
            const bDate = new Date(b.date)
            return bDate.getDate() === day && (bDate.getMonth() + 1) === month
        })

        if (todaysBirthdays.length === 0) {
            return NextResponse.json({ message: "No birthdays today" })
        }

        // Configure Nodemailer Transporter (Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send emails in parallel
        const emailPromises = todaysBirthdays.map(async (birthday) => {
            if (!birthday.user.email) return

            try {
                await transporter.sendMail({
                    from: `"Birthday Reminder" <${process.env.EMAIL_USER}>`,
                    to: birthday.user.email,
                    subject: `It's ${birthday.name}'s Birthday! 🎂`,
                    html: `
                  <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                    <h1>🎉 Happy Birthday ${birthday.name}! 🎂</h1>
                    <p style="font-size: 16px;">This is your friendly reminder to wish <strong>${birthday.name}</strong> a wonderful day!</p>
                    <p style="color: #888; font-size: 12px; margin-top: 20px;">Sent by Birthday Reminder App</p>
                  </div>
                `
                })
            } catch (error) {
                console.error(`Failed to send email to ${birthday.user.email}`, error)
            }
        })

        await Promise.all(emailPromises)

        return NextResponse.json({
            message: `Processed ${todaysBirthdays.length} birthdays`,
            sent: todaysBirthdays.length,
            birthdays: todaysBirthdays.map(b => b.name)
        })

    } catch (error) {
        console.error("Reminder Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

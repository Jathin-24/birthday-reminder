import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AddBirthdayButton } from "@/components/add-birthday-button"
import { BirthdayList } from "@/components/birthday-list"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const birthdays = await prisma.birthday.findMany({
        where: { userId: session.user.id },
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your birthdays and reminders.</p>
                </div>
                <AddBirthdayButton />
            </div>
            <BirthdayList birthdays={birthdays} />
        </div>
    )
}

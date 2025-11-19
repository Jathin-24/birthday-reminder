import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, differenceInDays, setYear, isBefore, addYears, startOfDay } from "date-fns"

type Birthday = {
    id: string
    name: string
    date: Date
}

export function BirthdayList({ birthdays }: { birthdays: Birthday[] }) {
    const getDaysUntil = (date: Date) => {
        const today = startOfDay(new Date())
        const birthdayDate = startOfDay(new Date(date))
        let nextBirthday = setYear(birthdayDate, today.getFullYear())

        if (isBefore(nextBirthday, today)) {
            nextBirthday = addYears(nextBirthday, 1)
        }
        return differenceInDays(nextBirthday, today)
    }

    const sortedBirthdays = [...birthdays].sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date))

    if (birthdays.length === 0) {
        return (
            <div className="text-center p-10 text-gray-500">
                No birthdays added yet. Click the button above to add one!
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedBirthdays.map((birthday) => {
                const days = getDaysUntil(birthday.date)
                return (
                    <Card key={birthday.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">
                                {birthday.name}
                            </CardTitle>
                            <span className={`text-2xl font-bold ${days === 0 ? 'text-pink-500 animate-bounce' : ''}`}>
                                {days === 0 ? "🎉 Today!" : `${days} days`}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                Born: {format(birthday.date, "MMMM do, yyyy")}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

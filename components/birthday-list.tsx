'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, differenceInDays, setYear, isBefore, addYears, startOfDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar as CalendarIcon } from "lucide-react"
import { deleteBirthday } from "@/app/actions/birthday"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type Birthday = {
    id: string
    name: string
    date: Date
}

export function BirthdayList({ birthdays }: { birthdays: Birthday[] }) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

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

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        await deleteBirthday(id)
        setDeletingId(null)
    }

    const getCountdownText = (days: number) => {
        if (days === 0) return "Today! 🎂"
        if (days === 1) return "Tomorrow! 🎁"
        return `In ${days} days`
    }

    const getUrgencyColor = (days: number) => {
        if (days === 0) return "bg-gradient-to-br from-secondary to-primary text-primary-foreground"
        if (days === 1) return "bg-gradient-to-br from-primary to-accent text-primary-foreground"
        if (days <= 7) return "bg-card text-card-foreground border-l-4 border-l-accent"
        return "bg-card text-card-foreground"
    }

    if (birthdays.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-10 flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl bg-gray-50/50 dark:bg-gray-900/50"
            >
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold text-lg">No birthdays yet</h3>
                    <p className="text-muted-foreground">Add your first birthday to get started!</p>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
                {sortedBirthdays.map((birthday, index) => {
                    const days = getDaysUntil(birthday.date)
                    const isUrgent = days <= 1

                    return (
                        <motion.div
                            layout
                            key={birthday.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                            <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${getUrgencyColor(days)}`}>
                                {/* Decorative background elements for urgent cards */}
                                {isUrgent && (
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl transform rotate-12"></div>
                                )}

                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative z-10">
                                    <div className="space-y-1">
                                        <CardTitle className={`text-xl font-bold ${isUrgent ? 'text-primary-foreground' : 'text-card-foreground'}`}>
                                            {birthday.name}
                                        </CardTitle>
                                        <p className={`text-sm font-medium ${isUrgent ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                            {format(birthday.date, "MMMM do")}
                                        </p>
                                    </div>
                                    <div className={`flex flex-col items-end ${isUrgent ? 'text-primary-foreground' : ''}`}>
                                        <span className="text-lg font-black tracking-tight">
                                            {getCountdownText(days)}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="relative z-10 pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${isUrgent ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                                            }`}>
                                            Turning {new Date().getFullYear() - new Date(birthday.date).getFullYear() + (days === 0 ? 0 : 1)}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-8 w-8 transition-opacity ${isUrgent
                                                ? 'text-white/70 hover:text-white hover:bg-white/20'
                                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                                                }`}
                                            onClick={() => handleDelete(birthday.id)}
                                            disabled={deletingId === birthday.id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}

'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addBirthday } from "@/app/actions/birthday"
import { useState, useEffect, useActionState } from "react"
import { Plus } from "lucide-react"

export function AddBirthdayButton() {
    const [open, setOpen] = useState(false)
    const [state, dispatch] = useActionState(addBirthday, null)
    const [month, setMonth] = useState<string>("")
    const [day, setDay] = useState<string>("")
    const [year, setYear] = useState<string>("")

    useEffect(() => {
        if (state?.message === 'Success') {
            setOpen(false)
            setMonth("")
            setDay("")
            setYear("")
        }
    }, [state])

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)

    const daysInMonth = month ? new Date(parseInt(year || currentYear.toString()), parseInt(month), 0).getDate() : 31
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const getDateString = () => {
        if (!month || !day || !year) return ""
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        return date.toISOString()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md cursor-pointer border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all">
                    <Plus className="h-4 w-4" /> Add Birthday
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Birthday</DialogTitle>
                    <DialogDescription>
                        Add a new birthday to your list. We'll remind you when it's close!
                    </DialogDescription>
                </DialogHeader>
                <form action={dispatch}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" name="name" className="col-span-3" placeholder="e.g. Mom" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Birthday
                            </Label>
                            <div className="col-span-3 flex gap-2">
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background cursor-pointer  transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                                    required
                                >
                                    <option value="">Month</option>
                                    {months.map((m, i) => (
                                        <option key={i} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                                <select
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    className="w-20 px-3 py-2 text-sm border border-input rounded-md bg-background cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                                    required
                                >
                                    <option value="">Day</option>
                                    {days.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-24 px-3 py-2 text-sm border border-input rounded-md bg-background cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                                    required
                                >
                                    <option value="">Year</option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            <input type="hidden" name="date" value={getDateString()} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!month || !day || !year} className="cursor-pointer">
                            Save Birthday
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

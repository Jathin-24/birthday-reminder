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
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function AddBirthdayButton() {
    const [open, setOpen] = useState(false)
    const [state, dispatch] = useActionState(addBirthday, null)
    const [date, setDate] = useState<Date>()

    useEffect(() => {
        if (state?.message === 'Success') {
            setOpen(false)
            setDate(undefined) // Reset date after success
        }
    }, [state])

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
                                Date
                            </Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal cursor-pointer",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {/* Hidden input to pass the date to the server action */}
                                <input type="hidden" name="date" value={date ? date.toISOString() : ''} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!date} className="cursor-pointer">Save Birthday</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

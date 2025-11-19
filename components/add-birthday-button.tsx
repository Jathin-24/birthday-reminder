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
import { useActionState } from "react"
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"

export function AddBirthdayButton() {
    const [open, setOpen] = useState(false)
    const [state, dispatch] = useActionState(addBirthday, null)

    useEffect(() => {
        if (state?.message === 'Success') {
            setOpen(false)
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="h-4 w-4" /> Add Birthday</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Birthday</DialogTitle>
                    <DialogDescription>
                        Add a new birthday to your list.
                    </DialogDescription>
                </DialogHeader>
                <form action={dispatch}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <Input id="date" name="date" type="date" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

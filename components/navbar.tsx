import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"

export default function Navbar() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-white px-6 dark:bg-gray-950 lg:h-[60px]">
            <Link className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent" href="/dashboard">
                <span>Birthday Reminder</span>
            </Link>
            <div className="ml-auto flex items-center gap-4">
                <form action={async () => {
                    'use server';
                    await signOut({ redirectTo: "/login" });
                }}>
                    <Button variant="ghost" size="sm">Sign Out</Button>
                </form>
            </div>
        </header>
    )
}

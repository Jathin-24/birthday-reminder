'use client'

import { useActionState } from 'react'
import { register } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RegisterPage() {
    const [state, dispatch] = useActionState(register, undefined)
    const router = useRouter()

    useEffect(() => {
        if (state === 'Success') {
            router.push('/login')
        }
    }, [state, router])

    return (
        <Card className="w-[350px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>Enter your information to get started.</CardDescription>
            </CardHeader>
            <form action={dispatch}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required minLength={6} />
                    </div>
                    {state && state !== 'Success' && (
                        <p className="text-sm text-red-500">{state}</p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full">Sign Up</Button>
                    <p className="text-sm text-center text-gray-500">
                        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}

'use server'

import { signIn } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AuthError } from 'next-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const RegisterSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
})

export async function register(prevState: string | undefined, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        return 'Invalid fields'
    }

    const { email, password, name } = validatedFields.data

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return 'User already exists'

        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })
    } catch (error) {
        return 'Failed to create user'
    }

    return 'Success'
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/dashboard',
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}

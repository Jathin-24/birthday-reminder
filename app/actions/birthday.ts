'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const BirthdaySchema = z.object({
    name: z.string().min(1),
    date: z.string().transform((str) => new Date(str)),
})

export async function addBirthday(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { message: "Unauthorized" }

    const validatedFields = BirthdaySchema.safeParse({
        name: formData.get('name'),
        date: formData.get('date'),
    })

    if (!validatedFields.success) {
        return { message: "Invalid fields" }
    }

    try {
        await prisma.birthday.create({
            data: {
                name: validatedFields.data.name,
                date: validatedFields.data.date,
                userId: session.user.id,
            },
        })
        revalidatePath('/dashboard')
        return { message: "Success" }
    } catch (e) {
        return { message: "Database Error" }
    }
}

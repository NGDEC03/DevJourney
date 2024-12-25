import { PrismaClient } from '@prisma/client'
import generateUsername from '@/utils/generateDetails'
import generateHashedPassword from '@/utils/generateDetails'
export default async function RegisterUser(email: string, password: string) {
    const prisma = new PrismaClient()
    const username = generateUsername(email)
    const hashedPassword = generateHashedPassword(password)
    const user = await prisma.user.findUnique({
        where: {
            Email: email
        }
    })
    if (user) throw new Error("User Exists!!")

    const newUser = await prisma.user.create({
        data: {
            UserName: username,
            Email: email,
            Password: hashedPassword,

        }
    })
    if (!newUser) throw new Error("User can not be created")


    return newUser

}
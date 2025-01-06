import { PrismaClient } from '@prisma/client'
import generateUsername from '@/utils/generateUsername'
import {generateHashedPassword} from '@/utils/generateHash'
interface registerProps{
    Email: string, 
    password: string,
    selectedTags:string[],
    Name:string
}
export async function RegisterUser({Email,password,selectedTags,Name}:registerProps) {
    try {
        const userName = generateUsername(Email)
        const hashed_pass=await generateHashedPassword(password) 
        console.log(userName,hashed_pass,Name);
        
        if(!userName || !hashed_pass)return new Error("Credentials Error!!") 
        const prisma = new PrismaClient()
        const user = await prisma.user.create({
            data: {
                userName,
                Email,
                Name,
                password:hashed_pass,
                tags:selectedTags
            }
        })
        return user

    }
    catch (err) {
return new Error(err as string)


    }

}
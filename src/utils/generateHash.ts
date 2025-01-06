import bcrypt from 'bcrypt'
export async function generateHashedPassword(password: string) {
    try {
       const saltRounds = 10
       const hashedPassword = await bcrypt.hash(password, saltRounds)

       
       return hashedPassword
    }
    catch (err) {
       console.error(err);
 
    }
 }
 
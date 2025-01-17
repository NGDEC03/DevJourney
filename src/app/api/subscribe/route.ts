import { sendMail } from "@/utils/sendMail";
import { NextRequest,NextResponse } from "next/server";
export async function POST(req:NextRequest){
  // console.log(await req.json());
  
    const {email}=await req.json()
    
          try {
            await sendMail({
              text: `New subscription for Learning Paths from ${email}`,
              subject: "New Learning Paths Subscription",
              recipient: email,
              html: `
                <h1>Thank you for your interest in Learning Paths!</h1>
                <p>We'll notify you as soon as our Learning Paths are available.</p>
                <p>Your registered email: ${email}</p>
              `
            })
           
           return NextResponse.json({message:"sucess"}) 
          } catch (error) {
            console.error('Failed to send email', error)
          return NextResponse.json({message:error})
          }
        }
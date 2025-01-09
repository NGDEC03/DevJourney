import { NextRequest,NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary'
cloudinary.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
export async function POST(req:NextRequest){
    const {base64}=await req.json()
   const response=await cloudinary.uploader.upload(base64)
   return NextResponse.json(response,{status:201})
    
}
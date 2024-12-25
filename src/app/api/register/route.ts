import {NextResponse,NextRequest} from 'next/server'
import RegisterUser from '@/utils/registerHandle'
async function GET(res:NextResponse){

  return NextResponse.json({message:"Succesfull call"})
}

async function POST(req:NextRequest){
    const body=await req.json()
    const {email,password}=body
    try{
        RegisterUser(email,password)
    }
    catch(err){
      return NextResponse.json({message:err})
    }
    
}
export default {GET,POST}
import {NextResponse,NextRequest} from 'next/server'
import {RegisterUser} from './registerHandle'
async function GET(res:NextResponse){

  return NextResponse.json({message:"Succesfull call"})
}

export async function POST(req:NextRequest){
    const body=await req.json()
    const {Email,password,selectedTags,Name}=body
    try{
      console.log(Name,Email,password,selectedTags);
      
       const user=await RegisterUser({Email,password,selectedTags,Name}) 
       console.log(user);
       
        return NextResponse.json(user)
    }
    catch(err){
      return NextResponse.json({message:err})
    }
    
}
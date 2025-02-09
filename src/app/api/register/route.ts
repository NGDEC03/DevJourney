import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { sendMail } from '@/utils/sendMail';

const prisma = new PrismaClient();

interface RegisterInput {
  Email: string;
  password: string;
  selectedTags: string[];
  Name: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Email, password, selectedTags, Name }: RegisterInput = body;

    // Validate inputs
    if (!Email || !password || !Name) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate username
    if (!Email.includes('@')) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: Email
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    };

    let userName = Email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
    userName = userName.slice(0, 15).toLowerCase();

    const hashed_pass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userName,
        email: Email,
        name: Name,
        password: hashed_pass,
        tags: selectedTags || [],
      },
    });
    const link=`https://dev-journey-alpha.vercel.app/verify?token=${100+Math.random()*(1000-100)}&user=${encodeURIComponent(userName)}`

    await sendMail({
      text:`Hello ${userName}, click this link to verify your account: ${link}`,
      subject:"One Last Step! Verify Your Email & Unlock Full Access to Our Platform",
      recipient:Email,
      html:`<div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
      <h2 style="color: #333;">Hello, ${userName} 👋</h2>
      <p>You're almost there! Click the button below to verify your account.</p>
      <a href="${link}" 
         style="display: inline-block; background: #007bff; color: #fff; padding: 10px 20px; 
                font-size: 16px; text-decoration: none; border-radius: 5px;">
          Verify Your Account
      </a>
      <p style="margin-top: 20px; font-size: 14px; color: #777;">Or copy this link:</p>
      <p style="word-break: break-all; font-size: 14px; color: #007bff;">${link}</p>
      <br/>
      <p style="color: #777; font-size: 12px;">If you didn't request this, please ignore this email.</p>
  </div>`
    })

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        userName: user.userName,
        email: user.email,
        name: user.email
      }
    }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error(errorMessage);
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
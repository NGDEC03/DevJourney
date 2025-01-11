import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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
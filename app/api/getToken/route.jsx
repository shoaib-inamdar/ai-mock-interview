import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

const assemblyAI = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY});

export async function GET(req) {

    const token = await assemblyAI.streaming.createTemporaryToken({
        expires_in_seconds: 600});
    
    return NextResponse.json(token);
}

// exprires in -> exprires_in_seconds
//realtime -> streaming


/*
export async function GET() {
  const response = await fetch("https://streaming.assemblyai.com/v3/token?expires_in_seconds=600", {
    method: "GET",
    headers: {
      "Authorization": process.env.ASSEMBLY_API_KEY,
    },
  });


  const body = await response.json();
  return body.token;

  const tokenOnly = { token: body.token };

  // ✅ Return only token
  return NextResponse.json(tokenOnly);

  //return NextResponse.json({ token: body.token });

  //return NextResponse.json(body);
}*/

import { prisma } from "@/src/app/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    const result = await prisma.tarefa.findMany();
    return NextResponse.json(result);
}

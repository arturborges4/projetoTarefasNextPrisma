import { prisma } from "@/src/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tarefa = await prisma.tarefa.update({
      where: { id: Number(params.id) },
      data: { concluida: true },
    });

    return NextResponse.json(tarefa, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao concluir tarefa", error }, { status: 500 });
  }
}

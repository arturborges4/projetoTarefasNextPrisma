import { prisma } from "@/src/app/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { conteudo, usuarioId } = await req.json();

    if (!conteudo || !usuarioId) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const tarefa = await prisma.tarefa.create({
      data: { conteudo, concluida: false, usuario_id: usuarioId },
    });

    return NextResponse.json(tarefa, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return NextResponse.json({ error: "Erro ao criar tarefa" }, { status: 500 });
  }
}

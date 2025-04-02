import { prisma } from "@/src/app/lib/prisma";
import { NextResponse } from "next/server";


export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.tarefa.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Tarefa deletada" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    return NextResponse.json({ error: "Erro ao excluir tarefa" }, { status: 500 });
  }
}
   
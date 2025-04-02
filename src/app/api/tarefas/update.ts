import { prisma } from "../../lib/prisma";


export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { id, concluida } = req.body;

    try {
      const tarefa = await prisma.tarefa.update({
        where: { id: Number(id) },
        data: { concluida },
      });

      return res.status(200).json(tarefa);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar a tarefa" });
    }
  }

  return res.status(405).json({ error: "Método não permitido" });
}

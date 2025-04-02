"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchTarefas = async () => {
    try {
      const response = await fetch("/api/tarefas");
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error("Erro ao buscar as tarefas:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchTarefas();
    }
  }, [status]);

  const criarTarefa = async () => {
    const conteudo = prompt("Digite o conteúdo da nova tarefa:");
    if (!conteudo) return;

    try {
      const response = await fetch("/api/tarefas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conteudo, usuarioId: session?.user?.id }),
      });

      if (response.ok) {
        fetchTarefas(); // Atualiza a lista de tarefas
      } else {
        console.error("Erro ao criar tarefa");
      }
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const excluirTarefa = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      const response = await fetch(`/api/tarefas/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchTarefas(); // Atualiza a lista de tarefas
      } else {
        console.error("Erro ao excluir tarefa");
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };
  const concluirTarefa = async (id) => {
    try {
      const response = await fetch(`/api/tarefas/${id}/concluir`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        fetchTarefas();
      } else {
        console.error("Erro ao concluir tarefa");
      }
    } catch (error) {
      console.error("Erro ao concluir tarefa:", error);
    }
  };

  if (status === "loading") {
    return <p className="text-center text-gray-600">Carregando...</p>;
  }

  const userImage = session?.user?.image || "/default-profile.jpg";

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <img
          src={userImage}
          alt="User Profile"
          className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300"
        />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Bem-vindo, {session?.user?.name}
        </h1>
        <p className="text-gray-600">{session?.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Sair
        </button>

        <h1 className="mt-4 text-xl font-bold text-gray-900">Tarefas do usuário</h1>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={criarTarefa}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Criar nova tarefa
          </button>
        </div>
      </div>

      <div className="max-w-3xl w-full mx-auto p-6 mt-8">
        <h1 className="text-2xl font-semibold text-center text-blue-600 mb-4">
          Lista de Tarefas
        </h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Conteúdo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Concluída</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Criação</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tarefas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-600">
                    Nenhuma tarefa encontrada.
                  </td>
                </tr>
              ) : (
                tarefas.map((tarefa) => (
                  <tr key={tarefa.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-sm text-gray-800">{tarefa.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{tarefa.conteudo}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {tarefa.concluida ? "✔" : "❌"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {new Date(tarefa.dt_criacao).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <button
                        onClick={() => excluirTarefa(tarefa.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition"
                      >
                        Excluir
                      </button>
                      <button
                        onClick={() => concluirTarefa(tarefa.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg transition ml-2"
                      >
                        Concluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

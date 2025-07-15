"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ItemEstoque = {
  id?: number;
  nome: string;
  tipo: "materia_prima" | "produto_intermediario" | "item_apoio";
  componentes?: string;
};

export default function Home() {
  const [materiasPrimas, setMateriasPrimas] = useState<ItemEstoque[]>([]);
  const [produtosIntermediarios, setProdutosIntermediarios] = useState<ItemEstoque[]>([]);
  const [itensApoio, setItensApoio] = useState<ItemEstoque[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [novoItem, setNovoItem] = useState<ItemEstoque>({
    nome: "",
    tipo: "materia_prima",
    componentes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, error } = await supabase.from("itens_estoque").select("*");
    if (error) {
      console.error("Erro ao carregar:", error);
      return;
    }

    const mp = data.filter(i => i.tipo === "materia_prima");
    const pi = data.filter(i => i.tipo === "produto_intermediario");
    const ia = data.filter(i => i.tipo === "item_apoio");

    setMateriasPrimas(mp);
    setProdutosIntermediarios(pi);
    setItensApoio(ia);
    setCarregando(false);
  }

  async function adicionarItem() {
    if (!novoItem.nome.trim()) return alert("Digite um nome válido!");

    const { error } = await supabase.from("itens_estoque").insert([novoItem]);
    if (error) {
      alert("Erro ao adicionar: " + error.message);
      return;
    }

    setNovoItem({ nome: "", tipo: "materia_prima", componentes: "" });
    fetchData();
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">🍰 Estoque da Doceria</h1>

      {/* Formulário de novo item */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-2xl font-semibold mb-4">Novo Item</h2>
        <div className="flex flex-col md:flex-row gap-2 mb-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Nome do item"
            value={novoItem.nome}
            onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })}
          />
          <select
            className="border p-2 rounded w-full"
            value={novoItem.tipo}
            onChange={e => setNovoItem({ ...novoItem, tipo: e.target.value as any })}
          >
            <option value="materia_prima">Matéria-Prima</option>
            <option value="produto_intermediario">Produto Intermediário</option>
            <option value="item_apoio">Item de Apoio</option>
          </select>
          <input
            className="border p-2 rounded w-full"
            placeholder="Componentes (opcional)"
            value={novoItem.componentes}
            onChange={e => setNovoItem({ ...novoItem, componentes: e.target.value })}
          />
        </div>
        <button
          onClick={adicionarItem}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ➕ Adicionar
        </button>
      </div>

      {/* Exibição das listas */}
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📦 Matérias-Primas</h2>
            <ul className="list-disc pl-6">
              {materiasPrimas.map(item => (
                <li key={item.id}>{item.nome}</li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">🍫 Produtos Intermediários</h2>
            <ul className="list-disc pl-6">
              {produtosIntermediarios.map(item => (
                <li key={item.id}>{item.nome}</li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">🎁 Itens de Apoio</h2>
            <ul className="list-disc pl-6">
              {itensApoio.map(item => (
                <li key={item.id}>{item.nome}</li>
              ))}
            </ul>
          </section>
        </>
      )}
return (
  <main>
    {/* ... resto do conteúdo */}
  </main>
);

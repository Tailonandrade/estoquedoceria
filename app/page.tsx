"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ItemEstoque = {
  id?: string;
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
    const { data } = await supabase.from("itens_estoque").select("*");
    const mp = data?.filter(i => i.tipo === "materia_prima") || [];
    const pi = data?.filter(i => i.tipo === "produto_intermediario") || [];
    const ia = data?.filter(i => i.tipo === "item_apoio") || [];

    setMateriasPrimas(mp);
    setProdutosIntermediarios(pi);
    setItensApoio(ia);
    setCarregando(false);
  }

  async function adicionarItem() {
    const { error } = await supabase.from("itens_estoque").insert([novoItem]);
    if (!error) {
      setNovoItem({ nome: "", tipo: "materia_prima", componentes: "" });
      fetchData(); // atualiza a lista
    } else {
      alert("Erro ao adicionar item");
    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Estoque da Doceria</h1>

      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Novo Item</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Nome do item"
          value={novoItem.nome}
          onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })}
        />
        <select
          className="border p-2 w-full mb-2"
          value={novoItem.tipo}
          onChange={e => setNovoItem({ ...novoItem, tipo: e.target.value as any })}
        >
          <option value="materia_prima">Matéria-Prima</option>
          <option value="produto_intermediario">Produto Intermediário</option>
          <option value="item_apoio">Item de Apoio</option>
        </select>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Componentes (se houver)"
          value={novoItem.componentes}
          onChange={e => setNovoItem({ ...novoItem, componentes: e.target.value })}
        />
        <button
          onClick={adicionarItem}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Adicionar
        </button>
      </div>

      {carregando ? (
        <p>Carregando estoque...</p>
      ) : (
        <>
          <section className="mb-4">
            <h2 className="text-xl font-semibold">Matérias-Primas</h2>
            <ul className="list-disc pl-5">
              {materiasPrimas.map((item) => (
                <li key={item.id}>{item.nome}</li>
              ))}
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold">Produtos Intermediários</h2>
            <ul className="list-disc pl-5">
              {produtosIntermediarios.map((item) => (
                <li key={item.id}>{item.nome}</li>
              ))}
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold">Itens de Apoio</h2>
            <ul className="list-disc pl-5">
              {itensApoio.map((item) => (
                <li key={item.id}>{item.nome}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}


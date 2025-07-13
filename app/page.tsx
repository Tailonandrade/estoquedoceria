"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ItemEstoque = {
  id: string;
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
    id: "",
    nome: "",
    tipo: "materia_prima",
    componentes: "",
  });

  useEffect(() => {
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
    fetchData();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Estoque da Doceria</h1>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <section>
            <h2>Matérias-Primas</h2>
            <ul>{materiasPrimas.map(i => <li key={i.id}>{i.nome}</li>)}</ul>
          </section>
          <section>
            <h2>Produtos Intermediários</h2>
            <ul>{produtosIntermediarios.map(i => <li key={i.id}>{i.nome}</li>)}</ul>
          </section>
          <section>
            <h2>Itens de Apoio</h2>
            <ul>{itensApoio.map(i => <li key={i.id}>{i.nome}</li>)}</ul>
          </section>
        </>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ✅ Tipagem dos itens
type ItemEstoque = {
  id: string;
  nome: string;
  tipo: "materia_prima" | "produto_intermediario" | "item_apoio";
  ingredientes?: string[];
};

export default function Home() {
  const [materiasPrimas, setMateriasPrimas] = useState<ItemEstoque[]>([]);
  const [produtosIntermediarios, setProdutosIntermediarios] = useState<ItemEstoque[]>([]);
  const [itensApoio, setItensApoio] = useState<ItemEstoque[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novoItem, setNovoItem] = useState({
    nome: "",
    tipo: "materia_prima",
    componentes: "",
  });

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("estoque").select("*");

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
            <h2 className="text-xl font-semibold">Matérias-Primas</h2>
            <ul>
              {materiasPrimas.map((item) => (
                <li key={item.id}>{item.nome}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-4">Produtos Intermediários</h2>
            <ul>
              {produtosIntermediarios.map((item) => (
                <li key={item.id}>{item.nome}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-4">Itens de Apoio</h2>
            <ul>
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

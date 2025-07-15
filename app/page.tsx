'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

type ItemEstoque = {
  id?: number;
  nome: string;
  tipo: string;
  quantidade?: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('materia_prima');
  const [quantidade, setQuantidade] = useState(0);
  const [materiasPrimas, setMateriasPrimas] = useState<ItemEstoque[]>([]);
  const [produtosIntermediarios, setProdutosIntermediarios] = useState<ItemEstoque[]>([]);
  const [itensApoio, setItensApoio] = useState<ItemEstoque[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarItens();
  }, []);

  const buscarItens = async () => {
    setCarregando(true);
    const { data, error } = await supabase.from('estoque').select('*');
    if (error) {
      alert('Erro ao carregar itens: ' + error.message);
      return;
    }

    setMateriasPrimas(data.filter((i) => i.tipo === 'materia_prima'));
    setProdutosIntermediarios(data.filter((i) => i.tipo === 'produto_intermediario'));
    setItensApoio(data.filter((i) => i.tipo === 'item_apoio'));
    setCarregando(false);
  };

  const adicionarItem = async () => {
    if (!nome || !tipo || quantidade < 0) {
      alert('Preencha todos os campos corretamente');
      return;
    }

    const { error } = await supabase.from('estoque').insert([
      { nome, tipo, quantidade },
    ]);

    if (error) {
      alert('Erro ao adicionar: ' + error.message);
    } else {
      setNome('');
      setQuantidade(0);
      buscarItens();
    }
  };

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">🍰 Estoque da Doceria</h1>

      <h2 className="text-xl font-semibold mb-2">Novo Item</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="materia_prima">Matéria-Prima</option>
          <option value="produto_intermediario">Produto Intermediário</option>
          <option value="item_apoio">Item de Apoio</option>
        </select>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="border px-2 py-1 rounded w-24"
        />
        <button
          onClick={adicionarItem}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Adicionar
        </button>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <Section title="Matérias-Primas" items={materiasPrimas} />
          <Section title="Produtos Intermediários" items={produtosIntermediarios} />
          <Section title="Itens de Apoio" items={itensApoio} />
        </>
      )}
    </main>
  );
}

function Section({ title, items }: { title: string; items: ItemEstoque[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mt-4 mb-1">{title}</h3>
      <ul className="list-disc pl-5">
        {items.map((item) => (
          <li key={item.id}>
            {item.nome} - {item.quantidade ?? 0}
          </li>
        ))}
      </ul>
    </div>
  );
}


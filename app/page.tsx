'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Estoque() {
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [produtosIntermediarios, setProdutosIntermediarios] = useState([]);
  const [itensApoio, setItensApoio] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [novoItem, setNovoItem] = useState({ nome: "", tipo: "materia_prima", componentes: "" });

  useEffect(() => {
    async function carregarItens() {
      const { data, error } = await supabase.from('itens_estoque').select('*');
      if (!error && data) {
        const mp = data.filter(i => i.tipo === "materia_prima");
        const pi = data.filter(i => i.tipo === "produto_intermediario");
        const ia = data.filter(i => i.tipo === "item_apoio");
        setMateriasPrimas(mp);
        setProdutosIntermediarios(pi);
        setItensApoio(ia);
      }
      setCarregando(false);
    }
    carregarItens();
  }, []);

  const adicionarItem = async () => {
    const item = { ...novoItem, id: Date.now() };
    await supabase.from('itens_estoque').insert([item]);
    if (item.tipo === "materia_prima") setMateriasPrimas([...materiasPrimas, item]);
    if (item.tipo === "produto_intermediario") setProdutosIntermediarios([...produtosIntermediarios, item]);
    if (item.tipo === "item_apoio") setItensApoio([...itensApoio, item]);
    setNovoItem({ nome: "", tipo: "materia_prima", componentes: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Controle de Estoque - Doceria</h1>

      <div className="mb-4 border p-4 rounded bg-white shadow">
        <input className="w-full p-2 border rounded mb-2" placeholder="Nome do item" value={novoItem.nome} onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })} />
        <textarea className="w-full p-2 border rounded mb-2" placeholder="Componentes (se houver)" value={novoItem.componentes} onChange={e => setNovoItem({ ...novoItem, componentes: e.target.value })} />
        <select className="w-full p-2 border rounded mb-2" value={novoItem.tipo} onChange={e => setNovoItem({ ...novoItem, tipo: e.target.value })}>
          <option value="materia_prima">Matéria-Prima</option>
          <option value="produto_intermediario">Produto Intermediário</option>
          <option value="item_apoio">Item de Apoio</option>
        </select>
        <button className="w-full bg-green-600 text-white py-2 rounded" onClick={adicionarItem}>Adicionar Item</button>
      </div>

      {carregando ? <p>Carregando...</p> : (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Matérias-Primas</h2>
            <ul className="space-y-1">{materiasPrimas.map(item => <li key={item.id} className="border p-2 rounded">{item.nome}</li>)}</ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Produtos Intermediários</h2>
            <ul className="space-y-1">{produtosIntermediarios.map(item => (
              <li key={item.id} className="border p-2 rounded">
                <strong>{item.nome}</strong><br />
                <small className="text-gray-500">Componentes: {item.componentes}</small>
              </li>
            ))}</ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Itens de Apoio</h2>
            <ul className="space-y-1">{itensApoio.map(item => <li key={item.id} className="border p-2 rounded">{item.nome}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}

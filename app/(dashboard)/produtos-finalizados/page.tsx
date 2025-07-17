'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';

const supabase = createClient<Database>();

export default function ProdutosFinalizados() {
  const [insumos, setInsumos] = useState([]);
  const [nome, setNome] = useState('');
  const [composicao, setComposicao] = useState([{ insumo_id: '', quantidade: 0 }]);

  useEffect(() => {
    async function fetchInsumos() {
      const { data } = await supabase.from('estoque').select('id, nome');
      setInsumos(data || []);
    }
    fetchInsumos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: produto, error } = await supabase
      .from('produtos_finalizados')
      .insert({ nome })
      .select()
      .single();

    if (error) return alert('Erro ao salvar produto');
    for (const item of composicao) {
      await supabase.from('composicoes').insert({
        produto_finalizado_id: produto.id,
        insumo_id: item.insumo_id,
        quantidade: item.quantidade,
      });
    }
    alert('Produto salvo com sucesso');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Nome do produto"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="border p-2 w-full"
        required
      />
      {composicao.map((item, index) => (
        <div key={index} className="flex gap-2">
          <select
            value={item.insumo_id}
            onChange={(e) =>
              setComposicao((prev) => {
                const copy = [...prev];
                copy[index].insumo_id = e.target.value;
                return copy;
              })
            }
            className="border p-2 flex-1"
            required
          >
            <option value="">Selecione o insumo</option>
            {insumos.map((insumo) => (
              <option key={insumo.id} value={insumo.id}>
                {insumo.nome}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantidade"
            value={item.quantidade}
            onChange={(e) =>
              setComposicao((prev) => {
                const copy = [...prev];
                copy[index].quantidade = parseFloat(e.target.value);
                return copy;
              })
            }
            className="border p-2 w-32"
            required
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setComposicao([...composicao, { insumo_id: '', quantidade: 0 }])}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Adicionar insumo
      </button>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded block w-full">
        Salvar produto
      </button>
    </form>
  );
}

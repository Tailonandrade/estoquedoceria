'use client';
import { useState, useEffect } from 'react';

export default function CadastroProdutoFinalizado() {
  const [nome, setNome] = useState('');
  const [consumos, setConsumos] = useState([{ item_id: '', quantidade: '', unidade: '' }]);
  const [materiais, setMateriais] = useState([]);

  useEffect(() => {
    fetch('/api/estoque') // Ajuste conforme sua API
      .then((res) => res.json())
      .then((data) => setMateriais(data));
  }, []);

  const handleAdicionarConsumo = () => {
    setConsumos([...consumos, { item_id: '', quantidade: '', unidade: '' }]);
  };

  const handleAlterarConsumo = (index, campo, valor) => {
    const novosConsumos = [...consumos];
    novosConsumos[index][campo] = valor;
    setConsumos(novosConsumos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/produtos-finalizados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, consumos })
    });
    if (response.ok) {
      alert('Produto finalizado cadastrado com sucesso!');
      setNome('');
      setConsumos([{ item_id: '', quantidade: '', unidade: '' }]);
    } else {
      alert('Erro ao cadastrar produto.');
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Produto Finalizado</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nome do Produto</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Itens Consumidos</label>
          {consumos.map((consumo, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                className="flex-1 p-2 border rounded"
                value={consumo.item_id}
                onChange={(e) => handleAlterarConsumo(index, 'item_id', e.target.value)}
                required
              >
                <option value="">Selecione o item</option>
                {materiais.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="w-24 p-2 border rounded"
                placeholder="Qtd"
                value={consumo.quantidade}
                onChange={(e) => handleAlterarConsumo(index, 'quantidade', e.target.value)}
                required
              />
              <input
                type="text"
                className="w-20 p-2 border rounded"
                placeholder="Un"
                value={consumo.unidade}
                onChange={(e) => handleAlterarConsumo(index, 'unidade', e.target.value)}
                required
              />
            </div>
          ))}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={handleAdicionarConsumo}
          >
            + Adicionar item
          </button>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Cadastrar Produto
        </button>
      </form>
    </main>
  );
}
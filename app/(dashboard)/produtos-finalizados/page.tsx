'use client'

import { useEffect, useState } from 'react'

type ItemEstoque = {
  id: string
  nome: string
  unidade: string
}

export default function CadastroProdutoFinalizado() {
  const [nomeProduto, setNomeProduto] = useState('')
  const [itensEstoque, setItensEstoque] = useState<ItemEstoque[]>([])
  const [itensComposicao, setItensComposicao] = useState<
    { idEstoque: string; quantidade: number }[]
  >([{ idEstoque: '', quantidade: 0 }])

  // Busca os itens de estoque para compor o produto
  useEffect(() => {
    fetch('/api/estoque')
      .then(res => res.json())
      .then(data => setItensEstoque(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/produtos-finalizados', {
      method: 'POST',
      body: JSON.stringify({
        nome: nomeProduto,
        composicao: itensComposicao
      }),
    })

    if (res.ok) {
      alert('Produto cadastrado com sucesso!')
      setNomeProduto('')
      setItensComposicao([{ idEstoque: '', quantidade: 0 }])
    } else {
      alert('Erro ao cadastrar produto.')
    }
  }

  const handleAddComposicao = () => {
    setItensComposicao([...itensComposicao, { idEstoque: '', quantidade: 0 }])
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Cadastro de Produto Finalizado</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome do Produto</label>
          <input
            type="text"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Composição:</label>
          {itensComposicao.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                className="flex-1 border rounded p-2"
                value={item.idEstoque}
                onChange={(e) => {
                  const newItens = [...itensComposicao]
                  newItens[index].idEstoque = e.target.value
                  setItensComposicao(newItens)
                }}
              >
                <option value="">Selecione um item</option>
                {itensEstoque.map((estoque) => (
                  <option key={estoque.id} value={estoque.id}>
                    {estoque.nome} ({estoque.unidade})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                step="0.01"
                className="w-24 border rounded p-2"
                placeholder="Qtd"
                value={item.quantidade}
                onChange={(e) => {
                  const newItens = [...itensComposicao]
                  newItens[index].quantidade = parseFloat(e.target.value)
                  setItensComposicao(newItens)
                }}
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddComposicao}
            className="text-blue-600 hover:underline text-sm"
          >
            + Adicionar outro item
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Salvar Produto
        </button>
      </form>
    </main>
  )
}

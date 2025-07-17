'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function CadastroProdutoFinalizado() {
  const supabase = createClient()
  const [nome, setNome] = useState('')
  const [unidade, setUnidade] = useState('un')
  const [estoques, setEstoques] = useState<any[]>([])
  const [itensComposicao, setItensComposicao] = useState<
    { idEstoque: string; quantidade: number }[]
  >([{ idEstoque: '', quantidade: 0 }])

  useEffect(() => {
    async function carregarEstoques() {
      const { data, error } = await supabase.from('estoque').select('id, nome, unidade')
      if (!error) setEstoques(data)
    }
    carregarEstoques()
  }, [])

  const handleAdicionarComponente = () => {
    setItensComposicao([...itensComposicao, { idEstoque: '', quantidade: 0 }])
  }

  const handleAlterarConsumo = (
    index: number,
    campo: 'idEstoque' | 'quantidade',
    valor: string | number
  ) => {
    const novosConsumos = [...itensComposicao]
    novosConsumos[index][campo] = campo === 'quantidade' ? Number(valor) : String(valor)
    setItensComposicao(novosConsumos)
  }

  const handleSalvar = async () => {
    if (!nome.trim()) {
      alert('Nome do produto é obrigatório.')
      return
    }

    const { data, error } = await supabase
      .from('produtos_finalizados')
      .insert({ nome, unidade })
      .select()
      .single()

    if (error) {
      alert('Erro ao salvar produto finalizado.')
      return
    }

    const idProduto = data.id

    const composicoes = itensComposicao.map((item) => ({
      id_produto: idProduto,
      id_estoque: item.idEstoque,
      quantidade: item.quantidade
    }))

    const { error: erroComposicao } = await supabase.from('composicao_produtos').insert(composicoes)

    if (erroComposicao) {
      alert('Erro ao salvar composição.')
    } else {
      alert('Produto finalizado cadastrado com sucesso!')
      setNome('')
      setUnidade('un')
      setItensComposicao([{ idEstoque: '', quantidade: 0 }])
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Produto Finalizado</h1>

      <div className="mb-4">
        <label className="block mb-1">Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Unidade</label>
        <select
          value={unidade}
          onChange={(e) => setUnidade(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="un">un</option>
          <option value="g">g</option>
          <option value="ml">ml</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Composição</label>
        {itensComposicao.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={item.idEstoque}
              onChange={(e) => handleAlterarConsumo(index, 'idEstoque', e.target.value)}
              className="flex-1 border rounded p-2"
            >
              <option value="">Selecione o item</option>
              {estoques.map((estoque) => (
                <option key={estoque.id} value={estoque.id}>
                  {estoque.nome} ({estoque.unidade})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.quantidade}
              onChange={(e) => handleAlterarConsumo(index, 'quantidade', e.target.value)}
              className="w-24 border rounded p-2"
              placeholder="Qtd."
            />
          </div>
        ))}
        <button
          onClick={handleAdicionarComponente}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + Adicionar componente
        </button>
      </div>

      <button
        onClick={handleSalvar}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Salvar
      </button>
    </div>
  )
}

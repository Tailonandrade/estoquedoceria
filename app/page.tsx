'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

      <Card className="mb-4">
        <CardContent className="space-y-4">
          <Input placeholder="Nome do item" value={novoItem.nome} onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })} />
          <Textarea placeholder="Componentes (se houver)" value={novoItem.componentes} onChange={e => setNovoItem({ ...novoItem, componentes: e.target.value })} />
          <select className="w-full border p-2 rounded" value={novoItem.tipo} onChange={e => setNovoItem({ ...novoItem, tipo: e.target.value })}>
            <option value="materia_prima">Matéria-Prima</option>
            <option value="produto_intermediario">Produto Intermediário</option>
            <option value="item_apoio">Item de Apoio</option>
          </select>
          <Button onClick={adicionarItem}>Adicionar Item</Button>
        </CardContent>
      </Card>

      {carregando ? <p>Carregando...</p> : (
        <Tabs defaultValue="materias">
          <TabsList>
            <TabsTrigger value="materias">Matérias-Primas</TabsTrigger>
            <TabsTrigger value="intermediarios">Produtos Intermediários</TabsTrigger>
            <TabsTrigger value="apoio">Itens de Apoio</TabsTrigger>
          </TabsList>

          <TabsContent value="materias">
            <ul className="space-y-2">
              {materiasPrimas.map(item => (
                <li key={item.id} className="border p-2 rounded">{item.nome}</li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="intermediarios">
            <ul className="space-y-2">
              {produtosIntermediarios.map(item => (
                <li key={item.id} className="border p-2 rounded">
                  <strong>{item.nome}</strong><br />
                  <span className="text-sm text-gray-500">Componentes: {item.componentes}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="apoio">
            <ul className="space-y-2">
              {itensApoio.map(item => (
                <li key={item.id} className="border p-2 rounded">{item.nome}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

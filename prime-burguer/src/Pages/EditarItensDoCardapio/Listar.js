import React, { useState } from "react";

export default function Lista({ item, setItem }) {
  const [editarId, setEditarid] = useState(null);
  const [newDescricao, setNewDescricao] = useState("");
  const [newProduto, setNewProduto] = useState("");

  const handleSave = (id) => {
    setItem(
      item.map((i) =>
        i.id === id
          ? { ...i, produto: newProduto, descricao: newDescricao }
          : i
      )
    );
    setEditarid(null); 
  };

  const handleEdit = (itens) => {
    setEditarid(itens.id); 
    setNewDescricao(itens.descricao);
    setNewProduto(itens.produto);
  };

  const handeDelete = (id) => {
    setItem(item.filter((i) => i.id !== id));
  };

  return (
    <div className="itens-lista">
      <h2>Itens Cadastrados</h2>

      {item.length === 0 ? (
        <p>Nenhum item cadastrado</p>
      ) : (
        <ul>
          {item.map((itens) => (
            <li key={itens.id}>
              {editarId === itens.id ? (
                <>
                  <input
                    type="text"
                    value={newProduto}
                    onChange={(e) => setNewProduto(e.target.value)}
                  />
                  <input
                    type="text"
                    value={newDescricao}
                    onChange={(e) => setNewDescricao(e.target.value)}
                  />

                  <button onClick={() => handleSave(itens.id)}>Salvar</button>
                </>
              ) : (
                <>
                  <span>
                    <strong>{itens.produto}</strong> – {itens.descricao}
                  </span>

                  <button onClick={() => handleEdit(itens)}>Editar</button>
                  <button onClick={() => handeDelete(itens.id)}>
                    Deletar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

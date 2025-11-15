import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cadastrar({ item, setItem }) {
  const [produto, setProduto] = useState("");
  const [descricao, setDescricao] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduto = { id: Date.now(), produto: produto.trim(), descricao: descricao.trim() };
    setItem([...item, newProduto]);

    setProduto("");
    setDescricao("");

    navigate("/lista");
  };

  return (
    <div className="cadastro-item">
      <h2>Cadastrar novo item no cardápio</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Produto"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <button type="submit">Criar</button>
      </form>
    </div>
  );
}

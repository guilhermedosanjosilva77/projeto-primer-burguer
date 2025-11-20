import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getTodosProdutos,
  atualizarProduto,
  deletarProduto,
} from "../../api/CriarProduto.js";
import {
  MdEdit,
  MdDelete,
  MdSave,
  MdCancel,
  MdSearch,
  MdOutlineWarning,
} from "react-icons/md";
import "./Lista.css";

export default function EditarCardapio() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  // Estado temporário para os dados em edição
  const [editData, setEditData] = useState({});

  // --- Funções de Carregamento ---
  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const data = await getTodosProdutos();
      setProdutos(data);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar produtos. Verifique o servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // --- Funções de Edição (Local) ---
  const handleEditStart = (produto) => {
    setEditingId(produto.id);
    setEditData({
      nome: produto.nome,
      preco: produto.preco.toString(),
      descricao: produto.descricao,
      categoria: produto.categoria,
      img: produto.img || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  // --- Funções de API (Atualizar) ---
  const handleSave = async (id) => {
    if (!editData.nome || !editData.preco) {
      Swal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Nome e Preço não podem estar vazios.",
        confirmButtonColor: "#FF7F00", // Usando sua cor secondary
      });
      return;
    }

    try {
      const updatedData = {
        ...editData,
        preco: parseFloat(editData.preco),
      };

      setLoading(true);
      const response = await atualizarProduto(id, updatedData);

      // Atualiza o estado localmente com a resposta do backend
      setProdutos(produtos.map((p) => (p.id === id ? response : p)));
      setEditingId(null);

      // Sucesso com Toast (mensagens pequenas no canto)
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Produto ${response.nome} atualizado!`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      // Erro com Modal (destaque para o problema)
      Swal.fire({
        icon: "error",
        title: "Falha na Atualização",
        text: `Não foi possível atualizar o produto. Erro: ${
          err.message || "Erro de conexão"
        }`,
        confirmButtonColor: "#C62828", // Usando sua cor primary
      });
      console.error("Erro na atualização:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Funções de API (Remover) ---
  const handleDelete = async (id, nome) => {
    // Confirmação de exclusão com SweetAlert2
    const result = await Swal.fire({
      title: `Remover "${nome}"?`,
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C62828", // Vermelho (Ação principal)
      cancelButtonColor: "#FF7F00", // Laranja (Ação secundária/cancelar)
      confirmButtonText: "Sim, remover!",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);
      await deletarProduto(id);

      // Remove o item da lista localmente
      setProdutos(produtos.filter((p) => p.id !== id));

      // Sucesso com Toast
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: `Produto "${nome}" removido.`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      // Erro com Modal
      Swal.fire({
        icon: "error",
        title: "Falha na Remoção",
        text: `Não foi possível remover o produto. Erro: ${
          err.message || "Erro de conexão"
        }`,
        confirmButtonColor: "#C62828",
      });
      console.error("Erro na remoção:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && produtos.length === 0) {
    return <div className="loading-state">Carregando cardápio...</div>;
  }

  if (error) {
    return <div className="error-state">Erro: {error}</div>;
  }

  return (
    <div className="cardapio-admin-container">
      <div className="cardapio-header">
        <h1>Gerenciamento do Cardápio</h1>
        <p>Visualize, edite e remova os itens cadastrados.</p>
      </div>

      <div className="lista-produtos">
        <h2>
          <MdSearch /> Produtos Cadastrados
        </h2>

        {produtos.length === 0 ? (
          <div className="no-data">
            <MdOutlineWarning
              size={30}
              style={{ marginRight: "10px", color: "var(--tertiary)" }}
            />
            Nenhum item encontrado no cardápio.
          </div>
        ) : (
          <table className="tabela-cardapio">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>ID</th>
                <th style={{ width: "25%" }}>Nome</th>
                <th style={{ width: "10%" }}>Preço</th>
                <th style={{ width: "15%" }}>Categoria</th>
                <th style={{ width: "35%" }}>Descrição</th>
                <th style={{ width: "10%", textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  {editingId === p.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="nome"
                          value={editData.nome}
                          onChange={handleEditChange}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="preco"
                          step="0.01"
                          value={editData.preco}
                          onChange={handleEditChange}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="categoria"
                          value={editData.categoria}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <textarea
                          name="descricao"
                          rows="2"
                          value={editData.descricao}
                          onChange={handleEditChange}
                        ></textarea>
                      </td>
                      <td className="acao-btns">
                        <button
                          onClick={() => handleSave(p.id)}
                          className="btn-salvar"
                          title="Salvar"
                        >
                          <MdSave />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn-cancelar"
                          title="Cancelar"
                        >
                          <MdCancel />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{p.nome}</td>
                      <td
                        style={{ color: "var(--primary)", fontWeight: "700" }}
                      >
                        R$ {p.preco.toFixed(2)}
                      </td>
                      <td>{p.categoria}</td>
                      <td>{p.descricao}</td>
                      <td className="acao-btns">
                        <button
                          onClick={() => handleEditStart(p)}
                          className="btn-editar"
                          title="Editar"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.nome)}
                          className="btn-deletar"
                          title="Deletar"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

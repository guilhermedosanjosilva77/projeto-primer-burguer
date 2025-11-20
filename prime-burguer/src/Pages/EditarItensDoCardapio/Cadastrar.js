import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importar o SweetAlert2
import { MdAddCircle, MdCloudUpload } from "react-icons/md";
import { criarProduto } from "../../api/CriarProduto.js";
import "./CadastrarProdutos.css";

const CATEGORIAS = [
  { value: "Lanche", label: "Lanche (Sanduíches/Burgers)" },
  { value: "Acompanhamento", label: "Acompanhamento (Batata Frita/Anéis)" },
  { value: "Bebida", label: "Bebida" },
  { value: "Sobremesa", label: "Sobremesa" },
];

export default function Cadastrar() {
  const [produtoData, setProdutoData] = useState({
    nome: "",
    preco: "",
    descricao: "",
    categoria: CATEGORIAS[0].value,
    img: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação básica para garantir que o preço não é um valor vazio que daria erro no parseFloat
    if (!produtoData.nome || !produtoData.preco || !produtoData.descricao) {
      Swal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Por favor, preencha Nome, Preço e Descrição.",
        confirmButtonColor: "#FF7F00",
      });
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...produtoData,
      preco: parseFloat(produtoData.preco), // Garante que o preço é um número
    };

    try {
      // 2. Chama a função de API
      const newProduto = await criarProduto(dataToSend);

      console.log("Produto criado com sucesso:", newProduto);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `"${newProduto.nome}" cadastrado!`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // 3. Limpa o formulário e navega
      setProdutoData({
        nome: "",
        preco: "",
        descricao: "",
        categoria: CATEGORIAS[0].value,
        img: "",
      });
      // Navega para a tela de edição/listagem
      navigate("/lista");
    } catch (error) {
      console.error("Erro ao criar produto:", error);

      // Feedback de Erro (Usando Modal)
      Swal.fire({
        icon: "error",
        title: "Falha no Cadastro",
        text: `Não foi possível cadastrar o produto. Erro: ${
          error.message || "Erro de conexão com a API."
        }`,
        confirmButtonColor: "#C62828",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-item-card">
        <h2>
          <MdAddCircle /> Cadastrar Novo Item no Cardápio
        </h2>
        <form onSubmit={handleSubmit} className="cadastro-form">
          {/* Linha 1: Nome e Preço */}
          <div className="form-group span-2">
            <label htmlFor="nome">Nome do Produto</label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Ex: Prime Burger Clássico"
              value={produtoData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preco">Preço (R$)</label>
            <input
              id="preco"
              name="preco"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 29.90"
              value={produtoData.preco}
              onChange={handleChange}
              required
            />
          </div>

          {/* Linha 2: Categoria e Imagem URL */}
          <div className="form-group">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              name="categoria"
              value={produtoData.categoria}
              onChange={handleChange}
              required
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group span-3">
            <label htmlFor="img">URL da Imagem</label>
            <input
              id="img"
              name="img"
              type="url"
              placeholder="Link direto para a imagem (Ex: http://.../.png ou base64)"
              value={produtoData.img}
              onChange={handleChange}
            />
          </div>

          {/* Linha 3: Descrição (área expandida) */}
          <div className="form-group span-full">
            <label htmlFor="descricao">Descrição Completa</label>
            <textarea
              id="descricao"
              name="descricao"
              placeholder="Descreva os ingredientes e o sabor do produto."
              rows="4"
              value={produtoData.descricao}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-criar span-full"
          >
            {loading ? (
              "Criando..."
            ) : (
              <>
                <MdCloudUpload /> Criar Produto
              </>
            )}
          </button>
        </form>
      </div>

      {/* Visualização da Imagem (Opcional) */}
      {produtoData.img && (
        <div className="image-preview-container">
          <h3>Pré-visualização da Imagem</h3>
          <img
            src={produtoData.img}
            alt="Pré-visualização do Produto"
            className="image-preview"
            // Esconde a imagem e mostra a mensagem de erro se a URL for inválida
            onError={(e) => {
              e.target.style.display = "none";
              const messageElement = e.target.nextSibling;
              if (messageElement) messageElement.style.display = "block";
            }}
          />
          <p className="image-error-message" style={{ display: "none" }}>
            ❌ Imagem não carregada ou URL inválida.
          </p>
        </div>
      )}
    </div>
  );
}

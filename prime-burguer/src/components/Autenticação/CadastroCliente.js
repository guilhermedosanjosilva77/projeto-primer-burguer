// src/Pages/CadastroCliente/CadastroCliente.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { criarCliente, buscarClientePorId } from "../../api/CriarCliente.js";
import "./CadastroCliente.css";

// Recebe o ID do usuário (vindo do estado global após o login)
export default function CadastroCliente({ usuarioLogado }) {
  const navigate = useNavigate();
  const [clienteData, setClienteData] = useState({
    nome: "",
    telefone: "",
    rua: "",
    bairro: "",
    numeroCasa: "",
    cidade: "",
  });
  const [loading, setLoading] = useState(false);
  const [clienteExistente, setClienteExistente] = useState(false);

  useEffect(() => {
    if (usuarioLogado?.id) {
      setLoading(true);
      // Busca os dados do cliente usando o ID do usuário logado (assumido ser o mesmo ID)
      buscarClientePorId(usuarioLogado.id)
        .then((cliente) => {
          if (cliente && cliente.id) {
            setClienteExistente(true);
            setClienteData(cliente); // Preenche o formulário com dados existentes
            Swal.fire(
              "Bem-vindo!",
              "Seu cadastro de cliente está completo. Prossiga para o checkout.",
              "info"
            );
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar cliente por ID:", error);
          // Continua no formulário para que o usuário possa preencher/corrigir
        })
        .finally(() => setLoading(false));
    } else {
      // Se não houver ID de usuário logado, redireciona para autenticação
      navigate("/autenticacao");
    }
  }, [usuarioLogado, navigate]);

  const handleChange = (e) => {
    setClienteData({ ...clienteData, [e.target.name]: e.target.value });
  };

  const handleSalvarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);

    // O ID do cliente será o mesmo ID do usuário (assumindo 1:1)
    const dataToSend = { ...clienteData, id: usuarioLogado.id };

    try {
      const action = clienteExistente ? "atualizar" : "criar";

      const savedCliente = await criarCliente(dataToSend);

      Swal.fire(
        "Sucesso!",
        `Dados de cliente ${action}s com sucesso! ID: ${savedCliente.id}`,
        "success"
      );

      navigate("/finalizarPedido", {
        state: {
          clienteId: savedCliente.id,
          clienteData: savedCliente,
        },
      });
    } catch (error) {
      Swal.fire("Erro!", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!usuarioLogado?.id || loading) {
    return <div className="loading-cliente">Carregando dados...</div>;
  }

  return (
    <div className="cadastro-cliente-container">
      <h2>
        {clienteExistente
          ? "Atualizar Dados de Entrega"
          : "Complete Seu Cadastro"}
      </h2>

      <form onSubmit={handleSalvarCliente} className="cliente-form">
        <div className="form-group">
          <label>Nome Completo</label>
          <input
            name="nome"
            value={clienteData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input
            name="telefone"
            value={clienteData.telefone}
            onChange={handleChange}
            required
          />
        </div>

        <h3>Endereço de Entrega</h3>

        <div className="form-group">
          <label>Rua</label>
          <input
            name="rua"
            value={clienteData.rua}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group-inline">
          <div className="form-group">
            <label>Número</label>
            <input
              name="numeroCasa"
              value={clienteData.numeroCasa}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Bairro</label>
            <input
              name="bairro"
              value={clienteData.bairro}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Cidade</label>
          <input
            name="cidade"
            value={clienteData.cidade}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-salvar-cliente">
          {loading
            ? "Salvando..."
            : clienteExistente
            ? "Atualizar e Continuar"
            : "Salvar e Finalizar"}
        </button>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import CriarCaixaModal from "../../components/CaixaModal/CaixaModal.js";
import CriarMovimentacaoModal from "../../components/CaixaModal/CriarMovimentacaoModal.js";
import {
  MdMonetizationOn,
  MdAddCircleOutline,
  MdClose,
  MdArrowUpward,
  MdArrowDownward,
  MdVisibility,
} from "react-icons/md";
import { buscarCaixaPrincipal, buscarMovimentacoes } from "../../api/Caixa.js";
import { buscarTodosClientes } from "../../api/CriarCliente.js";
import "./Caixa.css";

export default function Caixa() {
  const [caixa, setCaixa] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientMap, setClientMap] = useState({});
  const [mostrarModalCriarCaixa, setMostrarModalCriarCaixa] = useState(false);
  const [mostrarModalMovimentacao, setMostrarModalMovimentacao] =
    useState(false);

  const carregarDadosDoCaixa = async () => {
    setLoading(true);
    setError(null);
    try {
      const [caixaData, clientesData] = await Promise.all([
        buscarCaixaPrincipal(),
        buscarTodosClientes(),
      ]);

      const newClientMap = clientesData.reduce((map, cliente) => {
        map[cliente.id] = cliente.nome;
        return map;
      }, {});
      setClientMap(newClientMap);

      setCaixa(caixaData);

      if (caixaData) {
        const listaMov = await buscarMovimentacoes();
        setMovimentacoes(listaMov);
      } else {
        setMostrarModalCriarCaixa(true);
      }
    } catch (err) {
      console.error("Falha ao carregar dados do Caixa:", err);
      const errorMessage =
        err.message ||
        "Não foi possível carregar o Caixa Principal. Verifique o backend.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatarDescricao = (descricao, clientMap) => {
    const regex = /Cliente ID: (\d+)/;
    const match = descricao.match(regex);

    if (match) {
      const clienteId = match[1];
      const nomeCliente = clientMap[clienteId];

      if (nomeCliente) {
        return descricao.replace(match[0], `Cliente: ${nomeCliente}`);
      }
    }
    return descricao;
  };

  useEffect(() => {
    carregarDadosDoCaixa();
  }, []);

  const handleCaixaCriado = (novoCaixa) => {
    setCaixa(novoCaixa);
    setMostrarModalCriarCaixa(false);
    carregarDadosDoCaixa();
  };

  const handleMovimentacaoCriada = () => {
    setMostrarModalMovimentacao(false);
    carregarDadosDoCaixa();
  };

  if (loading) {
    return (
      <div className="caixa-page-container">
        <h2>
          <MdMonetizationOn /> Gestão de Caixa
        </h2>
        <p>Carregando dados do Caixa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="caixa-page-container">
        <h2>
          <MdMonetizationOn /> Gestão de Caixa
        </h2>
        <div className="error-message">
          <MdClose /> {error}
        </div>
      </div>
    );
  }

  if (!caixa) {
    return (
      <div className="caixa-page-container">
        <h2>
          <MdMonetizationOn /> Gestão de Caixa
        </h2>
        <p>O Caixa Principal não foi inicializado. Por favor, crie-o.</p>

        <button
          className="btn-action criar-caixa"
          onClick={() => setMostrarModalCriarCaixa(true)}
        >
          <MdAddCircleOutline /> Inicializar Caixa Principal
        </button>

        {mostrarModalCriarCaixa && (
          <CriarCaixaModal
            onClose={() => setMostrarModalCriarCaixa(false)}
            onCaixaCriado={handleCaixaCriado}
          />
        )}
      </div>
    );
  }

  return (
    <div className="caixa-page-container">
      <h2>
        <MdMonetizationOn /> Caixa: {caixa.descricao}
      </h2>

      <button
        className="btn-action adicionar-movimentacao"
        onClick={() => setMostrarModalMovimentacao(true)}
      >
        <MdAddCircleOutline /> Adicionar Entrada/Saída
      </button>

      <div className="caixa-details">
        <div className="caixa-card saldo-card">
          <h3>Saldo Atual</h3>
          <p className="saldo-value">
            R${" "}
            {caixa.saldoAtual
              ? caixa.saldoAtual.toFixed(2).replace(".", ",")
              : "0,00"}
          </p>
        </div>

        <div className="movimentacoes-section">
          <h3>
            <MdVisibility /> Histórico de Movimentações
          </h3>

          {movimentacoes.length === 0 ? (
            <p>Nenhuma movimentação registrada neste caixa ainda.</p>
          ) : (
            <ul className="movimentacoes-list">
              {movimentacoes.map((mov) => (
                <li
                  key={mov.id}
                  className={`movimentacao-item ${mov.tipo.toLowerCase()}`}
                >
                  <div className="mov-icon">
                    {mov.tipo === "ENTRADA" ? (
                      <MdArrowUpward />
                    ) : (
                      <MdArrowDownward />
                    )}
                  </div>
                  <div className="mov-details">
                    <span className="mov-descricao">
                      {formatarDescricao(mov.descricao, clientMap)}
                    </span>
                    <span className="mov-data">
                      {new Date(mov.data).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <span className="mov-valor">
                    R$ {mov.valor.toFixed(2).replace(".", ",")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal de Criação de Movimentação */}
      {mostrarModalMovimentacao && caixa && (
        <CriarMovimentacaoModal
          caixaId={caixa.id}
          onClose={() => setMostrarModalMovimentacao(false)}
          onMovimentacaoCriada={handleMovimentacaoCriada}
        />
      )}
    </div>
  );
}

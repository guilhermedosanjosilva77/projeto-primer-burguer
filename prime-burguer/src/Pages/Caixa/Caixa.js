import React, { useState, useEffect } from 'react';
import CriarCaixaModal from '../../components/CaixaModal/CaixaModal.js'; 
import CriarMovimentacaoModal from '../../components/CaixaModal/CriarMovimentacaoModal.js'; 
import { 
    MdMonetizationOn, 
    MdAddCircleOutline, 
    MdClose, 
    MdArrowUpward, 
    MdArrowDownward,
    MdVisibility
} from 'react-icons/md';
import { buscarCaixaPrincipal, buscarMovimentacoes } from '../../api/Caixa.js'; 
import "./Caixa.css"; 

export default function Caixa() {
    const [caixa, setCaixa] = useState(null); 
    const [movimentacoes, setMovimentacoes] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [mostrarModalCriarCaixa, setMostrarModalCriarCaixa] = useState(false); 
    const [mostrarModalMovimentacao, setMostrarModalMovimentacao] = useState(false); 


    const carregarDadosDoCaixa = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Busca o Caixa Principal (ID 1)
            const caixaData = await buscarCaixaPrincipal();
            setCaixa(caixaData);

            if (caixaData) {
                // 2. Se o caixa existir, busca as movimentações
                const listaMov = await buscarMovimentacoes();
                setMovimentacoes(listaMov);
            } else {
                // Se não encontrar o Caixa ID=1, abre o modal de criação
                setMostrarModalCriarCaixa(true);
            }

        } catch (err) {
            console.error("Falha ao carregar dados do Caixa:", err);
            const errorMessage = err.message || "Não foi possível carregar o Caixa Principal. Verifique o backend.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDadosDoCaixa();
    }, []); 

    // --- HANDLERS DE EVENTOS ---

    // Chamado quando o Caixa ID 1 é criado pela primeira vez
    const handleCaixaCriado = (novoCaixa) => {
        setCaixa(novoCaixa); // Define o caixa principal
        setMostrarModalCriarCaixa(false);
        carregarDadosDoCaixa(); // Recarrega os dados (incluindo as movimentações, que serão vazias)
    };

    // Chamado após criar uma nova movimentação
    const handleMovimentacaoCriada = () => {
        setMostrarModalMovimentacao(false);
        carregarDadosDoCaixa(); // Recarrega o caixa e a lista de movimentações
    };

    // --- RENDERIZAÇÃO ---

    if (loading) {
        return (
            <div className="caixa-page-container">
                <h2><MdMonetizationOn /> Gestão de Caixa</h2>
                <p>Carregando dados do Caixa...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="caixa-page-container">
                <h2><MdMonetizationOn /> Gestão de Caixa</h2>
                <div className="error-message"><MdClose /> {error}</div>
            </div>
        );
    }
    
    // Se o Caixa Principal não existir, mostre o botão de criação
    if (!caixa) {
        return (
            <div className="caixa-page-container">
                <h2><MdMonetizationOn /> Gestão de Caixa</h2>
                <p>O Caixa Principal não foi inicializado. Por favor, crie-o.</p>
                
                {/* Botão de Criação de Caixa (Forçado) */}
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

    // Se o Caixa Principal existe, renderiza os detalhes e movimentações
    return (
        <div className="caixa-page-container">
            <h2><MdMonetizationOn /> Caixa: {caixa.descricao}</h2>
            
            {/* Botão para Adicionar Movimentação Manual */}
            <button 
                className="btn-action adicionar-movimentacao" 
                onClick={() => setMostrarModalMovimentacao(true)}
            >
                <MdAddCircleOutline /> Adicionar Entrada/Saída
            </button>
            
            <div className="caixa-details">
                {/* CARD DE SALDO ATUAL */}
                <div className="caixa-card saldo-card">
                    <h3>Saldo Atual</h3>
                    <p className="saldo-value">
                        R$ {caixa.saldoAtual ? caixa.saldoAtual.toFixed(2).replace('.', ',') : '0,00'}
                    </p>
            f
                </div>
                
                {/* LISTA DE MOVIMENTAÇÕES */}
                <div className="movimentacoes-section">
                    <h3><MdVisibility /> Histórico de Movimentações</h3>
                    
                    {movimentacoes.length === 0 ? (
                        <p>Nenhuma movimentação registrada neste caixa ainda.</p>
                    ) : (
                        <ul className="movimentacoes-list">
                            {movimentacoes.map(mov => (
                                <li key={mov.id} className={`movimentacao-item ${mov.tipo.toLowerCase()}`}>
                                    <div className="mov-icon">
                                        {mov.tipo === 'ENTRADA' ? <MdArrowUpward /> : <MdArrowDownward />}
                                    </div>
                                    <div className="mov-details">
                                        <span className="mov-descricao">{mov.descricao}</span>
                                        <span className="mov-data">{new Date(mov.data).toLocaleDateString()}</span>
                                    </div>
                                    <span className="mov-valor">
                                        R$ {mov.valor.toFixed(2).replace('.', ',')}
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
import React, { useState, useEffect } from "react";
// Importações de navegação e notificação
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./MeusPedidos.css";

// Importando ícones compatíveis (Lucide)
import {
    ShoppingBag,
    AlertTriangle,
    CheckCircle,
    Clock,
    Utensils,
    LogOut,
    Home,
} from 'lucide-react';

// URL base da sua API
const API_BASE_URL = 'http://localhost:8080';

// Função para buscar pedidos do cliente
async function buscarPedidosDoCliente(clienteId) {
    if (!clienteId) {
        throw new Error("ID do cliente ausente. Por favor, faça login novamente.");
    }
    
    const url = `${API_BASE_URL}/pedidos/cliente/${clienteId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

      if (!response.ok) {
            let errorMessage = `Erro HTTP ${response.status}: Falha ao buscar pedidos.`;
            let errorDetails = {};

            const contentType = response.headers.get("content-type");
            
            if (contentType && contentType.includes("application/json")) {
                try {
                    
                    errorDetails = await response.json();
                    errorMessage = errorDetails.message || errorMessage;
                } catch (e) {
                
                    errorMessage = `Erro de formatação de resposta (${response.status}). Corpo da resposta não é JSON válido.`;
                }
            } else {
                errorMessage += " Resposta do servidor estava vazia ou em formato inesperado.";
            }

            const error = new Error(errorMessage);
            error.response = response;
            throw error;
        }

        const pedidos = await response.json();
        return pedidos;

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        
        if (!error.response) {
            throw new Error("Não foi possível conectar ao servidor da API. Verifique se o backend está rodando em " + API_BASE_URL);
        }
        
        throw error;
    }
}

// Componente MeusPedidos
function MeusPedidos({ usuarioLogado, fazerLogout }) {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // Efeito para autenticação e carregamento de pedidos
    useEffect(() => {
        if (!usuarioLogado || !usuarioLogado.id) {
            toast.error("Você precisa estar logado para ver seus pedidos!");
            navigate("/autenticacao");
            return;
        }
        carregarPedidos(usuarioLogado.id);
    }, [usuarioLogado, navigate]); 

    const carregarPedidos = async (clienteId) => {
        setLoading(true);
        setErro(null);

        try {
            const pedidosData = await buscarPedidosDoCliente(clienteId);
            
            // CORREÇÃO: Mapear os dados para converter o timestamp da data (segundos para milissegundos)
            const pedidosComDataCorrigida = pedidosData.map(pedido => {
                const dataConvertida = pedido.data ? new Date(pedido.data * 1000) : null;
                
                return {
                    ...pedido,
                    dataObjeto: dataConvertida, 
                };
            });

            const pedidosOrdenados = pedidosComDataCorrigida.sort((a, b) => {
                const dataA = a.dataObjeto ? a.dataObjeto.getTime() : 0;
                const dataB = b.dataObjeto ? b.dataObjeto.getTime() : 0;
                return dataB - dataA;
            });
            
            setPedidos(pedidosOrdenados);

        } catch (error) {
            setErro(error.message);
            toast.error("Erro ao carregar seus pedidos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (dataObj) => {
        if (!dataObj) return "Data não disponível";
        
        const data = dataObj instanceof Date ? dataObj : new Date(dataObj);

        if (isNaN(data.getTime())) return "Data inválida";

        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatarPreco = (preco) => {
        if (typeof preco !== 'number' && typeof preco !== 'string') return "R$ 0,00";
        const valor = parseFloat(preco);
        if (isNaN(valor)) return "R$ 0,00";
        
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    // Helper functions for status styling - Using custom class names
    const getStatusIcon = (status) => {
        const statusLower = status?.toLowerCase().replace(/ /g, '_') || 'pendente';
        const iconClass = "w-5 h-5"; 
        
        switch (statusLower) {
            case 'pendente':
                return <Clock className={iconClass} />;
            case 'em_preparacao':
            case 'preparando':
                return <Utensils className={iconClass} />;
            case 'concluído':
            case 'concluido':
            case 'entregue':
                return <CheckCircle className={iconClass} />;
            case 'cancelado':
                return <AlertTriangle className={iconClass} />;
            default:
                return <Clock className={iconClass} />;
        }
    };

    const getStatusClass = (status) => {
        const statusLower = status?.toLowerCase().replace(/ /g, '_') || 'pendente';
        
        switch (statusLower) {
            case 'pendente':
                return 'pedido-status status-pendente';
            case 'em_preparacao':
            case 'preparando':
                return 'pedido-status status-preparacao';
            case 'concluído':
            case 'concluido':
            case 'entregue':
                return 'pedido-status status-concluido';
            case 'cancelado':
                return 'pedido-status status-cancelado';
            default:
                return 'pedido-status';
        }
    };
    
    // Handler para Logout
    const handleLogout = () => {
        if (fazerLogout) {
            fazerLogout();
        }
        toast.success("Logout realizado com sucesso!");
        navigate("/home");
    };

    // ----------------------------------------------------
    // UI - Loading State
    // ----------------------------------------------------
    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p className="font-semibold">Carregando seus pedidos...</p>
            </div>
        );
    }

    // ----------------------------------------------------
    // UI - Error State
    // ----------------------------------------------------
    if (erro) {
        return (
            <div className="loading">
                <div className="erro-container">
                    <AlertTriangle className="erro-icon" />
                    <h2>Erro ao carregar pedidos</h2>
                    <p>{erro}</p>
                    <div className="btn-recarregar-wrapper">
                        <button 
                            className="btn-recarregar" 
                            onClick={() => carregarPedidos(usuarioLogado?.id)}
                        >
                            <AlertTriangle className="w-4 h-4" /> Tentar Novamente
                        </button>
                        <button 
                            className="btn-voltar" 
                            onClick={() => navigate("/home")}
                        >
                            <Home className="w-4 h-4" /> Voltar para Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------
    // UI - Main Content
    // ----------------------------------------------------
    return (
        <div className="meus-pedidos-container">
            
            <header>
                <div className="meus-pedidos-header">
                    <h1>
                        <ShoppingBag className="w-8 h-8" />
                        Meus Pedidos
                    </h1>
                    <p className="usuario-email">
                        Logado como: <span>{usuarioLogado?.email || 'N/A'}</span>
                    </p>
                    {fazerLogout && (
                        <button 
                            className="btn-logout-header" 
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" /> <span>Sair</span>
                        </button>
                    )}
                </div>
            </header>

            {pedidos.length === 0 ? (
                // Pedidos Vazios
                <div className="pedidos-vazio">
                    <ShoppingBag className="icone-vazio" size={80} />
                    <h2>Você ainda não fez nenhum pedido</h2>
                    <p>Que tal fazer seu primeiro pedido e aproveitar nossas delícias?</p>
                    <button 
                        className="btn-fazer-pedido" 
                        onClick={() => navigate("/home")}
                    >
                        <Utensils className="w-5 h-5" /> Fazer Pedido
                    </button>
                </div>
            ) : (
                // Lista de Pedidos
                <div className="pedidos-lista">
                    {pedidos.map((pedido) => (
                        <div key={pedido.id} className="pedido-card">
                            
                            {/* Pedido Header */}
                            <div className="pedido-header">
                                <div className="pedido-numero">
                                    <strong>Pedido #{pedido.id}</strong>
                                    <span className="pedido-data">
                                        {formatarData(pedido.dataObjeto || pedido.data)} 
                                    </span>
                                </div>
                                <div className={getStatusClass(pedido.status)}>
                                    {getStatusIcon(pedido.status)}
                                    <span>{pedido.status || 'Pendente'}</span>
                                </div>
                            </div>

                            {/* Detalhes do Pedido */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                
                                {/* Itens do Pedido */}
                                <div className="pedido-itens lg:col-span-2">
                                    <h3>Itens do Pedido:</h3>
                                    <ul className="pedido-itens-list">
                                        {pedido.itens && pedido.itens.length > 0 ? pedido.itens.map((item, index) => (
                                            <li key={item.id || index}>
                                                <span className="item-nome">
                                                    {/* Acessa o nome do produto dentro do ItemPedido */}
                                                    {item.produto?.nome || `Item ${index + 1}`}
                                                </span>
                                                <span className="item-quantidade">
                                                    x{item.quantidade || 1}
                                                </span>
                                                <span className="item-preco">
                                                    {/* Calcula o subtotal: Preço do Produto * Quantidade do ItemPedido */}
                                                    {formatarPreco((item.produto?.preco || 0) * (item.quantidade || 1))}
                                                </span>
                                            </li>
                                        )) : (
                                            <li className="pedido-info-resumo">
                                                <p>Nenhum item detalhado disponível (Corrija o @JsonIgnore no seu back-end).</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* Endereço e Pagamento */}
                                <div className="lg:col-span-1">
                                    {/* O Endereço virá aninhado no objeto Cliente do Pedido, ou em um campo separado se você o adicionou ao Pedido/DTO */}
                                    {pedido.cliente && (
                                        <div className="pedido-endereco">
                                            <h4>Entrega:</h4>
                                            <p>
                                                {pedido.cliente.rua && `${pedido.cliente.rua}, `}
                                                {pedido.cliente.numeroCasa}
                                            </p>
                                            <p>
                                                {pedido.cliente.bairro && `${pedido.cliente.bairro} - `}
                                                {pedido.cliente.cidade}
                                            </p>
                                        </div>
                                    )}

                                    {/* Pagamento */}
                                    <div className="pedido-pagamento">
                                        <h4>Pagamento:</h4>
                                        <span className="metodo-pagamento">
                                            {pedido.metodoPagamento || 'Não Informado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Observações e Total */}
                            <div className="pedido-footer">
                                <div className="pedido-observacoes">
                                    {pedido.observacoes && (
                                        <p className="observacoes">
                                            Obs: {pedido.observacoes}
                                        </p>
                                    )}
                                </div>
                                <span className="pedido-total">
                                    Total: {formatarPreco(pedido.valorTotal)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ações */}
            <div className="acoes-container">
                <button 
                    className="btn-novo-pedido" 
                    onClick={() => navigate("/home")}
                >
                    <Utensils className="w-4 h-4" /> Fazer Novo Pedido
                </button>
                <button 
                    className="btn-voltar-home" 
                    onClick={() => navigate("/home")}
                >
                    <Home className="w-4 h-4" /> Voltar para Home
                </button>
            </div>
        </div>
    );
}

export default MeusPedidos;
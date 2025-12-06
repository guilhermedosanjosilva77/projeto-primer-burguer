// Arquivo: src/components/admin/ListaPedidosAdmin.jsx

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
    buscarTodosPedidos, 
    atualizarStatusPedido, 
    deletarPedido 
} from '../../api/CriarPedido.js'; 
import { buscarTodosClientes } from '../../api/CriarCliente.js';
import './ListaPedidos.css'; 

const STATUS_MAP = {
    PENDENTE: { label: "Pendente", color: "#ff9800", icon: "🕒" },
    EM_PREPARO: { label: "Em Preparo", color: "#2196f3", icon: "🔪" },
    PRONTO: { label: "Pronto", color: "#4caf50", icon: "✅" },
    CONCLUIDO: { label: "Concluído", color: "#795548", icon: "📦" },
    CANCELADO: { label: "Cancelado", color: "#f44336", icon: "❌" }
};
const STATUS_OPTIONS = Object.keys(STATUS_MAP);

const PedidoCard = ({ pedido, onStatusChange, onDelete, clientMap }) => { 
    const statusInfo = STATUS_MAP[pedido.status] || STATUS_MAP.PENDENTE;
    
    const clientName = clientMap[pedido.clienteId] || `Cliente #${pedido.clienteId}`;
    
    const formatData = (dataString) => {
        try {
            return new Date(dataString).toLocaleTimeString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch {
            return "Data Inválida";
        }
    };
    
    const formatValor = (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

    return (
        <div className="pedido-card">
            <header className="pedido-header">
                <div className="pedido-id-tag"># {pedido.id}</div>
                <div className="pedido-status" style={{ backgroundColor: statusInfo.color }}>
                    {statusInfo.icon} {statusInfo.label}
                </div>
            </header>
            
            <div className="pedido-body">
                <p><strong>Cliente:</strong> {clientName}</p>
                <p><strong>Itens:</strong>{pedido.quantidade}</p>
                <p><strong>Data/Hora:</strong> {formatData(pedido.data)}</p>
                <p className="pedido-valor-total">
                    Total: <span>{formatValor(pedido.valorTotal)}</span>
                </p>
            </div>

            <footer className="pedido-footer">
                <div className="status-update-group">
                    <select 
                        value={pedido.status}
                        onChange={(e) => onStatusChange(pedido.id, e.target.value)}
                        style={{ borderColor: statusInfo.color }}
                    >
                        {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                                {STATUS_MAP[status].label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button 
                    className="delete-button"
                    onClick={() => onDelete(pedido.id)}
                    title="Excluir Pedido"
                >
                    Excluir
                </button>
            </footer>
        </div>
    );
};


export default function ListaPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [clientMap, setClientMap] = useState({}); 
    const [loading, setLoading] = useState(true);

    const fetchPedidos = useCallback(async () => {
        setLoading(true);
        try {
            const [pedidosData, clientesData] = await Promise.all([
                buscarTodosPedidos(),
                buscarTodosClientes()
            ]);

            const newClientMap = clientesData.reduce((map, cliente) => {
                map[cliente.id] = cliente.nome;
                return map;
            }, {});
            
            setClientMap(newClientMap); 
            
            const sortedData = pedidosData.sort((a, b) => {
                if (a.status === 'PENDENTE' && b.status !== 'PENDENTE') return -1;
                if (a.status !== 'PENDENTE' && b.status === 'PENDENTE') return 1;
                if (a.status === 'EM_PREPARO' && b.status !== 'EM_PREPARO') return -1;
                if (a.status !== 'EM_PREPARO' && b.status === 'EM_PREPARO') return 1;
                return b.id - a.id; 
            });
            
            setPedidos(sortedData);
            toast.success("Dados carregados com sucesso (Pedidos e Clientes).");
        } catch (error) {
            toast.error(error.message || "Erro ao carregar os dados.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]);


    const handleStatusChange = async (pedidoId, novoStatus) => {
        try {
             await atualizarStatusPedido(pedidoId, novoStatus);
            toast.success(`Status do Pedido #${pedidoId} atualizado para ${STATUS_MAP[novoStatus].label}!`);

            setPedidos(prevPedidos => prevPedidos.map(p => 
                p.id === pedidoId ? { ...p, status: novoStatus } : p
            ));
            
        } catch (error) {
            toast.error(error.message || `Falha ao atualizar o status do pedido #${pedidoId}.`);
        }
    };

    const handleDelete = async (pedidoId) => {
    toast((t) => (
        <div>
            <p>
                Tem certeza que deseja DELETAR o Pedido {pedidoId}?
                <br />
                Esta ação não pode ser desfeita.
            </p>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                <button
                    style={{ 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 15px', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                    }}
                    onClick={async () => {
                        toast.dismiss(t.id); 
                        try {
                            await deletarPedido(pedidoId);
                            
                            toast.success(`Pedido #${pedidoId} deletado com sucesso. Estoque revertido.`, { duration: 4000 });
                            
                          
                            setPedidos(prevPedidos => prevPedidos.filter(p => p.id !== pedidoId));
                        } catch (error) {
                            toast.error(error.message || `Falha ao deletar o pedido #${pedidoId}.`);
                        }
                    }}
                >
                    Sim, Deletar
                </button>
                <button
                    style={{ 
                        backgroundColor: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 15px', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                    }}
                    onClick={() => toast.dismiss(t.id)} 
                >
                    Cancelar
                </button>
            </div>
        </div>
    ), {
        duration: 99999, 
       style: {
        backgroundColor: 'white',
        border: '1px solid #dc3545',
        padding: '16px',
        color: 'black', 
        maxWidth: '400px',
    },
    });
};

    return (
        <div className="admin-pedidos-container">
             <h1 className='tituloPedidos'>🍔 Gestão de Pedidos</h1>
             <header className="admin-pedidos-header">
                 <p>Dashboard de controle: visualize e atualize o status de todos os pedidos.</p>
                 <button className="refresh-button" onClick={fetchPedidos} disabled={loading}>
                     {loading ? 'Carregando...' : 'Recarregar Pedidos'}
                 </button>
             </header>

             {loading && <div className="loading-message">Aguarde, carregando pedidos...</div>}

             {!loading && pedidos.length === 0 && (
                 <div className="empty-state">
                     Nenhum pedido encontrado.
                 </div>
             )}

             <div className="pedidos-grid">
                 {pedidos.map(pedido => (
                     <PedidoCard
                         key={pedido.id}
                         pedido={pedido}
                         onStatusChange={handleStatusChange}
                         onDelete={handleDelete}
                         clientMap={clientMap} 
                     />
                 ))}
             </div>
        </div>
    );
}
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdLocationOn } from 'react-icons/md';
import './PedidoFeito.css'; 

export default function PedidoFeito() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { pedidoId, valorTotal, enderecoEntrega } = location.state || {};

    if (!pedidoId) {
        return (
            <div className="confirmacao-container erro">
                <h2>❌ Pedido Não Encontrado</h2>
                <p>Ocorreu um erro ou você acessou a página diretamente. Volte ao cardápio.</p>
                <button className="btn-voltar-home" onClick={() => navigate('/')}>Ir para o Cardápio</button>
            </div>
        );
    }

    return (
        <div className="confirmacao-container">
            <MdCheckCircle size={80} className="check-icon" />
            <h2>Pedido Recebido com Sucesso!</h2>
            
            <div className="detalhes-pedido">
                <p>Obrigado pela sua compra. Seu pedido será preparado imediatamente!</p>
                
                <div className="info-box">
                    <strong>Número do Pedido:</strong> <span>#{pedidoId}</span>
                </div>
                
                <div className="info-box">
                    <strong>Valor Total:</strong> <span>R$ {valorTotal ? valorTotal.toFixed(2) : '0.00'}</span>
                </div>
                
                <div className="info-box info-endereco">
                    <MdLocationOn size={18} />
                    <strong>Entrega em:</strong> <span>{enderecoEntrega || 'Endereço não especificado'}</span>
                </div>
                
                <div className="info-box status-info">
                    <strong>Status Inicial:</strong> <span className="status-badge">PENDENTE</span>
                </div>
            </div>

            <div className="acoes-finais">
                <button className="btn-voltar-home" onClick={() => navigate('/')}>Continuar Comprando</button>
            </div>
        </div>
    );
}
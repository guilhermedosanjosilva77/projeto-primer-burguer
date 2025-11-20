import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { criarPedido } from '../../../api/CriarPedido.js'; 
import { MdPayment, MdClose, MdLocationOn, MdPerson } from 'react-icons/md';
import "./FinalizarPedido.css";

export default function FinalizarPedido({ carrinho }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const { clienteId, clienteData } = location.state || {};
    
    const enderecoFormatado = clienteData 
        ? `${clienteData.rua}, ${clienteData.numeroCasa} - ${clienteData.bairro}, ${clienteData.cidade}`
        : 'Endereço não confirmado. Retorne ao Cadastro de Cliente.';

    const { itensParaRenderizar, valorTotal } = useMemo(() => {
        const itensAgrupados = carrinho.reduce((acumulador, itemAtual) => {
            // Usa 'item' ou 'items' como chave de agrupamento, mas usa 'id' como id_produto
            const key = itemAtual.item || itemAtual.items;
            acumulador[key] = acumulador[key] || { 
                ...itemAtual, 
                quantidade: 0,
                id_produto: itemAtual.id, 
            };
            acumulador[key].quantidade++;
            return acumulador;
        }, {});
        
        const itens = Object.values(itensAgrupados);
        const total = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        
        return { itensParaRenderizar: itens, valorTotal: total };
    }, [carrinho]);

    const handleFinalizarCompra = async (e) => {
        e.preventDefault();

        if (!clienteId || !clienteData) {
            Swal.fire({
                icon: 'error',
                title: 'Dados do Cliente Ausentes',
                text: 'Por favor, complete seu cadastro e endereço antes de finalizar.',
                confirmButtonColor: '#FF7F00'
            }).then(() => {
                 navigate('/cadastroCliente'); 
            });
            return;
        }

        if (itensParaRenderizar.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Carrinho Vazio',
                text: 'Adicione itens ao carrinho antes de finalizar o pedido.',
            });
            return;
        }

        setLoading(true);

        const itensDTO = itensParaRenderizar.map(item => ({
            produtoId: item.id_produto,
            quantidade: item.quantidade
        }));

        const pedidoDTO = {
            clienteId: parseInt(clienteId), 
            itens: itensDTO
        };

        try {
            const novoPedido = await criarPedido(pedidoDTO);
            
            // Navega para a confirmação, passando os dados do pedido e o endereço formatado
            navigate('/pedidoFeito', { 
                state: { 
                    pedidoId: novoPedido.id, 
                    valorTotal: novoPedido.valorTotal,
                    enderecoEntrega: enderecoFormatado // Passa o endereço completo
                } 
            });
            
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            
            const errorMessage = error.message || "Erro desconhecido ao processar o pedido.";

            Swal.fire({
                icon: 'error',
                title: 'Falha no Pedido',
                html: `Ocorreu um erro ao finalizar a compra. Motivo: <br/><strong>${errorMessage}</strong>`,
                confirmButtonColor: '#C62828'
            });
            
        } finally {
            setLoading(false);
        }
    };

    if (carrinho.length === 0) {
        return (
            <div className="checkout-container vazio">
                <h2><MdClose /> Seu carrinho está vazio.</h2>
                <button className="btn-voltar" onClick={() => navigate('/')}>Voltar ao Cardápio</button>
            </div>
        );
    }
    
    // Se não houver dados de cliente, exibe um aviso
    if (!clienteId || !clienteData) {
         return (
            <div className="checkout-container vazio">
                <h2><MdPerson /> Confirmação de Dados Necessária</h2>
                <p>Ocorreu um erro na passagem de dados. Por favor, confirme seu cadastro para prosseguir.</p>
                <button className="btn-voltar" onClick={() => navigate('/cadastroCliente')}>Ir para Confirmação de Cadastro</button>
            </div>
        );
    }


    return (
        <div className="checkout-container">
            <h2><MdPayment /> Finalizar Pedido</h2>
            
            <div className="checkout-content">
                
                {/* 1. Dados Confirmados do Cliente */}
                <div className="dados-cliente-confirmados">
                    <div className="info-box-confirmacao">
                        <MdPerson size={20} className="icon-info" />
                        <p><strong>Cliente:</strong> {clienteData.nome} (ID: {clienteId})</p>
                    </div>
                    <div className="info-box-confirmacao">
                        <MdLocationOn size={20} className="icon-info" />
                        <p><strong>Entrega em:</strong> {enderecoFormatado}</p>
                    </div>
                    <button 
                        className="btn-mudar-endereco" 
                        onClick={() => navigate('/cadastroCliente', { state: { fromCheckout: true } })}
                    >
                        Alterar Endereço
                    </button>
                </div>

                {/* 2. Resumo do Pedido */}
                <div className="resumo-pedido">
                    <h3>Resumo dos Itens</h3>
                    <ul>
                        {itensParaRenderizar.map((item, index) => (
                            <li key={index}>
                                <span>{item.quantidade}x {item.item || item.items}</span>
                                <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="total">
                        <strong>Total:</strong>
                        <strong>R$ {valorTotal.toFixed(2)}</strong>
                    </div>
                </div>

                {/* 3. Pagamento e Ação Final */}
                <form onSubmit={handleFinalizarCompra} className="formulario-checkout">
                    <h3>Opções Finais</h3>

                    <div className="form-group">
                        <label>Forma de Pagamento</label>
                        <select className="input-pagamento">
                            <option>Dinheiro na entrega (Troco para R$ XX)</option>
                            <option>Cartão (Máquina)</option>
                            <option>PIX (Chave enviada no WhatsApp)</option>
                        </select>
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-finalizar-compra">
                        {loading ? 'Processando...' : `Confirmar Pedido de R$ ${valorTotal.toFixed(2)}`}
                    </button>
                </form>
            </div>
        </div>
    );
}
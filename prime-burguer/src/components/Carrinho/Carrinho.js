// src/components/Car/Car.jsx (ou onde estiver)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react'; // Adicionado para otimização
import { MdDeleteForever, MdShoppingCart } from 'react-icons/md';
import "./Carrinho.css";

/**
 * Agrupa os itens do carrinho e calcula o valor total.
 * @param {Array} carrinho - Lista não agrupada de itens do carrinho.
 * @returns {{itensParaRenderizar: Array, valorTotal: number}}
 */
const agruparItensECalcularTotal = (carrinho) => {
    let valorTotal = 0;

    const itensAgrupados = carrinho.reduce((acumulador, itemAtual) => {
        // Usa o ID como chave, se disponível (melhor prática), ou o nome.
        const key = itemAtual.id || itemAtual.item || itemAtual.items;
        const nome = itemAtual.item || itemAtual.items;
        
        // Garante que a chave existe e inicializa
        acumulador[key] = acumulador[key] || { 
            id_produto: itemAtual.id, // Adiciona o ID para o DTO de pedido
            nome: nome,
            preco: parseFloat(itemAtual.preco),
            foto: itemAtual.foto,
            quantidade: 0,
            // A chave que será usada para remover uma unidade (sempre o nome/id para o pai)
            id_chave: key 
        };
        
        acumulador[key].quantidade++;
        valorTotal += parseFloat(itemAtual.preco);
        
        return acumulador;
    }, {}); 

    // Converte o objeto de volta para um array para renderização
    const itensParaRenderizar = Object.values(itensAgrupados);
    
    return { itensParaRenderizar, valorTotal };
};

// Componente principal do Carrinho
export function Car({ carrinho, onRemoveItem }) { 
    const navigate = useNavigate(); // Hook deve estar no corpo da função do componente

    // Usa useMemo para recalcular apenas quando o carrinho mudar
    const { itensParaRenderizar, valorTotal } = useMemo(() => 
        agruparItensECalcularTotal(carrinho), 
        [carrinho]
    );
    
    // Função que chama o callback de remoção (assumindo que o pai atualizará o estado)
    const handleRemove = (itemKey) => {
        if (onRemoveItem) {
            onRemoveItem(itemKey);
        }
    };
    
    // Função de navegação para o checkout
    const handleCheckout = () => {
        navigate('/finalizarPedido');
    };

    return (
        <div className="carrinho-principal"> 
            <h3><MdShoppingCart /> Seu Carrinho</h3>
            
            {itensParaRenderizar.length > 0 ? (
                <>
                    {/* 1. Mapeia a lista agrupada para renderizar os itens */}
                    <ul className="carrinho-lista-itens">
                        {itensParaRenderizar.map((item, index) => (
                            <li key={item.id_chave}>
                                {/* Imagem */}
                                <img src={item.foto} alt={item.nome} className="item-foto" />
                                
                                <div className="carrinho-info-texto">
                                    <p className="item-nome">
                                        {item.nome}
                                    </p>
                                    <p className="item-detalhes">
                                        R$ {item.preco.toFixed(2)} ({item.quantidade}x) = R$ {(item.preco * item.quantidade).toFixed(2)}
                                    </p>
                                </div>
                                
                                {/* BOTÃO DE EXCLUSÃO */}
                                <button 
                                    className="carrinho-remover-btn"
                                    onClick={() => handleRemove(item.id_chave)}
                                    title="Remover uma unidade"
                                >
                                    <MdDeleteForever />
                                </button>
                            </li>
                        ))}
                    </ul>
                    
                    {/* Linha de Total */}
                    <div className="carrinho-total">
                        <strong>Total do Pedido:</strong>
                        <span>R$ {valorTotal.toFixed(2)}</span>
                    </div>

                    {/* 2. Botão de finalizar pedido */}
                    <button 
                        className="carrinho-finalizar-btn"
                        onClick={handleCheckout}
                    >
                        Finalizar Pedido
                    </button>
                </>
            ) : (
                <p className="carrinho-vazio-msg">Seu carrinho está vazio.</p>
            )}
        </div>
    );
}
import React from 'react';
import { data, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { MdDeleteForever, MdShoppingCart, MdAdd, MdRemove } from 'react-icons/md'; // Novos ícones para controle
import toast from 'react-hot-toast';
import "./Carrinho.css";

const agruparItensECalcularTotal = (carrinho) => {
    let valorTotal = 0;

    const itensAgrupados = carrinho.reduce((acumulador, itemAtual) => {
        const key = itemAtual.id || itemAtual.item || itemAtual.items;
        const nome = itemAtual.nome || itemAtual.item || itemAtual.items;
        
        acumulador[key] = acumulador[key] || { 
            id_produto: itemAtual.id, 
            nome: nome,
            preco: parseFloat(itemAtual.preco) || 0,
            img: itemAtual.img,
            quantidade: 0,
            id_chave: key 
        };
        
        acumulador[key].quantidade++;
        valorTotal += parseFloat(itemAtual.preco) || 0;
        
        return acumulador;
    }, {}); 

    const itensParaRenderizar = Object.values(itensAgrupados);
    
    return { itensParaRenderizar, valorTotal };
};


export function Car({ carrinho, setCarrinho }) { 
    const navigate = useNavigate();

    const { itensParaRenderizar, valorTotal } = useMemo(() => 
        agruparItensECalcularTotal(carrinho), 
        [carrinho]
    );

    //Adicionar unidade
    const handleAddUnit = (groupedItem) => {
        const itemTemplate = carrinho.find(item => (item.id || item.item || item.items) === groupedItem.id_chave);
        
        if (itemTemplate) {
            setCarrinho(prevCarrinho => [...prevCarrinho, itemTemplate]);
            toast.success(`Mais um ${groupedItem.nome} adicionado!`, { duration: 1000 });
        }
    };
    
    //remover unidade
    const handleRemoveUnit = (itemKey) => {
        const indexToRemove = carrinho.findIndex(item => (item.id || item.item || item.items) === itemKey);
        
        //Remover tudo
        if (indexToRemove > -1) {
            setCarrinho(prevCarrinho => {
                const newCarrinho = [...prevCarrinho];
                newCarrinho.splice(indexToRemove, 1);
                return newCarrinho;
            });
        
        }
    };

   
    const handleRemoveAll = (itemKey, nome) => {
        setCarrinho(prevCarrinho => 
            prevCarrinho.filter(item => (item.id || item.item || item.items) !== itemKey)
        );
        toast.error(`${nome} removido completamente.`, { duration: 1500 });
    };
    
    
    //Finalizar Pedido
    const handleCheckout = () => {
        if (valorTotal > 0) {
            //Pega valores já salvos no caixa
            const caixa = JSON.parse(localStorage.getItem("caixa")) || []

            caixa.push({
                valor:valorTotal,
                data: new Date().toISOString(),
                itens:itensParaRenderizar
            });
             //Salvar de volta

             localStorage.setItem("Caixa",JSON.stringify(caixa))

            navigate('/finalizarPedido');
        } else {
            toast.error("Adicione itens ao carrinho antes de finalizar!");
        }
    };

    return (
        <div className="carrinho-principal"> 
            <h3>
                <MdShoppingCart className="carrinho-icon-header" /> 
                Seu Carrinho
            </h3>
            
            {itensParaRenderizar.length > 0 ? (
                <>
                    
                    <ul className="carrinho-lista-itens">
                        {itensParaRenderizar.map((item) => (
                            <li key={item.id_chave}>
                                {/* Imagem */}
                                <img 
                                    src={item.img || 'https://placehold.co/60x60/D32F2F/FFFFFF?text=Item'} 
                                    alt={item.nome} 
                                    className="item-foto" 
                                />
                                
                                <div className="carrinho-info-texto">
                                    <p className="item-nome">
                                        {item.nome}
                                    </p>
                                    <p className="item-preco-unidade">
                                        R$ {item.preco.toFixed(2)} / un
                                    </p>
                                    <p className="item-subtotal">
                                        Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}
                                    </p>
                                </div>
                                
                              
                                <div className="carrinho-quantidade-controle">
                                    
                                    <button 
                                        className="btn-qtd-minus"
                                        onClick={() => handleRemoveUnit(item.id_chave)}
                                        disabled={item.quantidade === 1} // Não permite ir abaixo de 1
                                        title="Remover uma unidade"
                                    >
                                        <MdRemove />
                                    </button>
                                    
                                    {/* Exibição da Quantidade */}
                                    <span className="qtd-display">{item.quantidade}</span>
                                    
                                    {/* Botão de Adicionar Unidade */}
                                    <button 
                                        className="btn-qtd-plus"
                                        onClick={() => handleAddUnit(item)}
                                        title="Adicionar uma unidade"
                                    >
                                        <MdAdd />
                                    </button>
                                </div>
                                
                                {/* BOTÃO DE EXCLUSÃO TOTAL */}
                                <button 
                                    className="carrinho-remover-all-btn"
                                    onClick={() => handleRemoveAll(item.id_chave, item.nome)}
                                    title="Remover todas as unidades deste item"
                                >
                                    <MdDeleteForever />
                                </button>
                            </li>
                        ))}
                    </ul>
                    
                    {/* Linha de Total */}
                    <div className="carrinho-total">
                        <strong className="total-label">Total do Pedido:</strong>
                        <span className="total-value">R$ {valorTotal.toFixed(2)}</span>
                    </div>

                    {/* 2. Botão de finalizar pedido */}
                    <button 
                        className="carrinho-finalizar-btn"
                        onClick={handleCheckout}
                        disabled={valorTotal === 0}
                    >
                        Finalizar Pedido
                    </button>
                </>
            ) : (
                <div className="carrinho-vazio-msg">
                    <MdShoppingCart size={60} color="#ccc" />
                    <p>Seu carrinho está vazio. Que tal um hambúrguer delicioso?</p>
                </div>
            )}
        </div>
    );
}
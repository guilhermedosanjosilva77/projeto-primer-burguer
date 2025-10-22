import "./Carrinho.css"

// Adicionamos a prop 'onRemoveItem'
export function Car({ carrinho, onRemoveItem }) { 
  // Cria um objeto para agrupar os itens e contar a quantidade
  const itensAgrupados = carrinho.reduce((acumulador, itemAtual) => {
    // Usa o nome do item como chave.
    const key = itemAtual.item || itemAtual.items;
    
    // Garante que a chave existe e inicializa com o item e quantidade 0.
    // É crucial armazenar a REFERÊNCIA do primeiro item para poder passá-la para a função de remoção,
    // pois a remoção deve ser feita no array não-agrupado.
    acumulador[key] = acumulador[key] || { 
        ...itemAtual, 
        quantidade: 0,
        // Armazena uma chave única para a remoção, se o item tiver 'id', use 'itemAtual.id'.
        // Como não há 'id' no seu código, usamos o nome como identificador primário.
        id_chave: key 
    };
    
    // Incrementa a quantidade
    acumulador[key].quantidade++;
    
    return acumulador; // Retorna o acumulador para a próxima iteração
  }, {}); 

  // Converte o objeto de volta para um array para renderização
  const itensParaRenderizar = Object.values(itensAgrupados);
  
  // Função que chama o callback de remoção (assumindo que o pai atualizará o estado)
  const handleRemove = (itemKey) => {
      // Chamamos a função passada pelo pai, que deve remover uma instância do item 'itemKey'.
      if (onRemoveItem) {
          onRemoveItem(itemKey);
      }
  };
  
  // O componente React DEVE retornar o JSX aqui.
  return (
    <div className="carrinho-principal"> 
      <h3>Seu Carrinho</h3>
      
      {/* 1. Mapeia a lista agrupada para renderizar os itens */}
      <ul>
        {itensParaRenderizar.map((item, index) => (
          <li key={index}>
            {/* Imagem */}
            <img src={item.foto} alt={item.item || item.items} width="100" />
            
            <div className="carrinho-info-texto"> {/* Nova div para alinhar texto e botão */}
                <p>
                  {item.item || item.items} - R$ {item.preco} ({item.quantidade}x)
                </p>
                
                {/* BOTÃO DE EXCLUSÃO */}
                {/* Note que o agrupamento complica a remoção unitária. 
                    Aqui, ao clicar, removemos APENAS UM item daquele tipo. 
                    Se 'quantidade' for > 1, ela será decrementada no estado pai. */}
                <button 
                    className="carrinho-remover-btn"
                    onClick={() => handleRemove(item.id_chave)}
                >
                    [X]
                </button>
            </div>
          </li>
        ))}
      </ul>
      
      {/* 2. Botão de finalizar pedido */}

      {itensParaRenderizar.length > 0 && (
        <button className="carrinho-finalizar-btn">Finalizar pedido</button>
      )}
      
      {itensParaRenderizar.length === 0 && (
        <p>Seu carrinho está vazio.</p>
      )}
    </div>
  );
}
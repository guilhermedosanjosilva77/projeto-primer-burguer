export function Car({ carrinho }) {
  // Cria um objeto para agrupar os itens e contar a quantidade
  const itensAgrupados = carrinho.reduce((acumulador, itemAtual) => {
    // Usa o nome do item como chave.
    // Garante que a chave existe e inicializa com 0 se não existir.
    const key = itemAtual.item || itemAtual.items;
    acumulador[key] = acumulador[key] || { ...itemAtual, quantidade: 0 };
    // Incrementa a quantidade
    acumulador[key].quantidade++;
    return acumulador;
  }, {});

  // Converte o objeto de volta para um array para renderizar
  const itensParaRenderizar = Object.values(itensAgrupados);

  return (
    <div>
      <h2>Carrinho</h2>
     

      {itensParaRenderizar.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <div>
          <h3>Itens no Carrinho</h3>
          <ul>
            {itensParaRenderizar.map((item, index) => (
              <li key={index}>
                <img src={item.foto} alt={item.item || item.items} width="100" />
                <p>
                  {item.item || item.items} - R$ {item.preco} ({item.quantidade}x)
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
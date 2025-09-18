export function Car({ carrinho }) {
  //faz com que o item(lanche) apareça em uma parte do carrinho e os doçes(items) em outra
  return (
    <div>
      <h2>Carrinho</h2>

      {carrinho.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <div>
          <h3>Lanches</h3>
          <ul>
            {carrinho
              .filter((item) => item.item)
              .map((item, index) => (
                <ul key={index}>
                  <img src={item.foto} alt={item.item} width="100" />
                  <p>
                    {item.item}, R$ {item.preco}
                  </p>
                </ul>
              ))}
          </ul>

          <h3>Doces</h3>
          <ul>
            {carrinho
              .filter((items) => items.items)
              .map((items, index) => (
                <ul key={index}>
                  <img src={items.foto} alt={items.item} width="100" />
                  <p>
                    {items.items}, R$ {items.preco}
                  </p>
                </ul>
              ))}
          </ul>
          
        </div>
      )}
    </div>
  );
}

export function Car({ carrinho }) {//faz com que o item(lanche) apareça em uma parte do carrinho e os doçes(items) em outra
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
                <li key={index}>{item.item}</li>
              ))}
          </ul>

          <h3>Doces</h3>
          <ul>
            {carrinho
              .filter((items) => items.items) 
              .map((items, index) => (
                <li key={index}>{items.items}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

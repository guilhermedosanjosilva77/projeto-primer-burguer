export function Car({ carrinho }) {
  return (
    <div>
      <h2>Carrinho</h2>
      {carrinho.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <ul>
          {carrinho.map((item, index) => (
            <li key={index}>{item.item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ArticleLanches({ lanche, adicionarAoCarrinho }) {
  return (
    <div className="item-lanche">
      <img src={lanche.img} alt={lanche.nome} className="imagelanche" />
      <h1 style={{ textAlign: "center" }}>{lanche.nome}</h1>

      <div className="under-title">
        <h2>R$ {lanche.preco.toFixed(2)}</h2>

        <div className="buttondesc">
          <p>{lanche.descricao}</p>

          <button
            onClick={() => adicionarAoCarrinho(lanche)}
            className="lanchebuttom"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export function ArticleSobremessa({ doces, adicionarAoCarrinho }) {
  return (
    <div className="items-doce">
     <img src={doces.img} alt={doces.nome} className="imagelanche" />
      <h1 style={{ textAlign: "center" }}>{doces.nome}</h1>

      <div className="under-title">
        <h2>R$ {doces.preco.toFixed(2)}</h2>

        <div className="buttondesc">
          <p>{doces.descricao}</p>

          <button
            className="docebuttom"
            onClick={() => adicionarAoCarrinho(doces)}
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
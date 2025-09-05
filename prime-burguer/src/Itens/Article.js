function ArticleLanches({ lanche, adicionarAoCarrinho }) {
  //mostra o lanche e seus atributos na pag inicial e deixa add no carrinho
  return (
    <div className="item-lanche">
      <img src={lanche.foto} />
      <p>{lanche.descricao}</p>
      <p>{lanche.preco}</p>
      <button onClick={() => adicionarAoCarrinho(lanche)}>
        Adicionar ao carrinho
      </button>
    </div>
  );
}

export default ArticleLanches;

export function ArticleSobremessa({ doces, adicionarAoCarrinho }) {
  //mostra os doces e seus atributos na pag inicial e deixa add no carrinho
  return (
    <div className="item-doce">
      <div className="under-title">
        <img src={doces.foto} />
        <div className="titulo-desc1">
          <h1>{doces.item}</h1>
          <p>{doces.descricao}</p>
        </div>
      </div>

      <button onClick={() => adicionarAoCarrinho(doces)}>
        Adicionar ao carrinho
      </button>
    </div>
  );
}

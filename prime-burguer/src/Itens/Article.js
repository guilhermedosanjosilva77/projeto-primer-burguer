function ArticleLanches({ lanche, adicionarAoCarrinho }) {
  //mostra o lanche e seus atributos na pag inicial e deixa add no carrinho
  return (
    <div className="item-lanche">
      <h1>{lanche.item}</h1>
        <div className="under-title">
      <img src={lanche.foto} />
      <p>{lanche.descricao}</p>
      </div>
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
    <div className="items-doce">
      <div className="under-title">
        <img src={doces.foto} />
        <div className="titulo-desc1">
          <h1>{doces.items}</h1>
          <p>{doces.descricao}</p>
        </div>
      </div>

      <button onClick={() => adicionarAoCarrinho(doces)}>
        Adicionar ao carrinho
      </button>
    </div>
  );
}

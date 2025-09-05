function ArticleLanches({ lanche, adicionarAoCarrinho }) {
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



export function ArticleSobremessa({doces}) {
    return (
        <div className="item-doce"> 
            
            <div className="under-title">
             <img src={doces.foto} />
             <div className="titulo-desc1">
             <h1>{doces.item}</h1>
            <p>{doces.descricao}</p>
            </div>
            </div>
        </div>

    )
}

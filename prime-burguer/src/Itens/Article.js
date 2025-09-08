function ArticleLanches({ lanche, adicionarAoCarrinho }) {
  //mostra o lanche e seus atributos na pag inicial e deixa add no carrinho
  return (
    <div className="item-lanche">
      <img src={lanche.foto} className="imagelanche"/>
       <h1 style={{textAlign:"center"}}>{lanche.item}</h1>
      <div className="under-title">
        <h2>{lanche.preco}</h2>
        <div className="buttondesc">
        <p>{lanche.descricao}</p>

        <button onClick={() => adicionarAoCarrinho(lanche)}>
          Adicionar ao carrinho
        </button>
        </div>
      </div>
    </div>
  );
}

export default ArticleLanches;

export function ArticleSobremessa({ doces, adicionarAoCarrinho }) {
  //mostra os doces e seus atributos na pag inicial e deixa add no carrinho
  return (

    //Explicando as divs:
    //DIV ITEMS-DOCE:div pai, onde todos estão dentro
    //DIV UNDER-TITLE:Div onde estão os itens titulo,preco,
    // descricao e botao 
    //DIV BUTTONDESC:DIv onde estao os itens descricao e botão
    //Mesma logica no ArticleLanches

    <div className="items-doce">
      <img src={doces.foto} />
      <h1 style={{textAlign:"center"}}>{doces.items}</h1>
      <div className="under-title">
       
        <h2>{doces.preco}</h2>
        <div className="buttondesc">
          <p>{doces.descricao}</p>

          <button onClick={() => adicionarAoCarrinho(doces)}>
            Adicionar ao carrinho

          </button>
        </div>
      </div>

    </div>
  );
}

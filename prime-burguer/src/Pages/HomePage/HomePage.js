import { useEffect, useState } from "react";
import Banner from "../../assets/img/Banner e Logo/Banner.png"; 
import ArticleLanches, { ArticleSobremessa } from "../../components/Article/Article.js"; 
import { getTodosProdutos } from "../../api/CriarProduto.js"; 

function HomePage({ adicionarAoCarrinho }) {
  const [produtos, setProdutos] = useState({
    Lanche: [],
    Acompanhamento: [],
    Bebida: [],
    Sobremesa: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarProdutos() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getTodosProdutos(); 

        // 1. Inicializa o objeto de categorias
        const categoriasMap = {
          Lanche: [],
          Acompanhamento: [],
          Bebida: [],
          Sobremesa: [],
        };

        data.forEach(p => {
          const categoria = p.categoria;
          if (categoriasMap.hasOwnProperty(categoria)) {
            categoriasMap[categoria].push(p);
          }
        });

        setProdutos(categoriasMap);
        
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar o cardápio. Verifique a conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  const secoes = [
    { key: 'Lanche', title: 'Lanches ', component: ArticleLanches },
    { key: 'Acompanhamento', title: 'Acompanhamentos ', component: ArticleLanches },
    { key: 'Bebida', title: 'Bebidas ', component: ArticleLanches },
    { key: 'Sobremesa', title: 'Sobremesas ', component: ArticleSobremessa }, 
  ];
  
  if (loading) {
    return <div className="body" style={{ textAlign: 'center', padding: '50px' }}><h1>Carregando Cardápio...</h1></div>;
  }

  if (error) {
    return <div className="body" style={{ textAlign: 'center', padding: '50px', color: 'red' }}><h1>{error}</h1></div>;
  }


  return (
    <div className="body">
      <div className="banner">
        <img
          src={Banner}
          className="bannerpicture"
          alt="Banner da Lanchonete, com a logo e pratos"
        />
        <div className="banner-texto">
          <h1>Seja bem-vindo ao Prime Burguer! </h1>
          <p>Onde o sabor é sempre a estrela do prato </p>
        </div>
      </div>

      <main>
        {secoes.map(({ key, title, component: ProductArticle }) => {
          const itens = produtos[key];
          
          if (itens && itens.length > 0) {
            return (
              <section key={key} className={key.toLowerCase()} style={{ textAlign: "center" }}>
                <h1 className="styleh1" style={{ fontSize: "4em" }}>{title}</h1> 
                <div className={`${key.toLowerCase()}1`}>
                  {itens.map((item) => (
                    <ProductArticle
                      key={item.id}
                      item={item} 
                      adicionarAoCarrinho={adicionarAoCarrinho}
                    />
                  ))}
                </div>
              </section>
            );
          }
          return null; 
        })}

        {Object.values(produtos).every(arr => arr.length === 0) && (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2 className="styleh1">Cardápio Vazio! </h2>
                <p>Nenhum item cadastrado no momento.</p>
            </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
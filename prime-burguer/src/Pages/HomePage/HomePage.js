import { useEffect, useState } from "react";
import Banner from "../../assets/img/Banner e Logo/Banner.png";
import ArticleLanches, { ArticleSobremessa } from "../../components/Article/Article.js";

function HomePage({ adicionarAoCarrinho }) {
  const [lanches, setLanches] = useState([]);
  const [sobremesas, setSobremesas] = useState([]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        // Você pode alternar por categoria se sua API permitir
        const response = await fetch("http://localhost:8080/produtos");
        const data = await response.json();

        // Caso você queira separar lanches e sobremesas:
        const l = data.filter(p => p.categoria === "LANCHE");
        const s = data.filter(p => p.categoria === "SOBREMESA");

        setLanches(l);
        setSobremesas(s);

      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    }

    carregarProdutos();
  }, []);

  return (
    <div className="body">
      <div className="banner">
        <img
          src={Banner}
          className="bannerpicture"
          alt="Banner da Lanchonete, com a logo e pratos"
        />
        <div className="banner-texto">
          <h1>Seja bem-vindo ao Prime Burguer! 🍔</h1>
          <p>Onde o sabor é sempre a estrela do prato ⭐</p>
        </div>
      </div>

      <main>
        <section className="lanche" style={{ textAlign: "center" }}>
          <h1 className="styleh1" style={{ fontSize: "90px" }}>Lanches</h1>

          <div className="lanche1">
            {lanches.map((lanche) => (
              <ArticleLanches
                key={lanche.id}
                lanche={lanche}
                adicionarAoCarrinho={adicionarAoCarrinho}
              />
            ))}
          </div>
        </section>

        <section className="sobremessa">
          <h1 className="styleh1" style={{ textAlign: "center", fontSize: "90px" }}>
            Sobremesa
          </h1>

          <div className="sobremessa1">
            {sobremesas.map((doce) => (
              <ArticleSobremessa
                key={doce.id}
                doces={doce}
                adicionarAoCarrinho={adicionarAoCarrinho}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;

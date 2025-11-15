import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Nave } from "./components/Nav/Nav";
import ArticleLanches from "./components/Article/Article.js";
import { ArticleSobremessa } from "./components/Article/Article.js";
import "./App.css";
import {
  itensDoCardapioLanches,
  itensDoCardapioSobremessas,
} from "./api/itens-card";
import Footer from "./components/Footer/footer.js";
import { Car } from "./components/Carrinho/Carrinho.js";
import { Register } from "./components/Registro/Registro.js";
import { Contact } from "./components/Contato/Contato.js";
import Banner from "./assets/img/Banner e Logo/Banner.png";
import HomeAdmin from "./Pages/HomeAdmin.js";
import { useLocation } from "react-router-dom";
import Estoque from "./Pages/PaginaEstoque/Estoque.js";
import Cadastrar from "./Pages/EditarItensDoCardapio/Cadastrar.js";
import Lista from "./Pages/EditarItensDoCardapio/Listar.js";

function App() {
  //Criando objeto item como array -GUI
  const [item, setItem] = useState([]);   
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (item) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, item]);
  };

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Layout
          carrinho={carrinho}
          adicionarAoCarrinho={adicionarAoCarrinho}
          item={item}          
          setItem={setItem}
        />
      </BrowserRouter>
    </>
  );
}

function Layout({ carrinho, adicionarAoCarrinho, item, setItem }) {
  const location = useLocation();
  const isAdminPage = location.pathname === "/homeAdmin";

  return (
    <>
      {!isAdminPage && (
        <header>
          <nav>
            <Nave />
          </nav>
        </header>
      )}

      <Routes>
        <Route
          path="/"
          element={<HomePage adicionarAoCarrinho={adicionarAoCarrinho} />}
        />
        <Route
          path="/home"
          element={<HomePage adicionarAoCarrinho={adicionarAoCarrinho} />}
        />
        <Route path="/carrinho" element={<Car carrinho={carrinho} />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route
          path="/cadastrar"
          element={<Cadastrar item={item} setItem={setItem} />}
        />

        <Route path="/Lista" element={<Lista item={item} setItem={setItem} />} />
      </Routes>

      {!isAdminPage && (
        <footer>
          <Footer />
        </footer>
      )}
    </>
  );
}

function HomePage({ adicionarAoCarrinho }) {
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
          <h1 className="styleh1" style={{ fontSize: "90px" }}>
            Lanches
          </h1>
          <div className="lanche1">
            {itensDoCardapioLanches.map((lanche) => (
              <ArticleLanches
                key={lanche.id}
                lanche={lanche}
                adicionarAoCarrinho={adicionarAoCarrinho}
              />
            ))}
          </div>
        </section>

        <section className="sobremessa">
          <h1
            className="styleh1"
            style={{ textAlign: "center", fontSize: "90px" }}
          >
            Sobremesa
          </h1>
          <div className="sobremessa1">
            {itensDoCardapioSobremessas.map((doce) => (
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

export default App;

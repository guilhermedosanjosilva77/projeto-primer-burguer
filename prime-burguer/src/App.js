import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 1. IMPORTAÇÃO DO TOASTER
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

//criação da const carrinho junto desse useState JAO
function App() {
  const [carrinho, setCarrinho] = useState([]);
  const adicionarAoCarrinho = (item) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, item]);
  };

  //criação das rotas (router) JAO
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Layout
          carrinho={carrinho}
          adicionarAoCarrinho={adicionarAoCarrinho}
        />
      </BrowserRouter>
    </>
  );
}

//Criação de uma função para gerar apenas o layout
function Layout({ carrinho, adicionarAoCarrinho }) {
  const location = useLocation();

  // Verifica se está na rota /homeAdmin
  const isAdminPage = location.pathname === "/homeAdmin";

  return (
    <>
      {/* Exibe o Nav apenas se não for a página de admin */}
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
        <Route path="/home" element={<HomePage adicionarAoCarrinho={adicionarAoCarrinho} />} />
        <Route path="/carrinho" element={<Car carrinho={carrinho} />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/estoque" element={<Estoque />} />
      </Routes>

      {/* Exibe o Footer apenas se não for a página de admin */}
      {!isAdminPage && (
        <footer>
          <Footer />
        </footer>
      )}
    </>
  );
}

//criação da function homepage com o obj de add ao carrinho JAO
function HomePage({ adicionarAoCarrinho }) {
  return (
    //Banner fixo na home
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
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
import HomePage from "./Pages/HomePage/HomePage.js";

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

export default App;

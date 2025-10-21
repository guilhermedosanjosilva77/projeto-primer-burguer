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

//criação da const carrinho junto desse useState JAO
function App() {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (item) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, item]);
  };
  
  // FUNÇÃO IMPLEMENTADA PARA EXCLUIR UM ITEM POR VEZ DO CARRINHO (REMOÇÃO UNITÁRIA)
  const handleRemoveItem = (itemKey) => {
    // Encontra o índice do PRIMEIRO item que corresponde à chave (nome)
    const indexToRemove = carrinho.findIndex(item => (item.item || item.items) === itemKey);

    if (indexToRemove !== -1) {
      // Cria uma CÓPIA do array do carrinho para garantir a imutabilidade
      const novoCarrinho = [...carrinho]; 
      
      // Remove apenas UMA instância do item no índice encontrado
      novoCarrinho.splice(indexToRemove, 1); 
      
      // Atualiza o estado do carrinho
      setCarrinho(novoCarrinho);
    }
  };
  
  //criação das rotas (router) JAO
  return (
    <>
      <Toaster /> 
      <BrowserRouter>
        <header>
          <nav>
            <Nave />
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={<HomePage adicionarAoCarrinho={adicionarAoCarrinho} />}
          />
          {/* A ROTA /carrinho FOI ATUALIZADA PARA PASSAR A FUNÇÃO handleRemoveItem */}
          <Route 
            path="/carrinho" 
            element={<Car carrinho={carrinho} onRemoveItem={handleRemoveItem} />} 
          />
          <Route path="/registro" element={<Register />} />
          <Route path="/contato" element={<Contact />} />
          <Route
            path="/home"
            element={<HomePage adicionarAoCarrinho={adicionarAoCarrinho} />}
          />
          <Route
            path="/car"
            element={<HomePage adicionarAoCarrinho={adicionarAoCarrinho} />}
          />
        </Routes>
        
        {/* Movi o Footer para fora do BrowserRouter, dentro do componente principal App. */}
        <footer>
          <Footer />
        </footer>
      </BrowserRouter>
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

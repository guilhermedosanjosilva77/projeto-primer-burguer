import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nave } from "./Itens/Nav";
import ArticleLanches from "./Itens/Article";
import { ArticleSobremessa } from "./Itens/Article";
import "./App.css";
import {
  itensDoCardapioLanches,
  itensDoCardapioSobremessas,
} from "./cards/itens-card";
import Footer from "./Itens/footer";
import { Car } from "./testeredirecionamento/car";
import { Register } from "./testeredirecionamento/registro";
import { Contact } from "./testeredirecionamento/contato";

function App() {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (item) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, item]);
  };

  return (
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
        <Route path="/carrinho" element={<Car carrinho={carrinho} />} />
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
    </BrowserRouter>
  );
}

function HomePage({ adicionarAoCarrinho }) {
  return (
    <div>
      <main>
        <section className="lanche">
          <h1 className="styleh1">Lanches</h1>
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
          <h1>Sobremessa</h1>
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
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;

// App.js
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
  return (
    <BrowserRouter>
      <header>
        <nav>
          <Nave />
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/carrinho" element={<Car />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div>
      <main>
        <section className="lanche">
          <h1 className="styleh1">Lanches</h1>
          <div className="lanche1">
            {itensDoCardapioLanches.map((lanche) => (
              <ArticleLanches key={lanche.id} lanche={lanche} />
            ))}
          </div>
        </section>

        <section className="sobremessa">
          <h1>Sobremessa</h1>
          <div className="sobremessa1">
            {itensDoCardapioSobremessas.map((doces) => (
              <ArticleSobremessa key={doces.id} doces={doces} />
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

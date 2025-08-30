import { Nave } from './Itens/Nav';
import ArticleLanches from './Itens/Article';
import { ArticleSobremessa } from './Itens/Article';
import './App.css';
import { itensDoCardapioLanches, itensDoCardapioSobremessas } from './cards/itens-card';
function App() {
  return (
    <div>
      <header>
        <nav>
          <Nave />
        </nav>
      </header>
      <main>
        <section>
          <h1 className='styleh1'>Lanches</h1>
          {itensDoCardapioLanches.map(lanche => (
            <ArticleLanches key={lanche.id} lanche={lanche} />
          ))}
        </section>

        <section>
          <h1>Sobremessa</h1>
          {itensDoCardapioSobremessas.map(doces => (
            <ArticleSobremessa key={doces.id} doces={doces} />
          ))}
        </section>
      </main>
    </div>
  );
}


export default App;

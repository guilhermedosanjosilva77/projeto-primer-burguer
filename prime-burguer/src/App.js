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
        <section className='lanche'>
          <h1 className='styleh1'>Lanches</h1>
          <div className='lanche1'>
          {itensDoCardapioLanches.map(lanche => (
            <ArticleLanches key={lanche.id} lanche={lanche} />
          ))}
          </div>
        </section>

        <section className='sobremessa'>
          <h1>Sobremessa</h1>
          <div className='sobremessa1'>
          {itensDoCardapioSobremessas.map(doces => (
            <ArticleSobremessa key={doces.id} doces={doces} />
          ))}
          </div>
        </section>
      </main>
    </div>
  );
}


export default App;

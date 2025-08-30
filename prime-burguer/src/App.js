import { Nave } from './Itens/Nav';
import ArticleLanches from './Itens/Article';
import { ArticleSobremessa } from './Itens/Article';
import './App.css';
import { itensDoCardapioLanches, itensDoCardapioSobremessas } from './cards/itens-card';

function App() {
  return (
    <html>
      <header>
      <nav>
      <Nave/>
    </nav>
    </header>
    <article>
      <h1>Lanches</h1>
      {itensDoCardapioLanches.map(lanche =>(
        <ArticleLanches key={lanche.id} lanche={lanche} />
      ))}
    </article>
    <h1>Sobremessa</h1>
    {itensDoCardapioSobremessas.map(doces =>(
      <ArticleSobremessa key={doces.id} doces={doces}/>
    ))}
    <article>

    </article>
    </html>
   
   
  );
}

export default App;

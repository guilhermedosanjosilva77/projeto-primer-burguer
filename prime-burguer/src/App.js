import { Nave } from './Itens/Nav';
import Article from './Itens/Article';
import './App.css';
import { itensDoCardapioLanches } from './cards/itens-card';

function App() {
  return (
    <div>
    <nav>
      <Nave/>
    </nav>
    <article>
      {itensDoCardapioLanches.map(lanche =>(
        <Article key={lanche.id} lanche={lanche} />
      ))}
    </article>
    </div>
   
   
  );
}

export default App;

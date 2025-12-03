import react from "react";
import "./homeadmin.css";
import { useNavigate } from "react-router-dom";
import Estoque from "./PaginaEstoque/Estoque";


function HomeAdmin() {
  const navigate = useNavigate();

  //Função das rotas
  function Componente() {
  navigate("/Estoque");
  navigate("/cadastrar");
}
  return (
    <div className="layout">
      <header>
        <nav className="nave">
          <h1>Logo</h1>
          <h2>User:</h2>
        </nav>
      </header>
      <main>
        <article>
          <ul className="lista">
            {/* feito */}
            <l1>
              <button onClick={(e)=>Componente("/Estoque")}>Gerenciamento de estoque</button>
            </l1>
            {/* feito */}
            <li>
              <button>Editar Itens do cardápio</button>
            </li>
            <li>
              <button>
                Gerenciamento de pedidos (pedidos diários e histórico)
              </button>
            </li>
            {/* feito */}
            <li>
              <button onClick={(e)=>Componente("/cadastrar")}>Criação de Itens</button>
            </li>
            <li>
              <button>Caixa</button>
            </li>
          </ul>
        </article>
      </main>
    </div>
  );
}
export default HomeAdmin;

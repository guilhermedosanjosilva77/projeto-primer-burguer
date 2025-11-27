import react from "react";
import "./homeadmin.css"

function HomeAdmin() {
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
                <l1><button>Gerenciamento de estoque</button></l1>
                 {/* feito */}
                <li><button>Editar Itens do cardápio</button></li>
                <li><button>Gerenciamento de pedidos (pedidos diários e histórico)</button></li>
                 {/* feito */}
                <li><button>Criação de Itens</button></li>
                <li><button>Caixa</button></li>
                


            </ul>

        </article>
      </main>
    </div>
  );
}
export default HomeAdmin;

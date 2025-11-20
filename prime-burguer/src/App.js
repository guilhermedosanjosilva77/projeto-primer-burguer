import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; 
import { Toaster } from "react-hot-toast";
import { Nave } from "./components/Nav/Nav.js"; 
import "./App.css";
import Footer from "./components/Footer/footer.js";
import { Car } from "./components/Carrinho/Carrinho.js";
import { Register } from "./components/Registro/Registro.js";
import { Contact } from "./components/Contato/Contato.js";
import HomeAdmin from "./Pages/HomeAdmin.js";
import Estoque from "./Pages/PaginaEstoque/Estoque.js";
import Cadastrar from "./Pages/EditarItensDoCardapio/Cadastrar.js";
import Lista from "./Pages/EditarItensDoCardapio/Listar.js";
import HomePage from "./Pages/HomePage/HomePage.js";
import FinalizarPedido from "./Pages/Pedido/FinalizarPedido/FinalizarPedido.js";
import PedidoFeito from "./Pages/Pedido/PedidoFeito/PedidoFeito.js";
import CadastroCliente from "./components/Autenticação/CadastroCliente.js";

function App() {
  // Criando objeto item como array -GUI
  const [item, setItem] = useState([]);
  const [carrinho, setCarrinho] = useState([]);

  // **SIMULAÇÃO DE ESTADO DO USUÁRIO LOGADO**
  // Em uma aplicação real, este estado viria do contexto de autenticação após o login.
  // Criando um usuário fictício para que o componente CadastroCliente tenha um 'id' para funcionar.
  const [usuarioLogado, setUsuarioLogado] = useState({ id: 'user-123456789', email: 'cliente.teste@exemplo.com' });

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
          usuarioLogado={usuarioLogado} // Passando o usuário logado
        />
      </BrowserRouter>
    </>
  );
}

function Layout({ carrinho, adicionarAoCarrinho, item, setItem, setCarrinho, usuarioLogado }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/homeAdmin") || 
                      location.pathname.startsWith("/estoque") ||
                      location.pathname.startsWith("/cadastrar") ||
                      location.pathname.startsWith("/lista");

  const isCadastroPage = location.pathname === "/registro";
  // Nova condição para a rota de Cadastro de Cliente
  const isClientRegistrationPage = location.pathname === "/cadastroCliente"; 

  // Verifica se deve exibir Navegação e Rodapé
  const hideNavAndFooter = isAdminPage || isCadastroPage || isClientRegistrationPage;

  return (
    <>
      {/* Esconde a Navegação em rotas de Admin, Cadastro e Registro de Cliente */}
      {!hideNavAndFooter && (
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
        <Route path="/carrinho" element={<Car carrinho={carrinho} setCarrinho={setCarrinho} />} />
        
        <Route path="/registro" element={<Register />} /> 
        
        <Route path="/contato" element={<Contact />} />
        
        {/* Rotas de Admin */}
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route
          path="/cadastrar"
          element={<Cadastrar item={item} setItem={setItem} />}
        />
        <Route
          path="/lista"
          element={<Lista item={item} setItem={setItem} />}
        />
        
        <Route 
            path="/cadastroCliente" 
            element={<CadastroCliente usuarioLogado={usuarioLogado} />} 
        />

        <Route
          path="/finalizarPedido"
          element={<FinalizarPedido carrinho={carrinho} />}
        />
        <Route path="/pedidoFeito" element={<PedidoFeito />} />
      </Routes>

      {/* Esconde o Rodapé em rotas de Admin, Cadastro e Registro de Cliente */}
      {!hideNavAndFooter && (
        <footer>
          <Footer />
        </footer>
      )}
    </>
  );
}

export default App;
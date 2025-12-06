import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"; 
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
import MeusPedidos from "./Pages/Pedido/MeusPedidos/MeusPedidos.js";
import Autenticacao from "./components/Autenticação/Autenticação.js";
import Caixa from "./Pages/Caixa/Caixa.js";

function App() {
  const [item, setItem] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  
  // Estado de autenticação
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Carregar dados do localStorage quando o app iniciar
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    const carrinhoSalvo = localStorage.getItem('carrinho');

    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, []);

  // Salvar carrinho no localStorage quando ele mudar
  useEffect(() => {
    if (carrinho.length > 0) {
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
    } else {
      localStorage.removeItem('carrinho');
    }
  }, [carrinho]);

  // Salvar usuário logado no localStorage
  useEffect(() => {
    if (usuarioLogado) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    } else {
      localStorage.removeItem('usuarioLogado');
    }
  }, [usuarioLogado]);

  const adicionarAoCarrinho = (item) => {
    setCarrinho((prevCarrinho) => [...prevCarrinho, item]);
  };

  // Função para fazer login/definir usuário
  const fazerLogin = (usuario) => {
    setUsuarioLogado(usuario);
  };

  // Função para fazer logout
  const fazerLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('clienteData');
  };

  // Função para limpar carrinho (após finalizar pedido)
  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem('carrinho');
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Layout
          carrinho={carrinho} 
          setCarrinho={setCarrinho} 
          adicionarAoCarrinho={adicionarAoCarrinho}
          limparCarrinho={limparCarrinho}
          item={item}
          setItem={setItem}
          usuarioLogado={usuarioLogado}
          setUsuarioLogado={setUsuarioLogado}
          fazerLogin={fazerLogin}
          fazerLogout={fazerLogout}
        />
      </BrowserRouter>
    </>
  );
}

function Layout({ 
  carrinho, 
  setCarrinho, 
  adicionarAoCarrinho,
  limparCarrinho,
  item, 
  setItem, 
  usuarioLogado,
  setUsuarioLogado,
  fazerLogin,
  fazerLogout
}) {
  const location = useLocation();
  
  // Páginas de admin
  const isAdminPage = location.pathname.startsWith("/homeAdmin") || 
       location.pathname.startsWith("/estoque") ||
       location.pathname.startsWith("/cadastrar") ||
       location.pathname.startsWith("/lista") ||
       location.pathname.startsWith("/Caixa");

  // Páginas especiais sem Nav/Footer
  const isClientRegistrationPage = location.pathname === "/cadastroCliente" || 
                                     location.pathname === "/autenticacao";
  const isMeusPedidosPage = location.pathname === "/meusPedidos";
  const isCaixaPage = location.pathname === "/Caixa";

  // Ocultar Nav e Footer em páginas específicas
  const hideNavAndFooter = isAdminPage || isClientRegistrationPage || isMeusPedidosPage || isCaixaPage;

  return (
    <>
      {!hideNavAndFooter && (
        <Nave 
          usuarioLogado={usuarioLogado}
          fazerLogout={fazerLogout}
          totalItensCarrinho={carrinho.length}
        />
      )}

      <Routes>
        {/* Rotas Públicas */}
        <Route 
          path="/" 
          element={<HomePage adicionarAoCarrinho={adicionarAoCarrinho} />} 
        />
        <Route 
          path="/home" 
          element={<HomePage adicionarAoCarrinho={adicionarAoCarrinho} />} 
        />
        <Route 
          path="/carrinho" 
          element={
            <Car 
              carrinho={carrinho} 
              setCarrinho={setCarrinho} 
            />
          } 
        />
        <Route path="/contato" element={<Contact />} />

        {/* Rotas de Autenticação */}
        <Route 
          path="/registro" 
          element={<Register setUsuarioLogado={setUsuarioLogado} />} 
        /> 
        
        {/* Autenticacao - Para login/cadastro de usuário */}
        <Route 
          path="/autenticacao" 
          element={
            <Autenticacao 
              usuarioLogado={usuarioLogado}
              setUsuarioLogado={setUsuarioLogado}
            />
          } 
        />
        
        {/* CadastroCliente - Para dados pessoais e endereço */}
        <Route 
          path="/cadastroCliente" 
          element={
            <CadastroCliente 
              usuarioLogado={usuarioLogado}
            />
          } 
        />

        {/* Rotas de Pedidos - Protegidas */}
        <Route 
          path="/meusPedidos" 
          element={
            usuarioLogado ? (
              <MeusPedidos 
                usuarioLogado={usuarioLogado}
                fazerLogout={fazerLogout}
              />
            ) : (
              <Navigate to="/autenticacao" replace />
            )
          } 
        />
        
        {/* FinalizarPedido - Recebe dados via location.state do CadastroCliente */}
        <Route
          path="/finalizarPedido"
          element={
            carrinho.length > 0 ? (
              <FinalizarPedido 
                carrinho={carrinho}
                usuarioLogado={usuarioLogado}
                limparCarrinho={limparCarrinho}
              />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
        
        <Route 
          path="/pedidoFeito" 
          element={<PedidoFeito />} 
        />

        {/* Rotas de Admin */}

        {/*home Admin*/}
        <Route path="/homeAdmin" element={<HomeAdmin />} />

        {/*gerenciamento de estoque*/}
        <Route path="/estoque" element={<Estoque />} />

        {/*Criação de itens*/}
        <Route 
          path="/cadastrar" 
          element={<Cadastrar item={item} setItem={setItem} />} 
        />
        
        <Route 
          path="/lista" 
          element={<Lista item={item} setItem={setItem} />} 
        />

        {/*Caixa*/}
        <Route
        path="/Caixa"
        element={<Caixa/>}

        />

        {/* Rota 404 - Redireciona para home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      {!hideNavAndFooter && (
        <footer>
          <Footer />
        </footer>
      )}
    </>
  );
}

export default App;
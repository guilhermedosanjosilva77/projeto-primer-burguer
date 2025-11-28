// ./components/Nav/Nav.js
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/Banner e Logo/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCartShopping,
  faUserPlus,
  faPhone,
  faClipboardList, 
} from "@fortawesome/free-solid-svg-icons";

import "./Nav.css";

export function Nave() {
  const navigate = useNavigate(); 

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="my-nav">
         {/* Logo - O clique na logo retorna para a home */}  {" "}
      <div className="logo-nav" onClick={() => handleNavigate("/home")}>
            <img src={logo} alt="Logo da lanchonete" className="logo-img" />
          {" "}
      </div>
         {/* Ícones de navegação */}  {" "}
      <div className="itens-nav">
            {/* INÍCIO */}   {" "}
        <button className="nav-item" onClick={() => handleNavigate("/home")}>
               <FontAwesomeIcon icon={faHouse} size="xl" />    {" "}
          <span className="nav-text">INÍCIO</span>   {" "}
        </button>
            {/* PEDIDOS (NOVO) */}   {" "}
        <button className="nav-item" onClick={() => handleNavigate("/meusPedidos")}>
               <FontAwesomeIcon icon={faClipboardList} size="xl" />   
           <span className="nav-text">PEDIDOS</span>   {" "}
        </button>
            {/* CARRINHO */}   {" "}
        <button
          className="nav-item"
          onClick={() => handleNavigate("/carrinho")}
        >
               <FontAwesomeIcon icon={faCartShopping} size="xl" />    {" "}
          <span className="nav-text">CARRINHO</span>   {" "}
        </button>
            {/* REGISTRO */}   {" "}
        <button
          className="nav-item"
          onClick={() => handleNavigate("/registro")}
        >
               <FontAwesomeIcon icon={faUserPlus} size="xl" />    {" "}
          <span className="nav-text">REGISTRO</span>   {" "}
        </button>
            {/* CONTATO */}   {" "}
        <button className="nav-item" onClick={() => handleNavigate("/contato")}>
               <FontAwesomeIcon icon={faPhone} size="xl" />    {" "}
          <span className="nav-text">CONTATO</span>   {" "}
        </button>
          {" "}
      </div>
       {" "}
    </div>
  );
}

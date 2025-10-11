// ./Itens/Nav.js
import { useNavigate } from "react-router-dom";
// import carrinhoIcon from "../../assets/img/Ícones/carrinho.png";
// import registroIcon from "../../assets/img/Ícones/registro.png";
// import telefoneIcon from "../../assets/img/Ícones/telefone.png";
// import homeIcon from "../../assets/img/Ícones/home.png";
import logo from "../../assets/img/Banner e Logo/logo.png"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCartShopping,
  faUserPlus,
  faPhone,
} from "@fortawesome/free-solid-svg-icons"; 

import "./Nav.css"; 

// Componente que cria O Header
export function Nave() {
  const navigate = useNavigate();

  return (
    <div className="my-nav">
      {/* Logo */}
      <div className="logo-nav" onClick={() => navigate("/home")}>
        <img src={logo} alt="Logo da lanchonete" className="logo-img" />
      </div>

      {/* Ícones de navegação */}
      <div className="itens-nav">
        <button className="botao0" onClick={() => navigate("/home")}>
          {/* Ícone de Casa */}
          <FontAwesomeIcon icon={faHouse} size="lg" style={{color: "#000000",}}/>
        </button>

        <button className="botao1" onClick={() => navigate("/carrinho")}>
          {/* Ícone de Carrinho */}
          <FontAwesomeIcon icon={faCartShopping} size="lg" style={{color: "#000000",}}/>
        </button>

        <button className="botao2" onClick={() => navigate("/registro")}>
          {/* Ícone de User */}
          <FontAwesomeIcon icon={faUserPlus} size="lg" style={{color: "#000000",}}/>
        </button>

        <button className="botao3" onClick={() => navigate("/contato")}>
          {/* Ícone de Telefone */}
          <FontAwesomeIcon icon={faPhone} size="lg" style={{color: "#000000",}}/>
        </button>
      </div>
    </div>
  );
}

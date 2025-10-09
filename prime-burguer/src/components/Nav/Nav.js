// ./Itens/Nav.js
import { useNavigate } from "react-router-dom";
import carrinhoIcon from "../../assets/img/Ícones/carrinho.png";
import registroIcon from "../../assets/img/Ícones/registro.png";
import telefoneIcon from "../../assets/img/Ícones/telefone.png";
import homeIcon from "../../assets/img/Ícones/home.png";
import logo from "../../assets/img/Banner e Logo/logo.png"; 

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
          <img src={homeIcon} alt="Home" width={28} height={28} />
        </button>

        <button className="botao1" onClick={() => navigate("/carrinho")}>
          <img src={carrinhoIcon} alt="Carrinho" width={28} height={28} />
        </button>

        <button className="botao2" onClick={() => navigate("/registro")}>
          <img src={registroIcon} alt="Registro" width={28} height={28} />
        </button>

        <button className="botao3" onClick={() => navigate("/contato")}>
          <img src={telefoneIcon} alt="Contato" width={28} height={28} />
        </button>
      </div>
    </div>
  );
}

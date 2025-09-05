import { useNavigate } from "react-router-dom";
import carrinhoIcon from "./carrinho.png";
import registroIcon from "./registro.png";
import telefoneIcon from "./telefone.png";
import homeIcon from "./home.png";

export function Nave() {
  const navigate = useNavigate();

  return (
    <div className="my-nav">
      <div className="img">Logo</div>
      <div className="itens-nav">
        <button className="botao0" onClick={() => navigate("/Home")}>
          <img src={homeIcon} alt="home" width={24} height={24} />
        </button>

        <button className="botao1" onClick={() => navigate("/carrinho")}>
          <img src={carrinhoIcon} alt="Carrinho" width={24} height={24} />
        </button>
        <button className="botao2" onClick={() => navigate("/registro")}>
          <img src={registroIcon} alt="registro" width={24} height={24} />
        </button>
        <button className="botao3" onClick={() => navigate("/contato")}>
          <img src={telefoneIcon} lt="contato" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}

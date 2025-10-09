// ./Itens/footer.js
import React from "react";
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa"; // Biblioteca de ícones

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <h2>🍔 Sobre nós</h2>
          <p>
            Amamos criar o hambúrguer perfeito! 🍟<br />
            Nossos lanches são feitos com ingredientes fresquinhos, muito carinho e um toque especial que faz toda a diferença.
          </p>
        </div>

        <div className="footer-section">
          <h2>📞 Contato</h2>
          <ul className="contact-list">
            <li>
              <FaPhone className="contact-icon" />
              <span>(16) 99196-5919</span>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>Av. Dr. Gildeney das Neves, 587 - São Carlos</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>primeburguer@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 Prime Burguer. Todos os direitos reservados. 🍔</p>
      </div>
    </footer>
  );
}

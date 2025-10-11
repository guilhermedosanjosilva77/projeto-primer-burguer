import React from "react";
import "./Registro.css";

//feita p fzr o registro
// Componente Register que cria inputs para cadastro
export function Register() {
  return (
    <div className="itens">
      <div className="pag">
        <h1>Cadastre-se Já</h1>

        <label>
          Nome:
          <input type="text" placeholder="Digite seu nome completo" />
        </label>

        <label>
          Email:
          <input type="email" placeholder="exemplo@dominio.com" />
        </label>

        <button>Cadastrar</button>
      </div>
    </div>
  );
}
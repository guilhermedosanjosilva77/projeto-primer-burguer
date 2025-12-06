import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast';
import "./Registro.css";
import { registrarUsuario } from '../../api/criarUsuario.js'; 

import { Nave } from '../Nav/Nav.js'; 

export function Register() {
 const [nome, setNome] = useState('');
 const [email, setEmail] = useState('');
 const [senha, setSenha] = useState('');
 const [confirmarSenha, setConfirmarSenha] = useState('');
 const [loading, setLoading] = useState(false);

 const API_BASE_URL = "http://localhost:8080"; // Ajuste conforme sua API
 
 const navigate = useNavigate(); 

 const handleSubmit = async (event) => {
  event.preventDefault(); 

  // Validações
  if (!nome || !email || !senha || !confirmarSenha) {
   toast.error("Por favor, preencha todos os campos.");
   return;
  }
  
  if (senha !== confirmarSenha) {
   toast.error("A senha e a confirmação de senha não coincidem.");
   return;
  }

  setLoading(true); 

  try {
   const userData = {
    nome: nome,
    email: email,
    senha: senha,
   };

   const response = await fetch(`http://localhost:8080/users`,{
    method:"POST",
    headers:{
      "Content-type":"application/json"
    },
    body:JSON.stringify(userData),
})

   if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 409) {
        throw new Error("Este email já está cadastrado. Tente outro.");
      }
      throw new Error(errorData.message || "Falha ao cadastrar usuário.");
    }

    toast.success("Usuário cadastrado com sucesso!");


   await registrarUsuario(userData);

   // Sucesso
   toast.success("Usuário cadastrado com sucesso!");
   
   setNome('');
   setEmail('');
   setSenha('');
   setConfirmarSenha('');


   
  } catch (error) {
   let mensagemErro = "Falha no cadastro. Tente novamente.";
   
   if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 409) {
     mensagemErro = "Este e-mail já está cadastrado. Tente outro.";
    } 
    else if (data && data.message) {
     mensagemErro = data.message;
    } else if (status >= 400 && status < 500) {
     mensagemErro = `Erro do Cliente (${status}). Verifique seus dados.`;
    } else if (status >= 500) {
     mensagemErro = `Erro do Servidor (${status}). Tente mais tarde.`;
    }
   } else if (error.request) {
    mensagemErro = "Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.";
   } else {
    mensagemErro = `Erro desconhecido: ${error.message}`;
   }
   
   toast.error(mensagemErro);
  } finally {
   setLoading(false); 
  }
 };

 return (
  // Wrap tudo em um Fragment ou div
  <>
    {/* 2. Renderização do componente Nave no topo */}
    <Nave />
      
   <div className="itens">
    <div className="pag">
     <h1>Cadastre-se Já</h1>
     
     <form onSubmit={handleSubmit}>
      
      <label>
       Nome:
       <input 
        type="text" 
        placeholder="Digite seu nome completo" 
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        disabled={loading}
       />
      </label>

      <label>
       Email:
       <input 
        type="email" 
        placeholder="exemplo@dominio.com" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
       />
      </label>
      
      <label>
       Senha:
       <input 
        type="password"
        placeholder="Digite sua senha" 
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        disabled={loading}
       />
      </label>

      <label>
       Confirmar Senha:
       <input 
        type="password"
        placeholder="Confirme sua senha" 
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        disabled={loading}
       />
      </label>

      <button type="submit" disabled={loading}>
       {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
     </form>
     
     {/* Link de Login */}
     <div className="link-login">
      Já tem conta? <a href="#" onClick={() => navigate("/autenticacao")}>**Fazer Login**</a>
     </div>
     
    </div>
   </div>
  </>
 );
}
// export default Register;
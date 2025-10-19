import React, { useState } from 'react';
import toast from 'react-hot-toast';
import "./Registro.css";
import { registrarUsuario } from '../../api/criarUsuario.js'; 

export function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    // Validações de campos vazios e senhas
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
        // A requisição foi feita e o servidor respondeu com um status code fora da faixa 2xx
        const status = error.response.status;
        const data = error.response.data;

        // **Verificação de Usuário Existente:**
        // Se o back-end retorna 409 (Conflict) para e-mail duplicado
        if (status === 409) {
          mensagemErro = "Este e-mail já está cadastrado. Tente outro.";
        } 
        // Se o back-end retorna uma mensagem de erro específica no corpo
        else if (data && data.message) {
          mensagemErro = data.message;
        } else if (status >= 400 && status < 500) {
          mensagemErro = `Erro do Cliente (${status}). Verifique seus dados.`;
        } else if (status >= 500) {
          mensagemErro = `Erro do Servidor (${status}). Tente mais tarde.`;
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta (ex: servidor offline)
        mensagemErro = "Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.";
      } else {
        // Algo aconteceu na configuração da requisição que disparou um erro
        mensagemErro = `Erro desconhecido: ${error.message}`;
      }
      
      toast.error(mensagemErro);
    } finally {
      setLoading(false); 
    }
  };

  return (
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
      </div>
    </div>
  );
}
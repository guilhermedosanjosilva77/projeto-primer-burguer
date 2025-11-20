import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginUser, registrarUsuario } from '../../api/criarUsuario';
import './Autenticacao.css'; 

export default function Autenticacao({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // Alterna entre Login e Registro
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAcao = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let user;
            if (isLogin) {
                // Simulação de Login
                user = await loginUser(email, senha);
                Swal.fire('Sucesso!', 'Login realizado com sucesso.', 'success');
            } else {
                // Registro
                user = await registrarUsuario({ email, senha });
                Swal.fire('Sucesso!', `Registro realizado. Você é o Usuário ID: ${user.id}.`, 'success');
            }
            
            onLoginSuccess(user); // Passa o objeto do usuário para App.js
            navigate('/cadastroCliente'); // Próxima etapa (Rota ajustada para consistência)
            
        } catch (error) {
            // Verifica se o erro é um objeto com message, senão usa a string
            const errorMessage = error.message || error.toString();
            Swal.fire('Erro!', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Fazer Login' : 'Criar Conta'}</h2>
            
            <form onSubmit={handleAcao} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading} className="btn-auth-acao">
                    {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Registrar')}
                </button>
            </form>

            <button 
                className="btn-mudar-tela"
                onClick={() => setIsLogin(!isLogin)}
            >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já sou cadastrado'}
            </button>
        </div>
    );
}
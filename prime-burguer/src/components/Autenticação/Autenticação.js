import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, AlertTriangle, X } from "lucide-react"; 
import "./Autenticacao.css";

const API_BASE_URL = 'http://localhost:8080';

const SimpleAlert = ({ message, type, onClose }) => {
    if (!message) return null;

   
    const baseStyle = "p-4 mb-4 rounded-lg flex items-center shadow-lg transition-opacity duration-300";
    let colorStyle = "";
    let icon = null;

    if (type === "success") {
        colorStyle = "bg-green-100 text-green-700 border border-green-200";
        icon = <CheckCircle size={20} className="mr-2 text-green-500" />;
    } else { 
        colorStyle = "bg-red-100 text-red-700 border border-red-200";
        icon = <AlertTriangle size={20} className="mr-2 text-red-500" />;
    }

    return (
        <div className={`${baseStyle} ${colorStyle}`} role="alert">
            {icon}
            <span className="font-medium flex-grow">{message}</span>
            <button
                type="button"
               
                className="ml-auto p-1.5 rounded-lg text-gray-700 hover:bg-opacity-80 transition-colors"
                onClick={onClose}
            >
                <X size={18} />
            </button>
        </div>
    );
};

/**
 * Função para Logar usuário no Backend.
 * Espera receber um objeto UserResponseDTO ({ id, email }) do backend se a autenticação for bem-sucedida.
 * Assumindo que o backend tem um endpoint POST /users/login que aceita UserRequestDTO ({ email, senha }) e retorna UserResponseDTO se válido.
 */
const loginUser = async (email, senha) => {
    const url = `${API_BASE_URL}/users/login`;
    
    // Configuração para permitir retentativas (Exponential Backoff)
    const maxRetries = 3;
    let lastError = null;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }) // Envia UserRequestDTO
            });

            if (!response.ok) {
                // Tentativa de ler a mensagem de erro do corpo
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    throw new Error(`Erro de Login: ${response.statusText}`);
                }
                throw new Error(errorData.message || "Email ou senha inválidos. Tente novamente.");
            }

            const user = await response.json();
            
            // Verifica se a resposta contém os campos essenciais do UserResponseDTO
            if (!user || typeof user.id !== 'number' || typeof user.email !== 'string') {
                throw new Error("Resposta do servidor incompleta ou inválida. ID e Email são necessários.");
            }
            
            // Retorna o objeto do usuário (UserResponseDTO)
            return { id: user.id, email: user.email, ...user }; 

        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                // Implementa delay (1s, 2s, 4s) antes de retentar
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError; // Lança o último erro após todas as tentativas
};

/**
 * Função para Cadastrar novo Usuário no Backend.
 * Espera receber um objeto UserResponseDTO ({ id, email }) do backend.
 */
const registerUser = async (email, senha) => {
    const url = `${API_BASE_URL}/users`;
    
    const maxRetries = 3;
    let lastError = null;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }) // Envia UserRequestDTO
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    throw new Error(`Erro de Cadastro: ${response.statusText}`);
                }
                throw new Error(errorData.message || "Falha ao criar conta. Este email já pode estar em uso.");
            }
            
            const user = await response.json();
            
            // Verifica se a resposta contém os campos essenciais do UserResponseDTO
            if (!user || typeof user.id !== 'number' || typeof user.email !== 'string') {
                throw new Error("Resposta do servidor incompleta ou inválida. ID e Email são necessários após o cadastro.");
            }

            // Retorna o objeto do usuário (UserResponseDTO)
            return { id: user.id, email: user.email, ...user };

        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError; // Lança o último erro
};

// --- Componente Principal ---

export default function Autenticacao({ setUsuarioLogado }) {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail = location.state?.registeredEmail || '';
    const [email, setEmail] = useState(initialEmail);
    const [senha, setSenha] = useState("");
    const [isLoginMode, setIsLoginMode] = useState(true); // true = Login, false = Cadastro
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "" });
    
    // CSS personalizado (original do Autenticacao.css)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ message: "", type: "" }); // Limpa o alerta anterior

        try {
            let userResponse;
            
            if (isLoginMode) {
                userResponse = await loginUser(email, senha);
            } else {
                userResponse = await registerUser(email, senha);
            }

            // ATUALIZA O ESTADO GLOBAL COM O ID E EMAIL REAIS DO USER
            setUsuarioLogado(userResponse); 

            // Define o alerta de sucesso
            setAlert({
                message: isLoginMode 
                    ? `Bem-vindo(a) de volta, ${userResponse.email}! ID: ${userResponse.id}` 
                    : `Conta criada para ${userResponse.email}! ID: ${userResponse.id}`,
                type: "success"
            });

            // Redireciona para o Cadastro de Cliente para completar o endereço (ou Home)
            setTimeout(() => {
                navigate("/cadastroCliente"); 
            }, 1500); 

        } catch (error) {
            // Se houver erro, garante que o usuário não esteja logado
            setUsuarioLogado(null);
            
            // Define o alerta de erro
            setAlert({
                message: error.message || "Não foi possível conectar ao servidor. Verifique a API.",
                type: "error"
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Injeta o CSS */}

            {/* Renderiza o alerta/notificação */}
            <SimpleAlert 
                message={alert.message} 
                type={alert.type} 
                onClose={() => setAlert({ message: "", type: "" })} 
            />

            <h2>{isLoginMode ? "Acessar Minha Conta" : "Criar Nova Conta"}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Senha</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                
                <button type="submit" disabled={loading} className="btn-auth">
                    {loading ? "Aguarde..." : isLoginMode ? "Entrar" : "Cadastrar"}
                </button>
            </form>

            <div className="toggle-mode">
                <p>
                    {isLoginMode ? "Novo por aqui?" : "Já tem uma conta?"}
                    <button 
                        type="button" 
                        onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setAlert({ message: "", type: "" }); // Limpa o alerta ao trocar de modo
                            setEmail("");
                            setSenha("");
                        }}
                        className="btn-toggle-mode"
                    >
                        {isLoginMode ? "Criar Conta" : "Fazer Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}
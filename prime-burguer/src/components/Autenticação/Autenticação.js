import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, AlertTriangle, X } from "lucide-react";
import "./Autenticacao.css";

const API_BASE_URL = "http://localhost:8080";

// --------- COMPONENTE DE ALERTA BONITO ---------
const SimpleAlert = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseStyle = "p-4 mb-4 rounded-lg flex items-center shadow-lg";
    const colorStyle =
        type === "success"
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-red-100 text-red-700 border border-red-200";

    const Icon = type === "success" ? CheckCircle : AlertTriangle;

    return (
        <div className={`${baseStyle} ${colorStyle}`}>
            <Icon size={20} className="mr-2" />
            <span className="font-medium flex-grow">{message}</span>
            <button className="ml-auto" onClick={onClose}>
                <X size={18} />
            </button>
        </div>
    );
};
export default function Autenticacao({ setUsuarioLogado }) {
    const navigate = useNavigate();
    const location = useLocation();

    const initialEmail = location.state?.registeredEmail || "";
    const [email, setEmail] = useState(initialEmail);
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "" });


    const fazerLogin = async () => {
        const url = `${API_BASE_URL}/users/login`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {
            let data;
            try {
                data = await response.json();
            } catch (_) {}
            throw new Error(data?.message || "Email ou senha inválidos.");
        }

        return await response.json(); // objeto com id, email, nome, etc.
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ message: "", type: "" });

        
   const emailAdmin = "adminprimerburguer@gmail.com";

   if (emailAdmin === "adminprimerburguer@gmail.com") {
      navigate("/homeAdmin");
    } else {
      navigate("/autenticacao");
    }

        try {
            const usuario = await fazerLogin();

            // Salva usuário no estado global
            setUsuarioLogado(usuario);

            setAlert({
                message: `Bem-vindo(a), ${usuario.email}!`,
                type: "success",
            });

            // Redireciona para home após 1 segundo
            setTimeout(() => {
                navigate("/home", { state: { usuario } });
            }, 1000);
        } catch (error) {
            setAlert({
                message: error.message || "Falha ao realizar login.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <SimpleAlert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ message: "", type: "" })}
            />

            <h2>Entrar</h2>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>Senha</label>
                    <input
                        type="password"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-auth">
                    {loading ? "Entrando..." : "Login"}
                </button>
            </form>
        </div>
    );
}

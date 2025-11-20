import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/users'; 


export async function registrarUsuario({ email, senha }) {
    console.log("Tentativa de Registro:", email);
    
    try {
        // Simulação de latência
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        
        if (!email || !senha) {
            throw new Error("E-mail e senha são obrigatórios.");
        }

        // Simulação de retorno de sucesso
        return { 
            id: `user-${Date.now()}`, 
            email: email,
            token: "mock-token-reg" 
        };
    } catch (error) {
        console.error("Erro ao registrar usuário:", error.message);
        throw new Error(error.message || "Erro no registro. Tente novamente.");
    }
}

/**
 * Simula o login de um usuário existente.
 * @param {string} email - O email do usuário.
 * @param {string} senha - A senha do usuário.
 * @returns {Promise<object>} - O objeto do usuário logado com um ID.
 */
export async function loginUser(email, senha) {
    console.log("Tentativa de Login:", email);
    
    try {
        // Simulação de latência
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        // Simulação de credenciais válidas
        if (email !== 'teste@login.com' || senha !== '123456') {
            throw new Error("E-mail ou senha incorretos. Use: teste@login.com / 123456");
        }

        // Simulação de retorno de sucesso
        return { 
            id: 'user-123456789', // ID fixo para login de sucesso
            email: email,
            token: "mock-token-login" 
        };

    } catch (error) {
        console.error("Erro no login:", error.message);
        throw new Error(error.message || "Erro no login. Verifique suas credenciais.");
    }
}
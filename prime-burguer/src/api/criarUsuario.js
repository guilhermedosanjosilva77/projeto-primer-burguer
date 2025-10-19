import axios from 'axios';

// URL base do seu back-end (ajuste conforme necessário)
const API_BASE_URL = 'http://localhost:8080'; // Exemplo, mude para a porta e domínio do seu back-end

/**
 * Função para registrar um novo usuário
 * @param {object} userData - Os dados do usuário (nome e email)
 * @returns {Promise<object>} - A resposta do back-end
 */
export async function registrarUsuario(userData) {
  try {
    // Fazendo uma requisição POST para o endpoint de registro
    // Assumindo que o endpoint é '/api/usuarios' ou similar
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Se o status da resposta for 2xx, retornamos os dados
    return response.data;
  } catch (error) {
    // Tratamento de erros
    console.error("Erro ao registrar usuário:", error.response ? error.response.data : error.message);
    
    // Lançar o erro para que o componente que chamou possa tratá-lo
    throw error; 
  }
}
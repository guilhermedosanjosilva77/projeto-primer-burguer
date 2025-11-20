const API_BASE_URL = 'http://localhost:8080';


export async function criarCliente(clienteData) {
    const url = `${API_BASE_URL}/clientes`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteData),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.message || `Erro HTTP ${response.status}: Falha ao criar o cliente.`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao criar cliente:", error);
        throw error;
    }
}

/**
 * Busca um cliente pelo ID (útil para verificar se o cadastro está completo).
 * @param {number} id - ID do cliente.
 * @returns {Promise<object>} ClienteResponseDTO
 */
export async function buscarClientePorId(id) {
    const url = `${API_BASE_URL}/clientes/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
             // Cliente não encontrado/cadastrado
             return null; 
        }

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.message || `Erro HTTP ${response.status}: Falha ao buscar cliente.`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        throw error;
    }
}
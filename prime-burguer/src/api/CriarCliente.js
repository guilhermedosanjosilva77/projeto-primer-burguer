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


export async function buscarTodosClientes() {
    const url = `${API_BASE_URL}/clientes`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.message || `Erro HTTP ${response.status}: Falha ao buscar a lista de clientes.`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar todos os clientes:", error);
        throw error;
    }
}
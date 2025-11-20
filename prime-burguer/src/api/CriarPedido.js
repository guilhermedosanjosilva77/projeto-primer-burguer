// Definindo a URL base da sua API
const API_BASE_URL = 'http://localhost:8080/api'; // Ajuste esta URL conforme o endereço real da sua API

/**
 * Envia um novo pedido para o backend.
 *
 * @param {object} pedidoData - O DTO de Pedido, contendo:
 * - clienteId: number
 * - itens: [{ produtoId: number, quantidade: number }, ...]
 * @returns {Promise<object>} - O objeto PedidoResponseDTO retornado pela API.
 * @throws {Error} - Se a requisição falhar (e.g., cliente não encontrado, estoque insuficiente).
 */
export async function criarPedido(pedidoData) {
    const url = `${API_BASE_URL}/pedidos`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Adicione headers de autorização aqui, se necessário (e.g., 'Authorization': 'Bearer ' + token)
            },
            body: JSON.stringify(pedidoData),
        });

        // Verifica se a resposta HTTP é de sucesso (código 2xx)
        if (!response.ok) {
            // Tenta ler a mensagem de erro do corpo da resposta, se existir
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.message || `Erro HTTP ${response.status}: Falha ao criar o pedido.`;
            
            // Lança um erro para ser capturado no try...catch do componente FinalizarPedido
            const error = new Error(errorMessage);
            error.response = response; // Inclui a resposta original para mais detalhes
            throw error;
        }

        // Retorna o PedidoResponseDTO do backend
        const newPedido = await response.json();
        return newPedido;

    } catch (error) {
        // Loga o erro original e relança para o componente React
        console.error("Erro na função criarPedido:", error);
        
        // Se for um erro de rede/servidor (e não um erro HTTP 4xx/5xx tratado acima)
        if (!error.response) {
            throw new Error("Não foi possível conectar ao servidor da API. Verifique se o backend está rodando.");
        }
        
        throw error;
    }
}
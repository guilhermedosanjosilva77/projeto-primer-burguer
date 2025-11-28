// Definindo a URL base da sua API
const API_BASE_URL = "http://localhost:8080";

export async function criarPedido(pedidoData) {
  const url = `${API_BASE_URL}/pedidos`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedidoData),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage =
        errorBody.message ||
        `Erro HTTP ${response.status}: Falha ao criar o pedido.`;
      const error = new Error(errorMessage);
      error.response = response;
      throw error;
    }

    const newPedido = await response.json();
    return newPedido;
  } catch (error) {
    console.error("Erro na função criarPedido:", error);

    if (!error.response) {
      throw new Error(
        "Não foi possível conectar ao servidor da API. Verifique se o backend está rodando."
      );
    }

    throw error;
  }

  async function buscarPedidosDoCliente(clienteId) {
    const url = `${API_BASE_URL}/pedidos/cliente/${clienteId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const errorMessage =
          errorBody.message ||
          `Erro HTTP ${response.status}: Falha ao buscar pedidos.`;
        const error = new Error(errorMessage);
        error.response = response;
        throw error;
      }

      const pedidos = await response.json();
      return pedidos;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);

      if (!error.response) {
        throw new Error(
          "Não foi possível conectar ao servidor da API. Verifique se o backend está rodando."
        );
      }

      throw error;
    }
  }
}

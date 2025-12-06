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
}

export async function buscarPedidosDoCliente(clienteId) {
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

  export async function buscarTodosPedidos() {
    const url = `${API_BASE_URL}/pedidos`; 

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}: Falha ao buscar todos os pedidos.`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar todos os pedidos:", error);
        throw new Error("Não foi possível conectar ao servidor da API ou a busca falhou.");
    }
}


export async function atualizarStatusPedido(pedidoId, novoStatus) {
    const API_BASE_URL = "http://localhost:8080";
    const url = `${API_BASE_URL}/pedidos/${pedidoId}/status`;

 try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: novoStatus }), 
        });

        if (!response.ok) {
            const errorBody = await response.text(); 
            const errorMessage = `Erro HTTP ${response.status}: Falha ao atualizar o status. Detalhe: ${errorBody.substring(0, 100)}`;
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro na função atualizarStatusPedido:", error);
        throw error;
    }
}


export async function deletarPedido(pedidoId) {
    const url = `${API_BASE_URL}/pedidos/${pedidoId}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
        });

        if (response.status === 204 || response.ok) {
            return;
        }

        const errorBody = await response.json().catch(() => ({}));
        const errorMessage = errorBody.message || `Erro HTTP ${response.status}: Falha ao deletar o pedido.`;
        throw new Error(errorMessage);

    } catch (error) {
        console.error("Erro na função deletarPedido:", error);
        throw error;
    }
}


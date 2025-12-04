import React, { useEffect, useState, useCallback } from 'react';

// Função para buscar os pedidos do cliente
async function buscarPedidosDoCliente(clienteId) {
  const url = `http://localhost:8080/pedidos/cliente/${clienteId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorMessage =
      response.status === 404
        ? 'Cliente não encontrado.'
        : response.status === 204
        ? 'Cliente não possui pedidos.'
        : 'Erro ao buscar pedidos.';
    throw new Error(errorMessage);
  }

  return await response.json(); // Retorna a lista de pedidos
}

function Caixa({ clienteId }) {
  const [total, setTotal] = useState(0);  // Estado para armazenar o valor total dos pedidos
  const [loading, setLoading] = useState(true); // Estado para controlar o loading
  const [error, setError] = useState(null); // Estado para armazenar erros

  // Função para calcular o total dos pedidos com useCallback
  const calcularTotalPedidos = useCallback(async () => {
    if (!clienteId || isNaN(clienteId)) {
      setError('ID do cliente não fornecido ou inválido.');
      setLoading(false);
      return;
    }

    try {
      const pedidos = await buscarPedidosDoCliente(clienteId);
      const totalPedido = pedidos.reduce((acc, pedido) => acc + pedido.valor, 0);
      setTotal(totalPedido);  // Atualiza o estado com o valor total
    } catch (err) {
      setError(err.message); // Exibe a mensagem de erro
    } finally {
      setLoading(false);  // Finaliza o loading
    }
  }, [clienteId]); // Recalcula sempre que o clienteId mudar

  // Usamos o useEffect para chamar a função ao montar o componente
  useEffect(() => {
    calcularTotalPedidos();
  }, [calcularTotalPedidos]); // Agora a dependência é a função calcularTotalPedidos

  return (
    <div>
      <h1>Caixa de Pedidos</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <h3>Total: R$ {total.toFixed(2)}</h3> // Exibe o total dos pedidos
      )}
    </div>
  );
}

export default Caixa;

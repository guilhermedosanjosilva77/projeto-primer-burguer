import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const PRODUTOS_URL = `${API_BASE_URL}/produtos`;

export async function criarProduto(produtoData) {
    try {
        const response = await axios.post(PRODUTOS_URL, produtoData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Erro ao criar novo produto:", error.response || error.message);
        throw new Error(`Falha no cadastro: ${error.response?.data?.message || error.message}`);
    }
}

export async function getTodosProdutos() {
    try {
        const response = await axios.get(PRODUTOS_URL);
        return response.data;
    } catch (error) {
        console.error("❌ Erro ao buscar todos os produtos:", error.response || error.message);
        throw new Error(`Falha ao listar produtos: ${error.response?.data?.message || error.message}`);
    }
}


export async function atualizarProduto(id, produtoData) {
    try {
        const response = await axios.put(`${PRODUTOS_URL}/${id}`, produtoData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`❌ Erro ao atualizar produto com ID ${id}:`, error.response || error.message);
        throw new Error(`Falha na atualização: ${error.response?.data?.message || error.message}`);
    }
}


export async function deletarProduto(id) {
    try {
        await axios.delete(`${PRODUTOS_URL}/${id}`);
        return true;
    } catch (error) {
        console.error(`❌ Erro ao deletar produto com ID ${id}:`, error.response || error.message);
        throw new Error(`Falha ao deletar: ${error.response?.data?.message || error.message}`);
    }
}


export async function getProdutoById(id) {
    try {
        const response = await axios.get(`${PRODUTOS_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Erro ao buscar produto com ID ${id}:`, error.response || error.message);
        throw new Error(`Produto não encontrado ou falha na busca: ${error.response?.data?.message || error.message}`);
    }
}
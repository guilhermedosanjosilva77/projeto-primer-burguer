import axios from 'axios';

const API_BASE_URL_CAIXA = 'http://localhost:8080/caixa';
const API_BASE_URL_MOVIMENTACOES = 'http://localhost:8080/movimentacoes'; 

const ID_CAIXA_PRINCIPAL = 1;


export const buscarCaixaPrincipal = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL_CAIXA}/${ID_CAIXA_PRINCIPAL}`);
        return response.data; 
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; 
        }
        throw error;
    }
};

export const criarNovoCaixa = async (caixaRequestDTO) => {
    try {
        // Usa o endpoint do CaixaController
        const response = await axios.post(API_BASE_URL_CAIXA, caixaRequestDTO);
        return response.data; // Retorna CaixaResponseDTO
    } catch (error) {
        console.error("Erro ao criar novo Caixa:", error);
        throw error;
    }
};


export const buscarMovimentacoes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL_MOVIMENTACOES}/caixa/${ID_CAIXA_PRINCIPAL}`);
        return response.data; 
    } catch (error) {
        throw error;
    }
};


export const criarMovimentacaoManual = async (movimentacaoDTO) => {
    try {
        // Rota AJUSTADA para o MovimentacaoCaixaController
        const response = await axios.post(API_BASE_URL_MOVIMENTACOES, movimentacaoDTO);
        return response.data; // Retorna MovimentacaoCaixaResponseDTO
    } catch (error) {
        throw error;
    }
};
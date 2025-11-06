import axios from 'axios';

const API_URL = 'http://localhost:8080/ingredientes';


export async function cadastrarIngrediente(ingredienteData) {
    // Para um novo ingrediente, normalmente o estoque inicial é 0 ou o valor fornecido.
    return axios.post(API_URL, ingredienteData);
}


export async function buscarIngredientes() {
    return axios.get(API_URL);
}

export async function atualizarEstoque(id, quantidade) {
    // Seu endpoint PUT /ingredientes/{id}/estoque espera um parâmetro de query 'quantidade'
    return axios.put(`${API_URL}/${id}/estoque?quantidade=${quantidade}`);
}
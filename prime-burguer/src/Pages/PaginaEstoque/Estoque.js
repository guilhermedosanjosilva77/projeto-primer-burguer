import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { cadastrarIngrediente, buscarIngredientes, atualizarEstoque } from '../../api/ingrediente.js'; 
import './Estoque.css'; 

export default function Estoque() {
    const [ingredientes, setIngredientes] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [loadingList, setLoadingList] = useState(true); 

    const [nome, setNome] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('unidade'); 
    const [estoqueInicial, setEstoqueInicial] = useState('');
    const [precoCusto, setPrecoCusto] = useState('');
    const UNIDADES_VALIDAS = ['g', 'ml', 'unidade', 'kg', 'l'];

    const [estoqueUpdate, setEstoqueUpdate] = useState({}); 

    const fetchIngredientes = useCallback(async () => {
        setLoadingList(true);
        try {
            const response = await buscarIngredientes();
            setIngredientes(response.data);
        } catch (error) {
            toast.error("Falha ao carregar ingredientes. Verifique a API.");
            console.error("Erro ao buscar ingredientes:", error);
        } finally {
            setLoadingList(false);
        }
    }, []);

    // Executa o fetch na montagem do componente
    useEffect(() => {
        fetchIngredientes();
    }, [fetchIngredientes]);

    const handleCadastroSubmit = async (event) => {
        event.preventDefault();

        if (!nome || !unidadeMedida || estoqueInicial === '' || precoCusto === '') {
            toast.error("Por favor, preencha todos os campos, incluindo o Preço de Custo.");
            return;
        }

        const dadosCadastro = {
            nome,
            unidadeMedida,
            estoqueAtual: parseFloat(estoqueInicial) || 0,
            precoCusto: parseFloat(precoCusto),
        };

        setLoading(true);

        try {
            await cadastrarIngrediente(dadosCadastro);
            toast.success(`Ingrediente "${nome}" cadastrado com sucesso!`);
            
            setNome('');
            setEstoqueInicial('');
            setPrecoCusto('');
            await fetchIngredientes();

        } catch (error) {
            let mensagemErro = "Falha no cadastro. Verifique os dados.";
            
            if (error.response && error.response.data && error.response.data.message) {
                 mensagemErro = error.response.data.message;
            } else if (error.request) {
                mensagemErro = "Não foi possível conectar ao servidor.";
            }

            toast.error(mensagemErro);
            console.error("Erro ao cadastrar ingrediente:", error);

        } finally {
            setLoading(false);
        }
    };

    const handleEstoqueUpdate = async (id, tipo) => {
        const quantidade = parseFloat(estoqueUpdate[id]);

        if (isNaN(quantidade) || quantidade <= 0) {
            toast.error("A quantidade deve ser um número positivo maior que zero.");
            return;
        }
        
        const quantidadeApi = tipo === 'SAIDA' ? -quantidade : quantidade;

        setEstoqueUpdate(prev => ({ ...prev, [id]: 'loading' })); 

        try {
            await atualizarEstoque(id, quantidadeApi); 

            toast.success(`Estoque e Caixa atualizados com sucesso!`);

            setEstoqueUpdate(prev => {
                const newState = { ...prev };
                delete newState[id]; 
                return newState;
            });
            await fetchIngredientes();

        } catch (error) {
            let mensagemErro = "Falha ao atualizar estoque.";
            
            if (error.response && error.response.data) {
                 mensagemErro = error.response.data.message || `Erro: ${error.response.status}`;
            }

            toast.error(mensagemErro);
            console.error("Erro ao atualizar estoque:", error);
            
            setEstoqueUpdate(prev => ({ ...prev, [id]: '' })); 
        }
    };

    
    const renderTableBody = () => {
        if (loadingList) {
            return (
                <tr>
                    <td colSpan="6" style={{ textAlign: 'center', backgroundColor: '#fff', padding: '20px' }}>
                        Carregando ingredientes...
                    </td>
                </tr>
            );
        }

        if (ingredientes.length === 0) {
            return (
                <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#888', backgroundColor: '#fff', padding: '20px' }}>
                        Nenhum ingrediente cadastrado.
                    </td>
                </tr>
            );
        }

        return ingredientes.map((ingrediente) => (
            <tr key={ingrediente.id}>
                <td>{ingrediente.id}</td>
                <td>{ingrediente.nome}</td>
                <td>
                    {ingrediente.precoCusto > 0 ? 
                        `R$ ${ingrediente.precoCusto.toFixed(2).replace('.', ',')}` 
                        : 'R$ 0,00' 
                    }
                </td>
                {/* 🎯 ESTOQUE ATUAL */}
                <td>
                    {ingrediente.estoqueAtual} {ingrediente.unidadeMedida}
                </td>
                <td>{ingrediente.unidadeMedida}</td>
                {/* 🎯 ATUALIZAÇÃO DE ESTOQUE */}
                <td>
                    <div className="estoque-input-group">
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Qtd."
                            value={estoqueUpdate[ingrediente.id] === 'loading' ? '' : (estoqueUpdate[ingrediente.id] || '')}
                            onChange={(e) => setEstoqueUpdate(prev => ({ ...prev, [ingrediente.id]: e.target.value }))}
                            disabled={estoqueUpdate[ingrediente.id] === 'loading'}
                        />
                        <button
                            type="button"
                            onClick={() => handleEstoqueUpdate(ingrediente.id, 'ENTRADA')}
                            disabled={estoqueUpdate[ingrediente.id] === 'loading' || !estoqueUpdate[ingrediente.id]}
                            style={{ background: '#388e3c', boxShadow: '0 4px 10px rgba(56, 142, 60, 0.3)' }}
                        >
                            {estoqueUpdate[ingrediente.id] === 'loading' ? '...' : 'Entrada'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleEstoqueUpdate(ingrediente.id, 'SAIDA')}
                            disabled={estoqueUpdate[ingrediente.id] === 'loading' || !estoqueUpdate[ingrediente.id]}
                            style={{ background: '#f44336', boxShadow: '0 4px 10px rgba(244, 67, 54, 0.3)' }}
                        >
                            {estoqueUpdate[ingrediente.id] === 'loading' ? '...' : 'Saída'}
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className="ingredientes-panel">
    
            <div className="ingrediente-card cadastro-card">
                <h2 style={{ color: '#d32f2f' }}>Cadastrar Novo Ingrediente</h2>
                
                <form onSubmit={handleCadastroSubmit}>
                    
                    <label>
                        Nome do Ingrediente:
                        <input 
                            type="text" 
                            placeholder="Ex: Carne Bovina, Pão de Brioche" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <label>
                        Unidade de Medida:
                        <select
                            value={unidadeMedida}
                            onChange={(e) => setUnidadeMedida(e.target.value)}
                            disabled={loading}
                        >
                            {UNIDADES_VALIDAS.map(unidade => (
                                <option key={unidade} value={unidade}>{unidade.toUpperCase()}</option>
                            ))}
                        </select>
                    </label>
                    
                    <label>
                        Preço de Custo Unitário (R$):
                        <input 
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Ex: 5.50" 
                            value={precoCusto}
                            onChange={(e) => setPrecoCusto(e.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <label>
                        Estoque Inicial (Opcional, 0 se vazio):
                        <input 
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Ex: 10.0" 
                            value={estoqueInicial}
                            onChange={(e) => setEstoqueInicial(e.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar Ingrediente'}
                    </button>
                </form>
            </div>

            <div className="ingrediente-card visualizacao-estoque">
                <h2 style={{ color: '#d32f2f' }}>Inventário de Ingredientes</h2>
                
                <table className="ingrediente-tabela">
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>ID</th>
                            <th style={{ width: '20%' }}>Nome</th>
                            <th style={{ width: '15%' }}>Preço Custo</th>
                            <th style={{ width: '15%' }}>Estoque Atual</th>
                            <th style={{ width: '10%' }}>Medida</th>
                            <th style={{ width: '35%' }}>Atualizar Estoque</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableBody()}
                    </tbody>
                </table>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button 
                        type="button" 
                        onClick={fetchIngredientes} 
                        disabled={loadingList}
                        style={{ background: '#00bcd4', boxShadow: '0 4px 10px rgba(0, 188, 212, 0.3)', width: 'auto', padding: '10px 20px', fontSize: '14px' }}
                    >
                        {loadingList ? 'Recarregando...' : 'Recarregar Lista'}
                    </button>
                </div>
            </div>
        </div>
    );
}
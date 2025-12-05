// components/caixa/CriarCaixaModal.jsx

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { MdAdd } from 'react-icons/md';
import { criarNovoCaixa } from '../../api/Caixa.js'; 
import './CaixaModal.css';

export default function CriarCaixaModal({ onClose, onCaixaCriado }) {
    const [descricao, setDescricao] = useState('');
    const [saldoInicial, setSaldoInicial] = useState(0.00);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!descricao.trim()) {
            Swal.fire('Erro', 'A descrição do caixa não pode ser vazia.', 'error');
            return;
        }

        setLoading(true);
        const dto = {
            descricao,
            // O saldo inicial precisa ser um número decimal
            saldoAtual: parseFloat(saldoInicial) 
        };

        try {
            const novoCaixa = await criarNovoCaixa(dto);
            
            Swal.fire({
                icon: 'success',
                title: 'Caixa Criado!',
                html: `O caixa **${novoCaixa.descricao}** foi criado com sucesso. <br/>ID: **${novoCaixa.id}** | Saldo Inicial: R$ ${novoCaixa.saldoAtual.toFixed(2)}`,
                confirmButtonColor: '#27ae60'
            });

            onCaixaCriado(novoCaixa); // Notifica o componente pai para atualizar a lista/estado
            onClose();

        } catch (error) {
            Swal.fire('Erro', 'Não foi possível criar o caixa. Verifique o console para detalhes.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2><MdAdd /> Criar Novo Caixa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="descricao">Descrição do Caixa:</label>
                        <input
                            id="descricao"
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Ex: Caixa Principal, Caixa 2, etc."
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="saldoInicial">Saldo Inicial (R$):</label>
                        <input
                            id="saldoInicial"
                            type="number"
                            step="0.01"
                            value={saldoInicial}
                            onChange={(e) => setSaldoInicial(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Criando...' : 'Salvar Caixa'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
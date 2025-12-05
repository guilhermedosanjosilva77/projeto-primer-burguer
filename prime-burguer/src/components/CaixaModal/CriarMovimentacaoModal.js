// components/CaixaModal/CriarMovimentacaoModal.js

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { MdAdd, MdRemove } from 'react-icons/md';
import { criarMovimentacaoManual } from '../../api/Caixa'; // Ajuste o caminho

export default function CriarMovimentacaoModal({ caixaId, onClose, onMovimentacaoCriada }) {
    const [tipo, setTipo] = useState('ENTRADA');
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const valorNumerico = parseFloat(valor);
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            Swal.fire('Erro', 'O valor deve ser maior que zero.', 'error');
            return;
        }
        if (!descricao.trim()) {
            Swal.fire('Erro', 'Informe uma descrição para a movimentação.', 'error');
            return;
        }

        setLoading(true);

        const dto = {
            caixaId: caixaId,
            tipo: tipo,
            valor: valorNumerico,
            descricao: descricao,
            data: new Date().toISOString(), // Enviando a data atual
        };

        try {
            const novaMovimentacao = await criarMovimentacaoManual(dto);
            
            Swal.fire({
                icon: 'success',
                title: 'Movimentação Registrada!',
                text: `${tipo === 'ENTRADA' ? 'Entrada' : 'Saída'} de R$ ${novaMovimentacao.valor.toFixed(2)} registrada.`,
                confirmButtonColor: '#27ae60'
            });

            onMovimentacaoCriada(novaMovimentacao); 

        } catch (error) {
            Swal.fire('Erro', 'Falha ao registrar movimentação. Verifique o backend.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{tipo === 'ENTRADA' ? <MdAdd /> : <MdRemove />} Nova Movimentação</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tipo:</label>
                        <select 
                            value={tipo} 
                            onChange={(e) => setTipo(e.target.value)}
                        >
                            <option value="ENTRADA">ENTRADA</option>
                            <option value="SAIDA">SAÍDA</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Valor (R$):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder="0.00"
                            min="0.01"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Descrição:</label>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Ex: Reforço de Caixa, Compra de Pão, etc."
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" disabled={loading} className={`btn-primary ${tipo.toLowerCase()}`}>
                            {loading ? 'Registrando...' : 'Registrar'}
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
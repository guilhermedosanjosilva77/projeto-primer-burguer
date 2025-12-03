import { useEffect, useState } from "react"

function Caixa(){
    const [pedidos,setPedidos] = useState([]);

    useEffect(()=>{
        const dados = JSON.parse(localStorage.getItem("caixa")) || [];
        setPedidos(dados)
    },[]);

        const totalDoCaixa = pedidos.reduce((acc, p) => acc + p.valor, 0);

           return (
        <div className="caixa-container">
            <h1>Caixa</h1>

            <h2>Total acumulado com pedidos: R$ {totalDoCaixa.toFixed(2)}</h2>

            <h3>Pedidos finalizados</h3>

            {pedidos.length === 0 ? (
                <p>Nenhum pedido finalizado ainda.</p>
            ) : (
                <ul className="lista-pedidos">
                    {pedidos.map((p, i) => (
                        <li key={i} className="pedido-item">
                            <p><strong>Pedido:</strong> #{i + 1}</p>
                            <p><strong>Valor:</strong> R$ {p.valor.toFixed(2)}</p>
                            <p><strong>Data:</strong> {new Date(p.data).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );


}
export default Caixa
import { useState } from "react";

export default function Cadastrar({item,setItem}){
    const [produto,setProduto] = useState("");
    const [descricao,setDescricao] = useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();
        const newProduto ={id:Date.now(),produto,descricao};
        setItem([...item,newProduto]);
        setProduto("");
        setDescricao("");
    }
    return(
        <div className="cadastro-item">
            <h2>Cadastrar novo item no cardapio</h2>
            <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Produto"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
             />
             <input
             type="text"
             placeholder="Descrição"
             value={descricao}
             onChange={(e)=> setDescricao(e.target.value)}
      
             
             
             />
             <button type="submit">Criar</button>
            </form>
        </div>
    )

}
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
            <h2></h2>
        </div>
    )

}
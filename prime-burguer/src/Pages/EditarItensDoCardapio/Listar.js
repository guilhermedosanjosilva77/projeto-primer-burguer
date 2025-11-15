import React, { useState } from "react";

function Lista({itens,SetEditngitensId}){
    const[editarId,setEditarid]= useState=("");
    const[newDescricao,setNewDescricao] = useState("");
    const[newProduto, setNewProduto] = useState("");


// função percorre todos os itens usando o map e substitui o item que esta sendo editado pelo novo item
    const handleSave = (id) =>{
        itens.map((i) =>
        i.id === id ? {...i, produto:newProduto, descricao:newDescricao} : i);
        SetEditngitensId(null)
    }
}
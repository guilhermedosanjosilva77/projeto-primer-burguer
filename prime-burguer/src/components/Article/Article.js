import React from 'react';
import Swal from 'sweetalert2';

// Função auxiliar para mostrar o Toast de Sucesso.
// Ela precisa receber o 'item' como argumento ao ser chamada.
const toastSucesso = (item) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `${item.nome} adicionado ao Carrinho!`,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export default function ArticleLanches({ item, adicionarAoCarrinho }) {
  return (
    <div className="item-lanche">
      <img src={item.img} alt={item.nome} className="imagelanche" />
      <h1 style={{ textAlign: "center" }}>{item.nome}</h1>

      <div className="under-title">
        <h2>R$ {item.preco.toFixed(2)}</h2>

        <div className="buttondesc">
          <p>{item.descricao}</p>

          <button
            onClick={() => {
              // Chamada corrigida: Passando o item para a função toastSucesso
              toastSucesso(item); 
              adicionarAoCarrinho(item);
            }}
            className="lanchebuttom"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export function ArticleSobremessa({ item, adicionarAoCarrinho }) {
  return (
    <div className="items-doce">
      <img src={item.img} alt={item.nome} className="imagelanche" />
      <h1 style={{ textAlign: "center" }}>{item.nome}</h1>

      <div className="under-title">
        {/* Acesso corrigido: item.preco */}
        <h2>R$ {item.preco.toFixed(2)}</h2>

        <div className="buttondesc">
          {/* Acesso corrigido: item.descricao */}
          <p>{item.descricao}</p>

          <button
            className="docebuttom"
            // Passa o item correto para o carrinho
            onClick={() => {
              // Chamada corrigida: Passando o item para a função toastSucesso
              toastSucesso(item);
              adicionarAoCarrinho(item);
            }}
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
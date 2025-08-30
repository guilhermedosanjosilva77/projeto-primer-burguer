const ArticleLanches = ({lanche}) =>{
    return(
        <div className="item-lanche">
            <h1>{lanche.item}</h1>
            <div className="under-title">
            <img src={lanche.foto}/>  
            <p>{lanche.descricao}</p>
            </div>
        </div>
    )
}
export default ArticleLanches

export function ArticleSobremessa({doces}) {
    return (
        <div className="item-doce"> 
            <h1>{doces.item}</h1>
            <div className="under-title">
             <img src={doces.foto} />
            <p>{doces.descricao}</p>
            </div>
        </div>

    )
}

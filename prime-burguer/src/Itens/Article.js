const ArticleLanches = ({lanche}) =>{
    return(
        <div className="item-lanche">
            <div className="under-title">
            <img src={lanche.foto}/>  
            <div className="titulo-desc">
            <h1>{lanche.item}</h1>
            <p>{lanche.descricao}</p>
            </div>
            </div>
        </div>
    )
}
export default ArticleLanches

export function ArticleSobremessa({doces}) {
    return (
        <div className="item-doce"> 
            
            <div className="under-title">
             <img src={doces.foto} />
             <div className="titulo-desc1">
             <h1>{doces.item}</h1>
            <p>{doces.descricao}</p>
            </div>
            </div>
        </div>

    )
}

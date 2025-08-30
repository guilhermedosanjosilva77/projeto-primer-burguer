const ArticleLanches = ({lanche}) =>{
    return(
        <div>
            <h1>{lanche.item}</h1>
            <img src={lanche.foto}/>    
            <p>{lanche.descricao}</p>
        </div>
    )
}
export default ArticleLanches

export function ArticleSobremessa({doces}) {
    return (
        <div>
            <h1>{doces.item}</h1>
            <img src={doces.foto} />
            <p>{doces.descricao}</p>
        </div>

    )
}

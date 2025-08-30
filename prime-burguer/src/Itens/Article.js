const Article = ({lanche}) =>{
    return(
        <div>
            <h1>{lanche.item}</h1>
            <img src={lanche.foto}/>    
            <p>{lanche.descricao}</p>
        </div>
    )
}
export default Article
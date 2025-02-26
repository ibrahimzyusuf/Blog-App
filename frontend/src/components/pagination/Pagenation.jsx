import './pagenation.css'

const Pagenation = ({pages,currentPage,setCurrentPage}) => {
    const generatedPages=[]
    for (let i = 1; i <= pages; i++) {
        generatedPages.push(i)
    }
return (
    <div className="pagination">
        <button onClick={()=>setCurrentPage(prev=>prev-1)} className="page previouse" 
        disabled={currentPage===1}>Previouse</button>
        {generatedPages.map(page=>
        <div onClick={()=>setCurrentPage(page)} key={page} 
        className={currentPage===page?'page active':'page'}>
            {page}
        </div>)}
        <button onClick={()=>setCurrentPage(prev=>prev+1)} className="page next" 
        disabled={currentPage===pages}>Next</button>
    </div>
)
}

export default Pagenation
import * as React from 'react';
import "./style.scss"

export interface PaginationProps {
    totalPages: any;
    currentPage: number;
    setPage: any;
}
 
const Pagination: React.FunctionComponent<PaginationProps> = ({totalPages, currentPage, setPage}) => {
    
    const PAGINATION_LIMIT = window.screen.width >= 600 ? 9 : 3;
    const MORE = window.screen.width >= 600 ? 5 : 2;
     
    let setPagination = 0;

    if(currentPage > MORE) setPagination = currentPage - MORE;

    const pages = Array.from(Array(totalPages).keys())
        .splice(setPagination, PAGINATION_LIMIT)
        .map((x) => (
                <li className={"page-item"} key={x + 1}>
                    <button
                        className={currentPage === x + 1 ? "page-btn active" : "page-btn"}
                        onClick={() => setPage(x + 1)}
                    >
                        {x + 1}
                    </button>
                </li>
        ))
    
    return (
        <ul className="pagination">
            {currentPage >= 2 && (
                <>
                    <li className={"page-item"}>
                        <button className={"page-btn page-first"} onClick={() => setPage(1)}>First</button>
                    </li>
                    <li className={"page-item"}>
                        <button className={"page-btn"} onClick={() => setPage(currentPage - 1)}>&#171;</button>
                    </li>
                </>
            )}
            {pages}
            {totalPages !== 0 && currentPage !== totalPages && (
                <>
                    <li className={"page-item"}>
                        <button className={"page-btn"} onClick={() => setPage(currentPage + 1)}>&#187;</button>
                    </li>
                    <li className={"page-item"}>
                        <button className={"page-btn page-last"} onClick={() => setPage(totalPages)}>Last</button>
                    </li>
                </>
            )}
        </ul>
    );
}
 
export default Pagination;
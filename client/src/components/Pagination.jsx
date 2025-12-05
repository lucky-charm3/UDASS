import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ pagination, onPageChange, isFetching }) {
    const { currentPage, totalPages, totalStudents } = pagination;
    if (totalPages <= 1) return null; 

    const PageButton = ({ page, children, isActive, isDisabled }) => (
        <button
            onClick={() => onPageChange(page)}
            disabled={isDisabled || isFetching || isActive} 
            className={`px-4 py-2 text-sm font-medium border transition ${
                isActive
                    ? "bg-primary-600 text-white border-primary-600 pointer-events-none"
                    : "bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            }`}
        >
            {children}
        </button>
    );

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span> (Total <span className="font-medium">{totalStudents}</span> members)
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <PageButton page={currentPage - 1} isDisabled={currentPage === 1}>
                            <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </PageButton>

                        {pageNumbers.map(page => (
                            <PageButton 
                                key={page} 
                                page={page} 
                                isActive={page === currentPage}
                            >
                                {page}
                            </PageButton>
                        ))}
                        
                        <PageButton page={currentPage + 1} isDisabled={currentPage === totalPages}>
                            <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                        </PageButton>
                    </nav>
                </div>
            </div>
        </div>
    );
}
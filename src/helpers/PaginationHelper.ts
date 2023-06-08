export interface IPagination {
    current_page: number
    per_page: number
    total_pages: number
    total_items: number
    items: any[]
    links: {
        prev: string
        next: string
    }
}

export function createPaginatedResponse (
    items: any[],
    totalItems: number,
    pageNumber: number,
    perPage: number,
    baseUrl: string
): IPagination {
    const totalPages = Math.ceil(totalItems / perPage)
    const currentPage = pageNumber

    const response: IPagination = {
        current_page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_items: totalItems,
        items,
        links: {
            prev: "",
            next: ""
        }
    }

    if (currentPage > 1) {
        const prevPage = currentPage - 1
        response.links.prev = `${baseUrl}?page=${prevPage}&perPage=${perPage}`
    }

    if (currentPage < totalPages) {
        const nextPage = currentPage + 1
        response.links = {
            ...response.links,
            next: `${baseUrl}?page=${nextPage}&perPage=${perPage}`
        }
    }

    return response
}

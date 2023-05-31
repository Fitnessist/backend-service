export interface IPagination {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
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
        currentPage: pageNumber,
        perPage,
        totalPages,
        totalItems,
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

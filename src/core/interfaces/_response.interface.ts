
export interface _paginatorModel_I {

    meta: { [s: string]: any; itemCount: number; totalItems?: number; itemsPerPage: number; totalPages?: number; currentPage: number; },
    links: {
        first?: string;
        previous?: string;
        next?: string;
        last?: string;
    }

}

export interface _Response_I {

    ok?: boolean;
    statusCode?: number;
    path?: string;
    data?: any;
    message?: string;
    paginator?: _paginatorModel_I;
    err?: any;
    context?: string;

}



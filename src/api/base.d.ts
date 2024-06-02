declare type ApiResponse<T = unknown> = {
    code: "SUCCESS" | "ERROR" | "UNAUTHORIZED";
    msg: string;
    data?: T;
};

declare type BaseModel = {
    created_at: string;
    updated_at: string;
};

declare type PageResult<T> = {
    total: number;
    list: T[];
};

declare type PageRequest = {
    page?: number;
    per_page?: number;
    list_type?: "all";
};

import http from "@/utils/request.tsx";

export type UserModel = BaseModel & {
    id: number;
    name: string;
    username: string;
    email: string;
};

export type LoginReq = {
    username: string;
    password: string;
    verify_id: string;
    captcha_code: string;
};

export type LoginResp = ApiResponse<{
    token: string;
}>;

export function login(data: LoginReq) {
    return http.post<LoginResp>("/api/v1/login", data, {
        useCommonErrorHandler: false,
    });
}

export function logout() {
    return http.get("/api/v1/logout");
}

export type UserResp = ApiResponse<UserModel>;

export function user_info() {
    return http.get<UserResp>("/api/v1/users/user_info", {
        useCommonErrorHandler: false,
    });
}

export type CaptchaReq = {
    verify_id: string;
};

export type CaptchaResp = Blob;

export function captcha(data: CaptchaReq) {
    return http.get<CaptchaResp>("/api/v1/captcha", {
        headers: {
            "verify-id": data.verify_id,
        },
        useCommonErrorHandler: false,
        responseType: "blob",
    });
}

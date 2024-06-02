import { message, notification, Modal } from "antd";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { isEmpty } from "lodash-es";
import qs from "qs";
import { LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY } from "@/constants/browserStorage";
import pkg from "../../package.json";

declare module "axios" {
    export interface AxiosRequestConfig {
        useCommonErrorHandler?: boolean;
    }

    export interface AxiosInstance extends Axios {
        request<R, D = unknown>(config: AxiosRequestConfig<D>): Promise<R>;
        get<R, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
        delete<R, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
        head<R, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
        options<R, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
        post<R, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
        put<R, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
        patch<R, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
        postForm<R, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
        putForm<R, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
        patchForm<R, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    }
}

const http = axios.create({
    baseURL: import.meta.env.VITE_API_USE_PROXY === "true" ? "" : import.meta.env.VITE_API_HOST,
    headers: {
        "Content-Type": "application/json",
        "Client-Version": pkg.version,
    },
    useCommonErrorHandler: true,
});

// 自动添加 token
const tokenInterceptor = (config: InternalAxiosRequestConfig) => {
    const token =
        localStorage.getItem(LOCAL_STORAGE_KEY.AUTO_LOGIN) === "true"
            ? localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN)
            : sessionStorage.getItem(SESSION_STORAGE_KEY.TOKEN);

    if (!isEmpty(token)) config.headers.setAuthorization(`Bearer ${token}`);
    return config;
};

const paramsRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    const query = config.params
        ? qs.stringify(config.params, {
              arrayFormat: "brackets",
          })
        : null;
    const url = config.url + (query ? `?${query}` : "");
    return {
        ...config,
        url,
        params: void 0,
    };
};

const debugRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    console.debug(`请求地址：`, (config.baseURL || "") + config.url);
    console.debug(`请求头：`, config.headers);
    console.debug(`请求参数：`, config.data);
    return config;
};

http.interceptors.request.use(tokenInterceptor, function (error) {
    return Promise.reject(error);
});
http.interceptors.request.use(paramsRequestInterceptor, function (error) {
    return Promise.reject(error);
});
http.interceptors.request.use(debugRequestInterceptor, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(
    function (response) {
        console.debug(`响应对象：`, response);
        if (response.status >= 200 && response.status < 300) {
            const data: ApiResponse = response.data;
            console.debug(`响应参数：`, data);

            if (data.code === "ERROR") {
                const { config } = response;

                if (config.useCommonErrorHandler) {
                    message.error({
                        content: data.msg,
                    });
                }
                return Promise.reject(new AxiosError(data.msg, data.code, response.config, response.request, response));
            } else if (data.code === "UNAUTHORIZED") {
                const { config } = response;
                if (config.useCommonErrorHandler) {
                    Modal.error({
                        title: "登录超时",
                        content: "认证信息已过期，请重新登录",
                        okText: "登录",
                        onOk: () => {
                            [LOCAL_STORAGE_KEY.TOKEN, LOCAL_STORAGE_KEY.AUTO_LOGIN, SESSION_STORAGE_KEY.TOKEN].forEach(
                                (key) => {
                                    localStorage.removeItem(key);
                                    sessionStorage.removeItem(key);
                                },
                            );
                            location.href =
                                import.meta.env.BASE_URL +
                                "user/login?" +
                                qs.stringify({
                                    redirect: location.pathname + location.search,
                                });
                        },
                    });
                }

                return Promise.reject(new AxiosError(data.msg, data.code, response.config, response.request, response));
            }
            return response.data;
        } else {
            return Promise.reject(
                new AxiosError(response.statusText, AxiosError.ERR_BAD_RESPONSE, response.config, void 0, response),
            );
        }
    },
    function (error) {
        if (error instanceof AxiosError) {
            const { config, message, response } = error;
            if (config?.useCommonErrorHandler) {
                const { method, baseURL, url } = config;

                if (response) {
                    notification.error({
                        message: `${response.status} - ${response.statusText}`,
                        description: `[${method?.toUpperCase()}] ${baseURL}${url}`,
                    });
                } else {
                    notification.error({
                        message: `${message}`,
                        description: `[${method?.toUpperCase()}] ${baseURL}${url}`,
                    });
                }
            }
        }
        return Promise.reject(error);
    },
);

export default http;

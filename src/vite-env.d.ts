/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_DEFAULT_URL: string;
    readonly VITE_LOGIN_TITLE: string;
    readonly VITE_LOGIN_DESC: string;

    readonly VITE_API_USE_PROXY: "true" | "false";
    readonly VITE_API_HOST: string;
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

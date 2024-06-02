import { FC } from "react";
import { Tabs, Alert } from "antd";
import { LoginForm, ProFormCheckbox, ProFormText } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import qs from "qs";
import { captcha, login } from "@/api";
import IconComponent from "@/components/IconComponent";
import { LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY } from "@/constants/browserStorage";
import { LoginFormType } from "./data";

const loginBg = new URL("@/assets/login_bg.png", import.meta.url).href;

const Login: FC = () => {
    const location = useLocation();
    const params = qs.parse(location.search.substring(1));
    const navigate = useNavigate();

    const [verify_id, setVerify_id] = useState<string>("");
    const [captchaImg, setCaptchaImg] = useState<string>("");

    const { run } = useRequest(
        async () => {
            if (captchaImg) {
                URL.revokeObjectURL(captchaImg);
            }
            const verify_id = nanoid(32) + dayjs().unix();
            const res = await captcha({
                verify_id,
            });
            return {
                blob: res,
                verify_id,
            };
        },
        {
            onSuccess: (data) => {
                const imgUrl = URL.createObjectURL(data.blob);
                setCaptchaImg(imgUrl);
                setVerify_id(data.verify_id);
            },
        },
    );

    const { error, runAsync, loading } = useRequest(login, {
        manual: true,
    });

    const onFinish = async (data: LoginFormType) => {
        try {
            const res = await runAsync({
                ...data,
                verify_id,
            });
            if (res.data) {
                localStorage.setItem(LOCAL_STORAGE_KEY.AUTO_LOGIN, String(Boolean(data.autoLogin)));
                if (data.autoLogin) {
                    localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, res.data.token);
                } else {
                    sessionStorage.setItem(SESSION_STORAGE_KEY.TOKEN, res.data.token);
                }
            }
            if (location.search.length > 0) {
                if (params.redirect) {
                    let redirect = params.redirect as string;
                    if (redirect.includes(import.meta.env.BASE_URL)) {
                        redirect = "/" + redirect.replace(import.meta.env.BASE_URL, "");
                    }
                    navigate(redirect);
                    return;
                }
            }
            navigate(import.meta.env.VITE_DEFAULT_URL);
        } catch (error) {
            run();
            return Promise.reject(error);
        }
    };

    return (
        <div
            className={"h-screen"}
            style={{
                backgroundImage: `url(${loginBg})`,
                backgroundSize: "100% 100%",
            }}
        >
            <div className={"pt-28"}>
                <LoginForm
                    title={import.meta.env.VITE_LOGIN_TITLE}
                    subTitle={import.meta.env.VITE_LOGIN_DESC}
                    loading={loading}
                    onFinish={onFinish}
                    message={error && <Alert message={error?.message} showIcon type="error" />}
                >
                    <Tabs
                        centered
                        items={[
                            {
                                label: "账号密码登录",
                                key: "account",
                            },
                        ]}
                    />
                    <ProFormText
                        name={"username"}
                        fieldProps={{
                            size: "large",
                            prefix: <IconComponent icon={"UserOutlined"} />,
                        }}
                        placeholder={"用户名"}
                        rules={[
                            {
                                required: true,
                                message: "请输入用户名！",
                            },
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: "large",
                            prefix: <IconComponent icon={"LockOutlined"} />,
                        }}
                        placeholder={"密码"}
                        rules={[
                            {
                                required: true,
                                message: "请输入密码！",
                            },
                        ]}
                    />
                    <ProFormText
                        name="captcha_code"
                        fieldProps={{
                            size: "large",
                            prefix: <IconComponent icon={"LockOutlined"} />,
                        }}
                        addonAfter={
                            <img
                                className="cursor-pointer"
                                onClick={() => run()}
                                style={{ width: "80px", height: "40px" }}
                                src={captchaImg}
                            />
                        }
                        placeholder={"验证码"}
                        rules={[
                            {
                                required: true,
                                message: "请输入验证码！",
                            },
                        ]}
                    />
                    <div
                        style={{
                            marginBlockEnd: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox>
                    </div>
                </LoginForm>
            </div>
        </div>
    );
};

export default Login;

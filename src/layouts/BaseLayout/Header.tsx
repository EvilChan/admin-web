import { FC } from "react";
import { Dropdown, Avatar, Button } from "antd";
import qs from "qs";
import { logout } from "@/api/user";
import IconComponent from "@/components/IconComponent";
import { useSettingStore } from "@/stores/setting";
import { useUserStore } from "@/stores/user";

const Header: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { runAsync } = useRequest(logout, {
        manual: true,
    });
    const userStore = useUserStore();
    const settingStore = useSettingStore();

    return (
        <div className={"flex items-center h-full"}>
            <div className={"flex-1 flex"}>
                <div
                    onClick={() => settingStore.setCollapsed(!settingStore.collapsed)}
                    style={{
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    {settingStore.collapsed ? (
                        <IconComponent icon={"MenuUnfoldOutlined"} />
                    ) : (
                        <IconComponent icon={"MenuFoldOutlined"} />
                    )}
                </div>
            </div>
            <div className={"flex items-center"}>
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "logout",
                                icon: <IconComponent icon={"LogoutOutlined"} />,
                                label: "退出登录",
                                onClick: async () => {
                                    console.log("退出登录");

                                    await runAsync();
                                    ["token", "autoLogin"].forEach((key) => {
                                        localStorage.removeItem(key);
                                        sessionStorage.removeItem(key);
                                    });

                                    navigate(
                                        "/user/login?" +
                                            qs.stringify({
                                                redirect: location.pathname + location.search,
                                            }),
                                    );
                                },
                            },
                        ],
                    }}
                >
                    <Button type="text">
                        <div className={"flex items-center"}>
                            <Avatar size="small" icon={<IconComponent icon={"UserOutlined"} />} />
                            <span className={"ml-1.5"}>{userStore.user?.name || userStore.user?.username}</span>
                        </div>
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
};

export default Header;

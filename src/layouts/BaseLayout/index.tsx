import { FC } from "react";
import { Layout, ConfigProvider, App } from "antd";
import zhCN from "antd/locale/zh_CN";
import Content from "@/layouts/BaseLayout/Content.tsx";
import Header from "@/layouts/BaseLayout/Header.tsx";
import Logo from "@/layouts/BaseLayout/Logo";
import Menu from "@/layouts/BaseLayout/Menu";
import { useSettingStore } from "@/stores/setting.ts";

const BaseLayout: FC = () => {
    const collapsed = useSettingStore((state) => state.collapsed);
    const siderWidth = useSettingStore((state) => state.siderWidth);
    const headerHeight = useSettingStore((state) => state.headerHeight);

    const content = useMemo(() => <Content />, []);

    return (
        <ConfigProvider locale={zhCN}>
            <App>
                <Layout style={{ height: "100dvh" }}>
                    <Layout.Sider
                        collapsedWidth={0}
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        width={siderWidth}
                    >
                        <Layout.Header
                            style={{
                                height: headerHeight,
                                padding: 0,
                            }}
                        >
                            <Logo title={import.meta.env.VITE_APP_TITLE} />
                        </Layout.Header>
                        <Layout.Content>
                            <Menu title={import.meta.env.VITE_APP_TITLE} />
                        </Layout.Content>
                    </Layout.Sider>
                    <Layout>
                        <Layout.Header
                            style={{
                                height: headerHeight,
                                padding: "0 20px",
                                background: "#fff",
                            }}
                        >
                            <Header />
                        </Layout.Header>
                        <Layout.Content style={{ padding: "20px" }}>{content}</Layout.Content>
                    </Layout>
                </Layout>
            </App>
        </ConfigProvider>
    );
};

export default BaseLayout;

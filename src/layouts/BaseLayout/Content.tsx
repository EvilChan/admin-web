import { FC, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UIMatch, useMatches } from "react-router-dom";
import { Breadcrumb, Button, Result } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import Loading from "@/components/Loading";

const Content: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const matches = useMatches();

    const defaultUrl = import.meta.env.VITE_DEFAULT_URL;

    const [breadcrumbs, setBreadcrumbs] = useState<ItemType[]>([]);

    useEffect(() => {
        if (location.pathname === "/") navigate(defaultUrl);
    }, []);

    useEffect(() => {
        genBreadcrumb(matches);
    }, [matches]);

    /**
     * 添加面包屑
     */
    const genBreadcrumb = (matches: UIMatch[]) => {
        setBreadcrumbs(
            matches
                .filter((item) => item.handle)
                .map((item) => ({
                    path: item.pathname,
                    key: item.pathname,
                    title: (item.handle as Metadata).title,
                })),
        );
    };

    return (
        <ErrorBoundary
            fallback={
                <Result
                    status="error"
                    title="发生了未知错误"
                    subTitle="错误日志已发送，请联系管理人员"
                    extra={[
                        <Button
                            type={"primary"}
                            key="home"
                            onClick={() => {
                                window.location.href = import.meta.env.BASE_URL;
                            }}
                        >
                            返回首页
                        </Button>,
                    ]}
                />
            }
            onError={(error, info) => console.log(error, info)}
        >
            <div className={"h-full flex flex-col gap-2"}>
                <Breadcrumb
                    items={breadcrumbs}
                    itemRender={(route) =>
                        route.path === location.pathname ? (
                            <span>{route.title}</span>
                        ) : (
                            <Link to={route.path!}>{route.title}</Link>
                        )
                    }
                />
                <div className="max-h-full overflow-y-auto">
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Content;

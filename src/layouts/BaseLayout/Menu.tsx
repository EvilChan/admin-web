import { FC, ReactNode } from "react";
import { Helmet } from "react-helmet";
import { Menu as AntdMenu, GetProp } from "antd";
import { MenuItemType, SubMenuType, MenuItemGroupType } from "antd/es/menu/hooks/useItems";
import IconComponent from "@/components/IconComponent";
import { useSettingStore } from "@/stores/setting.ts";

type ItemType = GetProp<typeof AntdMenu, "items">[number];

type MenuProps = {
    title?: string;
};

const Menu: FC<MenuProps> = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [menus, setMenus] = useState<ItemType[]>([]);
    const [subTitle, setSubTitle] = useState<string>("");
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const collapsed = useSettingStore((state) => state.collapsed);

    useEffect(() => {
        const menus: ItemType[] = [
            {
                label: "首页",
                key: "/home",
                icon: <IconComponent icon={"HomeOutlined"} />,
            },
            {
                label: "上游管理",
                key: "/up",
                icon: <IconComponent icon={"UsergroupAddOutlined"} />,
                children: [
                    {
                        label: "商户管理",
                        key: "/upStreams",
                    },
                    {
                        label: "通道组管理",
                        key: "/channels",
                    },
                ],
            },
            {
                label: "下游管理",
                key: "/down",
                icon: <IconComponent icon={"UsergroupDeleteOutlined"} />,
                children: [
                    {
                        label: "商户管理",
                        key: "/downStreams",
                    },
                ],
            },
            {
                label: "订单管理",
                key: "order",
                icon: <IconComponent icon={"OrderedListOutlined"} />,
                children: [
                    {
                        label: "订单管理",
                        key: "/orders",
                    },
                ],
            },
            {
                label: "财务管理",
                key: "financial",
                icon: <IconComponent icon={"DollarOutlined"} />,
                children: [
                    {
                        label: "对账明细",
                        key: "/financialRecords",
                    },
                ],
            },
        ];
        setMenus(menus);

        for (const menu of menus) {
            const subTitle = getSubTitle(location.pathname, menu);
            if (subTitle) {
                setSubTitle(subTitle as string);
                break;
            }
        }
    }, []);

    useEffect(() => {
        if (menus.length > 0) setOpenKeys(getOpenKeys(location.pathname));
    }, [menus, collapsed, location.pathname]);

    const getSubTitle = (key: string, item: ItemType): ReactNode | undefined => {
        if (item?.key === key) {
            return (item as MenuItemType).label;
        }
        if (Array.isArray((item as SubMenuType).children)) {
            for (const menu of (item as SubMenuType).children) {
                return getSubTitle(key, menu);
            }
        }

        return void 0;
    };

    const getOpenKeys = (path?: string): string[] => {
        if (!path) return [];
        const openKeys: string[] = [];

        const find = (item: ItemType) => {
            if (item?.key === path) {
                return true;
            }
            const children = (item as MenuItemGroupType).children;
            if (children && Array.isArray(children)) {
                for (const item2 of children) {
                    const flag = find(item2);
                    if (flag) {
                        openKeys.push(item?.key as string);
                    }
                }
            }
        };

        for (const item of menus) {
            find(item);
        }

        return openKeys;
    };

    return (
        <>
            <Helmet>
                <title>
                    {subTitle && `${subTitle} - `}
                    {props.title}
                </title>
            </Helmet>
            <AntdMenu
                openKeys={openKeys}
                onOpenChange={(openKeys) => setOpenKeys(openKeys)}
                selectedKeys={[location.pathname]}
                onClick={(info) => {
                    if (menus) {
                        for (const menu of menus) {
                            const subTitle = getSubTitle(info.key, menu);
                            if (subTitle) {
                                setSubTitle(subTitle as string);
                                break;
                            }
                        }
                    }
                    navigate(info.key);
                }}
                mode={"inline"}
                theme={"dark"}
                items={menus}
            />
        </>
    );
};

export default Menu;

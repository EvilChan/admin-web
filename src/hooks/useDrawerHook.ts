import { DrawerProps } from "antd";

export function useDrawerHook(defaultDrawerProps?: DrawerProps) {
    const [drawerProps, setDrawerProps] = useState<DrawerProps>({
        open: false,
        onClose: () => {
            close();
        },
        ...defaultDrawerProps,
    });

    const open = () => {
        setDrawerProps({
            ...drawerProps,
            open: true,
        });
    };

    const close = () => {
        setDrawerProps({
            ...drawerProps,
            open: false,
        });
    };

    return {
        drawerProps,
        action: {
            open,
            close,
        },
    };
}

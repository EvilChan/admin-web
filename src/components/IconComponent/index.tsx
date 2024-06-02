import * as icons from "@ant-design/icons";

export default memo<{ icon: keyof typeof icons }>(
    (props) => {
        const { icon } = props;

        const Component = icons[icon];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return <Component {...props} />;
    },
    (prevProps, nextProps) => prevProps.icon === nextProps.icon,
);

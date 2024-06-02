import { FC } from "react";
import { Typography } from "antd";

type TitleProps = {
    title?: string;
};

const Title: FC<TitleProps> = (props) => {
    const navigate = useNavigate();

    return (
        <a
            className="flex items-center h-full text-nowrap"
            onClick={() => navigate(import.meta.env.VITE_DEFAULT_URL, { replace: true })}
        >
            <Typography.Title
                level={5}
                style={{
                    marginTop: "0.5em",
                    marginLeft: "28px",
                    color: "#fff",
                }}
            >
                {props.title}
            </Typography.Title>
        </a>
    );
};

export default Title;

import { FC } from "react";
import { Spin } from "antd";

const PageLoading: FC = () => {
    return (
        <div className={"flex h-screen justify-center items-center"}>
            <Spin size={"large"} />
        </div>
    );
};

export default PageLoading;

import { FC } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const Loading: FC = () => {
    useEffect(() => {
        NProgress.start();
        return () => {
            NProgress.done();
        };
    }, []);
    return <></>;
};

export default Loading;

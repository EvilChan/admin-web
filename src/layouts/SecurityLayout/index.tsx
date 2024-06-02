// import qs from "qs";
// import { user_info } from "@/api/user";
import PageLoading from "@/components/PageLoading";
import BaseLayout from "@/layouts/BaseLayout";

// import { useUserStore } from "@/stores/user";

const SecurityLayout = () => {
    // const { runAsync } = useRequest(user_info, {
    //     manual: true,
    // });
    // const userStore = useUserStore();
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        setIsShow(true);
        // 获取用户信息
        // runAsync()
        //     .then((res) => {
        //         if (res.data) {
        //             setIsShow(true);
        //             userStore.setUser(res.data);
        //         }
        //     })
        //     .catch(() => {
        //         location.href =
        //             import.meta.env.BASE_URL +
        //             "user/login?" +
        //             qs.stringify({
        //                 redirect: location.pathname + location.search,
        //             });
        //     });
    }, []);

    return isShow ? <BaseLayout /> : <PageLoading />;
};

export default SecurityLayout;

import { createBrowserRouter } from "react-router-dom";
import { routes } from "@/router/routes.tsx";

const router = createBrowserRouter(routes, {
    basename: import.meta.env.BASE_URL,
});

export default router;

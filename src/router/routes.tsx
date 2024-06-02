import type { RouteObject } from "react-router-dom";
import baseRoutes from "~react-pages";
import SecurityLayout from "@/layouts/SecurityLayout";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/user/login";

export const routes: RouteObject[] = [
    {
        path: "/user/login",
        element: <Login />,
    },
    {
        path: "*",
        element: <SecurityLayout />,
        children: [
            ...baseRoutes,
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
];

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "tailwindcss/tailwind.css";
import router from "@/router";

dayjs.locale("zh-cn");

ReactDOM.createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);

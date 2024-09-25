import SideBar from "@/components/SideBar/SideBar";
import Category from "@/pages/Category/Category";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ProductAdd from "@/pages/ProductAdd/ProductAdd";
import Products from "@/pages/Products/Products";
import Tags from "@/pages/Tags/Tags";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <SideBar />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/add",
        element: <ProductAdd />,
      },
      {
        path: "/categories",
        element: <Category />,
      },
      {
        path: "/tags",
        element: <Tags />,
      },
    ],
  },
]);

export default router;

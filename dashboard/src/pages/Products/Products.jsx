import DataTable from "react-data-table-component";
import PageHeader from "@/components/PageHeader/PageHeader";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Link } from "react-router-dom";
const columns = [
  {
    name: "#",
    selector: (row, index) => index + 1,
    sortable: true,
    width: "60px",
  },
  {
    name: "Product",
    selector: (row) => row,
    cell: (row) => (
      <div className="flex items-center">
        <img src={row.imageUrl} alt={row.title} className="w-12 h-12 mr-4" />
        <div className="flex flex-col gap-1">
          <p className="font-medium text-gray-900 line-clamp-1">{row.title}</p>
          <div className="flex">
            <p className="text-sm text-gray-500 border-r pr-2">ID: {row.id}</p>
            <p className="text-sm text-gray-500 pl-2">SKU: {row.sku}</p>
          </div>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    name: "Category",
    selector: (row) => row.category,
    sortable: true,
  },
  {
    name: "Stock",
    selector: (row) => row.stock,
    sortable: true,
    width: "150px",
  },
  {
    name: "Price",
    selector: (row) => row.price,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row,
    cell: (row) => (
      <div className="flex gap-2 items-center">
        <BiEditAlt className="text-primary text-xl" />
        <BiTrash className="text-red-500 text-xl" />
      </div>
    ),
    sortable: true,
    width: "150px",
  },
];

const data = [
  {
    id: "1",
    title:
      "Apple iPhone 15 kfjsk kfjsdkf dkfjsdk fdkfjsdkfj dkfjsdkfjdsf kdfjsdkfjs dkfjsdkf",
    sku: "APL-IP12",
    category: "Electronics",
    stock: 24,
    price: "$999.00",
    imageUrl: "https://picsum.photos/200",
  },
  {
    id: "2",
    title: "Samsung Galaxy S21",
    sku: "SAM-GS21",
    category: "Electronics",
    stock: 18998989,
    price: "$799.00",
    imageUrl: "https://picsum.photos/200",
  },
  // more products...
];

const Products = () => {
  return (
    <div>
      <PageHeader
        title1={"Dashboard/Products"}
        title2={"Products"}
        button1={
          <Link to="/products/add" className={buttonVariants({})}>
            Add product
          </Link>
        }
      />
      <div className="bg-white shadow-md rounded-md">
        <div className="p-3">
          <input
            type="text"
            placeholder="Start typing for search products"
            className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
          />
        </div>
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          pointerOnHover
          striped
        />
      </div>
    </div>
  );
};

export default Products;

import DataTable from "react-data-table-component";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import AlertDialogMessage from "@/components/AlertDialogMessage/AlertDialogMessage";
import DialogBox from "@/components/DialogBox/DialogBox";
import Select from "react-select";
import { useState } from "react";

const data = [
  {
    id: "1",
    name: "Apple iPhone 15",
    item: 24,
    visibility: "Public",
    imageUrl: "https://picsum.photos/200",
  },
  {
    id: "2",
    name: "Apple iPhone 15",
    item: 24,
    visibility: "Hidden",
    imageUrl: "https://picsum.photos/200",
  },
  // more products...
];

const Category = () => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const showEditModalData = (id) => {
    alert(id);
  };

  const handleSaveEditData = (id) => {
    alert(id);
  };
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
    },
    {
      name: "Image",
      selector: (row) => row,
      cell: (row) => (
        <img
          src={row.imageUrl}
          alt={row.name}
          className="w-12 h-12 object-cover"
        />
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.name,

      sortable: true,
    },
    {
      name: "Item",
      selector: (row) => row.item,
      sortable: true,
    },
    {
      name: "Visibility",
      selector: (row) => row.visibility,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => row,
      cell: (row) => (
        <div className="flex gap-2 items-center">
          {/* This is the edit button */}
          <DialogBox
            button={
              <BiEditAlt
                onClick={() => showEditModalData(row.id)}
                className="text-primary text-xl"
              />
            }
            title="Edit Category"
            button2={
              <Button onClick={() => handleSaveEditData(row.id)}>Save</Button>
            }
          >
            <div>
              <Select
                options={options}
                classNamePrefix="select"
                defaultValue={{ value: "chocolate", label: "Chocolate" }}
                placeholder={"Select parent category"}
              />
              <input
                type="text"
                placeholder="Category Name"
                defaultValue={row.name}
                required
                className="mt-3 w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
              />
            </div>
          </DialogBox>

          {/* This is the delete button */}
          <AlertDialogMessage
            button={<BiTrash className="text-red-500 text-xl" />}
            action={() => handleDelete(row.id)}
          />
        </div>
      ),
      sortable: true,
      width: "150px",
    },
  ];
  const handleDelete = (id) => {
    alert(id);
  };
  return (
    <div>
      <PageHeader
        title1="Dashboard/Categories"
        title2="Categories"
        button1={
          <DialogBox
            button={<Button>New Category</Button>}
            title="Add Category"
            button2={<Button>Save</Button>}
          >
            <div>
              <Select
                options={options}
                classNamePrefix="select"
                placeholder={"Select parent category"}
                onChange={(e) => setParentId(e.value)}
              />
              <input
                type="text"
                placeholder="Category Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-3 w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
              />
            </div>
          </DialogBox>
        }
      />
      {/* This is the table with search */}
      <div className="bg-white shadow-md rounded-md">
        <div className="p-3">
          <input
            type="text"
            placeholder="Start typing for search categories"
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

export default Category;

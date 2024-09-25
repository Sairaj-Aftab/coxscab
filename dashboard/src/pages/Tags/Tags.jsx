import DataTable from "react-data-table-component";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import AlertDialogMessage from "@/components/AlertDialogMessage/AlertDialogMessage";
import DialogBox from "@/components/DialogBox/DialogBox";

const data = [
  {
    id: "1",
    name: "Apple iPhone 15",
    item: 24,
  },
  {
    id: "2",
    name: "Apple iPhone 15",
    item: 24,
  },
  // more products...
];

const Tags = () => {
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
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
      name: "Action",
      selector: (row) => row,
      cell: (row) => (
        <div className="flex gap-2 items-center">
          <BiEditAlt className="text-primary text-xl" />
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
        title1="Dashboard/Tags"
        title2="Tags"
        button1={
          <DialogBox
            button={<Button>New Tag</Button>}
            title="Add Tag"
            button2={<Button>Save</Button>}
          >
            <div>
              <input
                type="text"
                placeholder="Tag Name"
                className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
              />
            </div>
          </DialogBox>
        }
      />
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

export default Tags;

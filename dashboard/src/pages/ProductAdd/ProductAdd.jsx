import { useState } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import Select from "react-select";
import "tailwindcss/tailwind.css";

const ProductAdd = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Function to handle editor state changes
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  return (
    <div>
      <PageHeader
        title1={"Dashboard/Products/Add"}
        title2={"Add product"}
        button1={<Button>Save</Button>}
      />
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Left Side */}
        <div className="basis-8/12 flex flex-col gap-5">
          {/* Basic Information */}
          <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">
              Basic information
            </h3>
            <label>
              <p className="text-sm font-medium text-gray-700">Name</p>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-sm outline-gray-400 py-1 px-3 text-base text-gray-800 mt-1"
              />
            </label>
            <label>
              <p className="text-sm font-medium text-gray-700">
                Short description
              </p>
              <textarea
                type="text"
                className="w-full border border-gray-300 rounded-sm outline-gray-400 py-1 px-3 text-base text-gray-800 mt-1"
              />
            </label>
            <label>
              <p className="text-sm font-medium text-gray-700">Description</p>
              <div className="min-h-[250px] border p-2 rounded bg-white">
                <Editor
                  editorState={editorState}
                  // wrapperClassName="demo-wrapper"
                  // editorClassName="demo-editor"
                  // toolbarClassName="border-b mb-2"
                  onEditorStateChange={onEditorStateChange}
                  //             toolbar={{
                  //     options: ["inline", "blockType", "fontSize", "list", "textAlign", "colorPicker", "link", "embedded", "emoji", "image", "remove", "history"],
                  //     inline: { options: ["bold", "italic", "underline", "strikethrough", "monospace"] },
                  //     blockType: { options: ["Normal", "H1", "H2", "H3", "Blockquote"] },
                  //     fontSize: { options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96] },
                  //     textAlign: { options: ["left", "center", "right", "justify"] },
                  //   }}
                />
              </div>
            </label>
          </div>
          {/* Pricing */}
          <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">
              Pricing
            </h3>
            <div className="flex gap-5">
              <label className="w-full">
                <p className="text-sm font-medium text-gray-700">Price</p>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-sm outline-gray-400 py-1 px-3 text-base text-gray-800 mt-1"
                />
              </label>
              <label className="w-full">
                <p className="text-sm font-medium text-gray-700">Old price</p>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-sm outline-gray-400 py-1 px-3 text-base text-gray-800 mt-1"
                />
              </label>
            </div>
          </div>
          {/* Sku Inventory */}
          <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">
              Inventory
            </h3>
            <div className="flex gap-5">
              <label className="w-full">
                <p className="text-sm font-medium text-gray-700">SKU</p>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-sm outline-gray-400 py-1 px-3 text-base text-gray-800 mt-1"
                />
              </label>
              <label className="w-full">
                <p className="text-sm font-medium text-gray-700">
                  Stock quantity
                </p>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-sm outline-gray-400 py-1 px-3 text-base text-gray-800 mt-1"
                />
              </label>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="basis-4/12 flex flex-col gap-5">
          {/* Categories */}
          <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">
              Categories
            </h3>
            <div>
              <Select options={options} isMulti classNamePrefix="select" />

              <button className="text-sm font-normal text-primary hover:underline mt-3">
                Add new category
              </button>
            </div>
          </div>
          {/* Tags */}
          <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">Tags</h3>
            <div>
              <Select options={options} isMulti classNamePrefix="select" />
              <button className="text-sm font-normal text-primary hover:underline mt-3">
                Add new tag
              </button>
            </div>
          </div>
          {/* Images */}
          <div className="rounded-md shadow-md p-3 bg-white">
            <h3 className="text-base font-medium text-gray_text mb-3">
              Images
            </h3>
            <div className="flex justify-between flex-wrap gap-5">
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-24 h-24 object-cover"
              />
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-24 h-24 object-cover"
              />
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-24 h-24 object-cover"
              />
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-24 h-24 object-cover"
              />
            </div>
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full border border-gray-300 rounded-sm outline-none py-1 px-3 text-base text-gray-800 mt-1"
              />
              <button className="text-sm font-normal text-primary hover:underline mt-3">
                Add images
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdd;

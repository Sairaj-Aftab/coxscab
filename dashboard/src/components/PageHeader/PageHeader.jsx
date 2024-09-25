const PageHeader = ({ title1, title2, button1, button2 }) => {
  return (
    <div className="flex justify-between items-center py-5">
      <div>
        <p className="text-xs font-medium text-gray-500">{title1}</p>
        <h1 className="text-2xl font-medium text-gray_text">{title2}</h1>
      </div>
      <div className="flex gap-3">
        {button1}
        {button2}
      </div>
    </div>
  );
};

export default PageHeader;

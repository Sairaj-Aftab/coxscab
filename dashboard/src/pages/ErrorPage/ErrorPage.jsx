import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-red-600 text-xl font-semibold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-red-600 font-semibold">
        <i>{error?.statusText || error?.message}</i>
      </p>
      <Link
        to={"/"}
        className="bg-primary px-4 py-2 rounded-md text-white font-semibold"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ErrorPage;

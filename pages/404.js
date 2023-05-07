//next
import { useRouter } from "next/router";

function Custom404() {
  const router = useRouter();

  function redirectHandler() {
    router.push("/welcome");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <div className="flex justify-center">
        <button
          onClick={redirectHandler}
          className="py-2 mt-4 px-4 border-0 bg-blue-500 font-semibold rounded-xl text-white"
        >
          Home Page
        </button>
      </div>
    </div>
  );
}

export default Custom404;

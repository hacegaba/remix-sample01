export default function Header() {
  return (
    <div className="px-2 py-2 sm:{px-4 py-6} lg:{px-6 py-8}">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Back End Developer
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <form method="post" action="/logout">
            <button
              type="submit"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

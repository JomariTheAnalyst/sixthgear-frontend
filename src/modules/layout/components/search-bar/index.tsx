"use client"

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-[200px] lg:max-w-[300px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-none leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-gray-900 focus:ring-0 sm:text-xs transition-colors duration-200"
        placeholder="Search"
      />
    </div>
  )
}

export default SearchBar

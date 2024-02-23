import { MdSearch } from "react-icons/md";

interface SearchProps {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

function Search({ setSearchText }: SearchProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex items-center bg-tertiary dark:bg-secondary rounded-md p-2 mb-3">
      <span className="pr-1">
        <MdSearch />
      </span>
      <input
        className="bg-tertiary dark:bg-secondary text-primary dark:text-quaternary w-full border-none focus:outline-none placeholder:text-gray-500 dark:placeholder:text-[#9CA3AF]"
        type="text"
        placeholder="Type to search..."
        onChange={handleSearch}
      />
    </div>
  );
}

export default Search;

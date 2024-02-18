import { MdSearch } from "react-icons/md";

interface SearchProps {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

function Search({ setSearchText }: SearchProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="flex items-center bg-secondary rounded-md p-2 mb-2 md:mb-5">
      <span className="pr-1">
        <MdSearch />
      </span>
      <input
        className="bg-secondary text-quaternary  w-full border-none focus:outline-none"
        type="text"
        placeholder="Type to search..."
        onChange={handleSearch}
      />
    </div>
  );
}

export default Search;

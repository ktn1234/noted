import { MdSearch } from "react-icons/md";

interface SearchProps {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Search({ handleSearch }: SearchProps) {
  return (
    <section className="flex items-center bg-tertiary dark:bg-secondary rounded-md p-2">
      <span className="pr-1">
        <MdSearch />
      </span>
      <input
        className="bg-tertiary dark:bg-secondary text-primary dark:text-quaternary w-full border-none focus:outline-none placeholder:text-gray-500 dark:placeholder:text-[#9CA3AF]"
        type="text"
        placeholder="Type to search..."
        onChange={handleSearch}
      />
    </section>
  );
}

export default Search;

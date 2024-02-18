import { FaStickyNote } from "react-icons/fa";

function Navbar(): JSX.Element {
  return (
    <nav className="flex items-center justify-between">
      <div>
        <div className="flex items-center">
          <FaStickyNote />
          <span className="pl-2">Noted</span>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div>Sign in</div>
      </div>
    </nav>
  );
}

export default Navbar;

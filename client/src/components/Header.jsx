import { Link } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";

export default function Header() {
  return (
    <section
      id="header"
      className="flex justify-between p-4 border-b-2 border-black items-center "
    >
      <h1>
        <Link to="/" className="text-4xl font-Plaster font-black">
          MEOBLOG
        </Link>
      </h1>
      <nav>
        <ul className="flex font-Popphins text-2xl">
          <li className="px-4">
            <Link to="/home">Home</Link>
          </li>
          <li className="px-4">
            <Link to="/sign-in">Sign In</Link>
          </li>
          <li className="px-4">
            <Link to="/sign-up">Sign Up</Link>
          </li>
          <button>
            <IoMdMenu className="w-6 h-6" />
          </button>
        </ul>
      </nav>
    </section>
  );
}

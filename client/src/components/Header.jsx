import { Link } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";

export default function Header() {
  return (
    <section
      id="header"
      className="flex justify-between p-4 border-b-2 border-black items-center "
    >
      <h1>
        <Link to="/" className="text-4xl font-Josefin font-black">
          WEOBLOG
        </Link>
      </h1>
      <nav>
        <ul className="flex font-Popphins">
          <li className="px-4 font-">
            <Link to="/home">Home</Link>
          </li>
          <li className="px-4">
            <Link to="/sign-in">SignIn</Link>
          </li>
          <li className="px-4">
            <Link to="/sign-up">SignUp</Link>
          </li>
          <button>
            <IoMdMenu className="w-6 h-6" />
          </button>
        </ul>
      </nav>
    </section>
  );
}

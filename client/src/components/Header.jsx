import { Link } from "react-router-dom";
import { IoMdMenu, IoMdMoon, IoMdSunny } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
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
          <div className="flex">
            <button className="p-3 mr-1 border rounded-full hover:bg-slate-100">
              <IoMdMenu className="w-6 h-6" />
            </button>
            <button
              className="p-3 mr-1 border rounded-full hover:bg-slate-100"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <IoMdSunny /> : <IoMdMoon />}
            </button>
            {currentUser ? (
              <>
                <img
                  src={currentUser.profilePicture}
                  className="rounded-full w-11 h-11 "
                />
                <div className="absolute flex flex-col p-4 border top-20 right-5">
                  <span>{currentUser.username}</span>
                  <span>{currentUser.email}</span>
                  <Link to={"/dashboard?tab=profile"}>Profile</Link>
                  <span>signOut</span>
                </div>
              </>
            ) : (
              <Link to={"/sign-in"}>로그인</Link>
            )}
          </div>
        </ul>
      </nav>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineProfile } from "react-icons/ai";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div>
      <ul className="flex flex-col gap-3 p-3  font-Popphins text-2xl">
        <li className={`profile ${tab === "profile" ? "text-red-500" : ""}`}>
          <Link to="/dashboard?tab=profile" className="flex items-center gap-1">
            <AiOutlineProfile />
            Profile
          </Link>
        </li>
        <li className="">users</li>
        <li className="">posts</li>
        <li className="">comments</li>
        <li className="">signout</li>
      </ul>
    </div>
  );
}

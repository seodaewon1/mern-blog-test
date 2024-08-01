import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import DashPosts from "../components/DashPosts";
import Dashcomments from "../components/Dashcomments";
import { useEffect, useState } from "react";
import DashUsers from "../components/DashUsers";

export default function Dashboard() {
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
    <div className="dashboard flex">
      <div className="dash__left w-60 h-screen border">
        <DashSidebar />
      </div>
      <div className="dash__right w-full h-screen">
        {tab === "profile" && <DashProfile />}
        {tab === "users" && <DashUsers />}
        {tab === "posts" && <DashPosts />}
        {tab === "comments" && <Dashcomments />}
      </div>
    </div>
  );
}

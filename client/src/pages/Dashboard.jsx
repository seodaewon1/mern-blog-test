import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";

export default function Dashboard() {
  return (
    <div className="dashboard flex">
      <div className="dash__left w-60 h-screen border">
        <DashSidebar />
      </div>
      <div className="dash__right w-full h-screen">
        <DashProfile />
      </div>
    </div>
  );
}

import DashProfile from "./DashProfile";
import DashSidebar from "./DashSidebar";

export default function Dashboard() {
  return (
    <div className="dashboard flex">
      <div className="dash__left h-screen border">
        <DashSidebar />
      </div>
      <div className="dash__right w-full">
        <DashProfile />
      </div>
    </div>
  );
}

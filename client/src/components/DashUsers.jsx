import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(`/api/user/getusers?&startIndex=${startIndex}`);
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 font-Popphins text-2xl items-center font-semibold">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <table className=" w-full">
            <caption className="text-4xl p-5">Blog Users</caption>
            <thead>
              <tr className="bg-slate-900 text-white text-xl">
                <th className="border  p-3">Data Created</th>
                <th className="border  p-3">User image</th>
                <th className="border  p-3">Username</th>
                <th className="border  p-3">Useremail</th>
                <th className="border  p-3">Admin</th>
                <th className="border  p-3">Delete</th>
              </tr>
            </thead>
            <tbody className="text-center text-xl">
              {users.map((user, index) => (
                <tr key={index} className=" transition-all hover:bg-gray-200 ">
                  <td className="p-2 border">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-20 object-cover mx-auto"
                    />
                  </td>
                  <td className="p-2 border">{user.username}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">
                    <div className="flex justify-center">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="p-2 border">
                    <span
                      className=" text-red-500 cursor-pointer hover:underline mb"
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                    >
                      delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className=" w-full text-xl items-center font-semibold border p-3 mt-5"
            >
              더보기
            </button>
          )}
        </>
      ) : (
        <p>아직 회원이 없습니다.</p>
      )}

      {showModal && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-35">
          <div className="absolute  w-1/4 p-10 transform -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2">
            <h3 className="mb-5 text-center">게시글을 정말 삭제하겠습니까?</h3>
            <div className="flex justify-evenly">
              <button
                className=" w-full px-2 py-2 mr-1 text-white bg-red-500"
                onClick={handleDeleteUser}
              >
                삭제
              </button>
              <button
                className="w-full px-4 text-white bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                뒤로가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
        }
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 font-Popphins text-2xl items-center font-semibold">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <table className=" w-full">
            <caption className="text-4xl p-5">Data</caption>
            <thead>
              <tr className="bg-slate-900 text-white text-xl">
                <th className="border  p-3">Data Updated</th>
                <th className="border  p-3">Post image</th>
                <th className="border  p-3">Post title</th>
                <th className="border  p-3">Category</th>
                <th className="border  p-3">Delete</th>
                <th className="border  p-3">Edit</th>
              </tr>
            </thead>
            <tbody className="text-center text-xl">
              {userPosts.map((post, index) => (
                <tr key={index} className=" transition-all hover:bg-gray-200 ">
                  <td className="p-2 border">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="border">
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 object-cover mx-auto"
                      />
                    </Link>
                  </td>
                  <td className="p-2 border">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </td>
                  <td className="p-2 border">{post.category}</td>
                  <td className="p-2 border">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className=" text-red-500 cursor-pointer hover:underline"
                    >
                      Delete
                    </span>
                  </td>
                  <td className="p-2 border">
                    <Link
                      to={`/update-post/${post._id}`}
                      className=" text-sky-500 cursor-pointer hover:underline"
                    >
                      Edit
                    </Link>
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
        <p>아직 글이 없습니다.</p>
      )}

      {showModal && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-35">
          <div className="absolute  w-1/4 p-10 transform -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2">
            <h3 className="mb-5 text-center">게시글을 정말 삭제하겠습니까?</h3>
            <div className="flex justify-evenly">
              <button
                className=" w-1/3 px-2 py-2 mr-1 text-white bg-red-500"
                onClick={handleDeletePost}
              >
                삭제
              </button>
              <button
                className="w-1/3 px-4 text-white bg-gray-500"
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

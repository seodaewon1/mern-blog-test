import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContents(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex">
      <div>
        <img
          className="w-16 h-16 m-2"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="w-full m-2 p-4 bg-slate-50 border">
        <div className="flex justify-between">
          {user ? `@${user.username}` : "anonymore user"}
          <span>{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ? (
          <>
            <textarea
              className="bg-slate-300 mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div>
              <button onClick={handleSave}>저장</button>
              <button
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              <div>{comment.content}</div>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button onClick={handleEdit}>수정</button>
                    <button onClick={() => onDelete(comment._id)}>삭제</button>
                  </>
                )}
              <button
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentTodelete, setCommentToDelete] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200) {
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      {currentUser ? (
        <div className="flex">
          <img
            className="w-10 h-10 object-cover rounded-full mb-2 bg-slate-500 mr-4"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <p className="text-2xl uppercase">{currentUser.username}</p>
        </div>
      ) : (
        <>
          <p>로그인 후 댓글 작성이 가능합니다.</p>
          <Link to={"/sign-in"}>로그인하기</Link>
        </>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="댓글을 200자 이내로 작성해주세요."
            rows="3"
            maxLength="200"
            className="border border-black w-full h-24 p-4 outline-none "
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></textarea>
          <p className="text-gray-500 text-right">199글자가 남았습니다.</p>
          <div>
            <button
              className="border bg-black text-white w-full p-3 mb-48"
              type="submit"
            >
              저장하기
            </button>
          </div>
          {commentError && <div className="mt-5 border">{commentError}</div>}
        </form>
      )}
      {comments.length === 0 ? (
        <p>아직 댓글이 없습니다.</p>
      ) : (
        <>
          <div>
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={(commentId) => {
                  setShowModal(true);
                  setCommentToDelete(commentId);
                }}
              />
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className=" absolute p-4 bg-white border top-1/2 left-1/2">
          <h3>정말로 삭제하시겠습니까?</h3>
          <button
            className="block p-2 mb-2 text-white bg-red-500"
            onClick={() => {
              handleDelete(commentTodelete);
            }}
          >
            Yes
          </button>
          <button
            className="block p-2 mb-2 text-white bg-gray-500"
            onClick={() => setShowModal(false)}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}

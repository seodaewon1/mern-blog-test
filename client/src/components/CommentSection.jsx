import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";

export default function CommentSection() {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentTodelete, setCommentToDelete] = useState(null);

  const handleSubmit = async () => {};
  return (
    <div>
      {currentUser ? (
        <div className="flex">
          <img
            className="w-5 h-5 object-cover rounded-full bg-slate-500"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <p>{currentUser.username}</p>
        </div>
      ) : (
        <>
          <p>로그인 후 댓글 작성이 가능합니다.</p>
          <Link>로그인하기</Link>
        </>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="댓글을 200자 이내로 작성해주세요."
            rows="3"
            maxLength="200"
            className="border border-cyan-700"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div>
            <p className="text-gray-500">199글자가 남았습니다.</p>
            <button className="border bg-black text-white" type="submit">
              저장하기
            </button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p>아직 댓글이 없습니다.</p>
      ) : (
        <>
          <div>
            <p>댓글(댓글 점수)</p>
            <Comment />
          </div>
        </>
      )}
    </div>
  );
}

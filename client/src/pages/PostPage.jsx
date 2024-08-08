import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setPost(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          console.log(data);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        loading.....
      </div>
    );
  return (
    <main>
      <div className=" w-1/2 m-auto flex justify-between items-center border-b-2 py-8 border-b-gray-500">
        <h1 className=" text-4xl pb-4 ">{post && post.title}</h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className="self-center mt-5"
        >
          <button className="p-2 px-4 border rounded-full">
            {post && post.category}
          </button>
        </Link>
        <div className="time  pb-4">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <img
        src={post && post.image}
        alt="PostImg"
        className="m-auto w-1/2 h-96 object-cover mt-8"
      />

      <div
        className="w-1/2 h-24 flex items-center m-auto p-2 bg-slate-800 text-white text-center  border mt-2"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <span className="italic">
        {post && (post.content.length / 1000).toFixed(0)} mins read
      </span>
      <div className="w-1/2 m-auto mt-12 ">
        <div className="comment font-bold text-3xl text-left mb-10 py-2 border-b-2 border-black">
          댓글 작성
        </div>
        {post && <CommentSection postId={post._id} />}

        <div className="flex flex-col items-center justify-center mb-5">
          <h1 className="mt-5 text-xl">Recent articles</h1>
          <div className="flex flex-wrap justify-center gap-5 mt-5">
            {recentPosts &&
              recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

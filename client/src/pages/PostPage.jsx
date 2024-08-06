import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

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
  return (
    <main>
      <div className=" w-1/2 m-auto flex justify-between items-center border-b-2 py-8 border-b-gray-500">
        <h1 className=" text-4xl pb-4 ">{post && post.title}</h1>
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
        className="w-1/2 m-auto p-2 bg-black text-white text-center border mt-2"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="comment"></div>
    </main>
  );
}

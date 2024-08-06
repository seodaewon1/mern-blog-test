import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        console.log(data);
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("이미지를 넣어주세요!");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("이미지 업로드 실패");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl min-h-screen mx-auto">
      <h1 className="text-3xl text-center my-7">Update Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="타이틀을 작성하세요."
            required
            className="w-full h-20 outline-none  text-xl"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <select
            className="block py-4"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncateorized" className="border outline-none">
              카테고리를 선택하세요!
            </option>
            <option value="javascript">javascript</option>
            <option value="react.js">react.js</option>
            <option value="next.js">next.js</option>
          </select>
        </div>
        <div>
          <div className="flex  justify-between items-center mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              className=" text-white bg-black p-2 rounded-md"
              onClick={handleUploadImage}
              disabled={imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">{`${
                  imageUploadProgress || 0
                }%`}</div>
              ) : (
                "이미지 업로드"
              )}
            </button>
            {imageUploadError && (
              <div className="p-2 bg-black text-white">{imageUploadError}</div>
            )}
            {formData.image && (
              <img
                src={formData.image}
                alt="upload"
                className=" object-cover w-72 h-72"
              />
            )}
          </div>
          <ReactQuill
            theme="snow"
            placeholder="내용을 적어주세요!"
            required
            className=" h-80"
            onChange={(value) => setFormData({ ...formData, content: value })}
            value={formData.content}
          />
          <button
            type="submit"
            className=" text-white bg-black p-2 rounded-md mt-12"
          >
            업데이트
          </button>
          {publishError && <div className="mt-5">{publishError}</div>}
        </div>
      </form>
    </div>
  );
}

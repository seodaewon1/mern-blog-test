import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // console.log(imageFileUploadProgress, imageFileUploadError);
  const [formData, setFormData] = useState({});

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // console.log(imageFile, imageFileUrl);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read;
    //         allow write: if
    //         request.resource.size < 1 * 1024 * 1024 &&
    //         request.resource.contentType.matches('image/.*')
    //         }
    //     }
    //   }
    // console.log("uploading image...");

    imageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("이미지는 1메가를 초과할 수 없습니다.");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("변경된 부분이 없습니다.");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("이미지 업로드 중입니다.");
      return;
    }

    try {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      dispatch(updateSuccess(data));
      setUpdateUserSuccess("프로필 업데이트가 성공했습니다.");
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        alert("계정이 성공적으로 삭제되었습니다.");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        alert("로그아웃 되었습니다.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto ">
        <h1 className="w-full p-10 text-2xl text-center">Profile</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              hidden
            />

            <div
              className="flex m-auto mb-4 relative self-center w-32 h-32 cursor-pointer"
              onClick={() => filePickerRef.current.click()}
            >
              <img
                className="rounded-full w-full h-full object-cover border-2 border-[lightgray]"
                src={imageFileUrl || currentUser.profilePicture}
                alt="user"
              />
              <span>{`${imageFileUploadProgress}%`}</span>
            </div>

            <input
              type="text"
              id="username"
              placeholder="이름"
              className="mb-6 w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none "
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
            <input
              type="email"
              id="email"
              placeholder="이메일"
              className="mb-6 w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              className="mb-6 w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none"
              defaultValue="********"
              onChange={handleChange}
            />
            {imageFileUploadError && (
              <div className="p-5 px-10 mb-6 text-white bg-slate-500 rounded-md text-center">
                {imageFileUploadError}
              </div>
            )}
            {updateUserSuccess && (
              <div className="p-5 px-10 mt-5 text-center text-green-700 bg-green-200 rounded-full">
                {updateUserSuccess}
              </div>
            )}
            {updateUserError && (
              <div className="p-5 px-10 mt-5 text-center text-red-700 bg-red-200 rounded-full">
                {updateUserError}
              </div>
            )}
            {error && (
              <div className="p-5 px-10 mt-5 text-center text-red-700 bg-red-200 rounded-full">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 px-10 text-white rounded-md block bg-black"
            >
              수정하기
            </button>
            {currentUser.isAdmin && (
              <Link to={"/create-post"}>
                <button
                  type="button"
                  className="w-full p-5 px-10 mt-3 text-white bg-red-600 rounded-full"
                >
                  글쓰기
                </button>
              </Link>
            )}

            <div className="flex justify-between mt-3 text-red-500">
              <span
                className="cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                계정 삭제
              </span>
              <span className="cursor-pointer" onClick={handleSignout}>
                로그아웃
              </span>
            </div>
          </fieldset>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-100  border-x-zinc-500 p-8 rounded-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold mb-4 ">
              계정을 정말 삭제하겠습니까?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                삭제하기
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                뒤로가기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

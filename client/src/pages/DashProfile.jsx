import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  // console.log(imageFileUploadProgress, imageFileUploadError);

  const filePickerRef = useRef();

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
          // setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="w-full p-10 text-2xl text-center">Profile</h1>
      <form className="">
        <fieldset>
          <input
            type="file"
            accept="image/*"
            className="mb-4"
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
          </div>

          <input
            type="text"
            id="username"
            placeholder="이름"
            className="mb-6 w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none "
            defaultValue={currentUser.username}
          />
          <input
            type="email"
            id="email"
            placeholder="이메일"
            className="mb-6 w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none"
            defaultValue={currentUser.email}
          />
          <input
            type="password"
            id="password"
            placeholder="비밀번호"
            className="mb-6 w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none"
            defaultValue="********"
          />
          {imageFileUploadError && (
            <div className="p-5 px-10 mb-6 text-white bg-slate-500 rounded-md text-center">
              {setImageFileUploadError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-10 text-white rounded-md block bg-black"
          >
            수정하기
          </button>
          <div className="flex justify-between mt-3 text-red-500">
            <span className="cursor-pointer">계정 삭제</span>
            <span className="cursor-pointer">로그아웃</span>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

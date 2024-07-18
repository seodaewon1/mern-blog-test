import { AiFillGooglePlusCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

export default function Facebook() {
  const fbook = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFacebookClick = async () => {
    const provider = new FacebookAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromFacebook = await signInWithPopup(fbook, provider);

      console.log(resultsFromFacebook);
      const res = await fetch("/api/auth/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromFacebook.user.displayName,
          email: resultsFromFacebook.user.email,
          googlePhotoUrl: resultsFromFacebook.user.photoURL,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="flex justify-center w-full p-4 mt-2 border hover:bg-slate-200"
        onClick={handleFacebookClick}
      >
        <AiFillGooglePlusCircle className="w-6 h-6 mr-2" /> 페이스북으로
        가입하기
      </button>
    </div>
  );
}

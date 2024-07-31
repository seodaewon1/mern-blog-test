import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth.jsx";
export default function SignUp() {
  const [formData, setFormData] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("모든 영역을 채워주세요!");
    }

    // 유효성 검사

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success == false) {
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-medium mb-6  font-Popphins">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              id="username"
              className="w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-stone-100 focus:border-stone-300"
              placeholder="이름을 입력해주세요."
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-stone-100 focus:border-stone-300"
              placeholder="이메일을 입력해주세요."
              onChange={handleChange}
            />
          </div>
          <div className="mb-10">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-6 py-3  border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-stone-100 focus:border-stone-300"
              placeholder="비밀번호를 입력해주세요."
              onChange={handleChange}
            />
          </div>
          {errorMessage && (
            <div className="mt-5 p-2 text-red-500 bg-red-200">
              {errorMessage}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full py-4 px-8 mb-4 bg-stone-950 hover:bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? (
                <span className="p-2">loading....</span>
              ) : (
                "회원가입하기"
              )}
            </button>
            <OAuth />
          </div>
          <Link to="/">계정이 있나요?</Link>
        </form>
      </div>
    </div>
  );
}

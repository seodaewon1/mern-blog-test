
export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-medium mb-6  font-Popphins">Sign In</h2>
        <form>
          <div className="mb-6">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-stone-100 focus:border-stone-300"
              placeholder="이메일을 입력해주세요."
            />
          </div>
          <div className="mb-10">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-6 py-3  border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-stone-100 focus:border-stone-300"
              placeholder="비밀번호를 입력해주세요."
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-4 px-8 bg-stone-950 hover:bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
    // <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //   <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    //     <h2 className="text-2xl font-medium mb-6  font-Popphins">Sign In</h2>
    //     <form>
    //       <div className="mb-4">
    //         <label className="block text-gray-700">Email</label>
    //         <input
    //           type="email"
    //           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-stone-100 focus:border-stone-300"
    //           placeholder="이메일을 입력해주세요."
    //         />
    //       </div>
    //       <div className="mb-6">
    //         <label className="block text-gray-700">Password</label>
    //         <input
    //           type="password"
    //           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-stone-100 focus:border-stone-300"
    //           placeholder="비밀번호를 입력해주세요."
    //         />
    //       </div>
    //       <div>
    //         <button
    //           type="submit"
    //           className="w-full py-2 px-4 bg-stone-950 hover:bg-stone-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
    //         >
    //           Sign In
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
}

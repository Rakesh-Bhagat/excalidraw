"use client";
import { useRouter } from "next/navigation";
import LoginButton from "./LoginButton";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Pen } from "lucide-react";

interface DecodedToken {
  name: string;
  userId: string;
}
const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded.name);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  return (
    <div className="mx-auto flex justify-between items-center  bg-[#1f2937] p-4">
      <div className="flex text-3xl text-gray-50  ">
        <h1 className="font-bold font-mono">SketchFlow</h1>
      </div>
      <div>
          <Link href="/canvas">
            <button className="relative flex items-center font-semibold font-mono bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-md hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-transparent bg-clip-padding before:content-[''] before:absolute before:inset-0 before:z-[-1] before:m-[-2px] before:rounded-xl before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:animate-pulse">
              <Pen className="mr-3 h-6 w-6" />
              Go To Canvas
            </button>
          </Link>
        </div>
      <div className="flex items-center space-x-4">
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="bg-blue-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center uppercase">
                {user.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="text-white border border-gray-500 px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <LoginButton onclick={() => router.push("/signin")} text="Login" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

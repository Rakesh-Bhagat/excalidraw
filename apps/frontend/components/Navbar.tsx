"use client";
import { useRouter } from "next/navigation";
import LoginButton from "./LoginButton";
import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";

interface DecodedToken {
  name: string;
  userId: string;

}
const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null)
  
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
  );
};

export default Navbar;

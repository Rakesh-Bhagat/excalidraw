"use client";
import InputBox from "@/components/InputBox";
import InputButton from "@/components/InputButton";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


const Signup = () => {
  const router = useRouter();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const handleSubmit = async() => {
    try {
      const response = await axios.post("http://localhost:8000/signin", {
        username,
        password
    }, {
      withCredentials: true
    })

    console.log(response.data)
    const token = response.data.token;
    localStorage.setItem("token", token)
    router.push('/room/123')
    } catch (error) {
      console.log("signin failed: " + error)
    }
    
    

}

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-neutral-300">
      <div className="w-[60vw] h-[80vh] bg-[hsl(var(--auth-background))] rounded-4xl grid grid-cols-2 p-2">
        <div className="col-span-1  relative">
          <Image
            src={"/signup.jpg"}
            alt="signup-image"
            fill
            className="object-cover rounded-4xl"
          />
        </div>
        <div className="col-span-1 px-12 py-20 flex flex-col ">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl mb-2 text-white font-semibold">Log In</h2>
            <p className="text-sm text-gray-500">
              Don &apos;t have an account??{" "}
              <Link href={"/signup"} className="underline">
                Sign up
              </Link>
            </p>
          </div>
          <div className="flex flex-col mt-16 items-center">
            <InputBox type="text" placeholder="Username" handleChange={(e) => setUsername(e.target.value)} />
            <InputBox type="password" placeholder="Enter Your Password" handleChange={(e) => setPassword(e.target.value)} />
            <InputButton buttonText="Create Account" onSubmit={handleSubmit}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

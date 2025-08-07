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
  const [name, setName] = useState("");
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const handleSubmit = async() => {
    try {
      const serverUrl = process.env.NEXT_PUBLIC_HTTP_URL
      const response = await axios.post(`${serverUrl}/signup`, {
        name,
        username,
        password
    }, {
      withCredentials: true
    })

    console.log(response.data)
    if(response.data){
      router.push("/signin")
    }
    } catch (error) {
      console.log("signup failer: " + error)
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
            <h2 className="text-3xl mb-2 text-white font-semibold">Create an Account</h2>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href={"/signin"} className="underline">
                Log in
              </Link>
            </p>
          </div>
          <div className="flex flex-col mt-16 items-center">
            <InputBox type="text" placeholder="Name" handleChange={(e) => setName(e.target.value)} />
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

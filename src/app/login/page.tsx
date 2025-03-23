"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; 

export default function LoginPage() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [error, setError] = useState("");
     const router = useRouter();

     const handleLogin = async (e: React.FormEvent) => {
          e.preventDefault();
          setError("");

          try {
               const userCredential = await signInWithEmailAndPassword(auth, email, password);
               const token = await userCredential.user.getIdToken(); 

               setCookie("token", token, { maxAge: 60 * 60 * 24, path: "/" });

               router.push("/dashboard"); 
          } catch (err) {
               console.error(err);
               setError("Login gagal, periksa email dan password!");
          }
     };

     return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
               <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-bold mb-4">Login</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <input
                         type="email"
                         placeholder="Email"
                         className="w-full p-2 border rounded mb-2"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                         type="password"
                         placeholder="Password"
                         className="w-full p-2 border rounded mb-2"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
               </form>
          </div>
     );
}

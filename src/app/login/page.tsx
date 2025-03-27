"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

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
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
               <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
               {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
               <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                         type="email"
                         label="Email"
                         placeholder="Masukkan email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                         type="password"
                         label="Password"
                         placeholder="Masukkan password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit">Login</Button>
               </form>
          </div>
     );
}

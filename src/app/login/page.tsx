"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Image from "next/image";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [error, setError] = useState("");
     const [isLoading, setIsLoading] = useState(false);
     const router = useRouter();

     const handleLogin = async (e: React.FormEvent) => {
          e.preventDefault();
          setError("");
          setIsLoading(true);

          try {
               const userCredential = await signInWithEmailAndPassword(auth, email, password);
               const token = await userCredential.user.getIdToken();

               setCookie("token", token, { maxAge: 60 * 60 * 24, path: "/" });

               router.push("/dashboard");
          } catch (err) {
               console.error(err);
               setError("Login gagal, periksa email dan password!");
               setIsLoading(false);
          }
     };

     return (
          <div className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
               <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-xl p-8">
                    <div className="text-center mb-8">
                         <Image 
                              src="/oktaa-white.svg" 
                              alt="Brand Logo" 
                              width={80} 
                              height={80} 
                              className="mx-auto mb-4 rounded-full"
                         />
                         <h1 className="text-2xl font-bold text-white text-center mb-4">Sign In to Oktaa</h1>
                         {/* <p className="text-sm text-gray-400">
                              &quot;Sign in to access your dashboard. Don&apos;t worry, we won&apos;t judge your password choices... much.&quot;
                         </p> */}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                         {error && (
                              <div className="bg-red-900 bg-opacity-50 text-red-300 px-4 py-3 rounded-lg text-center">
                                   {error}
                              </div>
                         )}

                         <div className="space-y-4">
                              <div className="relative">
                                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                   <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-gray-700 border-none text-white placeholder-gray-500"
                                        required
                                   />
                              </div>

                              <div className="relative">
                                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                   <Input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 bg-gray-700 border-none text-white placeholder-gray-500"
                                        required
                                   />
                              </div>
                         </div>

                         <Button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              disabled={isLoading}
                         >
                              {isLoading ? 'Logging in...' : 'Sign In'}
                         </Button>
                    </form>
               </div>
          </div>
     );
}
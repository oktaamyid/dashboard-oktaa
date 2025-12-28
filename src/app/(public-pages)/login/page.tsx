"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import Image from "next/image";
import { ASSETS } from "@/lib/assets";

export default function LoginPage() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const { showError } = useToast();
     const [isLoading, setIsLoading] = useState(false);
     const router = useRouter();

     const handleLogin = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsLoading(true);

          try {
               const userCredential = await signInWithEmailAndPassword(auth, email, password);
               const token = await userCredential.user.getIdToken();

               setCookie("token", token, { maxAge: 60 * 60 * 24, path: "/" });

               router.push("/");
          } catch (err) {
               console.error(err);
               showError("Invalid credentials. Please try again.");
               setIsLoading(false);
          }
     };

     return (
          <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
               {/* Background Decoration */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

               <div className="w-full max-w-sm z-10 relative">
                    {/* Header */}
                    <div className="text-center mb-10">
                         <div className="w-20 h-20 mx-auto mb-6 relative border border-white/10 bg-black flex items-center justify-center">
                              <Image
                                   src={ASSETS.LOGO_LIGHT || ASSETS.APPLE} // Fallback if logo light is issue
                                   alt="Brand Logo"
                                   width={40}
                                   height={40}
                                   className="object-contain"
                              />
                         </div>
                         <h1 className="text-3xl font-black text-white text-center mb-1 uppercase tracking-tighter">Access Portal</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">Enter valid credentials to continue</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-8">

                         <div className="space-y-4">
                              <Input
                                   label="Email Address"
                                   type="email"
                                   placeholder="user@example.com"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   required
                                   className="h-12"
                              />

                              <Input
                                   label="Password"
                                   type="password"
                                   placeholder="••••••••"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   required
                                   className="h-12"
                              />
                         </div>

                         <div className="pt-2">
                              <Button
                                   type="submit"
                                   variant="primary"
                                   className="w-full text-sm h-12"
                                   isLoading={isLoading}
                              >
                                   {isLoading ? 'Authenticating...' : 'Establish Session'}
                              </Button>
                         </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-12 text-center">
                         <p className="text-[10px] text-zinc-700 font-mono">
                              SECURE SYSTEM • AUTHORIZED PERSONNEL ONLY
                         </p>
                    </div>
               </div>
          </div>
     );
}
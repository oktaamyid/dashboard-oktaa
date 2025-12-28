import Image from 'next/image';
import { ASSETS } from '@/lib/assets';
import Link from 'next/link';

export default function NotFoundPage() {
     return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 relative overflow-hidden">
               {/* Grid Background */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

               <div className="text-center max-w-md z-10">
                    <div className="mx-auto mb-8 w-24 h-24 flex items-center justify-center bg-black">
                         <Image
                              src={ASSETS.LOGO_LIGHT}
                              alt="Brand Logo"
                              width={120}
                              height={120}
                              className="object-contain"
                         />
                    </div>

                    <h1 className="text-9xl font-black text-white mb-2 leading-none hover:text-zinc-200 transition-colors cursor-default tracking-tighter">404</h1>
                    <div className="h-px bg-white/20 w-24 mx-auto my-6" />
                    <h2 className="text-2xl font-extrabold text-white uppercase tracking-[0.3em] mb-4">Void / Null</h2>

                    <p className="text-zinc-500 mb-10 text-lg leading-relaxed font-mono uppercase tracking-wide">
                         The signal you are tracing has faded into the digital abyss. <br />
                         Target resource not found.
                    </p>
               </div>
          </div>
     );
}
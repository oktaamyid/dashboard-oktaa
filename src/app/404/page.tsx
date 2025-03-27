import Image from 'next/image';
import Link from 'next/link';

export default function NotFoundPage() {
     return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 px-4">
               <div className="text-center max-w-md">
                    <Image
                         src="/oktaa-black.svg"
                         alt="Brand Logo"
                         width={100}
                         height={100}
                         className="mx-auto mb-6 rounded-full"
                    />

                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>

                    <p className="text-gray-600 mb-6">
                          Oops! The page you are looking for doesn&apos;t exist or has been moved. 
                          Maybe it went on vacation without telling us!
                    </p>
               </div>
          </div>
     );
}
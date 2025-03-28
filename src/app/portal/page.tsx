"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiExternalLink, FiGithub, FiLinkedin, FiInstagram, FiMail, FiGlobe } from 'react-icons/fi';
import { FaSpotify, FaTiktok } from "react-icons/fa";
import { getLinks, getProfiles } from '@/lib/firestore';
import { Link, Profile } from '@/app/types';

// Skeleton Component
const LinkSkeleton = () => (
     <div className="bg-gray-700 animate-pulse rounded-lg px-4 py-3 mb-3">
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
     </div>
);

const LinktreePage: React.FC = () => {
     const [links, setLinks] = useState<Link[]>([]);
     const [profile, setProfile] = useState<Profile | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const [profileData, linksData] = await Promise.all([
                         getProfiles(),
                         getLinks()
                    ]);

                    if (profileData.length > 0) {
                         setProfile(profileData[0]);
                    }

                    const portalLinks = linksData.filter(link => link.showToPortal);
                    setLinks(portalLinks);
               } catch (error) {
                    console.error("Error fetching data:", error);
               } finally {
                    setLoading(false);
               }
          };
          fetchData();
     }, []);

     const handleShare = async () => {
          try {

               const shareData = {
                    title: 'Share Portal',
                    text: 'Check out this interesting profile!',
                    url: window.location.href,
               };

               if (navigator.share) {
                    await navigator.share(shareData);
               } else {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Link has been copied to clipboard!');
               }
          } catch (error) {
               console.error('Error share: ', error);

               if (error instanceof Error && error.name !== 'AbortError') {
                    alert('Failed to share, try again later.');
               }
          }
     };

     const socialLinks = [
          { icon: <FiGithub className="w-5 h-5" />, url: profile?.socialMedia?.github, visible: !!profile?.socialMedia?.github },
          { icon: <FiLinkedin className="w-5 h-5" />, url: profile?.socialMedia?.linkedin, visible: !!profile?.socialMedia?.linkedin },
          { icon: <FiInstagram className="w-5 h-5" />, url: profile?.socialMedia?.instagram, visible: !!profile?.socialMedia?.instagram },
          { icon: <FaSpotify className="w-5 h-5" />, url: profile?.socialMedia?.spotify, visible: !!profile?.socialMedia?.spotify },
          { icon: <FaTiktok className="w-5 h-5" />, url: profile?.socialMedia?.tiktok, visible: !!profile?.socialMedia?.tiktok },
          { icon: <FiMail className="w-5 h-5" />, url: profile?.socialMedia?.mail ? `mailto:${profile.socialMedia.mail}` : '', visible: !!profile?.socialMedia?.mail },
          { icon: <FiGlobe className="w-5 h-5" />, url: profile?.website, visible: !!profile?.website }
     ].filter(link => link.visible);

     if (loading) {
          return (
               <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                    <motion.div
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ duration: 0.3 }}
                         className="w-full md:max-w-lg overflow-hidden shadow-lg rounded-xl"
                    >
                         {/* Skeleton Profile Image */}
                         <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-500">
                              <div className="absolute -bottom-8 left-4">
                                   <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse"></div>
                              </div>
                         </div>

                         {/* Skeleton Content */}
                         <div className="pt-12 px-5 pb-6">
                              <div className="text-center mb-6">
                                   <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto mb-2 animate-pulse"></div>
                                   <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto animate-pulse"></div>
                              </div>

                              {/* Skeleton Links */}
                              <div className="space-y-3 mb-6">
                                   {[1, 2, 3, 4].map((_, index) => (
                                        <LinkSkeleton key={index} />
                                   ))}
                              </div>
                         </div>
                    </motion.div>
               </div>
          );
     }

     if (!profile) {
          return (
               <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                    <div className="text-white">No profile found</div>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-gray-800 flex items-center justify-center">
               <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full md:max-w-lg overflow-hidden shadow-lg h-screen"
               >
                    {/* Banner with Profile Image */}
                    <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-500">
                         {profile.profilePicture && (
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="absolute -bottom-8 left-4"
                              >
                                   <div className="relative w-20 h-20 rounded-full border-4 border-gray-700 overflow-hidden">
                                        <Image
                                             src={profile.profilePicture}
                                             alt={profile.name || "Profile"}
                                             width={64}
                                             height={64}
                                             className="object-cover"
                                             priority
                                        />
                                   </div>
                              </motion.div>
                         )}

                         <button onClick={handleShare} aria-label='Share' className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all">
                              <FiExternalLink className="w-4 h-4 text-white" />
                         </button>
                    </div>

                    {/* Content */}
                    <div className="pt-6 px-5 pb-5">
                         <div className="text-center mb-6">
                              <h1 className="text-xl font-bold text-white">@{profile.username}</h1>
                              <p className="text-gray-500 text-sm my-1">{profile.name}</p>
                              {profile.bio && (
                                   <p className="text-gray-400 mt-1 text-sm">{profile.bio}</p>
                              )}
                         </div>

                         {/* Links with Shimmer Effect */}
                         <div className="space-y-3 mb-6">
                              <AnimatePresence>
                                   {links.map((link, index) => (
                                        <motion.a
                                             key={link.id}
                                             href={link.originalUrl}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             initial={{
                                                  opacity: 0,
                                                  x: -20,
                                                  scale: 0.95
                                             }}
                                             animate={{
                                                  opacity: 1,
                                                  x: 0,
                                                  scale: 1,
                                                  transition: {
                                                       delay: 0.1 + index * 0.1,
                                                       type: "spring",
                                                       stiffness: 100
                                                  }
                                             }}
                                             whileHover={{
                                                  scale: 1.02,
                                                  boxShadow: "0 0 15px rgba(255,255,255,0.2)"
                                             }}
                                             className="block relative bg-gray-600 hover:bg-gray-500 rounded-lg px-4 py-6 transition-all duration-200 group overflow-hidden shimmer-effect"
                                        >
                                             <div className="flex items-center justify-between relative z-10">
                                                  <span className="text-white"></span>
                                                  <span className="text-white text-base font-medium truncate mx-auto">{link.nameUrl}</span>
                                                  <FiExternalLink className="text-gray-400 group-hover:text-white w-4 h-4" />
                                             </div>
                                        </motion.a>
                                   ))}
                              </AnimatePresence>
                         </div>

                         {/* Social Media Links */}
                         {socialLinks.length > 0 && (
                              <div className="flex justify-center space-x-5 mb-5">
                                   {socialLinks.map((social, index) => (
                                        <motion.a
                                             key={index}
                                             href={social.url}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{
                                                  opacity: 1,
                                                  y: 0,
                                                  transition: {
                                                       delay: 0.5 + index * 0.1
                                                  }
                                             }}
                                             whileHover={{
                                                  scale: 1.2,
                                                  rotate: [0, -10, 10, 0],
                                                  transition: { duration: 0.3 }
                                             }}
                                             className="text-gray-400 hover:text-white transition-colors"
                                             aria-label={`Social link ${index}`}
                                        >
                                             {social.icon}
                                        </motion.a>
                                   ))}
                              </div>
                         )}

                         {/* Footer */}
                         <div className="flex flex-col items-center">
                              <div className="relative w-6 h-6 mb-2">
                                   <Image
                                        src="/oktaa-white.svg"
                                        alt="Oktaa"
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                   />
                              </div>
                              <p className="text-gray-500 text-xs">
                                   © {new Date().getFullYear()} Oktaa
                              </p>
                         </div>
                    </div>
               </motion.div>
          </div>
     );
};

export default LinktreePage;
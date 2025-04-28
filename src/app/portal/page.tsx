"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiExternalLink, FiGithub, FiLinkedin, FiInstagram, FiMail, FiGlobe } from 'react-icons/fi';
import { FaSpotify, FaTiktok } from "react-icons/fa";
import { getLinks, getProfile } from '@/lib/service';
import { Link, Profile } from '@/app/types';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface Category {
     id: string;
     name: string;
}

const PortalPage: React.FC = () => {
     const [links, setLinks] = useState<Link[]>([]);
     const [profile, setProfile] = useState<Profile | null>(null);
     const [loading, setLoading] = useState<boolean>(true);
     const [activeTab, setActiveTab] = useState<string>('all');
     const [filteredLinks, setFilteredLinks] = useState<Link[]>([]);
     const [categories, setCategories] = useState<Category[]>([{ id: 'all', name: 'All' }]);

     useEffect(() => {
          // Initial data fetch
          const fetchData = async () => {
               try {
                    const [profileData, linksData] = await Promise.all([
                         getProfile(),
                         getLinks()
                    ]);

                    setProfile(profileData);
                    const portalLinks = linksData.filter(link => link.showToPortal);
                    setLinks(portalLinks);
                    setFilteredLinks(portalLinks);

                    const uniqueCategories = Array.from(
                         new Set(portalLinks.map(link => link.category).filter(category => category))
                    );
                    const dynamicCategories: Category[] = [
                         { id: 'all', name: 'All' },
                         ...uniqueCategories.map(category => ({
                              id: category!.toLowerCase().replace(/\s+/g, '-'), // Convert to kebab-case for ID
                              name: category!
                         }))
                    ];
                    setCategories(dynamicCategories);

               } catch (error) {
                    console.error("Error fetching data:", error);
               } finally {
                    setLoading(false);
               }
          };
          fetchData();

          // Setup realtime listeners for Firebase
          const profileRef = collection(db, 'profiles');
          const linksRef = collection(db, 'links');

          // Listen for profile changes
          const unsubscribeProfile = onSnapshot(profileRef, (snapshot) => {
               snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified' || change.type === 'added') {
                         getProfile().then(profileData => {
                              setProfile(profileData);
                         });
                    }
               });
          }, (error) => {
               console.error("Profile listener error:", error);
          });

          // Listen for links changes
          const unsubscribeLinks = onSnapshot(linksRef, (snapshot) => {
               snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified' || change.type === 'added' || change.type === 'removed') {
                         getLinks().then(linksData => {
                              const portalLinks = linksData.filter(link => link.showToPortal);
                              setLinks(portalLinks);
                              filterLinksByCategory(activeTab, portalLinks);

                              // Update categories based on new links data
                              const uniqueCategories = Array.from(
                                   new Set(portalLinks.map(link => link.category).filter(category => category))
                              );
                              const dynamicCategories: Category[] = [
                                   { id: 'all', name: 'All' },
                                   ...uniqueCategories.map(category => ({
                                        id: category!.toLowerCase().replace(/\s+/g, '-'), // Convert to kebab-case for ID
                                        name: category!
                                   }))
                              ];
                              setCategories(dynamicCategories);
                         });
                    }
               });
          }, (error) => {
               console.error("Links listener error:", error);
          });

          // Cleanup listeners on unmount
          return () => {
               unsubscribeProfile();
               unsubscribeLinks();
          };
     }, []);

     // Filter links based on active tab
     const filterLinksByCategory = (category: string, linksList = links) => {
          if (category === 'all') {
               setFilteredLinks(linksList);
          } else {
               const filtered = linksList.filter(link => link.category && link.category.toLowerCase().replace(/\s+/g, '-') === category);
               setFilteredLinks(filtered);
          }
     };

     // Handle tab change
     const handleTabChange = (tabId: string) => {
          setActiveTab(tabId);
          filterLinksByCategory(tabId);
     };

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

     if (!profile) {
          return (
               <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                    <div className="animate-pulse text-white">Loading...</div>
               </div>
          );
     }

     return (
          <div className="flex flex-col min-h-screen bg-gray-800 items-center justify-center">
               <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full md:max-w-lg overflow-hidden shadow-lg flex flex-col flex-grow mx-auto"
               >
                    {/* Banner with Profile Image */}
                    <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                         {profile.profilePicture && (
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="absolute -bottom-10"
                              >
                                   <div className="flex relative w-20 h-20 rounded-full border-4 items-center justify-center border-gray-700 overflow-hidden">
                                        <Image
                                             src={profile.profilePicture}
                                             alt={profile.name || "Profile"}
                                             width={80}
                                             height={80}
                                             className="object-cover rounded-full"
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
                    <div className="pt-12 px-5 pb-5">
                         <div className="text-center mb-6">
                              <h1 className="text-xl font-bold text-white">@{profile.username}</h1>
                              <p className="text-gray-500 text-sm my-1">{profile.name}</p>
                              {profile.bio && (
                                   <p className="text-gray-400 mt-1 text-sm">{profile.bio}</p>
                              )}
                         </div>

                         {/* Dynamic Categories Tabs */}
                         <div className="mb-6">
                              <div className="flex justify-center p-1">
                                   {categories.map((category) => (
                                        <button
                                             key={category.id}
                                             onClick={() => handleTabChange(category.id)}
                                             className={`flex items-center justify-center px-4 py-2 mx-1 rounded-full transition-all duration-200 text-sm font-semibold capitalize ${activeTab === category.id
                                                  ? 'bg-white text-black'
                                                  : 'border border-gray-400 text-gray-400 hover:border-white hover:text-white'
                                                  }`}
                                        >
                                             <span>{category.name}</span>
                                        </button>
                                   ))}
                              </div>
                         </div>

                         {/* Links with Shimmer Effect based on active tab */}
                         <div className="space-y-3 mb-6 min-h-56">
                              <AnimatePresence mode="wait">
                                   {loading ? (
                                        <div className="flex justify-center items-center h-40">
                                             <div className="animate-pulse text-white">Loading...</div>
                                        </div>
                                   ) : filteredLinks.length > 0 ? (
                                        filteredLinks.map((link, index) => (
                                             <motion.a
                                                  key={link.id}
                                                  href={`/${link.shortUrl}`}
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
                                                  exit={{
                                                       opacity: 0,
                                                       x: 20,
                                                       transition: {
                                                            duration: 0.2
                                                       }
                                                  }}
                                                  whileHover={{
                                                       scale: 1.02,
                                                       boxShadow: "0 0 15px rgba(255,255,255,0.2)"
                                                  }}
                                                  className="block relative bg-gray-600 hover:bg-gray-500 rounded-lg px-4 py-3 md:py-5 transition-all duration-200 group overflow-hidden shimmer-effect"
                                             >
                                                  <div className="flex items-center justify-between relative z-10">
                                                       <span className="text-white text-base font-medium truncate mx-auto">
                                                            {link.nameUrl || link.shortUrl}
                                                       </span>
                                                       <FiExternalLink className="text-gray-400 group-hover:text-white w-4 h-4" />
                                                  </div>
                                             </motion.a>
                                        ))
                                   ) : (
                                        <motion.div
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             exit={{ opacity: 0 }}
                                             className="flex flex-col items-center justify-center h-40 text-gray-400"
                                        >
                                             <p>No links found in this category</p>
                                        </motion.div>
                                   )}
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
                              <p className="text-gray-500 text-xs font-semibold">
                                   Copyright {new Date().getFullYear()} - oktaa.my.id
                              </p>
                         </div>
                    </div>
               </motion.div>
          </div>
     );
};

export default PortalPage;
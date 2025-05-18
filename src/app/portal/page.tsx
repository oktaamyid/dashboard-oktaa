"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiExternalLink, FiGithub, FiLinkedin, FiInstagram, FiMail, FiGlobe, FiChevronDown, FiChevronUp } from 'react-icons/fi';
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
     const [expandedCard, setExpandedCard] = useState<string | null>(null);

     const filterLinksByCategory = useCallback((category: string, linksList = links) => {
          if (category === 'all') {
               setFilteredLinks(linksList);
          } else {
               const filtered = linksList.filter(link => link.category && link.category.toLowerCase().replace(/\s+/g, '-') === category);
               setFilteredLinks(filtered);
          }
     }, [links]);

     useEffect(() => {
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
                              id: category!.toLowerCase().replace(/\s+/g, '-'),
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

          const profileRef = collection(db, 'profiles');
          const linksRef = collection(db, 'links');

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

          const unsubscribeLinks = onSnapshot(linksRef, (snapshot) => {
               snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified' || change.type === 'added' || change.type === 'removed') {
                         getLinks().then(linksData => {
                              const portalLinks = linksData.filter(link => link.showToPortal);
                              setLinks(portalLinks);
                              filterLinksByCategory(activeTab, portalLinks);

                              const uniqueCategories = Array.from(
                                   new Set(portalLinks.map(link => link.category).filter(category => category))
                              );
                              const dynamicCategories: Category[] = [
                                   { id: 'all', name: 'All' },
                                   ...uniqueCategories.map(category => ({
                                        id: category!.toLowerCase().replace(/\s+/g, '-'),
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

          return () => {
               unsubscribeProfile();
               unsubscribeLinks();
          };
     }, [activeTab, filterLinksByCategory]);

     // Add useEffect to handle URL hash changes
     useEffect(() => {
          const handleHashChange = () => {
               const hash = window.location.hash.slice(1); // Remove the # symbol
               if (hash) {
                    const normalizedHash = hash.toLowerCase().replace(/\s+/g, '-');
                    // Check if the hash matches any category
                    const categoryExists = categories.some(cat => cat.id === normalizedHash);
                    if (categoryExists) {
                         setActiveTab(normalizedHash);
                         filterLinksByCategory(normalizedHash);
                    }
               }
          };

          // Handle initial hash on mount
          handleHashChange();

          // Listen for hash changes
          window.addEventListener('hashchange', handleHashChange);
          return () => window.removeEventListener('hashchange', handleHashChange);
     }, [categories, filterLinksByCategory]);

     const handleTabChange = (tabId: string) => {
          setActiveTab(tabId);
          filterLinksByCategory(tabId);
          // Update URL hash without triggering a page reload
          if (tabId === 'all') {
               // Remove hash for "all" category
               history.pushState(null, '', window.location.pathname);
          } else {
               window.location.hash = tabId;
          }
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

     const toggleCard = (linkId: string) => {
          setExpandedCard(expandedCard === linkId ? null : linkId);
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
               <div className="flex flex-col min-h-screen bg-gray-800 items-center justify-center">
                    <motion.div
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ duration: 0.3 }}
                         className="w-full md:max-w-lg overflow-hidden shadow-lg flex flex-col flex-grow mx-auto"
                    >
                         <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                              <div className="absolute -bottom-10">
                                   <div className="w-20 h-20 rounded-full border-4 border-gray-700 bg-gray-600 animate-pulse" />
                              </div>
                              <div className="absolute top-3 right-3 bg-white/10 rounded-full p-2">
                                   <FiExternalLink className="w-4 h-4 text-white" />
                              </div>
                         </div>
                         <div className="pt-12 px-5 pb-5">
                              <div className="text-center mb-6">
                                   <div className="h-6 bg-gray-600 rounded w-1/3 mx-auto animate-pulse" />
                                   <div className="h-4 bg-gray-600 rounded w-1/2 mx-auto mt-2 animate-pulse" />
                                   <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mt-2 animate-pulse" />
                              </div>
                              <div className="mb-6">
                                   <div className="flex justify-center p-1">
                                        {[...Array(3)].map((_, index) => (
                                             <div
                                                  key={index}
                                                  className="h-8 bg-gray-600 rounded-full w-20 mx-1 animate-pulse"
                                             />
                                        ))}
                                   </div>
                              </div>
                              <div className="space-y-3 mb-6 min-h-56">
                                   {[...Array(4)].map((_, index) => (
                                        <div
                                             key={index}
                                             className="h-12 bg-gray-600 rounded-lg animate-pulse"
                                        />
                                   ))}
                              </div>
                              <div className="flex justify-center space-x-5 mb-5">
                                   {[...Array(3)].map((_, index) => (
                                        <div
                                             key={index}
                                             className="h-5 w-5 bg-gray-600 rounded-full animate-pulse"
                                        />
                                   ))}
                              </div>
                              <div className="flex flex-col items-center">
                                   <div className="h-4 bg-gray-600 rounded w-1/4 animate-pulse" />
                              </div>
                         </div>
                    </motion.div>
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

                    <div className="pt-12 px-5 pb-5">
                         <div className="text-center mb-6">
                              <h1 className="text-xl font-bold text-white">@{profile.username}</h1>
                              <p className="text-gray-500 text-sm my-1">{profile.name}</p>
                              {profile.bio && (
                                   <p className="text-gray-400 mt-1 text-sm">{profile.bio}</p>
                              )}
                         </div>

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

                         <div className="space-y-3 mb-6 min-h-56">
                              <AnimatePresence mode="wait">
                                   {loading ? (
                                        <div className="flex justify-center items-center h-40">
                                             <div className="animate-pulse text-white">Loading...</div>
                                        </div>
                                   ) : filteredLinks.length > 0 ? (
                                        filteredLinks.map((link, index) => (
                                             <motion.div
                                                  key={link.id}
                                                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                                  animate={{ opacity: 1, x: 0, scale: 1 }}
                                                  transition={{ delay: 0.1 + index * 0.1, type: "spring", stiffness: 100 }}
                                                  className="relative bg-gray-600 hover:bg-gray-500 rounded-lg px-4 py-3 md:py-5 transition-all duration-200 group overflow-hidden shimmer-effect"
                                                  role="button"
                                                  tabIndex={0}
                                                  onKeyDown={(e) => {
                                                       if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            if (link.useMultipleUrls) {
                                                                 toggleCard(link.id);
                                                            } else {
                                                                 window.open(link.originalUrl, '_blank', 'noopener,noreferrer');
                                                            }
                                                       }
                                                  }}
                                             >
                                                  {link.useMultipleUrls ? (
                                                       <div
                                                            className="flex items-center justify-between relative z-10 cursor-pointer"
                                                            onClick={() => toggleCard(link.id)}
                                                            aria-expanded={expandedCard === link.id}
                                                            aria-label={`Expand ${link.nameUrl || link.shortUrl} details`}
                                                       >
                                                            <div className="flex flex-col">
                                                                 <span className="text-white text-base font-medium truncate">
                                                                      {link.nameUrl || link.shortUrl}
                                                                 </span>
                                                            </div>
                                                            <motion.div
                                                                 animate={{ rotate: expandedCard === link.id ? 180 : 0 }}
                                                                 transition={{ duration: 0.3 }}
                                                            >
                                                                 {expandedCard === link.id ? (
                                                                      <FiChevronUp className="text-gray-400 group-hover:text-white w-5 h-5" />
                                                                 ) : (
                                                                      <FiChevronDown className="text-gray-400 group-hover:text-white w-5 h-5" />
                                                                 )}
                                                            </motion.div>
                                                       </div>
                                                  ) : (
                                                       // Direct link for originalUrl
                                                       <a
                                                            href={link.originalUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between relative z-10"
                                                            aria-label={`Visit ${link.nameUrl || link.shortUrl}`}
                                                       >
                                                            <div className="flex flex-col">
                                                                 <span className="text-white text-base font-medium truncate">
                                                                      {link.nameUrl || link.shortUrl}
                                                                 </span>
                                                                 <span className="text-gray-400 text-sm mt-1">
                                                                      {link.description || ""}
                                                                 </span>
                                                            </div>
                                                            <FiExternalLink className="text-gray-400 group-hover:text-white w-5 h-5" />
                                                       </a>
                                                  )}
                                                  <AnimatePresence>
                                                       {expandedCard === link.id && link.useMultipleUrls && (
                                                            <motion.div
                                                                 initial={{ height: 0, opacity: 0 }}
                                                                 animate={{ height: "auto", opacity: 1 }}
                                                                 exit={{ height: 0, opacity: 0 }}
                                                                 transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                 className="mt-3 border-t border-gray-500 pt-3"
                                                            >
                                                                 {link.description && (
                                                                      <p className="text-gray-300 text-sm mb-3 px-2">{link.description}</p>
                                                                 )}
                                                                 {link.price !== undefined && link.price > 0 && (
                                                                        <p className="text-white font-semibold mb-3 px-2">
                                                                              Harga: Rp {link.price.toLocaleString('id-ID')}
                                                                        </p>
                                                                 )}
                                                                 {link.multipleUrls && link.multipleUrls.length > 0 && (
                                                                      <div className="space-y-2 px-2">
                                                                           {link.multipleUrls.map((urlObj, idx) => (
                                                                                <a
                                                                                     key={idx}
                                                                                     href={urlObj.url}
                                                                                     target="_blank"
                                                                                     rel="noopener noreferrer"
                                                                                     className="flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                                                                     aria-label={`Visit ${urlObj.name || urlObj.url}`}
                                                                                >
                                                                                     <FiExternalLink className="mr-2 w-4 h-4" />
                                                                                     <span className="truncate">{urlObj.name || urlObj.url}</span>
                                                                                </a>
                                                                           ))}
                                                                      </div>
                                                                 )}
                                                            </motion.div>
                                                       )}
                                                  </AnimatePresence>
                                             </motion.div>
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
                                                  transition: { delay: 0.5 + index * 0.1 }
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
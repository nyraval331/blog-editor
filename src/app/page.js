"use client"

import { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import BlogList from '../components/BlogList';
import Link from 'next/link';

export default function Home() {
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    /**
     * A function that fetches the background URL from Firestore and sets it in the state.
     */
    const fetchBackgroundUrl = async () => {
      const q = query(collection(db, 'backgrounds'), orderBy('timestamp', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const latestBackground = querySnapshot.docs[0].data();
        setBackgroundUrl(latestBackground.url);
      }
    };

    fetchBackgroundUrl();
  }, []);

  /**
   * Handles the upload of a background image.
   *
   * @param {Event} e - The event object.
   * @return {Promise<void>} A promise that resolves when the upload is complete.
   */
  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `backgrounds/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
      },
      (error) => {
        console.error(error);
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setBackgroundUrl(downloadURL);
        setIsUploading(false);

        // Save the background URL to Firestore
        try {
          await addDoc(collection(db, 'backgrounds'), {
            url: downloadURL,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    );
  };

  return (
    <div>
      <header className="relative h-full">
        {backgroundUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center filter blur"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          ></div>
        )}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 ml-70x flex flex-col items-start justify-center h-full text-white pl-8">
          <h1 className="text-4xl font-bold mb-2">Investor Daily Dubai</h1>
          <p className="text-xl">A blog sharing the daily updates in Dubai Real Estate and investment markets.</p>
          <div className="mt-4 flex space-x-4">
            <Link href="/create-blog">
              <button className="flex items-center bg-white text-black px-4 py-2 rounded-full border-2 hover:border-purple-500 hover:bg-custom-purple hover:text-white transition duration-300">
                <span>Create new blog</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </Link>
            <button className="bg-white text-black px-4 py-2 rounded-full border-2 border-gray-300 hover:bg-gray-300 hover:text-white transition duration-300">
              Manage Subscribers
            </button>
          </div>
          <input
            type="file"
            id="background-upload"
            className="hidden"
            onChange={handleBackgroundUpload}
          />
          <label
            htmlFor="background-upload"
            className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded border-2 border-gray-300 hover:bg-gray-300 hover:text-white transition duration-300 cursor-pointer"
          >
            {isUploading ? 'Uploading...' : 'Add a Blog Background'}
          </label>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <BlogList />
      </main>
    </div>
  );
}

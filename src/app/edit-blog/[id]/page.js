"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import BlogEditor from '../../../components/BlogEditor';
import { db } from '../../../firebase/firebaseConfig';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const EditBlog = () => {
  const router = useRouter();
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    /**
     * Fetches a blog from the database based on the provided ID,
     * updates the state with the retrieved blog data,
     * and handles the case where no document with the ID exists.
     *
     * @return {Promise<void>} - A Promise that resolves once the function is completed.
     */
    const fetchBlog = async () => {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlogData(docSnap.data());
      } else {
        console.error("No such document!");
      }
    };

    fetchBlog();
  }, [id]);

  /**
   * Updates a blog document in the 'blogs' collection of the Firestore database
   * with the provided updated data. If the update is successful, displays a success
   * toast message and navigates to the home page. If there is an error, displays an
   * error toast message and logs the error to the console.
   *
   * @param {Object} updatedData - The data to update the blog document with.
   * @return {Promise<void>} - A Promise that resolves once the update is complete.
   */
  const handleUpdate = async (updatedData) => {
    try {
      const docRef = doc(db, 'blogs', id);
      await updateDoc(docRef, updatedData);
      toast.success("Blog updated successfully!");
      router.push('/');
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Failed to update blog. Please try again.");
    }
  };

  return (
    <div>
      <nav className="sticky top-0 z-50  flex justify-between items-center p-4 border-b mb-4 bg-gray-100">
        <a href="#" onClick={() => router.push('/')} className="text-lg justify-between items-center flex font-bold">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Blog Editor</a>
        <div>
          <button onClick={() => document.getElementById('blogForm').dispatchEvent(new CustomEvent('submit', { detail: { isDraft: false }, bubbles: true, cancelable: true }))} className="bg-custom-purple text-sm text-white px-4 py-2 rounded">Update Blog</button>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        {blogData && <BlogEditor handleSubmit={handleUpdate} initialData={blogData} isDraft={false} />}
      </div>
    </div>
  );
};

export default EditBlog;

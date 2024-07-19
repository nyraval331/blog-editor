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

  const handleUpdate = async (e, updatedData) => {
    e.preventDefault();
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
          <button className="bg-white text-black text-sm px-4 py-2 rounded border mr-2">Save as Draft</button>
          <button onClick={() => document.getElementById('blogForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))} className="bg-custom-purple text-sm text-white px-4 py-2 rounded">Update Blog</button>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        {blogData && <BlogEditor handleSubmit={handleUpdate} initialData={blogData} />}
      </div>
    </div>
  );
};

export default EditBlog;

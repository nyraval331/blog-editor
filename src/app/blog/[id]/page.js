"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BlogDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setBlog(docSnap.data());
      } else {
        console.error("No such document!");
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  console.log("blogs", blog)
  if (loading) {
    return (
      <>
        <nav className="sticky top-0 z-50 flex justify-between items-center p-4 border-b mb-4 bg-gray-100">
          <a href="#" onClick={() => router.push('/')} className="text-lg justify-between items-center flex font-bold">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />Blog Editor</a>
        </nav>
        <div className="w-50 mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-50 flex justify-between items-center p-4 border-b mb-4 bg-gray-100">
        <a href="#" onClick={() => router.push('/')} className="text-lg justify-between items-center flex font-bold">
          <ArrowLeftIcon className="w-5 h-5 mr-2" /> Blog Editor</a>
      </nav>
      <div className="w-50 mx-auto p-4">
        <h1 className="text-4xl font-bold mb-5 mt-5 text-center">{blog.title}</h1>
        {blog.imageUrl && (
          <div className="mb-4">
            <img src={blog.imageUrl} alt="Blog" className="w-full h-auto object-cover rounded" />
            {blog.imageCaption && <p className="text-gray-500 text-center">{blog.imageCaption}</p>}
          </div>
        )}
        {blog.caption && (
          <div className="text-center mt-2">
            <p className="text-gray-600">{blog.caption}</p>
          </div>
        )}
        <div className="prose">
          {blog.elements.map((element, index) => {
            if (element.type === 'paragraph') {
              return <p key={index}>{element.value}</p>;
            }
            if (element.type === 'subheading') {
              return <h2 key={index} className="text-2xl font-semibold mt-4 mb-4">{element.value}</h2>;
            }
            if (element.type === 'divider') {
              return <hr key={index} className="my-4" />;
            }
            return null;
          })}
        </div>
      </div>
    </>
  );
};

export default BlogDetail;

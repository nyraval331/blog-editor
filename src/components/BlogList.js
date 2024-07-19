"use client";

import React, { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { db } from '../firebase/firebaseConfig';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const BlogList = () => {
  const [snapshot, loading, error] = useCollection(query(collection(db, 'blogs')));
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const blogs = snapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const handleDelete = async (id) => {
    console.log("Attempting to delete document with id:", id); // Debugging step
    try {
      if (!id) {
        throw new Error("Invalid ID");
      }
      const docRef = doc(db, 'blogs', id);
      await deleteDoc(docRef);
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Failed to delete blog. Please try again.");
    }
  };

  const handleEdit = (id) => {
    router.push(`/edit-blog/${id}`);
  };

  const handleOpenBlog = (id) => {
    router.push(`/blog/${id}`);
  };

  const renderSkeleton = () => (
    <div className="border p-6 rounded flex flex-col bg-white shadow relative animate-pulse">
      <div className="flex items-start">
        <div className="w-32 h-32 bg-gray-200 mr-4 rounded"></div>
        <div className="flex-grow">
          <div className="h-6 bg-gray-200 mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 mb-2 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 mb-4 rounded"></div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <div className="w-24 h-8 bg-gray-200 rounded"></div>
        <div className="w-24 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4 w-3/4 mx-auto">
      {loading ? (
        <>{Array(3).fill(0).map((_, index) => renderSkeleton())}</>
      ) : (
        blogs && blogs.map(blog => (
          <div key={blog.id} className="border p-6 rounded flex flex-col bg-white shadow relative transition-transform transform hover:scale-105 hover:shadow-lg">
            <div className="flex items-start">
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt="Blog"
                  className="w-32 h-32 object-cover mr-4 rounded"
                />
              )}
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                <p className="text-gray-500 mb-2">Published 4 days ago · 4 minute read</p>
                <p className="text-gray-700 mb-4">{blog.content}</p>
              </div>
            </div>
            <div className="flex justify-end items-center space-x-2">
              <button
                onClick={() => handleOpenBlog(blog.id)}
                className="border text-sm border-gray-300 px-4 py-2 rounded whitespace-nowrap hover:bg-gray-100 transition"
              >
                Open Blog
              </button>
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === blog.id ? null : blog.id)}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Manage
                  <EllipsisVerticalIcon className="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
                </button>
                {activeDropdown === blog.id && (
                  <div
                    className="origin-bottom-right absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => handleEdit(blog.id)}
                        className="text-gray-700 group flex items-center px-4 py-2 text-sm w-full transition hover:bg-gray-100"
                      >
                        <PencilIcon className="w-5 h-5 mr-3 text-gray-400" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-gray-700 group flex items-center px-4 py-2 text-sm w-full transition hover:bg-gray-100"
                      >
                        <TrashIcon className="w-5 h-5 mr-3 text-gray-400" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogList;

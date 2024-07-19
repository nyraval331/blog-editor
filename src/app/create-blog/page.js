"use client";

import { useRouter } from 'next/navigation';
import BlogEditor from '../../components/BlogEditor';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function CreateBlog() {
  const router = useRouter();

  const handlePublish = async (e, blogData) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'blogs'), blogData);
      toast.success("Blog published successfully!");

      router.push('/');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to publish blog. Please try again.");
    }
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-4 border-b mb-4 bg-gray-100">
        <a href="#" onClick={() => router.push('/')} className="text-lg justify-between items-center flex font-bold"> 
        <ArrowLeftIcon className="w-5 h-5 mr-2" />Blog Editor</a>
        <div>
          <button className="bg-white text-black text-sm px-4 py-2 rounded border mr-2">Save as Draft</button>
          <button onClick={() => document.getElementById('blogForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))} className="bg-custom-purple text-sm text-white px-4 py-2 rounded">Publish Blog</button>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <BlogEditor handleSubmit={handlePublish} />
      </div>
    </div>
  );
}

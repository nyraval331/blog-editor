"use client";

import { useRouter } from 'next/navigation';
import BlogEditor from '../../components/BlogEditor';
import { addDoc, collection, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useEffect, useState, useRef } from 'react';

export default function CreateBlog() {
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const toastShown = useRef(false);

  useEffect(() => {
    /**
     * Fetches the latest draft from the 'drafts' collection in the database and sets the initial data state.
     * If a draft is found, it filters out any empty values and sets the initial data state.
     * If a draft is found and a toast notification has not already been shown, it shows a success toast notification.
     *
     * @return {Promise<void>} A promise that resolves when the draft is fetched and the initial data state is set.
     */
    const fetchDraft = async () => {
      const draftsQuery = query(collection(db, 'drafts'));
      const draftsSnapshot = await getDocs(draftsQuery);
      if (!draftsSnapshot.empty) {
        const draft = draftsSnapshot.docs[0].data();
        const filteredDraft = {};
        for (const key in draft) {
          if (draft[key] && draft[key].length !== 0) {
            filteredDraft[key] = draft[key];
          }
        }
        setInitialData(filteredDraft);
        setIsDraft(true);
        if (!toastShown.current) {
          toast.success("Opened Your Last Saved Draft");
          toastShown.current = true;
        }
      }
    };

    fetchDraft();
  }, []);

  useEffect(() => {
    if (pendingSubmit) {
      const form = document.getElementById('blogForm');
      if (form) {
        form.dispatchEvent(new CustomEvent('submit', { detail: { isDraft }, bubbles: true, cancelable: true }));
      }
      setPendingSubmit(false);
    }
  }, [isDraft, pendingSubmit]);

  /**
   * Saves the draft of a blog post to the database.
   *
   * @param {Object} blogData - The data of the blog post to be saved as a draft.
   * @return {Promise<void>} A promise that resolves when the draft is successfully saved.
   */
  const handleSaveDraft = async (blogData) => {
    try {
      const draftsQuery = query(collection(db, 'drafts'));
      const draftsSnapshot = await getDocs(draftsQuery);
      draftsSnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, 'drafts', docSnapshot.id));
      });
      await addDoc(collection(db, 'drafts'), blogData);
      toast.success("Draft saved successfully!");
      router.push('/');
    } catch (error) {
      console.error("Error saving draft: ", error);
      toast.error("Failed to save draft. Please try again.");
    }
  };

  /**
   * A function to handle publishing a blog post.
   *
   * @param {Object} blogData - The data of the blog post to be published.
   * @return {Promise<void>} A promise that resolves when the blog is successfully published.
   */
  const handlePublish = async (blogData) => {
    try {
      await addDoc(collection(db, 'blogs'), blogData);
      toast.success("Blog published successfully!");

      // Remove any existing drafts
      const draftsQuery = query(collection(db, 'drafts'));
      const draftsSnapshot = await getDocs(draftsQuery);
      draftsSnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, 'drafts', docSnapshot.id));
      });

      router.push('/');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to publish blog. Please try again.");
    }
  };

  /**
   * Sets the draft state and triggers pending submit.
   *
   * @param {type} draft - description of the draft parameter
   * @return {type} description of the return value
   */
  const handleButtonClick = (draft) => {
    setIsDraft(draft);
    setPendingSubmit(true);
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-4 border-b mb-4 bg-gray-100">
        <a href="#" onClick={() => router.push('/')} className="text-lg justify-between items-center flex font-bold">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />Blog Editor</a>
        <div>
          <button onClick={() => handleButtonClick(true)} className="bg-white text-black text-sm px-4 py-2 rounded border mr-2">Save as Draft</button>
          <button onClick={() => handleButtonClick(false)} className="bg-custom-purple text-sm text-white px-4 py-2 rounded">Publish Blog</button>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <BlogEditor handleSubmit={handlePublish} handleSaveDraft={handleSaveDraft} initialData={initialData} isDraft={isDraft} />
      </div>
    </div>
  );
}

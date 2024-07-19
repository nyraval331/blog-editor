"use client";

import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import DropdownButton from './DropdownButton';
import { TrashIcon } from '@heroicons/react/24/solid';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'; 
import { toast } from 'react-toastify';

const BlogEditor = ({ handleSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [elements, setElements] = useState([{ type: 'divider', value: '' }, { type: 'subheading', value: '' }, { type: 'paragraph', value: '' }]);
  const [isUploading, setIsUploading] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setImageUrl(initialData.imageUrl);
      setCaption(initialData.caption || '');
      setShowCaptionInput(!!initialData.caption);
      setElements(initialData.elements || [{ type: 'divider', value: '' }, { type: 'subheading', value: '' }, { type: 'paragraph', value: '' }]);
    }
  }, [initialData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploading(true); 
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.error(error);
        setIsUploading(false); 
        toast.error("Image upload failed!");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setIsUploading(false); 
          toast.success("Image uploaded successfully!");
        });
      }
    );
  };

  const handleAddElement = (type) => {
    setElements([...elements, { type, value: '' }]);
  };

  const handleElementChange = (index, value) => {
    const newElements = elements.slice();
    newElements[index].value = value;
    setElements(newElements);
  };

  const handleElementRemove = (index) => {
    const newElements = elements.slice();
    newElements.splice(index, 1);
    setElements(newElements);
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!imageUrl) {
      toast.error("Image is required");
      return false;
    }
    if (!elements.some(el => el.type === 'subheading' && el.value.trim())) {
      toast.error("At least one subheading is required");
      return false;
    }
    if (!elements.some(el => el.type === 'paragraph' && el.value.trim())) {
      toast.error("At least one paragraph is required");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true); 
      await handleSubmit(e, { title, content, imageUrl, caption, elements });
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="relative p-4">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="loader"></div>
        </div>
      )}
      <form id="blogForm" onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
        <div
          placeholder="Begin with an interesting heading here"
          className="p-2 text-center text-3xl font-bold focus:outline-none"
          contentEditable
          onChange={(e) => setTitle(e.target.value)}
        >
        {title}
        </div>
        <div className="relative group flex flex-col items-center">
          {imageUrl ? (
            <div className="relative">
              <img src={imageUrl} alt="Hero" className="max-w-full h-auto" />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 text-red-500 delete-icon"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              {isUploading ? (
                <div className="text-gray-500">Uploading...</div>
              ) : (
                <label className="image-upload cursor-pointer border-2 border-dotted border-gray-300 p-6 rounded flex flex-col items-center justify-center">
                  <input type="file" className="hidden" onChange={handleImageUpload} />
                  <ArrowUpOnSquareIcon className="w-10 h-10 text-gray-500" />
                  <span className="text-gray-500 mt-2-rem">Upload a Hero Image</span>
                  <span className="text-gray-400 mt-2-rem text-sm">You can upload PNG or JPEG Image. Minimum dimensions must be 500px X 500px</span>
                </label>
              )}
            </>
          )}
        </div>
        <div className="relative">
          {showCaptionInput ? (
            <div className="relative group flex flex-col">
              <div
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption here..."
                className="p-2 rounded text-center focus:outline-none border-transparent border-2"
                contentEditable
              >
                {caption}
              </div>
              <button
                type="button"
                onClick={() => {
                  setCaption('');
                  setShowCaptionInput(false);
                }}
                className="absolute right-0 top-0 input-delete-icon text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCaptionInput(true)}
              className="text-gray-500 bg-gray-200 border border-gray-300 rounded px-4 py-2"
            >
              Add an image caption
            </button>
          )}
        </div>
        {elements.map((element, index) => (
          <div key={index} className="relative group flex flex-col space-y-2">
            {element.type === 'paragraph' && (
              <div
                contentEditable
                className="p-2 rounded focus:outline-none focus:border-gray-300 hover:border-gray-300 border-transparent border-2"
                onInput={(e) => handleElementChange(index, e.currentTarget.textContent)}
                placeholder="Write your paragraph here..."
              >
                {element.value}
              </div>
            )}
            {element.type === 'subheading' && (
              <div className="relative group flex flex-col">
                <div
                  onChange={(e) => handleElementChange(index, e.target.value)}
                  contentEditable
                  placeholder="This is a sub-heading"
                  className="p-2 rounded text-xl font-semibold focus:outline-none"
                >
                  {element.value}
                </div>
                <button
                  type="button"
                  onClick={() => handleElementRemove(index)}
                  className="absolute right-0 top-0 input-delete-icon text-red-500"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            {element.type === 'divider' && (
              <div className="relative group flex flex-col">
                <hr className="my-2 border-gray-300" />
                <button
                  type="button"
                  onClick={() => handleElementRemove(index)}
                  className="absolute right-0 top-0 hr-icon input-delete-icon text-red-500"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </form>
      <div className="fixed bottom-4 right-4">
        <DropdownButton handleAddElement={handleAddElement} />
      </div>
    </div>
  );
};

export default BlogEditor;

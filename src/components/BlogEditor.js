"use client";

import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import DropdownButton from './DropdownButton';
import { TrashIcon } from '@heroicons/react/24/solid';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const BlogEditor = ({ handleSubmit, handleSaveDraft, initialData, isDraft }) => {
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
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setImageUrl(initialData.imageUrl || '');
      setCaption(initialData.caption || '');
      setShowCaptionInput(!!initialData.caption);
      setElements(initialData.elements || [{ type: 'divider', value: '' }, { type: 'subheading', value: '' }, { type: 'paragraph', value: '' }]);
    }
  }, [initialData]);

  /**
   * Handles the upload of an image file.
   *
   * @param {Event} e - The event object containing the file to upload.
   * @return {void} This function does not return anything.
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploading(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => { },
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

  /**
   * A description of the entire function.
   *
   * @param {type} type - description of parameter
   * @return {type} description of return value
   */
  const handleAddElement = (type) => {
    setElements([...elements, { type, value: '' }]);
  };

  /**
   * A description of the entire function.
   *
   * @param {type} index - description of parameter
   * @param {type} value - description of parameter
   * @return {type} description of return value
   */
  const handleElementChange = (index, value) => {
    const newElements = elements.slice();
    newElements[index].value = value;
    setElements(newElements);
  };

  /**
   * A description of the entire function.
   *
   * @param {type} index - description of parameter
   * @return {type} description of return value
   */
  const handleElementRemove = (index) => {
    const newElements = elements.slice();
    newElements.splice(index, 1);
    setElements(newElements);
  };

  /**
   * Validates the form by checking if the title, image, and elements are present.
   *
   * @return {boolean} Returns true if the form is valid, otherwise false.
   */
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

  /**
   * A description of the entire function.
   *
   * @param {Event} e - The event object triggering the form submission.
   * @return {void} This function does not return anything.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isDraft || validateForm()) {
      setIsSubmitting(true);
      if (isDraft) {
        handleSaveDraft({ title, content, imageUrl, caption, elements });
      } else {
        handleSubmit({ title, content, imageUrl, caption, elements });
      }
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
        <input
          placeholder="Begin with an interesting heading here"
          className="p-2 text-center text-3xl font-bold focus:outline-none"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <div className="relative group flex flex-col items-center">
          {
            imageUrl ? (
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
              <label className="image-upload cursor-pointer border-2 border-dotted border-gray-300 p-6 rounded flex flex-col items-center justify-center">
                <input type="file" className="hidden" onChange={handleImageUpload} />
                <ArrowUpOnSquareIcon className="w-10 h-10 text-gray-500" />
                {isUploading ? (
                  <div className="text-gray-500">Uploading...</div>
                ) : (
                  <>
                    <span className="text-gray-500 mt-2-rem">Upload a Hero Image</span>
                    <span className="text-gray-400 mt-2-rem text-sm">You can upload PNG or JPEG Image. Minimum dimensions must be 500px X 500px</span>
                  </>
                )}
              </label>
            )
          }

        </div>
        <div className="relative flex justify-end">
          {showCaptionInput ? (
            <div className="relative group flex flex-col w-full">
              <input
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption here..."
                className="p-2 rounded text-center focus:outline-none border-transparent border-2"
                value={caption}
              />
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
              <input
                className="p-2 rounded focus:outline-none focus:border-gray-300 hover:border-gray-300 border-transparent border-2"
                onChange={(e) => handleElementChange(index, e.target.value)}
                placeholder="Write your paragraph here..."
                value={element.value}
              />
            )}
            {element.type === 'subheading' && (
              <div className="relative group flex flex-col">
                <input
                  onChange={(e) => handleElementChange(index, e.target.value)}
                  placeholder="This is a sub-heading"
                  className="p-2 rounded text-xl font-semibold focus:outline-none"
                  value={element.value}
                />
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

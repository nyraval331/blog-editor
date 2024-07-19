// src/components/DropdownButton.js
"use client";

import { Menu } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';

const DropdownButton = ({ handleAddElement }) => {
  return (
    <div className="relative inline-block text-left">
      <Menu>
        <Menu.Button className="bg-gray-200 rounded-full px-4 py-2 text-gray-700 flex items-center space-x-1">
          <span>Add element</span>
          <ChevronUpIcon className="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
        </Menu.Button>
        <Menu.Items className="origin-bottom-right absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleAddElement('subheading')}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex items-center px-4 py-2 text-sm w-full`}
                >
                  Sub-heading
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleAddElement('paragraph')}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex items-center px-4 py-2 text-sm w-full`}
                >
                  Paragraph
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleAddElement('divider')}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex items-center px-4 py-2 text-sm w-full`}
                >
                  Divider
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default DropdownButton;

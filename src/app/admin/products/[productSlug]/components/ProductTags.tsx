'use client';
import Image from 'next/image';
import React, { useState } from 'react';
// Import an icon for delete

interface ProductTagsProps {
    tags: string[];
    onTagsUpdate: (updatedTags: string[]) => void;
}

const getIconPath = (name: string) => `/icons/${name.toLowerCase()}.svg`;

const ProductTags: React.FC<ProductTagsProps> = ({ tags, onTagsUpdate }) => {
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            const updatedTags = [...tags, newTag.trim()];
            onTagsUpdate(updatedTags);
            setNewTag('');
        }
    };

    const handleDeleteTag = (tagToDelete: string) => {
        const updatedTags = tags.filter((tag) => tag !== tagToDelete);
        onTagsUpdate(updatedTags);
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">Tags</label>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="p-2 border rounded-md flex-1 text-sm"
                />
                <button
                    onClick={handleAddTag}
                    className=" text-sm px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Add
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 text-sm ">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-full text-gray-400 hover:text-gray-600"
                    >
                        <span>{tag}</span>
                        <span onClick={() => handleDeleteTag(tag)} className='cursor-pointer'>
                            <Image
                                src={getIconPath('cross-sm')}
                                alt="Dashboard Icon"
                                width={19}
                                height={19}
                            /></span>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductTags;

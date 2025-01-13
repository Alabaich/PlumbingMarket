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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default form submission behavior
            handleAddTag();
        }
    };

    return (
        <div className="p-4 bg-white shadow-sm rounded-md flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">Tags</label>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a tag..."
                    className="p-2 border rounded-md flex-1 text-sm"
                />
                <button
                    onClick={handleAddTag}
                    className="p-2 bg-blue-50 text-white rounded-sm hover:bg-blue-100"
                >
                    <Image
                        src={getIconPath('add_plus')}
                        alt="Settings Icon"
                        width={19}
                        height={19}
                    />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm ">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="cursor-pointer flex items-center gap-2 bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-full text-gray-400 hover:text-gray-600"
                    >
                        <span>{tag}</span>
                        <span onClick={() => handleDeleteTag(tag)} className='cursor-pointer'>
                            <Image
                                src={getIconPath('cross-sm')}
                                alt="Dashboard Icon"
                                width={15}
                                height={15}
                            /></span>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductTags;

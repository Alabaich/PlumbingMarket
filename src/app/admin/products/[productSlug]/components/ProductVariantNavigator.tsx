'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { px } from 'framer-motion';

interface Variant {
    id: string;
    image?: string; // URL to the variant image
    options: { [key: string]: string }; // e.g., { Color: "Black", Size: "M" }
    name?: string; // Optional variant name
}

interface ProductVariantNavigatorProps {
    productSlug: string;
    productTitle: string;
    productImages: string[]; // URL to the product image
    productStatus: string; // "Active" or "Inactive"
    variants: Variant[];
    currentVariantId: string;
    onVariantSelect?: (variantId: string) => void; // Callback for variant selection
}

const ProductVariantNavigator: React.FC<ProductVariantNavigatorProps> = ({
    productSlug,
    productTitle,
    productImages,
    productStatus,
    variants,
    currentVariantId,
    onVariantSelect,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [productImage, setProductImage] = useState<string | null>(null);
    const [imageMap, setImageMap] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const handleVariantClick = (variantId: string) => {
        if (onVariantSelect) {
            onVariantSelect(variantId);
        } else {
            router.push(`/admin/products/${productSlug}/${variantId}`);
        }
    };

    useEffect(() => {
        const fetchProductImage = async () => {
            if (productImages.length === 0) return;

            const db = getFirestore();
            const firstImageId = productImages[0];
            const mediaDoc = doc(db, 'media', firstImageId);
            const mediaSnapshot = await getDoc(mediaDoc);

            if (mediaSnapshot.exists()) {
                const mediaData = mediaSnapshot.data();
                setProductImage(mediaData.url || '/placeholder.png'); // Fallback to a placeholder
            } else {
                setProductImage('/placeholder.png'); // Fallback if the image is not found
            }
        };

        fetchProductImage();
    }, [productImages]);



    useEffect(() => {
        const fetchImages = async () => {
            const db = getFirestore();
            const imagePromises = variants.map(async (variant) => {
                if (!variant.image) return { id: variant.id, url: null }; // Skip if no image ID
                const mediaDoc = doc(db, 'media', variant.image);
                const mediaSnapshot = await getDoc(mediaDoc);
                if (mediaSnapshot.exists()) {
                    const mediaData = mediaSnapshot.data();
                    return { id: variant.id, url: mediaData.url };
                }
                return { id: variant.id, url: null }; // Default to null if not found
            });

            const imageResults = await Promise.all(imagePromises);
            const imageMapping = imageResults.reduce((acc, item) => {
                acc[item.id] = item.url || '/placeholder.png'; // Use placeholder for missing images
                return acc;
            }, {} as { [key: string]: string });

            setImageMap(imageMapping);
        };

        fetchImages();
    }, [variants]);




    const filteredVariants = variants.filter((variant) => {
        return (
            variant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            Object.values(variant.options).some((option) =>
                option.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    });

    return (
        <div className="bg-white border rounded-md shadow-sm p-4 w-full max-w-sm">
            {/* Product Info */}
            <div className="flex items-start gap-4 mb-4">
                {productImage && (
                    <div className="h-[100px] w-[100px] min-w-[100px] flex-shrink-0">
                        <img
                            src={productImage}
                            alt={productTitle}
                            width={100}
                            height={100}
                            className="rounded-md object-cover h-[100px] w-[100px]"
                        />
                    </div>

                )}
                <div>
                    <h2 className="text-lg font-medium">{productTitle}</h2>
                    <p className={`text-sm ${productStatus === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                        {productStatus}
                    </p>
                    <p className="text-sm text-gray-500">{variants.length} variants</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search variants"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                />
            </div>

            {/* Variants List */}
            <ul className="space-y-2">
                {filteredVariants.map((variant) => (
                    <li
                        key={variant.id}
                        onClick={() => handleVariantClick(variant.id)}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${variant.id === currentVariantId
                                ? 'bg-blue-50 border-blue-500'
                                : 'hover:bg-blue-100'
                            }`}
                    >
                        {imageMap[variant.id] ? (
                            <img
                                src={imageMap[variant.id]}
                                alt={variant.name || 'Variant'}
                                width={40}
                                height={40}
                                className="rounded-md object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
                                No Image
                            </div>
                        )}

                        {/* Variant Info */}
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">
                                {variant.name || `Variant ${variant.id}`}
                            </p>
                            <p className="text-xs text-gray-500">
                                {Object.entries(variant.options)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(', ')}
                            </p>
                        </div>
                    </li>
                ))}
                {filteredVariants.length === 0 && (
                    <p className="text-sm text-gray-500">No variants found.</p>
                )}
            </ul>
        </div>
    );
};

export default ProductVariantNavigator;

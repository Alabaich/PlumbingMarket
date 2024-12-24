"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const collections = [
  { href: "/collection/1", image: "https://www.plumbingmarket.ca/cdn/shop/files/Plumbing_2.webp?pad_color=fff&v=1734712699&width=350", label: "Collection 1" },
  { href: "/collection/2", image: "https://www.plumbingmarket.ca/cdn/shop/files/Vanities_1.webp?pad_color=fff&v=1734712705&width=350", label: "Collection 2" },
  { href: "/collection/3", image: "https://www.plumbingmarket.ca/cdn/shop/files/Flooring_3.webp?pad_color=fff&v=1734712718&width=350", label: "Collection 3" },
  { href: "/collection/4", image: "https://www.plumbingmarket.ca/cdn/shop/files/Mirrors_2.webp?pad_color=fff&v=1734712723&width=350", label: "Collection 4" },
  { href: "/collection/5", image: "https://www.plumbingmarket.ca/cdn/shop/files/bathtubs.webp?pad_color=fff&v=1734716187&width=533", label: "Collection 5" },
];

const fadeUpAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CollectionLinks() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: 1.3, // Add delay before staggering begins
            staggerChildren: 0.2, // Stagger effect for each child
          },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6 py-0"
    >
      {collections.map((collection, index) => (
        <motion.div key={index} variants={fadeUpAnimation}>
          <Link
            href={collection.href}
            className="group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative rounded-lg w-full h-60 bg-gray-300">
              <img
                src={collection.image}
                alt={collection.label}
                className="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

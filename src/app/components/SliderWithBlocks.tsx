"use client";

import { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css"; // Import Splide's default styles
import Image from "next/image";
import Skeleton from "./Skeleton"; // Assuming Skeleton is the reusable skeleton component
import Link from "next/link"; // For navigation

// Define the type for media objects
type Media = {
  id: number;
  videoUrl?: string;
  imageUrl?: string;
  link: string;
};

export default function SliderWithBlocks() {
  const [isLoading, setIsLoading] = useState(true);

  // Sample data with both imageUrl and videoUrl
  const slides: Media[] = [
    {
      id: 1,
      videoUrl: "https://firebasestorage.googleapis.com/v0/b/plumbingmarket-68e8b.firebasestorage.app/o/videoplayback%20(online-video-cutter.com).webm?alt=media&token=ab7162b2-4a34-4559-baa9-0e26daeab856",
      imageUrl: "",
      link: "/page1",
    },
    {
      id: 2,
      videoUrl: "",
      imageUrl: "https://www.plumbingmarket.ca/cdn/shop/files/boxing_sale_collection_1300x1300.webp?v=1734719507",
      link: "/page2",
    },
  ];

  const rightBlocks: Media[] = [
    {
      id: 1,
      videoUrl: "",
      imageUrl: "https://www.plumbingmarket.ca/cdn/shop/files/BBS_500x500.webp?v=1734712785",
      link: "/top-link",
    },
    {
      id: 2,
      videoUrl: "",
      imageUrl: "https://www.plumbingmarket.ca/cdn/shop/files/BKS_500x500.webp?v=1734712782",
      link: "/bottom-link",
    },
  ];

  useEffect(() => {
    // Simulate loading time; replace with actual loading logic
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderMedia = (media: Media) => {
    if (media.videoUrl) {
      return (
        <video
          src={media.videoUrl}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }
    if (media.imageUrl) {
      return (
        <Image
          src={media.imageUrl}
          alt="Media Block"
          width={500}
          height={300}
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }
    return null;
  };

  return (
    <section className="relative p-6 py-4 pt-2">
      {/* Grid Container */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr] gap-4 shadow-[0_35px_100px_-15px_rgba(0,0,0,0.75)]"
        style={{
          zIndex: 10,
          boxShadow: "0px 0px 100px rgba(0, 0, 0, 0.75)",
        }}
      >
        {/* Splide Slider (Big Block) */}
        <div className="col-span-1 lg:col-span-1 lg:row-span-2 relative overflow-hidden rounded-lg">
          {isLoading ? (
            <Skeleton className="w-full h-[616px] rounded-lg" />
          ) : (
            <Splide
              options={{
                type: "loop",
                autoplay: true,
                interval: 5000,
                pauseOnHover: false,
                pagination: true,
                arrows: true,
                gap: "1rem",
                height: "100%"
              }}
              className="w-full h-full xl:max-h-[616px]"
            >
              {slides.map((slide) => (
                <SplideSlide key={slide.id} className="h-full">
                  <Link href={slide.link} className="h-full">
                    <div className="relative w-full h-full">
                      {renderMedia(slide)}
                    </div>
                  </Link>
                </SplideSlide>
              ))}
            </Splide>
          )}
        </div>

        {/* Right Column Blocks */}
        <div className="grid grid-cols-1 gap-4 lg:grid-rows-2">
          {rightBlocks.map((block) => (
            <div
              key={block.id}
              className="relative rounded-lg overflow-hidden xl:h-[300px] col-span-1"
            >
              {isLoading ? (
                <Skeleton className="w-full xl:h-[300px] rounded-lg" />
              ) : (
                <Link href={block.link}>{renderMedia(block)}</Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

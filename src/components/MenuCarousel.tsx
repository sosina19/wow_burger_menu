import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ItemImage } from "../types";

interface MenuCarouselProps {
  images: ItemImage[];
  fallbackImage: string;
}

export const MenuCarousel: React.FC<MenuCarouselProps> = ({ images, fallbackImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [{ id: "fallback", imagePath: fallbackImage, isPrimary: true, itemId: "none" }];

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const setSlide = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  return (
    <div className="relative group w-full h-80 rounded-2xl overflow-hidden bg-gray-100 shadow-md">
      <AnimatePresence mode="wait">
        <motion.img
          key={displayImages[currentIndex].id}
          src={displayImages[currentIndex].imagePath}
          alt="Menu Item image"
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {/* Primary Badge */}
      {displayImages[currentIndex].isPrimary && (
        <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-white" /> Primary Image
        </span>
      )}

      {/* Navigation arrows (only if multiple images exist) */}
      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next Image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination dots */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/45 px-3 py-1.5 rounded-full backdrop-blur-xs">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => setSlide(idx, e)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default MenuCarousel;

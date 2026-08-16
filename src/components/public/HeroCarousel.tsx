"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export interface CarouselSlide {
  id: string;
  heading: string;
  description: string;
  imageUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
}

export function HeroCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-card border border-slate-200 bg-slate-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Featured highlights"
    >
      {/* Slides Container */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[540px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <Image
                src={slide.imageUrl}
                alt={slide.heading}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />

              {/* Gradient Overlay for high editorial readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent sm:bg-gradient-to-r sm:from-slate-950/95 sm:via-slate-950/60 sm:to-transparent" />

              {/* Slide Content */}
              <div className="relative h-full max-w-2xl flex flex-col justify-end sm:justify-center p-6 sm:p-10 lg:p-14 text-white z-20 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/30 text-indigo-200 border border-brand-400/40 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                  Featured Spotlight
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                  {slide.heading}
                </h1>
                <p className="text-sm sm:text-base text-slate-200 line-clamp-3 max-w-xl leading-relaxed">
                  {slide.description}
                </p>

                {slide.ctaText && slide.ctaLink && (
                  <div className="pt-2">
                    <Link href={slide.ctaLink}>
                      <Button size="lg" className="bg-brand-600 hover:bg-brand-500 text-white font-semibold gap-2">
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-brand-400" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

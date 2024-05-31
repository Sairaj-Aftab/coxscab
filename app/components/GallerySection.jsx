"use client";
import Image from "next/image";
import Title from "./Title";
import { images } from "@/data/demoData";
import Link from "next/link";
import { useEffect, useState } from "react";
import "@/app/styles/components/gallery-section.css";
import { usePathname } from "next/navigation";

const GallerySection = ({ showNumber }) => {
  const path = usePathname();
  // State to store shuffled items
  const [shuffledItems, setShuffledItems] = useState(images);

  useEffect(() => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
  }, []);
  return (
    <div className="gallery-section">
      <div className="container">
        <Title title1="Our Gallery" title2="Unveiling the Wonders" />
        <div className="wrap">
          {path != "/gallery" && <Link href="/gallery">See all...</Link>}
          {shuffledItems
            ?.slice(0, showNumber ? showNumber : shuffledItems.length)
            .map((data, index) => (
              <div className="gallery-card" key={index}>
                <Image
                  src={data.img}
                  alt="Gallery"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySection;

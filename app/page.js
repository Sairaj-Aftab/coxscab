import Image from "next/image";
import Headline from "./components/Headline";
import MainSlider from "./components/MainSlider";
import AboutSection from "./components/AboutSection";
import GallerySection from "./components/GallerySection";

export default function Home() {
  return (
    <main>
      <MainSlider />
      <Headline />
      <AboutSection />
      <GallerySection />
    </main>
  );
}

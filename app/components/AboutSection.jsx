"use client";
import { useRef, useState } from "react";
import "@/app/styles/components/about-section.css";

const AboutSection = () => {
  const videoRef = useRef(null);
  const [showPlayIcon, setShowPlayIcon] = useState(true);
  const playVideo = (e) => {
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  return (
    <div className="about-section">
      <div className="container">
        <div className="wrap">
          <div className="flex-1">
            <h1>Have a Wonderful and Secure Journey to Cox's Bazar</h1>
            <p style={{ marginTop: "3px" }}>
              Welcome to Cox's Bazar, home of the world's longest sandy beach
              where the sun, sand, sea and hills await you.
            </p>
            <p>
              COXSCAB is an initiative by Coxsbazar District Police to make a
              safe and tourism-friendly traffic management in tourist area.
              Explore our website to unlock valuable safety information and
              essential guidelines to help you navigate various destinations
              with confidence.
            </p>
            <p>
              Your safety is our priority. Thank you for choosing Safe Travels.
              We wish you a secure and wonderful journey ahead!
            </p>
          </div>
          <div className="flex-1" style={{ textAlign: "center" }}>
            <div className="video">
              <video
                ref={videoRef}
                controls
                onPlay={(e) => e.type == "play" && setShowPlayIcon(false)}
                onPause={(e) => e.type == "pause" && setShowPlayIcon(true)}
                onEnded={(e) => e.type == "ended" && setShowPlayIcon(true)}
              >
                <source src="/coxscab.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {showPlayIcon && (
                <i onClick={playVideo} className="fi fi-tr-play-circle"></i>
              )}
            </div>
            {/* <iframe
              src="https://drive.google.com/file/d/1-CTlCQKXLtWXovaWYmQb71ZwP5-KdBkQ/preview"
              width="100%"
              height="315"
              title="About Coxscab"
              frameBorder="0"
              allow="autoplay"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;

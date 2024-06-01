"use client";
import { useRef } from "react";
import "@/app/styles/components/about-section.css";

const AboutSection = () => {
  const videoRef = useRef(null);
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
            <h1>কক্সবাজারে নিরাপদ ও আনন্দময় ভ্রমণ</h1>
            <p>
              কক্সবাজারের সৌন্দর্য উপভোগ করতে এসে নিরাপত্তা ও সুশৃঙ্খলতা বজায়
              রাখুন। ট্রাফিক পুলিশের নির্দেশনা মেনে চলুন এবং অন্যদের জন্য উদাহরণ
              তৈরি করুন। নিরাপদ ভ্রমণই সবার জন্য আনন্দময় অভিজ্ঞতা নিশ্চিত করতে
              পারে।
            </p>
            <p style={{ marginTop: "3px", fontWeight: "500" }}>
              আনন্দময় ও নিরাপদ কক্সবাজার ভ্রমণের জন্য সবাইকে শুভেচ্ছা!
            </p>
          </div>
          <div className="flex-1" style={{ textAlign: "center" }}>
            <div className="video">
              <video ref={videoRef} controls>
                <source src="/coxscab.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* {!videoRef.current && (
                <i onClick={playVideo} className="fi fi-tr-play-circle"></i>
              )} */}
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

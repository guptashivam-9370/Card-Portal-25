"use client";
import Image from "next/image";
import "./_assets/css/home.css";
import Link from "next/link";
import { useEffect } from "react";
import Footer from "../app/_components/Footer.js";

export default function Home() {
  useEffect(() => {
    const heroElement = document.querySelector(".hero");
    heroElement.classList.add("fade-in-out");
  }, []);

  return (
    <>
      <div className="home-page">
        <div className="texture"></div>
        <div>
          <img
            src="images/bottom-border.png"
            alt="bottom-border"
            className="bottom-border"
          />
        </div>
        <div className="hero">
          <div className="bg-wrapper">
            <div className="hero-bg"></div>
            <div className="hero-left"></div>
          </div>
          <div className="layer1"></div>
            <div className="logo">
              <div className="inlogo">
                <img src="images/alcher.png" alt="" className="inlogoimg"/>
                <div className="iitg">
                  <img src="images/iitg.png" alt="" />
                </div>
                <div className="star4">
                  <img src="images/star4.svg" alt="" />
                </div>
                <div className="star5">
                  <img src="images/star5.svg" alt="" />
                </div>
              </div>
          </div>
          <div className="star1">
            <img src="images/star1.png" alt="" />
          </div>
          <div className="star2">
            <img src="images/star2.png" alt="" />
          </div>
          <div className="star3">
            <img src="images/star3.png" alt="" />
          </div>
          <div className="herotext">
            <h1>Grab Your Cards Here!!</h1>
            <p>
              Power up your fest experience in an electrifying arcade-punk
              world. Unlock your card today!
            </p>
          </div>
        </div>
        <div className="main">
          <div className="grids"></div>
          <div className="content">
            <div className="cards">
              <div className="card-heads">
                <h1 className="mb-6">ALCHERINGA CARDS</h1>
                <h3>NORMAL SEASON CARD</h3>
                <h4>This card will grant access for all days.</h4>
              </div>
              <div className="rectangles">
                <div>
                  <a href="/otp">
                    <div className="card1 text-black flex items-center justify-center">
                      <img src="images/card.svg" alt="" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

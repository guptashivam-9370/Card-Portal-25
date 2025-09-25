"use client";

import "../_assets/css/home.css";
import "../_assets/css/error.css";
import "../_assets/css/success.css";
import Loading from "../loading";
import { useEffect, useState } from "react";
import Card from "../_components/Card";
import { useSearchParams } from "next/navigation";
import Footer from "../_components/Footer";

const Result = () => {
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [res, setRes] = useState(false);
  const [cards, setCards] = useState([]);
  const [added_cards, setAddedCards] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setParams(searchParams);
    const storedCards = JSON.parse(localStorage.getItem("cards"));
    setAddedCards(storedCards);
    fetchRes(searchParams.get("txn_id"));
  }, []);

  const fetchRes = async (txn_id) => {
    try {
      const res = await fetch(`https://cardsapi.alcheringa.in/result/${txn_id}`);
      const data = await res.json();
      if (data.processed_cards) {
        setRes(true);
        setCards(data.processed_cards);
        localStorage.setItem("cards", JSON.stringify(data.processed_cards));
      } else {
        setRes(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

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
        {loading && <Loading />}
        {!loading && (
          <>
            <div className="main">
              <div className="grids"></div>
              <div className="alcher">
                <h1>ALCHERINGA</h1>
                <div className="rstar1">
                  <img src="images/star1.png" alt="" />
                </div>
                <div className="rstar2">
                  <img src="images/star2.png" alt="" />
                </div>
                <div className="rstar3">
                  <img src="images/star3.png" alt="" />
                </div>
              </div>
              {res && (
                <>
                  <div className="page">
                    <div className="failText">
                      <img src="images/success.svg" />
                      <h1>YOU HAVE SUCCESSFULLY BOOKED YOUR ALCHER CARDS</h1>
                    </div>
                    <p className="text">
                      Your summary for Alcheringa 2025 cards.
                    </p>
                    <div className="attDown">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "flex-start",
                        }}
                      >
                        <div className="att">
                          <p className="attend">Attendees</p>
                        </div>
                        <div className="down">
                          <a
                            href={`https://cardsapi.alcheringa.in/download-all?txn_id=${params.get(
                              "txn_id"
                            )}`}
                          >
                            <p className="download">DOWNLOAD ALL</p>
                            <img src="images/download.svg" />
                          </a>
                        </div>
                      </div>
                      <div className="cards">
                        {added_cards
                          ? added_cards.map((card, index) => (
                              <Card card={card} key={index} id={index} />
                            ))
                          : cards.map((card, index) => (
                              <Card card={card} key={index} id={index} />
                            ))}
                      </div>
                      <a href="/register" className="btn">
                        <p>BUY MORE CARDS HERE</p>
                        <img src="images/arrow.svg" />
                      </a>
                    </div>
                  </div>
                </>
              )}

              {!res && (
                <div className="page">
                  <div className="failText">
                    <img src="images/error.svg" />
                    <h1 style={{ color: "#DB5356" }}>
                      THERE WAS A FAILURE IN YOUR TRANSACTION
                    </h1>
                  </div>
                  <p className="text">
                    We couldn't book any card for you due to failure in
                    transaction
                  </p>
                  <a href="/register" className="btn">
                    <p>BUY MORE CARDS HERE</p>
                    <img src="images/arrow.svg" />
                  </a>
                </div>
              )}
              <Footer />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Result;

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../_assets/css/home.css";
import "../_assets/css/error.css";
import "../_assets/css/success.css";
import "./Summary.css";
import Footer from "../_components/Footer";

const Summary = () => {
  const router = useRouter();

  //   const navigate = useNavigate();
  // const [normalTotal, setNormalTotal] = useState(0);
  // const [totalAmount, setTotalAmount] = useState(0);
  // const [normalCount, setNormalCount] = useState(0);
  //   const navigate = useNavigate();
  const [normalTotal, setNormalTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [normalCount, setNormalCount] = useState(0);
  const [verifiedEmail, setEmailVerified] = useState("example@gmail.com");

  const [attendees, setAttendees] = useState([]);
  const [transactionData, setTransactionData] = useState({
    EncryptTrans: "test",
    merchIdVal: 10,
  });

  useEffect(() => {
    // Retrieve data from localStorage
    localStorage.setItem("backupform", null);
    const storedData = localStorage.getItem("registrationData");
    const transaction_data = localStorage.getItem("transaction");

    if (storedData && transaction_data) {
      const parsedData = JSON.parse(storedData);
      const transactionParsedData = JSON.parse(transaction_data);
      setNormalTotal(parsedData.normalTotal || 0);
      setTotalAmount(parsedData.total_amount || 0);
      setNormalCount(parsedData.normalCount || 0);

      // Convert parsedData into attendees array format
      const attendeesArray = parsedData.name.map((name, index) => ({
        name: name,
        email: parsedData.email[index],
        gender: parsedData.gender[index],
        contact: parsedData.contact[index],
        age: parsedData.age[index],
        id_type: parsedData.id_type[index],
        id_number: parsedData.id_number[index],
        pass_type: WhichPass(parsedData.pass_type[index]),
      }));

      setAttendees(attendeesArray); // Update state
      setTransactionData(transactionParsedData); // Update transaction data
      setEmailVerified(JSON.parse(localStorage.getItem("verifiedEmail")));
    }
  }, []);

  const WhichPass = (type) => {
    if (type === "Normal") {
      const pass_type = "Normal Season Card";
      return pass_type;
    }
  };

  const handleEdit = async () => {
    // Redirect to Register component
    localStorage.setItem("backupform", JSON.stringify(attendees));
    try {
      const response = await fetch("https://cardsapi.alcheringa.in/edit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendees),
      });

      if (response.ok) {
        // console.log("Old Transaction Deletion Failed");
        // console.log(response);
      } else {
        console.error("Old Transaction Deletion Failed");
      }
    } catch {
      console.error("Error during Edit Loading", error);
    }
    router.push("/register");
  };

  return (
    <>
      <div className="home-page">
        <div className="texture"></div>
        <div className="fullpage px-20">
          <div
            style={{ fontFamily: "Brick_Pixel" }}
            className="head mt-10 mb-20 text-center text-8xl text-[#FCD794] "
          >
            Alcheringa
          </div>
          <div className="line1 flex">
            <div>
              <h1
                style={{ fontFamily: "Brick_Pixel" }}
                className="text-5xl text-[#FCD794]"
              >
                Order summary
              </h1>
              <p
                style={{ fontFamily: "Brick_Pixel" }}
                className="text-2xl text-[#FCD794]"
              >
                Your order summary here for the Alcheringa 2025 cards.
              </p>
            </div>
            <div>
              <button
                onClick={handleEdit}
                style={{ fontFamily: "Stone_Slab" }}
                className="flex items-center justify-center rounded-sm cursor-pointer bg-[#FCD794] w-fit h-fit px-8 py-2 text-2xl text-black"
              >
                EDIT
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 31 30"
                  fill="none"
                >
                  <path
                    d="M2.70588 21.9698L1 28.7933L7.82353 27.0875L27.5879 7.32311C28.2275 6.68331 28.5868 5.81567 28.5868 4.91099C28.5868 4.00631 28.2275 3.13867 27.5879 2.49887L27.2945 2.20546C26.6547 1.56585 25.787 1.20654 24.8824 1.20654C23.9777 1.20654 23.11 1.56585 22.4702 2.20546L2.70588 21.9698Z"
                    stroke="#1E1E1E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.70588 21.97L1 28.7935L7.82353 27.0876L24.8824 10.0288L19.7647 4.91113L2.70588 21.97Z"
                    fill="#1E1E1E"
                  />
                  <path
                    d="M19.7648 4.91113L24.8824 10.0288M16.353 28.7935H30.0001"
                    stroke="#1E1E1E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Display attendees */}
          {attendees.length > 0 ? (
            attendees.map((attendee, index) => (
              <div key={index} className="wholecontainer mt-10">
                <div className=" mb-2 flex flex-wrap gap-4 items-center text-[#F4F4F4]">
                  {index === 0 ? (
                    <h1
                      style={{ fontFamily: "Brick_Pixel" }}
                      className="smalltitle text-4xl"
                    >
                      Primary Attendee
                    </h1>
                  ) : (
                    <h1
                      style={{ fontFamily: "Brick_Pixel" }}
                      className="smalltitle text-4xl"
                    >
                      Attendee {index + 1}
                    </h1>
                  )}
                  <div
                    style={{ fontFamily: "Stone_Slab" }}
                    className="passtype bg-[#245DB3] px-4 flex items-center justify-between mb-2  text-2xl text-black font-bold rounded-sm"
                  >
                    <p>{attendee.pass_type} </p>
                  </div>
                </div>
                <div className="gridbox line2    items-center mt-8 text-[#F4F4F4]">
                  <div className="mr-10">
                    <div className="element flex gap-4">
                      <div
                        style={{ fontFamily: "Game_Tape" }}
                        className="text-gray-500 mb-4  "
                      >
                        Full Name
                      </div>
                      <div className="value" style={{ fontFamily: "Game_Tape" }}>
                        {attendee.name}
                      </div>
                    </div>
                    <div className="element flex gap-4">
                      <div
                        style={{ fontFamily: "Game_Tape" }}
                        className=" text-gray-500 mb-4"
                      >
                        {" "}
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-2">
                          <div className="sm:w-auto w-full sm:text-left">
                            Email-ID
                          </div>
                          <div
                            className="value sm:w-auto w-full text-white sm:text-left"
                            style={{ fontFamily: "Game_Tape" }}
                          >
                            {attendee.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="element flex gap-4">
                      <div
                        style={{ fontFamily: "Game_Tape" }}
                        className="text-gray-500"
                      >
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-2">
                          <div className="sm:w-auto w-full sm:text-left">
                            ID Type
                          </div>
                          <div
                            className="value sm:w-auto w-full text-white sm:text-left"
                            style={{ fontFamily: "Game_Tape" }}
                          >
                            {attendee.id_type}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex mb-4">
                      <div className="element flex gap-4">
                        <div
                          style={{ fontFamily: "Game_Tape" }}
                          className="text-gray-500"
                        >
                          Gender
                        </div>
                        <div className="value" style={{ fontFamily: "Game_Tape" }}>
                          {attendee.gender}
                        </div>
                      </div>
                      <div className="element age flex gap-4 ml-8">
                        <div
                          style={{ fontFamily: "Game_Tape" }}
                          className="text-gray-500"
                        >
                          Age
                        </div>
                        <div className="value" style={{ fontFamily: "Game_Tape" }}>
                          {attendee.age}
                        </div>
                      </div>
                    </div>
                    <div className="element flex gap-4">
                      <div
                        style={{ fontFamily: "Game_Tape" }}
                        className="text-gray-500"
                      >
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-2">
                          <div className="sm:w-auto w-full sm:text-left">
                            Contact No.
                          </div>
                          <div
                            className="value sm:w-auto w-full text-white sm:text-left"
                            style={{ fontFamily: "Game_Tape" }}
                          >
                            +91 {attendee.contact}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="element flex gap-4">
                      <div
                        style={{ fontFamily: "Game_Tape" }}
                        className="text-gray-500"
                      >
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-2">
                          <div className="sm:w-auto w-full sm:text-left">
                            ID Number
                          </div>
                          <div
                            className="value sm:w-auto w-full text-white sm:text-left"
                            style={{ fontFamily: "Game_Tape" }}
                          >
                            {attendee.id_number}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No attendees found.</p>
          )}

          <div className="summary-box">
            <div>
              <h3>Summary</h3>

							<p>
								Normal Season Cards: {normalCount} | Cost: ₹{normalTotal}
							</p>
							<hr></hr>
							<p>Total Amount: ₹{totalAmount}</p>
						</div>
					</div>

          {/* Transaction Form */}

          <form
            name="form1"
            method="post"
            action="https://www.sbiepay.sbi/secure/AggregatorHostedListener"
          >
            <input
              type="hidden"
              name="EncryptTrans"
              id="EncryptTrans"
              value={transactionData.EncryptTrans}
            />
            <input
              type="hidden"
              name="merchIdVal"
              id="merchIdVal"
              value={transactionData.merchIdVal}
            />
            <button
              style={{ fontFamily: "Stone_Slab" }}
              className="submitButton cursor-pointer text-[#FFF0D5] bg-[#FE3989] mt-4 w-fit h-fit px-8 py-2 border-[#181818] rounded-sm text-2xl"
              id="summarysubmit"
              type="submit"
              value="Submit"
            >
              SUBMIT AND PAY{" "}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Summary;

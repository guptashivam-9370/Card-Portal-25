"use client";
import React, { useEffect, useState } from "react";
import "./Register.css";
// import "../_assets/css/home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookSquare,
  faTwitter,
  faYoutube,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/navigation";
import Attendee from "../_components/Attendee";
import Footer from "../_components/Footer";
import Loading from "../loading";
const Register = () => {
  const router = useRouter();
  const passPrices = {
    Normal: 500, // Price for Normal Pass
    Early: 450, // Price for Early Bird Pass
  };

  const [errors, setErrors] = useState([]);
  const [errorstatus, setErrorStatus] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetdata = async () => {
      const backupData = await JSON.parse(localStorage.getItem("backupform"));
      if (backupData) {
        // console.log("working");
        const prefilledAttendees = await backupData.map((attendee) => ({
          passType: attendee.passType || "Normal",
          name: attendee.name || "",
          gender: attendee.gender || "Male",
          age: attendee.age || "",
          email: attendee.email || "",
          contact: attendee.contact || "",
          idType: attendee.id_type || "Aadhar Card",
          idNumber: attendee.id_number || "",
        }));
        setAttendees(prefilledAttendees);
      }
      const email = await JSON.parse(localStorage.getItem("verifiedEmail"));
      if (!backupData) {
        setAttendees([
          {
            passType: "Normal",
            name: "",
            gender: "Male",
            age: "",
            email: email,
            contact: "",
            idType: "Aadhar Card",
            idNumber: "",
          },
        ]);
      }
      setVerifiedEmail(email);
    };
    fetdata();
  }, []);
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  // const [loading, setLoading] = useState(false);

  const [paymentMode, setPaymentMode] = useState("");

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedAttendees = [...attendees];
    updatedAttendees[index][name] = value;
    setAttendees(updatedAttendees);
  };

  const handlePaymentModeChange = (e) => {
    setPaymentMode(e.target.value);
  };

  const handleAddAttendee = () => {
    setAttendees([
      ...attendees,
      {
        passType: "Normal",
        name: "",
        gender: "Male",
        age: "",
        email: "",
        contact: "",
        idType: "Aadhar Card",
        idNumber: "",
      },
    ]);
  };

  const handleRemoveAttendee = (index) => {
    const updatedAttendees = attendees.filter((_, i) => i !== index);
    setAttendees(updatedAttendees);
  };

  const validateForm = (attendee) => {
    // console.log("validation running");
    const newErrors = {};
    if (!attendee.name.trim()) {
      newErrors.name = "Full Name is required.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!attendee.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(attendee.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!attendee.contact.trim()) {
      newErrors.contact = "Contact Number is required.";
    } else if (!phoneRegex.test(attendee.contact)) {
      newErrors.contact = "Enter a valid 10-digit contact number.";
    }
    if (!attendee.idNumber.trim()) {
      newErrors.idNumber = "ID Number is required.";
    }
    if (!attendee.age || attendee.age <= 0) {
      newErrors.age = "Enter a valid age.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

    // Calculate the total amount
    const { normalCount, normalTotal, totalAmount } = calculateSummary();

    // Prepare the data to send to the backend
    const formData = {
      total_amount: totalAmount,
      normalCount: normalCount,
      normalTotal: normalTotal,
      payment_mode: paymentMode,
      name: attendees.map((attendee) => attendee.name),
      email: attendees.map((attendee) => attendee.email),
      pass_type: attendees.map((attendee) => attendee.passType),
      gender: attendees.map((attendee) => attendee.gender),
      contact: attendees.map((attendee) => attendee.contact),
      age: attendees.map((attendee) => attendee.age),
      id_type: attendees.map((attendee) => attendee.idType),
      id_number: attendees.map((attendee) => attendee.idNumber),
    };


    // Validate all attendees
    const allValid = attendees.every((attendee) => {
      if (!validateForm(attendee)) {
        setErrorStatus(true);
        return false;
      } else {
        return true;
      }
    });

    if (!allValid) {
      // setLoading(false);
      return; // Stop further execution if validation fails
    }

    // Proceed with form submission if validation passes
    try {
      const response = await fetch("https://cardsapi.alcheringa.in/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Registration successful:");
        localStorage.setItem("registrationData", JSON.stringify(formData));
        localStorage.setItem("transaction", JSON.stringify(data));
        localStorage.setItem("backupform", null);
        // setLoading(false);
        router.push("/Order_Summary");
      } else {
        console.error("Registration failed:", data);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      // setLoading(false);
    }
  };

  // Calculate total amount and count of Normal and Early pass types
  const calculateSummary = () => {
    let normalCount = 0;
    let earlyCount = 0;
    let normalTotal = 0;
    let earlyTotal = 0;

    attendees.forEach((attendee) => {
      if (attendee.passType === "Normal") {
        normalCount++;
        normalTotal += passPrices.Normal;
      } else if (attendee.passType === "Early") {
        earlyCount++;
        earlyTotal += passPrices.Early;
      }
    });

    return {
      normalCount,
      earlyCount,
      normalTotal,
      earlyTotal,
      totalAmount: normalTotal + earlyTotal,
    };
  };

  const { normalCount, earlyCount, normalTotal, earlyTotal, totalAmount } =
    calculateSummary();

  return (
    <div className="userregister">
      <div className="texture"></div>

      <>
        <div className="heading">
          <div className="heading2">
            <h1>Alcheringa</h1>
            <div className="rstar1">
              <img src="images/star1.png" alt="" />
            </div>
            <div className="rstar2">
              <img src="images/star2.png" alt="" />
            </div>
            <div className="rstar3">
              <img src="images/star3.png" alt="" />
            </div>
            <p>
              Welcome to Alcheringa!! Please enter each of your attendee's names
              and select the kind of pass for each of it
            </p>
          </div>
        </div>

        <form id="userform" onSubmit={handleFormSubmit}>
          <div className="Attendeetitle">
            <h1>Attendee Details</h1>
          </div>
          {attendees.map((attendee, index) => (
            <Attendee
              errors={errors}
              verifiedEmail={verifiedEmail}
              attendee={attendee}
              key={index}
              index={index}
              handleChange={handleChange}
              handleRemoveAttendee={handleRemoveAttendee}
            />
          ))}

          <div className="paymentmodeSelect form-group">
            <div>
              <label htmlFor="payment_mode">Payment Mode:</label>
            </div>
            <div style={{ width: "50%", marginBottom: "5vh" }}>
              <select
                id="payment_mode"
                value={paymentMode}
                onChange={handlePaymentModeChange}
                required
              >
                <option value="" disabled>
                  Select a payment mode
                </option>
                <option value="CREDIT CARD">Credit Card</option>
                <option value="DEBIT CARD">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="NET BANKING">Net Banking</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="add-attendee-button"
              onClick={handleAddAttendee}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M8.57143 11.6122H0V8.75502H8.57143V0.183594H11.4286V8.75502H20V11.6122H11.4286V20.1836H8.57143V11.6122Z"
                  fill="black"
                />
              </svg>
              Add More Attendees
            </button>
          </div>
          <div className="summary-box">
          <img src="../../../public/images/Summarybg.png" alt="" />
            <div className="summarychild">
              <h3>Summary</h3>
              <p>
                Normal Season Cards: {normalCount} | Cost: ₹{normalTotal}
              </p>
              <hr></hr>
              <p>Total Amount: ₹{totalAmount}</p>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Proceed
          </button>
        </form>
      </>
      <Footer />
    </div>
  );
};

export default Register;

import React from "react";
import logo from "../Assets/a.jpg";
import axios from "axios";
import { BASE_URL } from "../../config";

function TBConfirm2() {

  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

async function displayRazorpay() {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  console.log(res);
  console.log("hello");

  if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
  }

  // creating a new order
  console.log("starting payment");
    const result = await axios.post(`${BASE_URL}/api/TicketBooking/BookTickets`, { amount: 50000, currency: "INR" });
  console.log("result");
  console.log(result);

  if (!result) {
      alert("Server error. Are you online?");
      return;
  }

  // Getting the order details back
  const { amount, id: order_id, currency } = result.data;

  const options = {
      key: "rzp_test_wH5PplUikspRy6", // Enter the Key ID generated from the Dashboard
      amount: 10000,
      currency: "INR",
      name: "Soumya Corp.",
      description: "Test Transaction",
      image: { logo },
      order_id: 115,
      handler: async function (response) {
          const data = {
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
          };

          const result = await axios.post(`${BASE_URL}/payment/success`, data);

          alert(result.data.msg);
      },
      prefill: {
          name: "Soumya Dey",
          email: "SoumyaDey@example.com",
          contact: "9999999999",
      },
      notes: {
          address: "Soumya Dey Corporate Office",
      },
      theme: {
          color: "#61dafb",
      },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}


    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Buy React now!</p>
                <button className="App-link" onClick={displayRazorpay}>
                    Pay ₹500
                </button>
            </header>
        </div>
    );
}

export default TBConfirm2;
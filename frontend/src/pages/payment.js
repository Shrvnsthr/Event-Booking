import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code"; 
import Confetti from "react-confetti"; // Import Confetti
import { motion } from "framer-motion"; // For animation effects

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Retrieve the event details from URL query
    const { eventId, tickets, totalAmount } = window.location.search
      .slice(1)
      .split("&")
      .reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = value;
        return acc;
      }, {});

    setEventId(eventId);
    setTickets(Number(tickets));
setTotalAmount(Math.round(Number(totalAmount)));
  }, []);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === "cash" || paymentMethod === "upi") {
      setPaymentSuccess(true);
    }
  };

  const generateRandomUpiQR = () => {
    const upiAddress = `upipay@bank${Math.floor(Math.random() * 10000)}`;
    const upiMessage = `Amount: ₹${totalAmount}`;
    return `upi://pay?pa=${upiAddress}&pn=Event+Tickets&mc=123456&tid=789456&tn=${upiMessage}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Confetti Animation */}
      {paymentSuccess && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div className="bg-white shadow-md rounded-lg max-w-5xl w-full mt-10 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Page</h1>

        <div className="mt-4">
          <p className="text-gray-600">
            <strong>Event:</strong> Event #{eventId} - Tickets: {tickets} - Total: ₹{totalAmount}
          </p>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <motion.button
            className={`${
              paymentMethod === "cash" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
            } py-2 px-4 rounded-md mb-4 sm:mb-0 transition-all`}
            onClick={() => handlePaymentMethodChange("cash")}
            whileHover={{ scale: 1.05 }}
          >
            Cash Payment
          </motion.button>
          <motion.button
            className={`${
              paymentMethod === "upi" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
            } py-2 px-4 rounded-md transition-all`}
            onClick={() => handlePaymentMethodChange("upi")}
            whileHover={{ scale: 1.05 }}
          >
            UPI Payment
          </motion.button>
        </div>

        {/* UPI QR Code */}
        {paymentMethod === "upi" && (
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-gray-600 mb-4">
              Scan the QR code to pay via UPI (₹{totalAmount}).
            </p>
      
              <QRCode value={generateRandomUpiQR()} size={256} />
     
            <p className="text-gray-500 mt-4">
              Scan the code with your UPI app and proceed with the payment.
            </p>
          </motion.div>
        )}

        {/* Confirm Payment */}
        <div className="flex justify-center mt-6">
          <motion.button
            onClick={handleConfirmPayment}
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            Confirm Payment
          </motion.button>
        </div>

        {/* Success Message */}
        {paymentSuccess && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl text-green-600 font-semibold">Payment Successful!</h3>
            <p className="text-gray-600 mt-4">Your tickets have been successfully booked.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setError("Invalid payment information");
      setLoading(false);
      return;
    }

    // 결제 승인 요청
    async function confirmPayment() {
      console.log(paymentKey, orderId, amount);
      try {
        const response = await fetch(
          "http://localhost:3000/api/payment/confirm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentKey,
              orderId,
              amount,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Payment confirmation failed");
        }

        const data = await response.json();
        setPaymentInfo(data);
      } catch (err) {
        console.error("Payment confirmation error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="wrapper">
        <div className="box_section" style={{ textAlign: "center" }}>
          <h1>Processing Payment...</h1>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <div className="box_section" style={{ textAlign: "center" }}>
          <h1>Payment Error</h1>
          <p style={{ color: "#e74c3c", fontSize: "18px", fontWeight: "bold" }}>
            {error}
          </p>
          <div style={{ marginTop: "30px" }}>
            <button
              className="button"
              onClick={() => navigate("/order")}
              style={{ marginRight: "10px" }}
            >
              Back to Order
            </button>
            <button
              className="button"
              onClick={() => navigate("/")}
              style={{ backgroundColor: "#6c757d" }}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="box_section" style={{ textAlign: "center" }}>
        <h1>Payment Successful!</h1>
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#27ae60", fontSize: "18px", fontWeight: "bold" }}>
            Your payment has been successfully processed.
          </p>
          {paymentInfo && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Payment Details</h3>
              <p style={{ marginBottom: "10px" }}>
                <strong>Order ID:</strong> {paymentInfo.orderId}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Payment Key:</strong> {paymentInfo.paymentKey}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Order Name:</strong> {paymentInfo.orderName || "N/A"}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Method:</strong> {paymentInfo.method || "N/A"}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Amount:</strong>{" "}
                {paymentInfo.totalAmount
                  ? `₩${paymentInfo.totalAmount.toLocaleString()}`
                  : "N/A"}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Status:</strong> {paymentInfo.status || "N/A"}
              </p>
              {paymentInfo.approvedAt && (
                <p style={{ margin: 0 }}>
                  <strong>Approved At:</strong>{" "}
                  {new Date(paymentInfo.approvedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
          <div style={{ marginTop: "30px" }}>
            <button className="button" onClick={() => navigate("/")}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OrderFailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const message = searchParams.get("message");

    console.error("Payment failed:", { code, message });
  }, [searchParams]);

  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="wrapper">
      <div className="box_section" style={{ textAlign: "center" }}>
        <h1>Payment Failed</h1>
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#e74c3c", fontSize: "18px", fontWeight: "bold" }}>
            Payment has failed. Please try again.
          </p>
          {code && (
            <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <p style={{ marginBottom: "10px" }}>
                <strong>Error Code:</strong> {code}
              </p>
              {message && (
                <p style={{ margin: 0 }}>
                  <strong>Error Message:</strong> {message}
                </p>
              )}
            </div>
          )}
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
    </div>
  );
}

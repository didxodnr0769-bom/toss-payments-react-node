const express = require("express");
const router = express.Router();

// Toss Payments 결제 승인 API
router.post("/confirm", async (req, res) => {
  const { paymentKey, orderId, amount } = req.body;

  // 필수 파라미터 검증
  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameters: paymentKey, orderId, or amount",
    });
  }

  // Toss Payments Secret Key 확인
  const secretKey = process.env.TOSS_SECRET_KEY;

  try {
    // Toss Payments API 호출
    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: Number(amount), // amount를 숫자로 변환
        }),
      }
    );

    const data = await response.json();

    // Toss Payments API 응답 처리
    if (!response.ok) {
      console.error("Toss Payments API Error:", data);
      return res.status(response.status).json({
        success: false,
        message: data.message || "Payment confirmation failed",
        code: data.code,
      });
    }

    // 성공 응답
    return res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      data: data,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment confirmation",
      error: error.message,
    });
  }
});

module.exports = router;

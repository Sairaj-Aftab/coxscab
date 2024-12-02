import axios from "axios";

export const sendSMStoPhone = async (receiver, sms) => {
  try {
    const response = await axios.post(
      `http://bulksmsbd.net/api/smsapi?api_key=${process.env.SMS_API_KEY}&type=text&number=${receiver}&senderid=${process.env.SENDER_ID}&message=${sms}`
    );

    const responseData = response.data;

    if (responseData.response_code === 202) {
      console.log("SMS Submitted Successfully:", responseData.success_message);
      return responseData;
    } else {
      throw new Error(responseData.error_message || "Failed to send SMS");
    }
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw new Error("Error sending SMS");
  }
};

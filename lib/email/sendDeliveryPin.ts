import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDeliveryPin(
  email: string,
  customerName: string,
  pin: string,
) {
  // Send the one-time verification code to the customer.
  return resend.emails.send({
    from: "Reflex <onboarding@resend.dev>",
    to: email,
    subject: "Your Reflex delivery verification code",
    html: `
      <h2>Your delivery is on the way</h2>

      <p>Hello ${customerName},</p>

      <p>
        Your Reflex delivery is on its way.
      </p>

      <h1>${pin}</h1>

      <p>
        Please give this verification code to the rider
        <strong>when you receive your order</strong>.
      </p>

      <p>
        Do not share this code before receiving your delivery.
      </p>

      <p>Thank you,<br />Reflex</p>
    `,
  });
}
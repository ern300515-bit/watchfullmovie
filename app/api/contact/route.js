
import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL || "billaardilla@gmail.com";

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "ScreenNest <onboarding@resend.dev>";

function cleanText(value, maxLength = 5000) {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .replace(/\r\n/g, "\n")
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br />");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    console.log("========================================");
    console.log("📩 ScreenNest Contact API");
    console.log("========================================");

    // --------------------------------------------------
    // 1. Check environment
    // --------------------------------------------------

    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is missing");

      return NextResponse.json(
        {
          success: false,
          error: "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    console.log("✅ RESEND_API_KEY detected");
    console.log("📤 From:", FROM_EMAIL);
    console.log("📥 To:", CONTACT_EMAIL);

    const resend = new Resend(process.env.RESEND_API_KEY);

    // --------------------------------------------------
    // 2. Read request
    // --------------------------------------------------

    const body = await request.json();

    const name = cleanText(body?.name, 100);
    const email = cleanText(body?.email, 254).toLowerCase();
    const subject = cleanText(body?.subject, 200);
    const message = cleanText(body?.message, 5000);

    const website = cleanText(body?.website, 200);

    console.log("👤 Name:", name);
    console.log("📧 Visitor email:", email);
    console.log("📝 Subject:", subject);

    // --------------------------------------------------
    // 3. Honeypot
    // --------------------------------------------------

    if (website) {
      console.log("⚠️ Honeypot triggered");

      return NextResponse.json({
        success: true,
        message: "Message sent successfully.",
      });
    }

    // --------------------------------------------------
    // 4. Validation
    // --------------------------------------------------

    if (!name || !email || !subject || !message) {
      console.error("❌ Missing required fields");

      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      console.error("❌ Invalid email:", email);

      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 5. Escape HTML
    // --------------------------------------------------

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    // --------------------------------------------------
    // 6. Send email
    // --------------------------------------------------

    console.log("🚀 Sending email through Resend...");

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `ScreenNest Contact: ${subject}`,

      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>ScreenNest Contact Form</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f5f5;
              font-family: Arial, Helvetica, sans-serif;
              color: #222222;
            "
          >
            <div
              style="
                max-width: 680px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #e5e5e5;
              "
            >
              <div
                style="
                  padding: 24px;
                  background: #111111;
                  color: #ffffff;
                "
              >
                <h1 style="margin: 0; font-size: 24px;">
                  ScreenNest
                </h1>

                <p
                  style="
                    margin: 8px 0 0;
                    color: #cccccc;
                    font-size: 14px;
                  "
                >
                  New Contact Form Message
                </p>
              </div>

              <div style="padding: 28px;">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style="border-collapse: collapse;"
                >
                  <tr>
                    <td
                      style="
                        padding: 10px 0;
                        font-weight: bold;
                        width: 110px;
                        vertical-align: top;
                      "
                    >
                      Name
                    </td>

                    <td style="padding: 10px 0;">
                      ${safeName}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding: 10px 0;
                        font-weight: bold;
                        vertical-align: top;
                      "
                    >
                      Email
                    </td>

                    <td style="padding: 10px 0;">
                      ${safeEmail}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding: 10px 0;
                        font-weight: bold;
                        vertical-align: top;
                      "
                    >
                      Subject
                    </td>

                    <td style="padding: 10px 0;">
                      ${safeSubject}
                    </td>
                  </tr>
                </table>

                <div
                  style="
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid #eeeeee;
                  "
                >
                  <h2
                    style="
                      margin: 0 0 12px;
                      font-size: 18px;
                    "
                  >
                    Message
                  </h2>

                  <div
                    style="
                      line-height: 1.7;
                      font-size: 15px;
                      color: #333333;
                      word-break: break-word;
                    "
                  >
                    ${safeMessage}
                  </div>
                </div>

                <div
                  style="
                    margin-top: 28px;
                    padding: 14px 16px;
                    background: #f7f7f7;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #666666;
                  "
                >
                  <strong>Reply-To:</strong> ${safeEmail}
                </div>
              </div>

              <div
                style="
                  padding: 18px 24px;
                  background: #fafafa;
                  border-top: 1px solid #eeeeee;
                  font-size: 12px;
                  color: #888888;
                "
              >
                This message was submitted through the ScreenNest
                contact form.
              </div>
            </div>
          </body>
        </html>
      `,

      text: `
ScreenNest Contact Form

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Reply-To: ${email}
      `.trim(),
    });

    // --------------------------------------------------
    // 7. Resend response
    // --------------------------------------------------

    if (error) {
      console.error("❌ RESEND ERROR");
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          error:
            error?.message ||
            "Resend failed to send the email.",
          resendError: error,
        },
        { status: 500 }
      );
    }

    console.log("========================================");
    console.log("✅ RESEND ACCEPTED EMAIL");
    console.log("📨 Message ID:", data?.id);
    console.log("========================================");

    return NextResponse.json({
      success: true,
      message: "Your message has been accepted by Resend.",
      id: data?.id || null,
    });
  } catch (error) {
    console.error("========================================");
    console.error("❌ CONTACT API ERROR");
    console.error(error);
    console.error("========================================");

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
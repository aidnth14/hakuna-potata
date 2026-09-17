export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('BREVO_API_KEY not configured in environment');
    return res.status(200).json({ success: false, message: 'Email service unconfigured' });
  }

  const order = req.body || {};

  const orderId = order.orderId || `HKP-${Date.now().toString().slice(-6)}`;
  const customerName = order.name || 'Valued Customer';
  const customerPhone = order.phone || 'N/A';
  const deliveryAddress = order.address || 'N/A';
  const deliveryZoneText = order.deliveryZoneText || 'Inside Dhaka';
  const cakeSize = order.sizeName || '6" Cake';
  const sponge = order.spongeFlavor || 'Standard';
  const filling = order.filling || 'Standard';
  const color = order.color || 'Artisan';
  const inscription = order.inscription || 'None';
  const date = order.date || 'TBD';
  const time = order.time || 'TBD';
  const totalPrice = order.totalPrice ? `৳${order.totalPrice}` : 'N/A';
  const notes = order.notes || 'None';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 24px; background: #faf9f6; color: #1a1a1a; }
          .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #eae8e3; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
          .header { text-align: center; border-bottom: 2px dashed #eae8e3; padding-bottom: 24px; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; margin: 0; color: #111; }
          .order-id { font-size: 13px; color: #777; font-family: monospace; margin-top: 6px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f0ec; font-size: 14px; }
          .label { color: #666; font-weight: 500; }
          .val { font-weight: 600; text-align: right; color: #111; }
          .total-box { margin-top: 24px; padding: 16px; background: #111111; color: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
          .total-box .val { font-size: 20px; font-weight: 800; color: #ffffff; }
          .footer { text-align: center; font-size: 11px; color: #888; margin-top: 28px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">Hakuna Potata Bakery</h1>
            <div class="order-id">New Custom Cake Order #${orderId}</div>
          </div>
          <div class="row"><span class="label">Customer Name:</span><span class="val">${customerName}</span></div>
          <div class="row"><span class="label">Phone:</span><span class="val">${customerPhone}</span></div>
          <div class="row"><span class="label">Delivery Zone:</span><span class="val">${deliveryZoneText}</span></div>
          <div class="row"><span class="label">Delivery Address:</span><span class="val">${deliveryAddress}</span></div>
          <div class="row"><span class="label">Delivery Date & Time:</span><span class="val">${date} at ${time}</span></div>
          <div class="row"><span class="label">Cake Size:</span><span class="val">${cakeSize}</span></div>
          <div class="row"><span class="label">Sponge Flavor:</span><span class="val">${sponge}</span></div>
          <div class="row"><span class="label">Cream & Filling:</span><span class="val">${filling}</span></div>
          <div class="row"><span class="label">Color Palette:</span><span class="val">${color}</span></div>
          <div class="row"><span class="label">Custom Inscription:</span><span class="val">"${inscription}"</span></div>
          <div class="row"><span class="label">Special Notes:</span><span class="val">${notes}</span></div>
          <div class="total-box">
            <span>Total Payable</span>
            <span class="val">${totalPrice}</span>
          </div>
          <div class="footer">
            Hakuna Potata Artisan Bakery · Automated Order Notification
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Hakuna Potata Bakery', email: process.env.BREVO_SENDER_EMAIL || 'aiu.mailhub@gmail.com' },
        to: [{ email: process.env.BREVO_RECIPIENT_EMAIL || 'hakunapotatabakery@gmail.com', name: 'Hakuna Potata Bakery' }],
        subject: `🍰 New Order #${orderId} - ${cakeSize} (${customerName})`,
        htmlContent: htmlContent,
      }),
    });

    const data = await brevoResponse.json();
    if (!brevoResponse.ok) {
      console.error('Brevo API error:', data);
      return res.status(brevoResponse.status).json({ success: false, error: data });
    }

    return res.status(200).json({ success: true, messageId: data.messageId });
  } catch (err) {
    console.error('Order email error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}

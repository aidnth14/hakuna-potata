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
  const customerEmail = (order.email || '').trim();
  const deliveryAddress = order.address || 'N/A';
  const deliveryZoneText = order.deliveryZoneText || 'Inside Dhaka';
  const cakeSize = order.sizeName || '6" Cake';
  const diameterSpec = order.diameterSpec || '';
  const servings = order.servings || '';
  const basePrice = order.basePrice || 0;
  const sponge = order.spongeFlavor || 'Standard';
  const filling = order.filling || 'Standard';
  const color = order.color || 'Artisan';
  const inscription = order.inscription || 'None';
  const isEggless = Boolean(order.isEggless);
  const egglessFee = order.egglessFee || (isEggless ? 250 : 0);
  const deliveryCost = order.deliveryCost !== undefined ? order.deliveryCost : 100;
  const date = order.date || 'TBD';
  const time = order.time || 'TBD';
  const totalPrice = order.totalPrice ? order.totalPrice.toLocaleString() : (basePrice + egglessFee + deliveryCost).toLocaleString();
  const notes = order.notes || 'None';
  const referenceNotes = order.referenceNotes || '';

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'aiu.mailhub@gmail.com';
  const bakeryEmail = process.env.BREVO_RECIPIENT_EMAIL || 'hakunapotatabakery@gmail.com';

  // 1. Bakery Notification Email HTML
  const bakeryNotificationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 24px; background: #faf9f6; color: #1a1a1a; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #eae8e3; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
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
          <div class="row"><span class="label">Customer Email:</span><span class="val">${customerEmail || 'Not provided'}</span></div>
          <div class="row"><span class="label">Delivery Zone:</span><span class="val">${deliveryZoneText}</span></div>
          <div class="row"><span class="label">Delivery Address:</span><span class="val">${deliveryAddress}</span></div>
          <div class="row"><span class="label">Delivery Date & Time:</span><span class="val">${date} at ${time}</span></div>
          <div class="row"><span class="label">Cake Size:</span><span class="val">${cakeSize} (${diameterSpec})</span></div>
          <div class="row"><span class="label">Sponge Flavor:</span><span class="val">${sponge}</span></div>
          <div class="row"><span class="label">Cream & Filling:</span><span class="val">${filling}</span></div>
          <div class="row"><span class="label">Color Palette:</span><span class="val">${color}</span></div>
          <div class="row"><span class="label">Dietary:</span><span class="val">${isEggless ? '100% Pure Eggless (+৳250)' : 'Standard'}</span></div>
          <div class="row"><span class="label">Custom Inscription:</span><span class="val">"${inscription}"</span></div>
          ${referenceNotes ? `<div class="row"><span class="label">Design Notes:</span><span class="val">${referenceNotes}</span></div>` : ''}
          <div class="row"><span class="label">Special Instructions:</span><span class="val">${notes}</span></div>
          <div class="total-box">
            <span>Total Payable</span>
            <span class="val">৳${totalPrice}</span>
          </div>
          <div class="footer">
            Hakuna Potata Artisan Bakery · Automated Order Notification
          </div>
        </div>
      </body>
    </html>
  `;

  // 2. Customer Full Itemized Invoice HTML
  const customerInvoiceHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px 12px; background-color: #f7f6f2; color: #1c1917; }
          .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
          .brand-banner { background-color: #0c0a09; color: #f5f5f4; padding: 36px 32px 28px; text-align: center; }
          .brand-name { font-size: 24px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; color: #ffffff; }
          .brand-subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #a8a29e; margin-top: 6px; }
          .invoice-pill { display: inline-block; margin-top: 18px; padding: 4px 14px; background: #292524; color: #fafaf9; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; font-family: monospace; }
          .content { padding: 32px; }
          .greeting { font-size: 16px; font-weight: 600; color: #1c1917; margin-bottom: 6px; }
          .intro-text { font-size: 13px; color: #78716c; line-height: 1.6; margin-top: 0; margin-bottom: 24px; }
          .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #78716c; margin-bottom: 12px; }
          .details-card { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; }
          .detail-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px dashed #e7e5e4; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #78716c; font-weight: 500; }
          .detail-val { font-weight: 600; color: #1c1917; text-align: right; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .table th { text-align: left; padding: 10px 12px; background: #f5f5f4; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #57534e; border-bottom: 1px solid #e7e5e4; }
          .table th.num { text-align: right; }
          .table td { padding: 12px; font-size: 13px; border-bottom: 1px solid #f5f5f4; color: #1c1917; }
          .table td.num { text-align: right; font-weight: 600; }
          .table td .item-sub { font-size: 11px; color: #78716c; margin-top: 2px; }
          .total-section { background: #0c0a09; color: #ffffff; border-radius: 14px; padding: 20px 24px; margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; color: #d6d3d1; }
          .grand-total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; padding-top: 10px; margin-top: 8px; border-top: 1px solid #292524; color: #ffffff; }
          .action-banner { margin-top: 28px; padding: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; text-align: center; }
          .action-title { font-size: 14px; font-weight: 700; color: #14532d; margin-bottom: 6px; }
          .action-desc { font-size: 12px; color: #166534; margin-bottom: 16px; line-height: 1.5; }
          .btn-wa { display: inline-block; background-color: #16a34a; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; }
          .footer { background: #fafaf9; border-top: 1px solid #e7e5e4; padding: 24px 32px; text-align: center; font-size: 11px; color: #a8a29e; line-height: 1.6; }
          .footer a { color: #57534e; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Banner -->
          <div class="brand-banner">
            <h1 class="brand-name">HAKUNA POTATA</h1>
            <div class="brand-subtitle">Artisan Bakery &amp; Custom Cake Studio</div>
            <div class="invoice-pill">OFFICIAL INVOICE #${orderId}</div>
          </div>

          <!-- Invoice Content -->
          <div class="content">
            <div class="greeting">Dear ${customerName},</div>
            <p class="intro-text">
              Thank you for ordering with Hakuna Potata Artisan Bakery! We have logged your custom cake commission. Below is your complete, itemized tax invoice and order summary.
            </p>

            <!-- Customer & Delivery Summary -->
            <div class="section-title">Order &amp; Delivery Details</div>
            <div class="details-card">
              <div class="detail-row"><span class="detail-label">Invoice Number</span><span class="detail-val">#${orderId}</span></div>
              <div class="detail-row"><span class="detail-label">Customer Name</span><span class="detail-val">${customerName}</span></div>
              <div class="detail-row"><span class="detail-label">Contact Phone</span><span class="detail-val">${customerPhone}</span></div>
              <div class="detail-row"><span class="detail-label">Customer Email</span><span class="detail-val">${customerEmail}</span></div>
              <div class="detail-row"><span class="detail-label">Delivery Schedule</span><span class="detail-val">${date} at ${time}</span></div>
              <div class="detail-row"><span class="detail-label">Fulfillment Region</span><span class="detail-val">${deliveryZoneText}</span></div>
              <div class="detail-row"><span class="detail-label">Delivery Address</span><span class="detail-val">${deliveryAddress}</span></div>
            </div>

            <!-- Itemized Cake Specification Table -->
            <div class="section-title">Itemized Order Breakdown</div>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="num">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${cakeSize} Custom Artisan Cake</strong>
                    <div class="item-sub">Diameter: ${diameterSpec || 'Standard'} · Portions: ${servings || 'Party'}</div>
                    <div class="item-sub">Sponge: ${sponge} · Cream/Filling: ${filling}</div>
                    <div class="item-sub">Theme/Palette: ${color}</div>
                    ${inscription !== 'None' ? `<div class="item-sub">Inscription: "<em>${inscription}</em>"</div>` : ''}
                  </td>
                  <td class="num">৳${basePrice ? basePrice.toLocaleString() : '—'}</td>
                </tr>
                ${isEggless ? `
                <tr>
                  <td>
                    <strong>100% Pure Eggless Sponge Customization</strong>
                    <div class="item-sub">Dietary preparation fee</div>
                  </td>
                  <td class="num">৳${egglessFee}</td>
                </tr>
                ` : ''}
                <tr>
                  <td>
                    <strong>Delivery &amp; Courier Service</strong>
                    <div class="item-sub">${deliveryZoneText}</div>
                  </td>
                  <td class="num">৳${deliveryCost}</td>
                </tr>
              </tbody>
            </table>

            ${notes && notes !== 'None' ? `
            <div class="section-title">Special Instructions</div>
            <div class="details-card" style="font-size: 12px; color: #44403c; font-style: italic;">
              "${notes}"
            </div>
            ` : ''}

            <!-- Total Box -->
            <div class="total-section">
              <div class="total-row">
                <span>Base Cake Subtotal:</span>
                <span>৳${basePrice ? basePrice.toLocaleString() : '0'}</span>
              </div>
              ${isEggless ? `
              <div class="total-row">
                <span>Eggless Customization:</span>
                <span>৳${egglessFee}</span>
              </div>
              ` : ''}
              <div class="total-row">
                <span>Delivery &amp; Handling:</span>
                <span>৳${deliveryCost}</span>
              </div>
              <div class="grand-total-row">
                <span>Total Payable:</span>
                <span>৳${totalPrice}</span>
              </div>
            </div>

            <!-- WhatsApp Direct Confirmation Banner -->
            <div class="action-banner">
              <div class="action-title">Need to verify or customize your design?</div>
              <div class="action-desc">
                Our pastry team is on standby to coordinate reference pictures, colors, and delivery timings directly with you.
              </div>
              <a href="https://wa.me/8801339656675?text=Hello%20Hakuna%20Potata!%20I%20have%20an%20inquiry%20regarding%20my%20Order%20${orderId}" class="btn-wa">
                Connect on WhatsApp (+880 1339656675)
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <strong>Hakuna Potata Artisan Bakery</strong><br />
            Bashundhara R/A, Block F, Dhaka, Bangladesh<br />
            Hotline: +880 1339656675 · Email: <a href="mailto:hakunapotatabakery@gmail.com">hakunapotatabakery@gmail.com</a><br /><br />
            <em>Every confection is handcrafted with European butter, Belgian chocolate, and pure passion.</em>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const tasks = [];

    // Send customer invoice if email is provided
    if (customerEmail && customerEmail.includes('@')) {
      tasks.push(
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'Hakuna Potata Artisan Bakery', email: senderEmail },
            to: [{ email: customerEmail, name: customerName }],
            replyTo: { email: bakeryEmail, name: 'Hakuna Potata Bakery' },
            subject: `🧾 Official Invoice & Order Confirmation #${orderId} - Hakuna Potata Bakery`,
            htmlContent: customerInvoiceHtml,
          }),
        }).then(async (res) => ({ type: 'customer', status: res.status, ok: res.ok, data: await res.json().catch(() => ({})) }))
      );
    }

    // Send bakery notification
    tasks.push(
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Hakuna Potata Studio', email: senderEmail },
          to: [{ email: bakeryEmail, name: 'Hakuna Potata Bakery' }],
          replyTo: customerEmail && customerEmail.includes('@') ? { email: customerEmail, name: customerName } : undefined,
          subject: `🍰 New Order #${orderId} - ${cakeSize} (${customerName})`,
          htmlContent: bakeryNotificationHtml,
        }),
      }).then(async (res) => ({ type: 'bakery', status: res.status, ok: res.ok, data: await res.json().catch(() => ({})) }))
    );

    const results = await Promise.all(tasks);
    const hasFailures = results.some((r) => !r.ok);

    return res.status(200).json({
      success: !hasFailures,
      orderId,
      results,
    });
  } catch (err) {
    console.error('Order email error:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
}

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

  const waUrl = `https://wa.me/8801339656675?text=Hello%20Hakuna%20Potata!%20I%20have%20an%20inquiry%20regarding%20my%20Order%20${orderId}`;

  // 1. Bakery Notification Email (Table-based, 100% email client compatible)
  const bakeryNotificationHtml = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>New Order #${orderId}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f7f6f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f7f6f2; padding: 24px 10px;">
          <tr>
            <td align="center">
              <table width="580" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e7e5e4;">
                <tr>
                  <td align="center" style="background-color: #0c0a09; padding: 28px 24px; color: #ffffff;">
                    <div style="font-size: 18px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #ffffff;">HAKUNA POTATA BAKERY</div>
                    <div style="font-size: 12px; color: #a8a29e; margin-top: 4px; font-family: monospace;">New Custom Cake Order #${orderId}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" border="0" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-size: 13px;">
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec; width: 40%;">Customer Name:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${customerName}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Phone:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${customerPhone}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Customer Email:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${customerEmail || 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Delivery Zone:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${deliveryZoneText}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Delivery Address:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${deliveryAddress}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Delivery Schedule:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${date} at ${time}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Cake Size:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${cakeSize} (${diameterSpec})</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Sponge Flavor:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${sponge}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Cream &amp; Filling:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${filling}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Color Palette:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${color}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Dietary:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${isEggless ? '100% Pure Eggless (+৳250)' : 'Standard'}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Custom Inscription:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; font-style: italic; border-bottom: 1px solid #f2f0ec;">"${inscription}"</td>
                      </tr>
                      ${referenceNotes ? `
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Design Notes:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${referenceNotes}</td>
                      </tr>` : ''}
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px solid #f2f0ec;">Special Instructions:</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px solid #f2f0ec;">${notes}</td>
                      </tr>
                    </table>

                    <table width="100%" border="0" cellpadding="14" cellspacing="0" style="margin-top: 20px; background-color: #0c0a09; color: #ffffff; border-radius: 10px;">
                      <tr>
                        <td align="left" style="color: #e7e5e4; font-size: 14px; font-weight: 700;">Total Payable</td>
                        <td align="right" style="color: #ffffff; font-size: 20px; font-weight: 800;">৳${totalPrice}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="background-color: #fafaf9; border-top: 1px solid #e7e5e4; padding: 16px; font-size: 11px; color: #a8a29e;">
                    Hakuna Potata Artisan Bakery · Automated Order Notification
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // 2. Customer Full Itemized Invoice HTML (Table-based, 100% email client compatible)
  const customerInvoiceHtml = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hakuna Potata Invoice #${orderId}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f7f6f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f7f6f2; padding: 24px 10px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
                
                <!-- Brand Header -->
                <tr>
                  <td align="center" style="background-color: #0c0a09; padding: 34px 24px; color: #ffffff;">
                    <div style="font-size: 22px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #ffffff;">HAKUNA POTATA</div>
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #a8a29e; margin-top: 4px;">Artisan Bakery &amp; Custom Cake Studio</div>
                    <div style="display: inline-block; margin-top: 14px; padding: 5px 16px; background-color: #292524; color: #fafaf9; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; font-family: monospace;">OFFICIAL INVOICE #${orderId}</div>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 28px 24px;">
                    <div style="font-size: 16px; font-weight: 700; color: #1c1917; margin-bottom: 6px;">Dear ${customerName},</div>
                    <div style="font-size: 13px; color: #78716c; line-height: 1.6; margin-bottom: 22px;">
                      Thank you for choosing Hakuna Potata! We have registered your custom cake commission. Below is your complete, itemized tax invoice and scheduled fulfillment details.
                    </div>

                    <!-- Order & Delivery Details Table -->
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #78716c; margin-bottom: 8px;">Order &amp; Delivery Details</div>
                    <table width="100%" border="0" cellpadding="8" cellspacing="0" style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; margin-bottom: 24px; font-size: 12px;">
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px dashed #e7e5e4; width: 38%;">Invoice Number</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; font-family: monospace; border-bottom: 1px dashed #e7e5e4;">#${orderId}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px dashed #e7e5e4;">Customer Name</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px dashed #e7e5e4;">${customerName}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px dashed #e7e5e4;">Contact Phone</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px dashed #e7e5e4;">${customerPhone}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px dashed #e7e5e4;">Customer Email</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px dashed #e7e5e4;">${customerEmail}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px dashed #e7e5e4;">Delivery Schedule</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px dashed #e7e5e4;">${date} at ${time}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500; border-bottom: 1px dashed #e7e5e4;">Fulfillment Region</td>
                        <td align="right" style="color: #1c1917; font-weight: 700; border-bottom: 1px dashed #e7e5e4;">${deliveryZoneText}</td>
                      </tr>
                      <tr>
                        <td align="left" style="color: #78716c; font-weight: 500;">Delivery Address</td>
                        <td align="right" style="color: #1c1917; font-weight: 700;">${deliveryAddress}</td>
                      </tr>
                    </table>

                    <!-- Itemized Breakdown Table -->
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #78716c; margin-bottom: 8px;">Itemized Order Breakdown</div>
                    <table width="100%" border="0" cellpadding="10" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
                      <thead>
                        <tr style="background-color: #f5f5f4; border-bottom: 1px solid #e7e5e4;">
                          <th align="left" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #57534e; padding: 10px 12px;">Description</th>
                          <th align="right" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #57534e; padding: 10px 12px; width: 30%;">Amount (BDT)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style="border-bottom: 1px solid #f5f5f4;">
                          <td align="left" style="padding: 12px; font-size: 13px; color: #1c1917;">
                            <div style="font-weight: 700; color: #1c1917;">${cakeSize} Custom Artisan Cake</div>
                            <div style="font-size: 11px; color: #78716c; margin-top: 2px;">Diameter: ${diameterSpec || 'Standard'} · Portions: ${servings || 'Party'}</div>
                            <div style="font-size: 11px; color: #78716c;">Sponge: ${sponge} · Cream/Filling: ${filling}</div>
                            <div style="font-size: 11px; color: #78716c;">Theme/Palette: ${color}</div>
                            ${inscription !== 'None' ? `<div style="font-size: 11px; color: #78716c; font-style: italic;">Inscription: "${inscription}"</div>` : ''}
                          </td>
                          <td align="right" style="padding: 12px; font-size: 13px; font-weight: 700; color: #1c1917;">
                            ৳${basePrice ? basePrice.toLocaleString() : '0'}
                          </td>
                        </tr>
                        ${isEggless ? `
                        <tr style="border-bottom: 1px solid #f5f5f4;">
                          <td align="left" style="padding: 12px; font-size: 13px; color: #1c1917;">
                            <div style="font-weight: 700; color: #1c1917;">100% Pure Eggless Customization</div>
                            <div style="font-size: 11px; color: #78716c; margin-top: 2px;">Dietary preparation fee</div>
                          </td>
                          <td align="right" style="padding: 12px; font-size: 13px; font-weight: 700; color: #1c1917;">
                            ৳${egglessFee}
                          </td>
                        </tr>
                        ` : ''}
                        <tr style="border-bottom: 1px solid #f5f5f4;">
                          <td align="left" style="padding: 12px; font-size: 13px; color: #1c1917;">
                            <div style="font-weight: 700; color: #1c1917;">Delivery &amp; Courier Service</div>
                            <div style="font-size: 11px; color: #78716c; margin-top: 2px;">${deliveryZoneText}</div>
                          </td>
                          <td align="right" style="padding: 12px; font-size: 13px; font-weight: 700; color: #1c1917;">
                            ৳${deliveryCost}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    ${notes && notes !== 'None' ? `
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #78716c; margin-bottom: 8px;">Special Instructions</div>
                    <table width="100%" border="0" cellpadding="10" cellspacing="0" style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 10px; margin-bottom: 20px;">
                      <tr>
                        <td style="font-size: 12px; color: #44403c; font-style: italic;">
                          "${notes}"
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    <!-- Financial Summary Box -->
                    <table width="100%" border="0" cellpadding="8" cellspacing="0" style="background-color: #0c0a09; color: #ffffff; border-radius: 14px; margin-top: 14px;">
                      <tr>
                        <td align="left" style="color: #d6d3d1; font-size: 12px; padding: 8px 16px;">Base Cake Subtotal:</td>
                        <td align="right" style="color: #ffffff; font-size: 12px; font-weight: 600; padding: 8px 16px;">৳${basePrice ? basePrice.toLocaleString() : '0'}</td>
                      </tr>
                      ${isEggless ? `
                      <tr>
                        <td align="left" style="color: #d6d3d1; font-size: 12px; padding: 4px 16px;">Eggless Customization:</td>
                        <td align="right" style="color: #ffffff; font-size: 12px; font-weight: 600; padding: 4px 16px;">৳${egglessFee}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td align="left" style="color: #d6d3d1; font-size: 12px; padding: 4px 16px;">Delivery &amp; Handling:</td>
                        <td align="right" style="color: #ffffff; font-size: 12px; font-weight: 600; padding: 4px 16px;">৳${deliveryCost}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 4px 16px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #292524; padding-top: 10px;">
                            <tr>
                              <td align="left" style="color: #ffffff; font-size: 15px; font-weight: 800; padding: 8px 0;">Total Payable:</td>
                              <td align="right" style="color: #ffffff; font-size: 20px; font-weight: 800; padding: 8px 0;">৳${totalPrice}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- WhatsApp Direct Confirmation Banner -->
                    <table width="100%" border="0" cellpadding="16" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; margin-top: 24px; text-align: center;">
                      <tr>
                        <td align="center">
                          <div style="font-size: 13px; font-weight: 700; color: #14532d; margin-bottom: 4px;">Need to verify or adjust your custom cake design?</div>
                          <div style="font-size: 12px; color: #166534; margin-bottom: 14px; line-height: 1.5;">
                            Our pastry team coordinates reference pictures, colors, and delivery timings directly via WhatsApp.
                          </div>
                          <table border="0" cellpadding="0" cellspacing="0" align="center">
                            <tr>
                              <td align="center" bgcolor="#16a34a" style="border-radius: 8px;">
                                <a href="${waUrl}" target="_blank" style="font-size: 12px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 10px 22px; display: inline-block; letter-spacing: 0.05em;">
                                  Connect on WhatsApp (+880 1339656675)
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="background-color: #fafaf9; border-top: 1px solid #e7e5e4; padding: 22px; font-size: 11px; color: #a8a29e; line-height: 1.6;">
                    <strong style="color: #44403c;">Hakuna Potata Artisan Bakery</strong><br />
                    Bashundhara R/A, Block F, Dhaka, Bangladesh<br />
                    Hotline: +880 1339656675 · Email: <a href="mailto:hakunapotatabakery@gmail.com" style="color: #44403c;">hakunapotatabakery@gmail.com</a><br />
                    <span style="font-style: italic; display: block; margin-top: 6px;">Handcrafted with European butter, Belgian chocolate, and pure passion.</span>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
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

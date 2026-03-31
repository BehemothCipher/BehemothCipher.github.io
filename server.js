require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://behemothlab.dev', 'http://localhost:5500', 'http://127.0.0.1:5500']
}));
app.use(express.json());

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'CipherBuilds server running' });
});

// Commission form submission
app.post('/commission', async (req, res) => {
  const { name, email, tier, message } = req.body;

  if (!name || !email || !tier) {
    return res.status(400).json({ error: 'Name, email, and tier are required.' });
  }

  try {
    // Auto-reply to client
    await transporter.sendMail({
      from: `"BehemothCipher | CipherBuilds" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your CipherBuilds Commission Request',
      html: `
        <div style="font-family:monospace;background:#0a0a14;color:#e0f0ff;padding:32px;border-radius:8px;max-width:560px">
          <div style="color:#00bfff;font-size:20px;font-weight:bold;margin-bottom:8px">CIPHERBUILDS</div>
          <div style="color:#7ab8cc;font-size:12px;margin-bottom:24px">behemothlab.dev</div>
          <p>Hey ${name},</p>
          <p>Thanks for reaching out about a commission! I've received your request for a <strong style="color:#00bfff">${tier}</strong> build.</p>
          <p>I'll review your project details and get back to you within 24 hours with next steps, including a contract for you to review before we get started.</p>
          <p>If you have any questions in the meantime, just reply to this email.</p>
          <br/>
          <p style="color:#00bfff">— BehemothCipher</p>
          <p style="color:#3a6a80;font-size:11px">contact@behemothlab.dev · github.com/BehemothCipher · behemothlab.dev</p>
          <hr style="border-color:#1a2a3a;margin:24px 0"/>
          <p style="color:#3a6a80;font-size:10px">50% deposit is non-refundable once development has begun. All builds include a contract.</p>
        </div>
      `
    });

    // Notify yourself
    await transporter.sendMail({
      from: `"CipherBuilds Server" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Commission Request — ${tier} — ${name}`,
      html: `
        <div style="font-family:monospace;padding:24px">
          <h2>New Commission Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Tier:</strong> ${tier}</p>
          <p><strong>Message:</strong></p>
          <p>${message || 'No message provided.'}</p>
          <hr/>
          <p style="color:#888">Client has been sent an acknowledgement email. Send them the contract when ready.</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Request received!' });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Regular contact form
app.post('/contact', async (req, res) => {
  const { name, email, topic, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    await transporter.sendMail({
      from: `"CipherBuilds Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `CipherBuilds — ${topic || 'General'} — from ${name}`,
      html: `
        <div style="font-family:monospace;padding:24px">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Topic:</strong> ${topic || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Message received!' });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`CipherBuilds server running on port ${PORT}`);
});

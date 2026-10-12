const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
        ]
    }
});

// Mobile logs mein QR text dekhne ke liye
client.on('qr', (qr) => {
    console.log('--- SCAN_THIS_CODE ---');
    console.log(qr);
    console.log('----------------------');
});

client.on('ready', () => {
    console.log('WhatsApp API Server Ready!');
});

app.post('/send', async (req, res) => {
    const { token, number, message } = req.body;
    
    if (token !== "KamaiKaPassword123") {
        return res.status(401).json({ status: false, error: 'Galat Password!' });
    }

    if (!number || !message) {
        return res.status(400).json({ status: false, error: 'Number aur message lazmi hain.' });
    }

    try {
        const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        await client.sendMessage(formattedNumber, message);
        res.json({ status: true, message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

app.get('/', (req, res) => { res.send('API running free 24/7!'); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    client.initialize();
    console.log(`Server connected to port ${PORT}`);
});
          

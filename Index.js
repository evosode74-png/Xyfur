const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function startXyfurBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session_xyfur');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const from = msg.key.remoteJid;
        const prefix = "."; // Kamu bisa ganti jadi ! atau #

        if (text === prefix + 'menu') {
            let menuText = `*───「 XYFUR BOT MENU 」───*

*🛠️ TOOLS MENU*
.bratt
.ssweb
.lacak (Fitur Lacak Desa kamu)

*📥 DOWNLOAD MENU*
.tiktok
.instagram
.ytmp4

*🏪 STORE MENU*
.payment
.prosess
.done

Ketik *${prefix}help* untuk bantuan.`;

            await sock.sendMessage(from, { text: menuText });
        }

        // Contoh Fitur Download (Logika Sederhana)
        if (text.startsWith(prefix + 'tiktok')) {
            await sock.sendMessage(from, { text: 'Sedang mengunduh video... Tunggu bentar ya!' });
        }
    });

    console.log("Sistem Render Siap! Cek Log untuk Scan QR.");
}

startXyfurBot();

const { default: makeWASocket, useMultiFileAuthState, MessageType } = require('@whiskeysockets/baileys');
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

        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const command = text.toLowerCase().split(" ")[0];
        const prefix = "."; 
        
        // --- [ CONFIG OWNER ] ---
        const ownerNumber = "6285251271515@s.whatsapp.net"; // Nomor kamu
        const isOwner = msg.key.participant === ownerNumber || from === ownerNumber;

        // --- [ ALL MENU LENGKAP ] ---
        if (command === prefix + 'menu') {
            let menu = `*───「 XYFUR AMNESIA V3 」───*
*Owner:* @6285251271515

*🛠️ TOOLS MENU*
${prefix}lacak (Tracking Desa)
${prefix}ssweb [url]
${prefix}hd (Upscale Foto)
${prefix}stiker (Buat Stiker)

*📥 DOWNLOAD MENU*
${prefix}tiktok [url]
${prefix}ig [url]
${prefix}ytmp4 [url]
${prefix}facebook [url]

*🏪 STORE MENU*
${prefix}listproduk
${prefix}payment
${prefix}proses
${prefix}done

*👥 GROUP MENU*
${prefix}hidetag [teks]
${prefix}kick @tag
${prefix}add 62xxx
${prefix}group [open/close]

*🛡️ ADDPOTECT MENU*
${prefix}antidelete (on/off)
${prefix}antilink (on/off)

*👤 OWNER MENU*
${prefix}self (Mode Pribadi)
${prefix}public (Mode Umum)
${prefix}broadcast [teks]
${prefix}setppbot (Ganti Foto Bot)

Ketik *${prefix}owner* untuk hubungi admin.`;
            
            await sock.sendMessage(from, { text: menu, mentions: [ownerNumber] });
        }

        // --- [ FITUR OWNER ] ---
        if (command === prefix + 'owner') {
            const vcard = 'BEGIN:VCARD\n' 
                + 'VERSION:3.0\n' 
                + 'FN:XyFur Owner\n' 
                + 'TEL;type=CELL;type=VOICE;waid=6285251271515:+62 852-5127-1515\n' 
                + 'END:VCARD';
            await sock.sendMessage(from, {
                contacts: { displayName: 'XyFur Owner', contacts: [{ vcard }] }
            });
        }

        if (command === prefix + 'broadcast' && isOwner) {
            const bcText = text.slice(11);
            await sock.sendMessage(from, { text: '📢 Mengirim Broadcast...' });
            // Logika kirim ke semua chat bisa ditambah di sini
        }

        // --- [ FITUR STORE ] ---
        if (command === prefix + 'payment') {
            let p = `*💳 METODE PEMBAYARAN*\n\n*Dana:* 085251271515\n*OVO:* 085251271515\n*QRIS:* (Kirim Gambar QRIS)`;
            await sock.sendMessage(from, { text: p });
        }
    });
}

startXyfurBot();

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { token, chatId, text, imageBase64 } = await req.json();

        if (!token || !chatId || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const tgUrl = `https://api.telegram.org/bot${token}`;

        if (imageBase64) {
            // Send Photo with Caption
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('caption', text);
            formData.append('parse_mode', 'HTML');

            // Convert base64 to Blob
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            formData.append('photo', blob, 'screenshot.jpg');

            const response = await fetch(`${tgUrl}/sendPhoto`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!data.ok) {
                throw new Error(data.description || 'Failed to send photo to Telegram');
            }

            return NextResponse.json({ success: true, data });
        } else {
            // Send Text only
            const response = await fetch(`${tgUrl}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'HTML',
                }),
            });

            const data = await response.json();
            if (!data.ok) {
                throw new Error(data.description || 'Failed to send message to Telegram');
            }

            return NextResponse.json({ success: true, data });
        }
    } catch (error: any) {
        console.error('Telegram API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

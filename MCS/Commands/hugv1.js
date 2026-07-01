"use strict";

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "hugv1",
    aliases: ["embrace"],
    version: "5.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: true,
    cooldown: 5,
    description: "Create Hug Banner",
    category: "love"
};

module.exports.onLoad = async function () {

    const canvasDir = path.join(__dirname, "B4D9L");

    if (!fs.existsSync(canvasDir))
        fs.mkdirSync(canvasDir, { recursive: true });

    const bgPath = path.join(canvasDir, "hugv1.png");

    if (!fs.existsSync(bgPath)) {

        const res = await axios.get(
            "https://i.ibb.co/3YN3T1r/q1y28eqblsr21.jpg",
            {
                responseType: "arraybuffer"
            }
        );

        fs.writeFileSync(bgPath, res.data);
    }

};

async function circle(imagePath) {

    const img = await jimp.read(imagePath);

    img.circle();

    return await img.getBufferAsync("image/png");

}

async function makeImage({ one, two }) {

    const canvasDir = path.join(__dirname, "B4D9L");

    const bg = await jimp.read(
        path.join(canvasDir, "hugv1.png")
    );

    const avatar1 = path.join(canvasDir, `avatar_${one}.png`);
    const avatar2 = path.join(canvasDir, `avatar_${two}.png`);

    const output = path.join(
        canvasDir,
        `hug_${one}_${two}.png`
    );

    // Download Sender Avatar
    const senderAvatar = await axios.get(
        `https://graph.facebook.com/${one}/picture?width=512&height=512`,
        {
            responseType: "arraybuffer"
        }
    );

    fs.writeFileSync(
        avatar1,
        Buffer.from(senderAvatar.data)
    );

    // Download Target Avatar
    const targetAvatar = await axios.get(
        `https://graph.facebook.com/${two}/picture?width=512&height=512`,
        {
            responseType: "arraybuffer"
        }
    );

    fs.writeFileSync(
        avatar2,
        Buffer.from(targetAvatar.data)
    );

    const circle1 = await jimp.read(
        await circle(avatar1)
    );

    const circle2 = await jimp.read(
        await circle(avatar2)
    );

    bg
        .composite(
            circle1.resize(150, 150),
            320,
            100
        )
        .composite(
            circle2.resize(130, 130),
            280,
            280
        );

    const buffer = await bg.getBufferAsync("image/png");

    fs.writeFileSync(output, buffer);

    fs.unlinkSync(avatar1);
    fs.unlinkSync(avatar2);

    return output;

}

module.exports.onStart = async function (api, event) {

    try {

        const { threadID, messageID, senderID } = event;

        const mention = Object.keys(event.mentions);

        if (!mention.length) {

            return api.sendMessage(
                "🤗 | Please mention someone to hug.",
                threadID,
                messageID
            );

        }

        const targetID = mention[0];

        const image = await makeImage({
            one: senderID,
            two: targetID
        });

        const captions = [

            "🤗 Sending you a warm hug! ❤️",
            "💞 A hug can say more than words.",
            "🥰 Here's a lovely hug for you!",
            "💖 Hug delivered successfully!",
            "🌸 Spread love with a warm hug.",
            "🫂 A hug makes everything better.",
            "💝 Virtual Hug Incoming...",
            "❤️ Happiness begins with a hug."

        ];

        const body =
            captions[Math.floor(Math.random() * captions.length)];

        api.sendMessage(
            {
                body:
`╭━━━━━━━━━━━━━━━━━━╮
┃ 🤗 HUG SYSTEM
╰━━━━━━━━━━━━━━━━━━╯

${body}

━━━━━━━━━━━━━━━━━━
🤖 BADOL-BOT-V5`,
                attachment: fs.createReadStream(image)
            },
            threadID,
            () => {
                if (fs.existsSync(image))
                    fs.unlinkSync(image);
            },
            messageID
        );

    } catch (err) {

        console.log("[HUG ERROR]", err);

        return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━╮
┃ ❌ HUG ERROR
╰━━━━━━━━━━━━━━━━━━╯

${err.message}

━━━━━━━━━━━━━━━━━━
🤖 BADOL-BOT-V5`,
            event.threadID,
            event.messageID
        );

    }

};

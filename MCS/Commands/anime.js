const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "anime",
    aliases: ["ani"],
    version: "2.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    prefix: true,
    cooldown: 5,
    description: "Send random anime video",
    category: "media"
};

module.exports.onLoad = async function () {
    console.log("» [BADOL-BOT] Anime module loaded successfully.");
};

module.exports.onStart = async function (api, event) {
    try {
        const { threadID, messageID } = event;

        const videos = [
            "https://drive.google.com/uc?id=18-qJqj0yJOe1DnqtKCtt2BA6aL4Lsu1V",
            "https://drive.google.com/uc?id=18_dfqfqJ7Izv_V39udjqHIhL9VNXJ9g8",
            "https://drive.google.com/uc?id=1AtMec3fO0qsocLBjbbAealc18pZeC8-3",
            "https://drive.google.com/uc?id=194QHUiobsj_4gWEnC1vJxQUMZjDz1J97",
            "https://drive.google.com/uc?id=18f4u2I-yIu6k1oZwurqJqfUlX9m13Yfi"
        ];

        const captions = [
            "🎌 Random Anime Video For You ❤️",
            "✨ Enjoy Your Anime Moment!",
            "💖 BADOL-BOT-V5 Anime Collection",
            "🔥 Best Anime Clip Just For You",
            "🌸 Have Fun Watching!"
        ];

        const url = videos[Math.floor(Math.random() * videos.length)];
        const caption = captions[Math.floor(Math.random() * captions.length)];

        const cacheDir = path.join(__dirname, "cache");
        const filePath = path.join(cacheDir, `anime_${Date.now()}.mp4`);

        await fs.ensureDir(cacheDir);

        const response = await axios({
            url,
            method: "GET",
            responseType: "stream"
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", async () => {
            await api.sendMessage({
                body:
`╭─❍
│ 🎌 BADOL-BOT-V5
│ 📹 Random Anime Video
╰─────────────

${caption}`,
                attachment: fs.createReadStream(filePath)
            }, threadID, messageID);

            fs.unlink(filePath, () => {});
        });

        writer.on("error", () => {
            api.sendMessage("❌ Failed to download anime video.", threadID, messageID);
        });

    } catch (err) {
        console.log(err);
        api.sendMessage("❌ Unable to fetch anime video.", event.threadID, event.messageID);
    }
};

module.exports.onChat = async function () {};
module.exports.onEvent = async function () {};
module.exports.onReply = async function () {};
module.exports.onReaction = async function () {};

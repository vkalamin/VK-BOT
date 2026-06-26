const axios = require("axios");
‎const fs = require("fs");
‎const path = require("path");
‎
‎module.exports = {
‎  config: {
‎    name: "islam",
‎    aliases: ["islamic"],
‎    credit: "MOHAMMAD BADOL",
‎    prefix: true,
‎    role: 0,
‎    cooldown: 5,
‎    description: "Random Islamic Video",
‎    category: "media"
‎  },
‎
‎  onStart: async (api, event) => {
‎
‎    const videos = [
‎      "https://drive.google.com/uc?id=14emH_6vF3fuJe2vmeC52e575TppboHne",
‎    "https://drive.google.com/uc?id=15APJbSuGLY7zCiZsAgU7HjCJeinYDX9K",
‎    "https://drive.google.com/uc?id=15ImMIXM_mqPM8hXpQNPLTGCrm9sh0RPS",
‎    "https://drive.google.com/uc?id=14qUnMm3J3cUqImDDy4ehRjDiv_NeRpMo",
‎    "https://drive.google.com/uc?id=15ZqanDuEYrC-lHSsiIYAjWagr1h8yZpP",
‎    "https://drive.google.com/uc?id=155rlKywUHP3xzgJkQ1ztxXpKnDxXtXlb",
‎    "https://drive.google.com/uc?id=156MaTKck-_ureBfj7NI-iU7_rGut-ssD",
‎    "https://drive.google.com/uc?id=15l4gxljfoe9-WvQKzffjambLC5Tt1YNd",
‎    "https://drive.google.com/uc?id=15fauLjjElJ0loxajhUvDeaKTqW4YdskK",
‎    "https://drive.google.com/uc?id=16IBAHr7AlKM1RR4hiTBuvAn5x27ed6j4",
‎    "https://drive.google.com/uc?id=15amvNN6WLIKwg17ufgFhs7EqI0EXNxy5",
‎    "https://drive.google.com/uc?id=15OS5gFi2QGZm5TTStIn6iD3YRUNHw1Zm",
‎    "https://drive.google.com/uc?id=168qMjWaEyObyBgJrilyTb4vOcvgynQAD",
‎    "https://drive.google.com/uc?id=15FFHINVpAbr4ykjkhk1_vQ5uDQakTcpy",
‎    "https://drive.google.com/uc?id=14j501R3TheTH3YLInLZlLTU-oXVvjegw",
‎    "https://drive.google.com/uc?id=15UmCBW1ddt6Kpt9xytqPpXiJip-05bDG",
‎    "https://drive.google.com/uc?id=14e0lCDG6vwzGi8apiDcm38Wov911501y",
‎    "https://drive.google.com/uc?id=15Cbl-YGajKcV0QMp6bDtRT4dI-K6lWR0",
‎    "https://drive.google.com/uc?id=15hJ9St2amhdLnowAvuDn0BicgZ5Aw0rW",
‎    "https://drive.google.com/uc?id=15QIjrXblGNjf5b3J6dRQ4XMSV-_j7soB",
‎    "https://drive.google.com/uc?id=15tgfSnX-ICfO8V5T6vXbb_AwYkfl_EYX"
‎    ];
‎
‎    const url = videos[Math.floor(Math.random() * videos.length)];
‎
‎    const cacheDir = path.join(__dirname, "cache");
‎
‎    if (!fs.existsSync(cacheDir))
‎      fs.mkdirSync(cacheDir);
‎
‎    const filePath = path.join(cacheDir, "islam.mp4");
‎
‎    try {
‎
‎      const res = await axios({
‎        url,
‎        method: "GET",
‎        responseType: "stream"
‎      });
‎
‎      const writer = fs.createWriteStream(filePath);
‎
‎      res.data.pipe(writer);
‎
‎      writer.on("finish", () => {
‎
‎        api.sendMessage({
‎          body:
‎`🕌 আসসালামু আলাইকুম 🕋
‎
‎🌸 আপনার জন্য একটি ইসলামিক ভিডিও।
‎
‎❤️ Powered By BADOL-BOT-V5`,
‎          attachment: fs.createReadStream(filePath)
‎        },
‎        event.threadID,
‎        () => {
‎          if (fs.existsSync(filePath))
‎            fs.unlinkSync(filePath);
‎        },
‎        event.messageID);
‎
‎      });
‎
‎      writer.on("error", () => {
‎        api.sendMessage("❌ ভিডিও ডাউনলোড করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
‎      });
‎
‎    } catch (e) {
‎      api.sendMessage("❌ ভিডিও লোড করা যাচ্ছে না।", event.threadID, event.messageID);
‎      console.log(e);
‎    }
‎  }
‎};

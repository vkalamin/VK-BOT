const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "hack",
  aliases: ["cyberhack"],
  version: "4.0.0",
  credit: "MOHAMMAD BADOL",
  role: 0,
  prefix: true,
  cooldown: 5,
  description: "Advanced Fake Hacking Simulation",
  category: "fun"
};

module.exports.onStart = async function (api, event, args) {
  try {

    const {
      threadID,
      messageID,
      senderID,
      mentions,
      type,
      messageReply
    } = event;

    let targetID = senderID;

    if (mentions && Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    }

    if (type === "message_reply" && messageReply) {
      targetID = messageReply.senderID;
    }

    // আপনার ছবির Direct Link
    const IMAGE_URL = "https://drive.google.com/uc?export=download&id=1DxAIX1MGBjeJDhbjK0QbNeGxUiEn33yu";

    // Victim Information

    let victimName = "Unknown";
    let victimGender = "Unknown";
    let profileLink = `https://facebook.com/${targetID}`;

    try {

      const userInfo = await api.getUserInfo(targetID);

      if (userInfo && userInfo[targetID]) {

        victimName = userInfo[targetID].name || "Unknown";

        if (userInfo[targetID].gender == 2)
          victimGender = "Male";
        else if (userInfo[targetID].gender == 1)
          victimGender = "Female";

      }

    } catch (e) {
      console.log(e);
    }

    const steps = [
      "📡 Initializing SAEEM Cyber Engine...",
      "🌐 Connecting Secure Server...",
      "👤 Detecting Target...",
      "📲 Reading Facebook Profile...",
      "📂 Accessing Gallery...",
      "💬 Reading Messenger...",
      "📞 Syncing Contacts...",
      "🌍 Tracking Location...",
      "🔐 Bypassing Security...",
      "📡 Uploading Report...",
      "⚡ Finalizing...",
      "✅ Simulation Completed."
    ];

    let loadingMessage;

    api.sendMessage(steps[0], threadID, async (err, info) => {

      if (err) return;

      loadingMessage = info;

      for (let i = 1; i < steps.length; i++) {

        await new Promise(resolve => setTimeout(resolve, 1500));

        try {

          await api.editMessage(
            `${steps[i]}

██████████ ${Math.floor(((i + 1) / steps.length) * 100)}%`,
            loadingMessage.messageID
          );

        } catch (e) {}

      }

      await new Promise(resolve => setTimeout(resolve, 1200));

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const imagePath = path.join(
        cacheDir,
        `hack_${Date.now()}.jpg`
      );

      try {

        const response = await axios({
          url: IMAGE_URL,
          method: "GET",
          responseType: "stream"
        });

        const writer = fs.createWriteStream(imagePath);

        response.data.pipe(writer);

        writer.on("finish", async () => {

          try {
            await api.unsendMessage(loadingMessage.messageID);
          } catch (e) {}

          const result = `
💀 𝐒𝐀𝐄𝐄𝐌 𝐂𝐘𝐁𝐄𝐑 𝐄𝐍𝐆𝐈𝐍𝐄 💀
━━━━━━━━━━━━━━━━━━━━━

👤 ‎𝐍𝐚𝐦𝐞 : ${victimName}
🆔 𝐔𝐈𝐃 : ${targetID}
🚻 𝐆𝐞𝐧𝐝𝐞𝐫 : ${victimGender}
🔗 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐋𝐢𝐧𝐤 :
${profileLink}

━━━━━━━━━━━━━━━━━━━━━

🛰️ 𝐂𝐄𝐍𝐓𝐑𝐀𝐋 𝐂𝐋𝐎𝐔𝐃 🧚 𝐇𝐎𝐒𝐓 𝐒𝐀𝐄𝐄𝐌-𝐅𝐑𝐀𝐌𝐄 ✅ 𝐒𝐄𝐑𝐕𝐄𝐑

━━━━━━━━━━━━━━━━━━━━━

📂 𝐆𝐚𝐥𝐥𝐞𝐫𝐲 𝐒𝐜𝐚𝐧 ✅
💬 𝐌𝐞𝐬𝐬𝐞𝐧𝐠𝐞𝐫 𝐒𝐜𝐚𝐧 ✅
📞 𝐂𝐨𝐧𝐭𝐚𝐜𝐭𝐬 𝐒𝐜𝐚𝐧 ✅
📸 𝐏𝐡𝐨𝐭𝐨𝐬 𝐒𝐜𝐚𝐧 ✅
🌍 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧 𝐒𝐜𝐚𝐧 ✅
📡 𝐈𝐏 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 𝐒𝐜𝐚𝐧 ✅
🔐 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲 𝐒𝐜𝐚𝐧 ✅
☁ 𝐂𝐥𝐨𝐮𝐝 𝐔𝐩𝐥𝐨𝐚𝐝 ✅
⚡ 𝐒𝐞𝐬𝐬𝐢𝐨𝐧 𝐒𝐲𝐧𝐜 ✅
🛰 𝐃𝐞𝐯𝐢𝐜𝐞 𝐀𝐧𝐚𝐥𝐲𝐬𝐢𝐬 ✅

━━━━━━━━━━━━━━━━━━━━━

‎⚠️ [𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓 𝐍𝐎𝐓𝐈𝐂𝐄]
‎𝐀𝐥𝐥 𝐦𝐞𝐭𝐚𝐝𝐚𝐭𝐚 𝐚𝐧𝐝 𝐬𝐲𝐬𝐭𝐞𝐦 𝐝𝐮𝐦𝐩 𝐟𝐢𝐥𝐞𝐬 𝐨𝐟 𝐭𝐡𝐢𝐬 𝐚𝐜𝐜𝐨𝐮𝐧𝐭 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫𝐫𝐞𝐝 𝐭𝐨 𝐬𝐚𝐞𝐞𝐦 𝐬𝐡𝐞𝐢𝐤𝐡 𝐬𝐞𝐜𝐮𝐫𝐞𝐝 𝐡𝐨𝐬𝐭𝐢𝐧𝐠 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.

‎🛑 [𝐖𝐀𝐑𝐍𝐈𝐍𝐆] অ্যাকাউন্টটি বর্তমানে ছাইম বসের স্কুইড সার্ভার 🖇️ এ রয়েছে। পরবর্তী ১০ মিনিটের মধ্যে ছাইম বসকে 😹একটা Gf অথবা তোমার গার্লফ্রেন্ড ☺️ ট্রিট না দিলে, 🫣সমস্ত গোপন চ্যাট হিস্ট্রি গ্রুপে লিক করে দেওয়া হবে! 😉

━━━━━━━━━━━━━━━━━━━━━
‎👤 𝐂𝐑𝐄𝐃𝐈𝐓 𝐁𝐘 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓`;

          api.sendMessage(
            {
              body: result,
              attachment: fs.createReadStream(imagePath)
            },
            threadID,
            () => {
              try {
                if (fs.existsSync(imagePath))
                  fs.unlinkSync(imagePath);
              } catch (e) {}
            },
            messageID
          );

        });

        writer.on("error", () => {
          api.sendMessage(
            "❌ Image Download Failed!",
            threadID,
            messageID
          );
        });

      } catch (err) {

        console.log(err);

        api.sendMessage(
          "❌ Failed To Load Image!",
          threadID,
          messageID
        );

      }

    });

  } catch (error) {

    console.error(error);

    api.sendMessage(
      `❌ SYSTEM ERROR\n\n${error.message}`,
      event.threadID,
      event.messageID
    );

  }

};

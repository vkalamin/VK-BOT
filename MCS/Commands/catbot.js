const axios = require("axios");

const baseApiUrl = async () => {
  try {
    const base = await axios.get(
      "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
    );
    return base.data.api;
  } catch (e) {
    return "https://api.dipto.fun";
  }
};

module.exports = {
  config: {
    name: "catbot",
    version: "7.0.0",
    credit: "MOHAMMAD BADOL",
    role: 0,
    description: "Better than all sim simi with mention reply",
    prefix: true,
    aliases: ["baby", "sim"],
    cooldown: 0
  },

  // prefix command
  onStart: async function ({ api, event, args }) {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();

    if (!args[0]) {
      return api.sendMessage(
        "Bolo baby, type 'baby help' for info.",
        event.threadID,
        event.messageID
      );
    }

    try {
      const res = await axios.get(
        `${link}?text=${encodeURIComponent(dipto)}&senderID=${event.senderID}&font=1`
      );
      return api.sendMessage(res.data.reply, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage("Error: " + e.message, event.threadID, event.messageID);
    }
  },

  // no-prefix chat reply
  onChat: async function ({ api, event, usersData }) {
    try {
      if (!event.body) return;

      const body = event.body.trim();
      const lowerBody = body.toLowerCase();

      // যেসব keyword বললে bot reply দিবে
      const keywords = ["baby", "bby", "bot", "বট"];

      // message startsWith keyword কিনা
      const matchedKeyword = keywords.find(k => lowerBody.startsWith(k));
      if (!matchedKeyword) return;

      // keyword এর পরের text
      const arr = body.slice(matchedKeyword.length).trim();

      // user info
      const senderID = event.senderID;
      const userName = await usersData.getName(senderID) || "Baby";

      // mention format
      const mentionTag = `@${userName}`;

      // যদি শুধু Bot/Baby বলে, তাহলে random romantic reply দিবে + mention
      if (!arr) {
        const msgs = [
          "এই যে {name}, এত ডাকাডাকি কেন গো? 😘💞",
          "হুম {name}, শুনতেছি... বলো কী চাই? 😼💕",
          "উফফ {name}, এভাবে ডাকলে তো প্রেমে পড়ে যাবো 😹💘",
          "এই যে জান {name}, শান্ত হও... আমি তো আছিই 😚",
          "বলো সোনা {name}, তোমার জন্য কী করতে পারি? 🥰",
          "ওইইই {name}, এত পিং দিস না... হার্টবিট বেড়ে যায় 😵‍💫💘",
          "এই যে ডার্লিং {name}, কি লাগবে তোমার? 🙈💕",
          "হুম {name}, ভালোবাসা দিবা নাকি কাজ দিবা? 😹💞"
        ];

        const randomMsg = msgs[Math.floor(Math.random() * msgs.length)]
          .replace("{name}", mentionTag);

        return api.sendMessage(
          {
            body: randomMsg,
            mentions: [
              {
                tag: mentionTag,
                id: senderID
              }
            ]
          },
          event.threadID,
          event.messageID
        );
      }

      // যদি keyword এর পরে text থাকে → API reply
      try {
        const link = await baseApiUrl();
        const res = await axios.get(
          `${link}/baby?text=${encodeURIComponent(arr)}&senderID=${senderID}&font=1`
        );

        return api.sendMessage(
          {
            body: `${mentionTag} ${res.data.reply}`,
            mentions: [
              {
                tag: mentionTag,
                id: senderID
              }
            ]
          },
          event.threadID,
          event.messageID
        );
      } catch (e) {
        console.error("Catbot Error: " + e.message);
      }
    } catch (err) {
      console.error("onChat error:", err);
    }
  },

  // bot reply message-এ reply করলে আবার উত্তর দিবে
  onReply: async function ({ api, event }) {
    try {
      if (!event.body || !event.messageReply) return;

      // শুধু বটের নিজের message-এ reply করলে কাজ করবে
      if (event.messageReply.senderID != api.getCurrentUserID()) return;

      const senderID = event.senderID;
      const reply = event.body.toLowerCase();
      const link = await baseApiUrl();

      const res = await axios.get(
        `${link}/baby?text=${encodeURIComponent(reply)}&senderID=${senderID}&font=1`
      );

      return api.sendMessage(res.data.reply, event.threadID, event.messageID);
    } catch (err) {
      return api.sendMessage("Error: " + err.message, event.threadID, event.messageID);
    }
  }
};

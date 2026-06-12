const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "approve",
        version: "3.1.2",
        credit: "MOHAMMAD BADOL",
        role: 1,
        description: "Approve pending threads permanent + auto dynamic sync",
        prefix: true,
        aliases: ["apv"],
        cooldown: 5
    },

    onStart: async (api, event, args) => {
        const configPath = path.join(__dirname, "../../config.json");
        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

        // 🔥 /approve scan
        if (args[0]?.toLowerCase() === "scan") {
            const waitMsg = await api.sendMessage("🔍 সব গ্রুপ স্ক্যান করতেছি...", event.threadID);

            try {
                const threads = await api.getThreadList(100, null, ["INBOX"]);
                const groups = threads.filter(t => t.isGroup);

                let addedCount = 0;

                for (const group of groups) {
                    const isApproved = config.APPROVAL_SYSTEM.APPROVED_THREADS.includes(group.threadID);
                    const isPending = config.APPROVAL_SYSTEM.PENDING_THREADS.some(t => t.id === group.threadID);

                    if (!isApproved && !isPending) {
                        config.APPROVAL_SYSTEM.PENDING_THREADS.push({
                            id: group.threadID,
                            name: group.name || "Unnamed Group"
                        });
                        addedCount++;
                    }
                }

                // সিঙ্ক্রোনাস রাইট নিশ্চিত করা হয়েছে যাতে কোনো ডেটা লস না হয়
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf-8");
                if (typeof global.reloadConfig === "function") global.reloadConfig();

                await api.deleteMessage(waitMsg.messageID);
                return api.sendMessage(
                    `━━━━━━━━━━━━━━━━━━━━━━\n ✅ SCAN COMPLETE \n━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `🔍 Total Groups: ${groups.length}\n` +
                    `✨ New Pending Added: ${addedCount}\n` +
                    `📋 Total Pending: ${config.APPROVAL_SYSTEM.PENDING_THREADS.length}\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━\n👉 /approve লিখে লিস্ট দেখো\n━━━━━━━━━━━━━━━━━━━━━━`,
                    event.threadID
                );
            } catch (e) {
                return api.sendMessage(`❌ Scan Error: ${e.message}`, event.threadID);
            }
        }

        // 🔥 নরমাল approve লিস্ট
        if (!config.APPROVAL_SYSTEM.PENDING_THREADS || config.APPROVAL_SYSTEM.PENDING_THREADS.length === 0) {
            return api.sendMessage(
                "━━━━━━━━━━━━━━━━━━━━━━\n ✅ NO PENDING REQUESTS \n━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "There are no groups currently waiting for approval.\n\n" +
                "💡 পুরানো গ্রুপ চেক করতে: /approve scan\n" +
                "━━━━━━━━━━━━━━━━━━━━━━",
                event.threadID
            );
        }

        let msg = "━━━━━━━━━━━━━━━━━━━━━━\n 📋 PENDING GROUPS \n━━━━━━━━━━━━━━━━━━━━━━\n\n";
        config.APPROVAL_SYSTEM.PENDING_THREADS.forEach((group, index) => {
            msg += `✨ ${index + 1}. ${group.name}\n`;
        });
        msg += "\n━━━━━━━━━━━━━━━━━━━━━━\n👉 Reply with the number to approve this group.\n💡 পুরানো গ্রুপ এড করতে: /approve scan\n━━━━━━━━━━━━━━━━━━━━━━";

        const info = await api.sendMessage(msg, event.threadID);
        global.msgCache.set(info.messageID, { commandName: "approve" });
    },

    onReply: async (api, event, cache) => {
        const configPath = path.join(__dirname, "../../config.json");
        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        const index = parseInt(event.body) - 1;

        if (isNaN(index) || index < 0 || index >= config.APPROVAL_SYSTEM.PENDING_THREADS.length) {
            return api.sendMessage("❌ Invalid number! Please provide a valid index.", event.threadID);
        }

        const targetGroup = config.APPROVAL_SYSTEM.PENDING_THREADS[index];
        const ownerName = config.OWNER_LOCK.NAME;

        // ডাবল চেক প্রোটেকশন: গ্রুপটি অলরেডি লিস্টে থাকলে আর পুশ করবে না
        if (!config.APPROVAL_SYSTEM.APPROVED_THREADS.includes(targetGroup.id)) {
            config.APPROVAL_SYSTEM.APPROVED_THREADS.push(targetGroup.id);
        }
        
        config.APPROVAL_SYSTEM.PENDING_THREADS.splice(index, 1);
        
        // সিঙ্ক্রোনাসলি ফাইলে সেভ এবং ইনস্ট্যান্ট গ্লোবাল ক্যাশ রিফ্রেশ
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf-8");
        if (typeof global.reloadConfig === "function") global.reloadConfig();

        // 🔥 Google Drive ছবি লিঙ্ক
        const driveFileId = "1ITONZqIZdgshuwVC1Sgk1KservMD9lMT";
        const driveDownloadUrl = `https://drive.google.com/uc?export=download&id=${driveFileId}`;

        try {
            const imgPath = path.join(__dirname, `../../temp_approve_${Date.now()}.jpg`);
            const imgRes = await axios.get(driveDownloadUrl, { responseType: "arraybuffer", timeout: 15000 });
            fs.writeFileSync(imgPath, Buffer.from(imgRes.data, "binary"));

            const approvalMsg =
`━━━━━━━━━━━━━━━━━━━━━━
   ✅ GROUP APPROVED
━━━━━━━━━━━━━━━━━━━━━━

🎉 Congratulations!
Your group has been successfully approved.

👑 Approved By: ${ownerName}
📅 Date: ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}
🤖 Bot: ${config.BOT_INFO.NAME}

━━━━━━━━━━━━━━━━━━━━━━
✨ All bot features are now unlocked!
💬 Type ${config.BOT_INFO.PREFIX}help to see commands
🔥 Enjoy using BADOL-BOT V5
━━━━━━━━━━━━━━━━━━━━━━`;

            await api.sendMessage({
                body: approvalMsg,
                attachment: fs.createReadStream(imgPath)
            }, targetGroup.id);

            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

        } catch (e) {
            // ছবি ডাউনলোডে বা পাঠাতে সমস্যা হলে ব্যাকআপ হিসেবে শুধু টেক্সট মেসেজ যাবে
            await api.sendMessage(
                `━━━━━━━━━━━━━━━━━━━━━━\n ✅ GROUP APPROVED \n━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `🎉 Congratulations! Your group has been approved by ${ownerName}.\n` +
                `✨ All features unlocked! Type ${config.BOT_INFO.PREFIX}help\n` +
                `━━━━━━━━━━━━━━━━━━━━━━`,
                targetGroup.id
            );
            console.error("[APPROVE] Image send failed:", e.message);
        }

        // ওনার/এডমিনকে কনফার্মেশন মেসেজ
        api.sendMessage(
            `━━━━━━━━━━━━━━━━━━━━━━\n ✅ GROUP APPROVED \n━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `Successfully approved: ${targetGroup.name}\n` +
            `📨 Approval message sent with custom photo\n` +
            `━━━━━━━━━━━━━━━━━━━━━━`,
            event.threadID
        );
    }
};

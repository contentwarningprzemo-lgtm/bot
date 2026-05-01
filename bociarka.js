const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const CONFIG = {
    host: "SpiderFFA.aternos.me",
    port: 29582,
    version: "1.21.11",

    password: "SpiderBot123",
    controlPassword: "ATERNOS",

    skinName: "Marlowww",

    targetPlayer: "qwdqwxx",

    BOT_COUNT: 2,
    botDelay: 5000,

    reconnectDelay: 30000,
    loginDelay: 4000
};

function randomName() {
    const names = ["Alex","Steve","Kuba","Oskar","Mati","Leo","Tom","Dark","Pro","Ultra"];
    return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 9999);
}

function log(msg) {
    console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

function createBot(id) {
    const username = randomName();

    const bot = mineflayer.createBot({
        host: CONFIG.host,
        port: CONFIG.port,
        username,
        version: CONFIG.version,
        auth: 'offline'
    });

    bot.loadPlugin(pathfinder);

    let mcData;
    let move;
    let loggedIn = false;

    // =====================
    // 🔥 SKIN SYSTEM
    // =====================
    function setSkin() {
        setTimeout(() => {
            log(`🎭 ${username} próbuje ustawić skin`);

            bot.chat(`/skin set ${CONFIG.skinName}`);

            setTimeout(() => {
                bot.chat(`/skin ${CONFIG.skinName}`);
            }, 2000);

            setTimeout(() => {
                bot.chat(`/skins set ${CONFIG.skinName}`);
            }, 4000);

        }, 5000);
    }

    // =====================
    // 👣 FOLLOW SYSTEM
    // =====================
    function startFollow() {
        setInterval(() => {
            const player = bot.players[CONFIG.targetPlayer];
            if (!player || !player.entity) return;

            const pos = player.entity.position;

            bot.pathfinder.setMovements(move);
            bot.pathfinder.setGoal(
                new goals.GoalNear(pos.x, pos.y, pos.z, 1)
            );
        }, 2000);
    }

    bot.once('spawn', () => {
        log(`✅ ${username} wszedł`);

        mcData = require('minecraft-data')(bot.version);
        move = new Movements(bot, mcData);

        setTimeout(() => {
            bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`);

            setTimeout(() => {
                bot.chat(`/login ${CONFIG.password}`);

                loggedIn = true;

                setTimeout(() => {
                    setSkin();
                    startFollow();
                }, 3000);

            }, 2000);

        }, CONFIG.loginDelay);
    });

    // =====================
    // 💬 MSG CONTROL
    // =====================
    bot.on('message', (msg) => {
        const text = msg.toString();

        if (text.includes("-> me]")) {
            if (text.toLowerCase().includes(CONFIG.controlPassword.toLowerCase())) {
                try {
                    const parts = text.split("]");
                    let cmd = parts[1].replace(/ATERNOS/i, "").trim();

                    if (cmd) {
                        log(`🎮 ${username} wykonuje: ${cmd}`);
                        bot.chat(cmd);
                    }
                } catch {}
            }
        }
    });

    bot.on('kicked', (r) => log(`KICK ${username}: ${r}`));

    bot.on('end', () => {
        setTimeout(() => createBot(id), CONFIG.reconnectDelay);
    });

    bot.on('error', (e) => log(e.message));
}

// =====================
// 🚀 START
// =====================
log("=== START FULL BOT SYSTEM ===");

for (let i = 0; i < CONFIG.BOT_COUNT; i++) {
    setTimeout(() => createBot(i), i * CONFIG.botDelay);
}

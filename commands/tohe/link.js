const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const types = JSON.parse(readFileSync('./roleTypes.json'));
const api = require('../../apiRequests.js');

function checkRole(member) {
    for (const categoryKey in types) {
        const category = types[categoryKey];
        for (const roleKey in category) {
            const hasRole = member.roles.cache.has(category[roleKey].roleID);
            if (hasRole) return [category[roleKey], roleKey];
        }
    }
}

function checkCode(code) {
    if (code.substring(code.length - 5, code.length - 4) !== "#") return false;
    if (!code.substring(code.length - 4, code.length).match(/^[0-9]+$/)) return false;
    return true;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your Discord to your Among Us Friend Code')
        .addStringOption(option => option.setName('friendcode').setDescription('Your Among Us Friend Code').setRequired(true)),
    async execute(interaction) {
        const codeInput = interaction.options.getString('friendcode');
        const discordId = interaction.user.id;
        const discordName = interaction.user.username;
        const isSponsor = interaction.member.roles.cache.has('1161429535020040282');
        let upAccess = 0;
        let devAccess = 0;
        let colorAccess = 0;
        let debugAccess = 0;
        let overhead_tag = null;
        let color = null;

        console.log(`-----------------------\nlinkcmd: Received by ${discordId}`);

        const role = checkRole(interaction.member);
        if (!role) {
            let noRoleEmbed = new EmbedBuilder()
                .setTitle("Unable to Link Account")
                .setDescription("You are not eligible to link your account. If you believe this is in error, please contact a developer.")
                .addFields(
                    {
                        name: "Want to become a Sponsor and get access to Alpha builds?",
                        value: "Consider Purchasing a Package [Here](https://weareten.ca/tohe/) for as little as __**$5 a month**__! Alpha Builds are unstable but include lots of new features. Updated 2-3 times a **week**."
                    },
                )
                .setColor("#FF0000")
                .setTimestamp()
                .setFooter({ text: "Can't donate? No worries! We release full STABLE builds every month!" });
            console.log(`linkcmd: Command Cancelled ${discordName} does not have a sponsor role\n-----------------------`);
            return interaction.reply({ embeds: [noRoleEmbed], ephemeral: true });
        }

        const userInfo = await api.getUserByID(discordId);

        if (userInfo.userID && userInfo.friendcode !== "null") {
            console.log(`linkcmd: Command Cancelled ${discordName} already has an account linked\n-----------------------`);
            return interaction.reply({ content: "You already have this account linked. Please unlink it first.", ephemeral: true });
        }

        if (checkCode(codeInput) === false) {
            console.log(`linkcmd: Command Cancelled ${discordName} entered an invalid friend code\n-----------------------`);
            return interaction.reply({ content: "Invalid Friend Code. Format must include the `#1234` at the end. Example: `friendcode#1234`", ephemeral: true });
        }

        if (role[1].startsWith("s_") && (role[1] !== "s_it" && role[1] !== "s_in" && role[1] !== "s_bo" && role[1] !== "s_jc"))
            upAccess = 1;

        if (role[1] === "s_jc")
            debugAccess = 1;
        else if (role[1] === "s_cr") {
            devAccess = 1;
            colorAccess = 1;
            debugAccess = 1;
        }

        if (isSponsor) {
            overhead_tag = "Sponsor";
            color = "ff0000";
        }
        else if (role[1] === "s_bo") {
            overhead_tag = "Booster";
            color = "ffc0cb"
        }

        let createdDate = new Date(interaction.createdAt);
        createdDate = createdDate.getFullYear() + "-" + (createdDate.getMonth() + 1) + "-" + createdDate.getDate();
        console.log(createdDate)

        let createUser = await api.createUserByID({
            userID: discordId,
            type: role[1],
            friendcode: codeInput,
            name: discordName,
            overhead_tag: overhead_tag,
            color: color,
            isUP: upAccess,
            isDev: devAccess,
            colorCmd: colorAccess,
            debug: debugAccess,
            date_joined: createdDate
        });

        if (createUser.result === "Error creating user")
            return interaction.reply({
                content: "An error occurred while linking your account. Please try again later. If this issue persists, please contact a developer.",
                ephemeral: true
            });

        console.log(`linkcmd: Details - ${discordId} - ${discordName} - ${codeInput} - ${role[1]} - ${upAccess} - ${devAccess} - ${colorAccess} - ${debugAccess} - ${createdDate}`);
        console.log(`linkcmd: Command Completed ${discordName} linked their account.\n-----------------------`);
        return interaction.reply({ content: "Successfully linked your account!", ephemeral: true });
    }
}
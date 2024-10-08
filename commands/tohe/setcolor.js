const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const types = JSON.parse(readFileSync('./roleTypes.json'));
const { getUserByID, updateUserByID } = require(__dirname + '/../../API Functions/userinfo.js');
const Canvas = require('@napi-rs/canvas');

function checkColor(color) {
    if (color.length != 6) return false;
    if (!/^[0-9A-Fa-f]+$/.test(color)) return false;
    return true;
}

function checkRole(member) {
    for (const categoryKey in types) {
        const category = types[categoryKey];
        for (const roleKey in category) {
            const hasRole = member.roles.cache.has(category[roleKey].roleID);
            if (hasRole) return [category[roleKey], roleKey];
        }
    }
}

module.exports = {
    type: 'tohe',
    data: new SlashCommandBuilder()
        .setName('setcolor')
        .setDescription('Set your color in our database')
        .addStringOption(option => option.setName('color').setDescription('The color you want to set').setRequired(true)),
    async execute(interaction) {
        const discordId = interaction.user.id;
        const color = interaction.options.getString('color');

        console.log(`setcolor - Input: ${discordId} | ${color} `);

        let userInfo = await getUserByID(discordId);
        if (!userInfo) {
            console.log(`setcolor - Error: ${userInfo.error}`);
            return interaction.reply({ content: "You do not have an account linked. Please link your account before you set a color.", ephemeral: true });
        }

        const role = await checkRole(interaction.member);

        if (userInfo.error)
            return interaction.reply({ content: `You do not have an account linked. Please link your account instead of updating.`, ephemeral: true });

        if (role[1] === 's_bo') {
            return interaction.reply({ content: `You cannot set your color as a booster.`, ephemeral: true });
        }

        if (!checkColor(color))
            return interaction.reply({ content: `Please enter a valid color.`, ephemeral: true });

        userInfo.color = color;
        userInfo = await updateUserByID(userInfo, discordId);

        if (userInfo.error)
            return interaction.reply({ content: `Error: ${userInfo.error}`, ephemeral: true });

        const canvas = Canvas.createCanvas(512, 512);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./Images/Color.png');

        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.fillStyle = `#${color}`;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'Color.png' });

        let embed = new EmbedBuilder()
            .setTitle(`Color Updated`)
            .setDescription(`Your color has been updated to **#${color}**!`)
            .setColor(color)
            .setThumbnail(`attachment://${attachment.name}`)
        return interaction.reply({ embeds: [embed], files: [attachment], ephemeral: true });
    }
}
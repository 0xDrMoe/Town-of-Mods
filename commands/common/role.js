const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const con = require('../../mysqlConn.js');

function formatRole(string) {
    let stringArray = string.split(" ");
    stringArray = stringArray.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return stringArray.join(" ");
}

function internalNameToRoleName(gitJson) {
    const result = {};

    for (const key in gitJson) {
        if (key.includes("InfoLong")) {
            const internalName = key.replace("InfoLong", "");
            if (internalName in gitJson) {
                result[formatRole(gitJson[internalName].toLowerCase())] = {
                    Description: gitJson[key],
                    codeName: internalName
                };
            }
        }
    }
    console.log(`rolecmd: internalNameToRoleName successfully converted ${Object.keys(result).length} InfoLongs.`);
    return result;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Get the description of a role in Town of Host: Enhanced')
        .addStringOption(option => option.setName('role').setDescription('The role to get the description of').setRequired(true))
        .addStringOption(option => option.setName('language').setDescription('The language to get the description in').setRequired(false)
            .addChoices(
                { name: 'English', value: 'en_US' },
                { name: 'Latin American', value: 'es_419' },
                { name: 'Spanish', value: 'es_ES' },
                { name: 'French', value: 'fr_FR' },
                { name: 'Japanese', value: 'ja_JP' },
                { name: 'Portuguese', value: 'pt_BR' },
                { name: 'Russian', value: 'ru_RU' },
                { name: 'Chinese (Simplified)', value: 'zh_CN' },
                { name: 'Chinese (Traditional)', value: 'zh_TW' }
            )),
    async execute(interaction) {

        const roleInput = formatRole(interaction.options.getString('role').toLowerCase());
        console.log("rolecmd: Input - " + roleInput);
        const langInput = interaction.options.getString('language') || "en_US";
        console.log("rolecmd: Language - " + langInput);

        let repoLangURL;
        await fetch(`https://raw.githubusercontent.com/0xDrMoe/TownofHost-Enhanced/main/Resources/Lang/${langInput}.json`)
            .then((response) => {
                repoLangURL = response;
                console.log(`rolecmd: RawURL - https://raw.githubusercontent.com/0xDrMoe/TownofHost-Enhanced/main/Resources/Lang/${langInput}.json`);
            })
            .catch(() =>
                interaction.reply({ content: `rolecmd: The language ${langInput} does not exist.`, ephemeral: true }));
        const langJson = await repoLangURL.json();

        const lang = internalNameToRoleName(langJson);

        if (!lang[roleInput]) return interaction.reply({ content: `The role ${roleInput} does not exist.`, ephemeral: true })
        let roleInfo = lang[roleInput].Description;
        let roleCodeName = lang[roleInput].codeName;

        if (!roleInfo || !roleCodeName) return interaction.reply({ content: `The role ${roleInput} does not exist.`, ephemeral: true })
            .then(console.log(`rolecmd: Role ${roleInput} does not exist.`));

        const sliceIndex = roleInfo.indexOf(":");

        // Extract role type from the roleInfo
        const roleType = roleInfo.slice(1, sliceIndex - 1);
        console.log("rolecmd: Role Type - " + roleType);

        // role colors
        let roleColorURL;
        await fetch(`https://raw.githubusercontent.com/0xDrMoe/TownofHost-Enhanced/main/Resources/roleColor.json`)
            .then((response) => {
                roleColorURL = response;
                console.log('roleColor: RawURL - https://raw.githubusercontent.com/0xDrMoe/TownofHost-Enhanced/main/Resources/roleColor.json');
            })
            .catch(() =>
                interaction.reply({ content: `roleColor URL invalid`, ephemeral: true }));
        const roleColorJson = await roleColorURL.json();
        let roleColor = "#ff1919";
        if (roleCodeName in roleColorJson) roleColor = roleColorJson[roleCodeName];

        // Extract role description from the roleInfo
        roleInfo = roleInfo.slice(sliceIndex + 1);
        console.log("rolecmd - Role Description: " + roleInfo);

        const embed = new EmbedBuilder()
            .setTitle(roleInput + ": " + roleType)
            .setDescription(roleInfo)
            .setColor(roleColor)
            .setTimestamp()
            .addFields(
                { name: "For more information:", value: "[Check out our Website!](https://tohe.weareten.ca/Roles.html)", inline: true },
                { name: "Want to support TOHE?", value: "[Consider purchasing a Package!](https://weareten.ca/tohe/)", inline: true }
            )
            .setFooter({ text: "Town of Host: Enhanced", iconURL: "https://i.ibb.co/RvX9B3s/Yeetus-TOHE-Pic.png" });

        interaction.reply({ embeds: [embed] }).then(console.log(`rolecmd: Sent by ${interaction.member.id}\n-----------------------`));
    }
}
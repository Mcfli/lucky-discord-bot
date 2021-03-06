require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']});

// Roles
const BOT_ROLE = '720511554436464670';
const VISITOR_ROLE = '720514641020583946';
const OFFICER_ROLE = '711454031007973438';
const BDO_ROLE = '718712020610056305';
const SMASH_ROLE = '721603511833591838';
const WOW_ROLE = '718930981880594452';

// Users
const BOT_USER = '719769443324133406';
const ECLIPSE_USER = '107714153698852864';

// Emojis
const BDO_EMOJI = '721575227821391895';
const WOW_EMOJI = '722338448572284978';
const SMASH_EMOJI = '721590704966467624';

// Channels
const GUILD_INFO_CHANNEL = '721263231791923212';
const VISITOR_CENTER_CHANNEL = '720894627846160456';
const ROLE_ASSIGN_CHANNEL = '721265098655662191';

// Listen for connected event
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Message listener
client.on('message', (message) => {

    if (message.content == '!dreamcatcher' && message.author.id === ECLIPSE_USER) {
        message.reply('https://www.youtube.com/watch?v=I5_BQAtwHws');
    // Restrict welcome message generating to only Eclipse
    } else if (message.content == '!sleepwalking' && message.author.id === ECLIPSE_USER) {
        message.reply('https://www.youtube.com/watch?v=2_GcbZlDnns');
    } else if (message.content === '!silentnight' && message.author.id === ECLIPSE_USER) {
        message.reply('https://www.youtube.com/watch?v=7NO0YX341XU');
    } else if (message.content === '!info' && message.author.id === ECLIPSE_USER) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Lucky Cat')
        .setColor('0xa100ff')
        .setDescription('We\'re a small, friendly guild currently pushing to softcap and looking to grow. PVP, PVE, Lifeskill; we welcome all with luck on their side. Visit our guild page to learn more or say hi!')
        .addFields(
            { name: 'Guild Master', value: `<@180474446685929474>`},
            { name: 'Guild Officers', value: '<@107714153698852864>\n<@473247777531494400>\n<@56575160035049472>\n'},
            { name: 'Rules', value: `Please set your Discord nickname to include your family name in Black Desert so we know you are from in-game!`},
            { name: 'Introduction', value: `Feel free to introduce yourself in the <#${VISITOR_CENTER_CHANNEL}>!`},
        );
        message.channel.send(embed);
    } else if (message.content === '!role-assign' && message.author.id === ECLIPSE_USER) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Lucky Cat Role Assignment')
        .setColor('0xa100ff')
        .setDescription('React below with the emojis to gain access to the corresponding channels. More roles coming soon!')
        .addFields(
            { name: 'Black Desert Online', value: `<:black_spirit:${BDO_EMOJI}>`},
            { name: 'Super Smash Bros', value: `<:smash:${SMASH_EMOJI}>`},
            { name: 'World of Warcraft', value: `<:world_of_warcraft:${WOW_EMOJI}>`},
        );
        message.channel.send(embed).then(sentMessage => {
            sentMessage.react(`${BDO_EMOJI}`);
            sentMessage.react(`${SMASH_EMOJI}`);
            sentMessage.react(`${WOW_EMOJI}`);
        });
    }

});


// Add listener for reactions
client.on('messageReactionAdd', async (reaction, user) => {
    // Don't do anything if the bot was reacting
    if (user.id === BOT_USER) {
        return;
    }
    // fectch the message that was reacted to
    if (reaction.message.partial) {
        try {
            await reaction.message.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
        };
    }
    // Check if the message was the welcome message
    const rmsg = reaction.message;
    if (rmsg.channel.id === ROLE_ASSIGN_CHANNEL) {
        // Match user id to member of server
        rmsg.guild.members.fetch(user.id).then(member => {
            // Check emoji and assign correct role
            if(reaction.emoji.id === BDO_EMOJI) {
                member.roles.add(BDO_ROLE);
            } else if (reaction.emoji.id === SMASH_EMOJI) {
                member.roles.add(SMASH_ROLE);
            } else if (reaction.emoji.id === WOW_EMOJI) {
                member.roles.add(WOW_ROLE);
            }
        });
    };
});


// Add listener for removing reactions
client.on('messageReactionRemove', async(reaction, user) => {
    // Don't do anything if the bot was removing the reaction
    if (user.id === '718734831516778517') {
        return;
    }
    // fectch the message that had reaction removed
    if (reaction.message.partial) {
        try {
            await reaction.message.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
        };
    }
    // Check if the message was the welcome message
    const rmsg = reaction.message;
    if (rmsg.channel.id === ROLE_ASSIGN_CHANNEL) {
        // Match user id to member of server
        rmsg.guild.members.fetch(user.id).then(member => {
            // Check emoji and remove correct role
            if(reaction.emoji.id === BDO_EMOJI) {
                member.roles.remove(BDO_ROLE);
            } else if (reaction.emoji.id === SMASH_EMOJI) {
                member.roles.remove(SMASH_ROLE);
            } else if (reaction.emoji.id === WOW_EMOJI) {
                member.roles.remove(WOW_ROLE);
            }
        });
    };
});

// Add listner for new members added to the server
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'visitor-center');
    if (!channel) return
    channel.send(`Welcome to the server ${member}! Please read over the guild info in the <#${GUILD_INFO_CHANNEL}> channel and introduce yourself here!`);
    member.roles.add(VISITOR_ROLE);
});


// Initialize bot and connect to server
client.login(process.env.DISCORD_TOKEN);
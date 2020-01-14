//change [clienttoken] to the bots client token
//change [permissions] to your bots permissions from the bot permissions page: https://discordapp.com/developers/applications
//select the relevant bot and copy the id that is generated after checking the specific permissions
//
//https://discordapp.com/oauth2/authorize?&client_id=[clienttoken]&scope=bot&permissions=[permissions]

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var config = require('./botconfig.json');

var availablePlayers = [];
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    logger.info(message);
    logger.info(channelID);
    if (message.startsWith('/wel ')) {
        var args = message.substring(0).split(' ');
        var cmd = args[1];
        var  message = "";
        logger.info('')
        logger.info(channelID);
        args = args.splice(1);
        const userInfo = bot.users[userID];

        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: config.botRoom,
                    message: 'Pong!'
                });
                break;
            case 'available':
                if(!availablePlayers.includes(userInfo.username)) {
                    availablePlayers.push(userInfo.username);
                    bot.sendMessage({
                        to: config.botRoom,
                        message: userInfo.username + ' is now available to play!'
                    });
                }
                break;
            case 'unavailable':
                if(availablePlayers.includes(userInfo.username)) {
                    availablePlayers = availablePlayers.filter(e => e !== userInfo.username);
                    bot.sendMessage({
                        to: config.botRoom,
                        message: userInfo.username + ' is no longer available to play.'
                    });
                }
                break;
            case 'list':
                message = "There are currently no players available to play.";
                if(availablePlayers.length > 0) {
                    message = "There is/are currently " + availablePlayers.length + " player(s) available to play. The list of available players is/are: " + availablePlayers.join(", ");
                }
                bot.sendMessage({
                    to: config.botRoom,
                    message: message
                });
                break;
            case 'help':
                message = "please see " + config.helpURL + " for information on how to use this bot.";
                bot.sendMessage({
                    to: config.botRoom,
                    message: message
                });
                break;
            default:
                break;
         }
     }
});
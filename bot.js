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
var tentativePlayers = [];
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
    // It will listen for messages that will start with `/wel`
    logger.info(message);
    logger.info(channelID);
    logger.info(evt.d.id);
    if (message.startsWith(config.commandprefix)) {
        var args = message.substring(0).split(' ');
        var cmd = args[1];
        var  responseMessage = "";
        logger.info('')
        logger.info(channelID);
        args = args.splice(1);
        const userInfo = bot.users[userID];
        let msgID = evt.d.id
        let msgObj = { channelID: channelID, messageID: msgID };

        switch(cmd) {
            // /wel ping
            case 'ping':
                bot.deleteMessage(msgObj,(err,response)=>{ if(err) console.log(err); })
                bot.sendMessage({
                    to: config.botRoom,
                    message: 'Pong!'
                });
                break;
            case 'available':
                if(!availablePlayers.includes(userInfo.username)) {
                    bot.deleteMessage(msgObj,(err,response)=>{ if(err) console.log(err); })
                    availablePlayers.push(userInfo.username);
                    bot.sendMessage({
                        to: config.botRoom,
                        message: userInfo.username + ' is now available to play!'
                    });
                }
                break;
            case 'available?':
                    if(!tentativePlayers.includes(userInfo.username)) {
                        bot.deleteMessage(msgObj,(err,response)=>{ if(err) console.log(err); })
                        tentativePlayers.push(userInfo.username);
                        bot.sendMessage({
                            to: config.botRoom,
                            message: userInfo.username + ' is now tentatively available to play.'
                        });
                    }
                    break;
            case 'unavailable':
                if(availablePlayers.includes(userInfo.username)) {
                    bot.deleteMessage(msgObj,(err,response)=>{ if(err) console.log(err); })
                    availablePlayers = availablePlayers.filter(e => e !== userInfo.username);
                    bot.sendMessage({
                        to: config.botRoom,
                        message: userInfo.username + ' is no longer available to play.'
                    });
                }
                if(tentativePlayers.includes(userInfo.username)) {
                    bot.deleteMessage(msgObj,(err,response)=>{ if(err) console.log(err); })
                    tentativePlayers = tentativePlayers.filter(e => e !== userInfo.username);
                    bot.sendMessage({
                        to: config.botRoom,
                        message: userInfo.username + ' is no longer tentatively available to play.'
                    });
                }

                break;
            case 'list':
                bot.deleteMessage(msgObj,(err,response)=>{ if(err) console.log(err); })
                responseMessage = "There are currently no players available to play.";
                if(availablePlayers.length > 0) {
                    responseMessage = "There is/are currently " + availablePlayers.length + " player(s) available to play. The list of available players is/are: " + availablePlayers.join(", ");
                }
                if(tentativePlayers.length > 0) {
                    responseMessage += "\nThere is/are currently " + tentativePlayers.length + " player(s) tentatively available to play. The list of tentative players is/are: " + tentativePlayers.join(", ");
                }
                bot.sendMessage({
                    to: config.botRoom,
                    message: responseMessage
                });
                break;
            case 'help':
                responseMessage = "please see " + config.helpURL + " for information on how to use this bot.";
                bot.sendMessage({
                    to: config.botRoom,
                    message: responseMessage
                });
                break;
            default:
                break;
         }
     }
});

function logObject(obj) {
    for (var property in obj) {
        console.log(property);
    }
}
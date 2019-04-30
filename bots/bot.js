// Import require Package
const { ActivityTypes, ActivityHandler } = require('botbuilder');
const { MainDialog } = require('../dialogs/mainDialog')

// Define the identifiers for our state property accessors.
const DIALOG_STATE_PROPERTY = "dialogstateproperty"
const USER_INFO_PROPERTY = "userinfoproperty"

// // await myBot.run(context);
class MpBot extends ActivityHandler {
    constructor(conversationState, userState){
        super()

        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');

        this.conversationState = conversationState
        this.userState = userState
        
        // Create our state property accessors.
        this.dialogStateAccessor = conversationState.createProperty(DIALOG_STATE_PROPERTY);
        this.userProfileAccessor = userState.createProperty(USER_INFO_PROPERTY);

        const mainDialog = new MainDialog(this.dialogStateAccessor, this.userProfileAccessor)

        // User coming to the bot
        this.onMembersAdded(async turnContext => {
            const membersAdded = turnContext.activity.membersAdded
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== turnContext.activity.recipient.id) {
                    await turnContext.sendActivity(`Hello`); 
                }
            }
        })

        // User type something to bot
        this.onMessage(async turnContext => {
            await turnContext.sendActivity(`You said '${ turnContext.activity.text }'`)
            console.log("bot run start")
            await mainDialog.run(turnContext)
            console.log("bot run end")

            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(turnContext, false);
            await this.userState.saveChanges(turnContext, false);
        })
    }
}

module.exports.MpBot = MpBot;

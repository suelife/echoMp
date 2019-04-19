const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');

// Define the property accessors.
const BOT_PROMPT = "botPrompt"
const MAIN_PROMPT = "mainPrompt"


class MainDialog extends ComponentDialog {
    constructor(dialogStateAccessor, userProfileAccessor){
        super(MAIN_PROMPT)

        this.dialogStateAccessor = dialogStateAccessor
        this.userProfileAccessor = userProfileAccessor
        this.addDialog(new WaterfallDialog(BOT_PROMPT, [
            this.testStep.bind(this)
        ]))

        this.initialDialogId = BOT_PROMPT

    }

    async run(turnContext) {
        await turnContext.sendActivity(`I say '${ turnContext.activity.text }' too`)

        const dialogSet = new DialogSet(this.dialogStateAccessor)
        dialogSet.add(this)
        const dialogContext =  await dialogSet.createContext(turnContext)
        const result = await dialogContext.continueDialog()
        if (result.status === DialogTurnStatus.empty){
            await dialogContext.beginDialog(MAIN_PROMPT)
        }
    }

    async testStep(stepContext) {
        return await stepContext.endDialog()
    }
}

module.exports.MainDialog = MainDialog
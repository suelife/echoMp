// Import require Package
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { UserInfo } = require('./Resource/userInfo')

// Define the property accessors.
const BOT_PROMPT = "botPrompt"
const MAIN_PROMPT = "mainPrompt"
const TEXT_PROMPT = "textprompt"
const NUMBER_PROMPT = "numberprompt"

class MainDialog extends ComponentDialog {
    constructor(dialogStateAccessor, userProfileAccessor){
        super(MAIN_PROMPT)

        this.dialogStateAccessor = dialogStateAccessor
        this.userProfileAccessor = userProfileAccessor

        // Create Prompt Dialog
        this.addDialog(new TextPrompt(TEXT_PROMPT))
        this.addDialog(new NumberPrompt(NUMBER_PROMPT))

        // Create WaterfallDialog
        this.addDialog(new WaterfallDialog(BOT_PROMPT, [
            this.initializeStateStep.bind(this),
            this.testStep.bind(this),
            this.testStep2.bind(this)
        ]))

        // Set initialDialogId
        this.initialDialogId = BOT_PROMPT
    }

    // Running MainDialog
    async run(turnContext) {
        await turnContext.sendActivity(`I say '${ turnContext.activity.text }' too`)

        // Create DialogSet Object
        const dialogSet = new DialogSet(this.dialogStateAccessor)
        dialogSet.add(this)

        // Creates a dialog context
        const dialogContext =  await dialogSet.createContext(turnContext)

        // Create userInfo
        let userInfo = await this.userProfileAccessor.get(dialogContext.context)
        await this.userProfileAccessor.set(dialogContext.context, new UserInfo())
        if (userInfo === undefined) {
            if (dialogContext.options && dialogContext.options.userInfo) {
                await this.userProfileAccessor.set(dialogContext.context, dialogContext.options.userInfo);
            } else {
                await this.userProfileAccessor.set(dialogContext.context, new UserInfo());
            }
        } 

        // ContinueDialog
        const result = await dialogContext.continueDialog()
        if (result.status === DialogTurnStatus.empty){

            // BeginDialog
            await dialogContext.beginDialog(MAIN_PROMPT)
        }
    }

    async initializeStateStep(stepContext) {
        console.log("userInfo ", stepContext)
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        console.log("userInfo ", userInfo)
        // console.log("initializeStateStep stepContext", stepContext.context)
        // let userInfo = await this.userProfileAccessor.get(stepContext.context)
        // await this.userProfileAccessor.set(stepContext.context, new UserInfo())
        // if (userInfo === undefined) {
        //     if (stepContext.options && stepContext.options.userInfo) {
        //         await this.userProfileAccessor.set(stepContext.context, stepContext.options.userInfo);
        //     } else {
        //         await this.userProfileAccessor.set(stepContext.context, new UserInfo());
        //     }
        // } 
        return await stepContext.next()
    }

    async testStep(stepContext) {
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo == undefined && stepContext.result) {
            console.log("1")
        }else{
            console.log("2")
        }
        return await stepContext.endDialog()
    }

    async testStep2(stepContext) {
        const userInfo = await this.userProfileAccessor.get(stepContext.context)

        return await stepContext.endDialog()
    }
}

module.exports.MainDialog = MainDialog
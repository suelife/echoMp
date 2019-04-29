// Import require Package
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');
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
            this.checkpidStep.bind(this),
            this.testStep.bind(this)
            // this.testStep2.bind(this)
        ]))

        // Set initialDialogId
        this.initialDialogId = BOT_PROMPT
    }

    // Running MainDialog
    async run(turnContext) {
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

    // Check user enter is number or not(default is number)
    async checkpidStep(stepContext) {
        let cknum = stepContext.context.activity.text
        if (isNaN(cknum)) {
            await stepContext.context.sendActivity("產品編號錯誤")
            await stepContext.context.sendActivity("請輸入產品編號")
            await stepContext.context.sendActivities([
                { type: 'typing' },
                { type: 'delay', value: 1000 }
            ]);
            await stepContext.context.sendActivity("你說你不知道商品編號是什麼意思???")
            await stepContext.context.sendActivities([
                { type: 'typing' },
                { type: 'delay', value: 1000 }
            ]);
            await stepContext.context.sendActivity("怪我喔??")
            await stepContext.context.sendActivities([
                { type: 'typing' },
                { type: 'delay', value: 1000 }
            ]);
            await stepContext.context.sendActivity("不會去問商家阿!!!")
            return await stepContext.endDialog()
        } else {
            await stepContext.context.sendActivity("正在搜尋該商品")
            await stepContext.context.sendActivities([
                { type: 'typing' },
                { type: 'delay', value: 1000 }
            ]);
            return await stepContext.next()
        }
    }

    async testStep(stepContext) {
        await stepContext.context.sendActivity("WTF???")
        return await stepContext.endDialog()
    }

    async testStep2(stepContext) {
        const userInfo = await this.userProfileAccessor.get(stepContext.context)

        return await stepContext.endDialog()
    }
}

module.exports.MainDialog = MainDialog
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');

const MAIN_PROMPT = "mainPrompt"
const TEXT_PROMPT = 'textPrompt'
const NONE_PROMPT = "nonePrompt"

class NoneDialog extends ComponentDialog {
    constructor(id, userProfileAccessor) {
        console.log(id)
        super(id || NONE_PROMPT)

        this.userProfileAccessor = userProfileAccessor

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(MAIN_PROMPT, [
                this.nonetestStpe0.bind(this),
                this.nonetestStpe1.bind(this)
            ]))

        this.initialDialogId = MAIN_PROMPT
    }

    async nonetestStpe0(stepContext) {
        console.log("nonetestStpe0")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        await stepContext.context.sendActivity("是就是，不是就不是，還不好說，你媽B的")
        const choiceCard = MessageFactory.suggestedActions(["好", "不要", "幹你娘，你去死啦"], `${userInfo.u_name}，要不要自殺???`)

        if (!userInfo.p_single_4) {
            return await stepContext.prompt(TEXT_PROMPT, choiceCard)
        } else {
            return await stepContext.next()
        }
    }

    async nonetestStpe1(stepContext) {
        console.log("nonetestStpe1")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_single_4 === undefined && stepContext.result) {
            userInfo.p_single_4 = stepContext.result
        }
        console.log("usersingle_4 : ", userInfo.p_single_4)

        switch (userInfo.p_single_4) {
            case "好":
                await stepContext.context.sendActivity("別別別，好好活下來，人生Hen美好的")
                return await stepContext.endDialog()
            case "不要":
                await stepContext.context.sendActivity("好啊，那跟我說對不起")
                return await stepContext.endDialog()
            case "幹你娘，你去死啦":
                await stepContext.context.sendActivity("糙你媽，還敢嗆我!!")
                return await stepContext.endDialog()
            default:
                await stepContext.context.sendActivity("叫你選，她媽是有叫你打字是不是啦")
                await stepContext.context.sendActivity("滾回去再選一次，幹!!")
                userInfo.p_single_4 = undefined
                return await this.nonetestStpe0(stepContext)
        }
    }
}

module.exports.NoneDialog = NoneDialog
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');

const MAIN_PROMPT = "mainPrompt"
const TEXT_PROMPT = 'textPrompt'
const YES_PROMPT = "yesPrompt"

class YesDialog extends ComponentDialog {
    constructor(id, userProfileAccessor) {
        console.log(id)
        super(id || YES_PROMPT)

        this.userProfileAccessor = userProfileAccessor

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(MAIN_PROMPT, [
                this.yestestStpe0.bind(this),
                this.yestestStpe1.bind(this),
                this.yestestStpe2.bind(this)
            ]))

        this.initialDialogId = MAIN_PROMPT
    }

    async yestestStpe0(stepContext) {
        console.log("yestestStpe0")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        const likeCard = MessageFactory.suggestedActions(["喜歡", "不喜歡"], `${userInfo.u_name}，你喜歡小狗??`)

        if (!userInfo.p_single_1) {
            return await stepContext.prompt(TEXT_PROMPT, likeCard)
        } else {
            return await stepContext.next()
        }
    }

    async yestestStpe1(stepContext) {
        console.log("yestestStpe1")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_single_1 === undefined && stepContext.result) {
            userInfo.p_single_1 = stepContext.result
        }
        console.log("usersingle1 : ", userInfo.p_single_1)
        const introvertCard = MessageFactory.suggestedActions(["對", "不對"], `${userInfo.u_name}，你內向嗎??`)

        if (!userInfo.p_single_2) {
            return await stepContext.prompt(TEXT_PROMPT, introvertCard)
        } else {
            return await stepContext.next()
        }
    }

    async yestestStpe2(stepContext) {
        console.log("yestestStpe2")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_single_2 === undefined && stepContext.result) {
            userInfo.p_single_2 = stepContext.result
        }
        console.log("usersingle2 : ", userInfo.p_single_2)

        return await stepContext.endDialog()
    }
}

module.exports.YesDialog = YesDialog
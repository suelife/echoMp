const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');

const MAIN_PROMPT = "mainPrompt"
const TEXT_PROMPT = 'textPrompt'
const NO_PROMPT = "noPrompt"

class NoDialog extends ComponentDialog {
    constructor(id, userProfileAccessor) {
        console.log(id)
        super(id || NO_PROMPT)

        this.userProfileAccessor = userProfileAccessor

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(MAIN_PROMPT, [
                this.notestStpe0.bind(this),
                this.notestStpe1.bind(this),
                this.notestStpe2.bind(this),
                this.notestStpe3.bind(this)
            ]))

        this.initialDialogId = MAIN_PROMPT
    }

    async notestStpe0(stepContext) {
        console.log("notestStpe0")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)

        if (!userInfo.p_single_3_1) {
            return await stepContext.prompt(TEXT_PROMPT, "你第一次跟誰??")
        } else {
            return await stepContext.next()
        }
    }

    async notestStpe1(stepContext) {
        console.log("notestStpe1")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_single_3_1 === undefined && stepContext.result) {
            userInfo.p_single_3_1 = stepContext.result
        }
        console.log("usersingle_3_1 : ", userInfo.p_single_3_1)

        const sexwowCard = MessageFactory.suggestedActions(["Hen爽", "普通", "不爽"], `${userInfo.u_name}，那個爽不爽??`)

        if (!userInfo.p_single_3_2) {
            return await stepContext.prompt(TEXT_PROMPT, sexwowCard)
        } else {
            return await stepContext.next()
        }
    }

    async notestStpe2(stepContext) {
        console.log("notestStpe2")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_single_3_2 === undefined && stepContext.result) {
            userInfo.p_single_3_2 = stepContext.result
        }
        console.log("usersingle_3_2 : ", userInfo.p_single_3_2)

        const multiplayerCard = MessageFactory.suggestedActions(["接受", "不接受"], `${userInfo.u_name}，你接受Multiplayer嗎??`)

        if (!userInfo.p_single_3_3) {
            return await stepContext.prompt(TEXT_PROMPT, multiplayerCard)
        } else {
            return await stepContext.next()
        }
    }

    async notestStpe3(stepContext) {
        console.log("notestStpe3")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_single_3_3 === undefined && stepContext.result) {
            userInfo.p_single_3_3 = stepContext.result
        }
        console.log("usersingle_3_3 : ", userInfo.p_single_3_3)

        return await stepContext.endDialog()
    }
}

module.exports.NoDialog = NoDialog
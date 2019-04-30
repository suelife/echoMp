const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');

const MAIN_PROMPT = "mainPrompt"
const TEXT_PROMPT = 'textPrompt'
const FEMALE_PROMPT = "femalePrompt"

class FemaleDialog extends ComponentDialog {
    constructor(id, userProfileAccessor) {
        console.log(id)
        super(id || FEMALE_PROMPT)

        this.userProfileAccessor = userProfileAccessor

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(MAIN_PROMPT, [
                this.femaletestStpe0.bind(this),
                this.femaletestStpe1.bind(this),
                this.femaletestStpe2.bind(this)
            ]))

        this.initialDialogId = MAIN_PROMPT
    }

    async femaletestStpe0(stepContext) {
        console.log("maletestStpe0")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        const likeCard = MessageFactory.suggestedActions(["不想", "想"], `${userInfo.u_name}，妳想生小孩嗎??`)

        if (!userInfo.p_sex_3) {
            return await stepContext.prompt(TEXT_PROMPT, likeCard)
        } else {
            return await stepContext.next()
        }
    }

    async femaletestStpe1(stepContext) {
        console.log("maletest1Stpe1")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_sex_3 === undefined && stepContext.result) {
            userInfo.p_sex_3 = stepContext.result
        }
        console.log("usersex_3 : ", userInfo.p_sex_3)

        if (!userInfo.p_sex_4) {
            return await stepContext.prompt(TEXT_PROMPT, `${userInfo.u_name}，妳的興趣是什麼?`)
        } else {
            return await stepContext.next()
        }
    }

    async femaletestStpe2(stepContext) {
        console.log("maletest1Stpe2")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_sex_4 === undefined && stepContext.result) {
            userInfo.p_sex_4 = stepContext.result
        }
        console.log("usersex_4 : ", userInfo.p_sex_4)

        return await stepContext.endDialog()
    }
}

module.exports.FemaleDialog = FemaleDialog
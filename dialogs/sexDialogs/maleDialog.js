const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');

const MAIN_PROMPT = "mainPrompt"
const TEXT_PROMPT = 'textPrompt'
const MALE_PROMPT = "malePrompt"

class MaleDialog extends ComponentDialog {
    constructor(id, userProfileAccessor) {
        console.log(id)
        super(id || MALE_PROMPT)

        this.userProfileAccessor = userProfileAccessor

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(MAIN_PROMPT, [
                this.maletestStpe0.bind(this),
                this.maletestStpe1.bind(this),
                this.maletestStpe2.bind(this)
            ]))

        this.initialDialogId = MAIN_PROMPT
    }

    async maletestStpe0(stepContext) {
        console.log("maletestStpe0")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        const likeCard = MessageFactory.suggestedActions(["異性戀", "同性戀", "雙性戀"], `${userInfo.u_name}，你是什麼戀??`)

        if (!userInfo.p_sex_1) {
            return await stepContext.prompt(TEXT_PROMPT, likeCard)
        } else {
            return await stepContext.next()
        }
    }

    async maletestStpe1(stepContext) {
        console.log("maletest1Stpe1")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_sex_1 === undefined && stepContext.result) {
            userInfo.p_sex_1 = stepContext.result
        }
        console.log("usersex_1 : ", userInfo.p_sex_1)

        if (!userInfo.p_sex_2) {
            return await stepContext.prompt(TEXT_PROMPT, `${userInfo.u_name}，喜歡吃什麼?`)
        } else {
            return await stepContext.next()
        }
    }

    async maletestStpe2(stepContext) {
        console.log("maletest1Stpe2")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_sex_2 === undefined && stepContext.result) {
            userInfo.p_sex_2 = stepContext.result
        }
        console.log("usersex_2 : ", userInfo.p_sex_2)

        return await stepContext.endDialog()
    }
}

module.exports.MaleDialog = MaleDialog
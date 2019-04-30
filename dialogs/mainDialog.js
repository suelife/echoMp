// Import require Package
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');

const { MaleDialog } = require("./maleDialog")
const { FemaleDialog } = require("./femaleDialog")

const { UserInfo } = require('./Resource/userInfo')

// Define the property accessors.
const BOT_PROMPT = "botPrompt"
const MAIN_PROMPT = "mainPrompt"
const TEXT_PROMPT = "textprompt"
const NUMBER_PROMPT = "numberprompt"
const MALE_PROMPT = "malePrompt"
const FEMALE_PROMPT = "femalePrompt"

class MainDialog extends ComponentDialog {
    constructor(dialogStateAccessor, userProfileAccessor){
        super(MAIN_PROMPT)

        this.dialogStateAccessor = dialogStateAccessor
        this.userProfileAccessor = userProfileAccessor

        // Create Prompt Dialog
        this.addDialog(new TextPrompt(TEXT_PROMPT))
        this.addDialog(new NumberPrompt(NUMBER_PROMPT))

        // Create WaterfallDialog
        this.addDialog(new MaleDialog(MALE_PROMPT, this.userProfileAccessor))
            .addDialog(new FemaleDialog(FEMALE_PROMPT, this.userProfileAccessor))
            .addDialog(new WaterfallDialog(BOT_PROMPT, [
            this.initializationStep.bind(this),
            this.testStep0.bind(this),
            this.testStep1.bind(this),
            this.testStep2.bind(this),
            this.testStep3.bind(this),
            this.testStep4.bind(this),
            this.testStep5.bind(this),
            this.testStep6.bind(this)
        ]))

        // Set initialDialogId
        this.initialDialogId = BOT_PROMPT
    }

    async run(turnContext) {
        // Create DialogSet Object
        const dialogSet = new DialogSet(this.dialogStateAccessor)
        dialogSet.add(this)

        // Creates a dialog context
        const dialogContext =  await dialogSet.createContext(turnContext)

        // ContinueDialog
        const result = await dialogContext.continueDialog()
        if (result.status === DialogTurnStatus.empty){
            // BeginDialog
            await dialogContext.beginDialog(this.id)
        }
    }

    async initializationStep(stepContext) {
        console.log("initializationStep")
        let userInfo = await this.userProfileAccessor.get(stepContext.context)
        await this.userProfileAccessor.set(stepContext.context, new UserInfo())
        if (userInfo === undefined) {
            if (stepContext.options && stepContext.options.userInfo) {
                await this.userProfileAccessor.set(stepContext.context, stepContext.options.userInfo);
            } else {
                await this.userProfileAccessor.set(stepContext.context, new UserInfo());
            }
        }
        return await stepContext.next() 
    }

    async testStep0(stepContext) {
        console.log("testStep0")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (!userInfo.u_name) {
            return await stepContext.prompt(TEXT_PROMPT, "請問怎麼稱呼??")
        } else {
            return await stepContext.next()
        }
    }

    async testStep1(stepContext) {
        console.log("testStep1")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_name === undefined && stepContext.result) {
            userInfo.u_name = stepContext.result
        }
        console.log("userName : ", userInfo.u_name)
        if (!userInfo.u_age) {
            await stepContext.context.sendActivity(`${userInfo.u_name}，您好。`)
            return await stepContext.prompt(NUMBER_PROMPT, "請問您幾歲??")
        } else {
            return await stepContext.next()
        }
    }

    async testStep2(stepContext) {
        console.log("testStep2")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_age === undefined && stepContext.result) {
            userInfo.u_age = stepContext.result
        }
        console.log("userage : ", userInfo.u_age)
        if (!userInfo.u_phone) {
            return await stepContext.prompt(NUMBER_PROMPT, "請問您的連絡電話是??")
        } else {
            return await stepContext.next()
        }
    }

    async testStep3(stepContext) {
        console.log("testStep3")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_phone === undefined && stepContext.result) {
            userInfo.u_phone = stepContext.result
        }
        console.log("userphone : ", userInfo.u_phone)
        if (!userInfo.u_email) {
            return await stepContext.prompt(TEXT_PROMPT, "請問您的連絡信箱是??")
        } else {
            return await stepContext.next()
        }
    }
    
    async testStep4(stepContext) {
        console.log("testStep4")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.u_email === undefined && stepContext.result) {
            userInfo.u_email = stepContext.result
        }
        console.log("useremail : ", userInfo.u_email)
        const sexCard = MessageFactory.suggestedActions(["男生", "女生", "不好說"], "請問您的性別是?")
        if (!userInfo.p_sex) {
            return await stepContext.prompt(TEXT_PROMPT, sexCard)
        } else {
            return await stepContext.next()
        }
    }
    
    async testStep5(stepContext) {
        console.log("testStep5")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_sex === undefined && stepContext.result) {
            userInfo.p_sex = stepContext.result
        }
        console.log("usersex : ", userInfo.p_sex)

        switch (userInfo.p_sex) {
            case "男生":
                // await stepContext.context.sendActivity(`${userInfo.u_name}，是${userInfo.p_sex}`)
                return await stepContext.beginDialog(MALE_PROMPT)
            case "女生":
                // await stepContext.context.sendActivity(`${userInfo.u_name}，是${userInfo.p_sex}`)
                return await stepContext.beginDialog(FEMALE_PROMPT)
            case "不好說":
                // await stepContext.context.sendActivity(`${userInfo.u_name}，是${userInfo.p_sex}`)
                return await stepContext.next()
            default:
                await stepContext.context.sendActivity(`${userInfo.u_name}，為什麼亂打`)
                return await stepContext.endDialog();
        }
    }
    
    async testStep6(stepContext) {
        console.log("testStep6")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)

        await stepContext.context.sendActivity(`你的姓名: ${userInfo.u_name}`)
        await stepContext.context.sendActivity(`你的年齡: ${userInfo.u_age}`)   
        await stepContext.context.sendActivity(`你的電話: ${userInfo.u_phone}`)
        await stepContext.context.sendActivity(`你的信箱: ${userInfo.u_email}`)
        await stepContext.context.sendActivity(`你的性別: ${userInfo.p_sex}`)
        
        switch (userInfo.p_sex) {
            case "男生":
                await stepContext.context.sendActivity(`你的性向: ${userInfo.p_sex_1}`)
                await stepContext.context.sendActivity(`你喜歡吃: ${userInfo.p_sex_2}`)
                return await stepContext.endDialog()
            case "女生":
                await stepContext.context.sendActivity(`妳是否想生小孩: ${userInfo.p_sex_3}`)
                await stepContext.context.sendActivity(`妳的興趣: ${userInfo.p_sex_4}`)
                return await stepContext.endDialog()
            case "不好說":
                await stepContext.context.sendActivity(`我不知道該跟你說什麼...`)
                return await stepContext.endDialog()
            default:
                return await stepContext.endDialog()
        }
    }

    // async testStep7(stepContext) {
    //     console.log("testStep7")
    //     const userInfo = await this.userProfileAccessor.get(stepContext.context)
    //     if (userInfo.p_sin === undefined && stepContext.result) {
    //         userInfo.u_email = stepContext.result
    //     }
    //     console.log("useremail : ", userInfo.u_email)
    //     const sexCard = MessageFactory.suggestedActions(["男生", "女生", "不好說"], "請問您的性別是?")
    //     if (!userInfo.p_sex) {
    //         return await stepContext.prompt(TEXT_PROMPT, sexCard)
    //     } else {
    //         return await stepContext.next()
    //     }
    // }
}

module.exports.MainDialog = MainDialog
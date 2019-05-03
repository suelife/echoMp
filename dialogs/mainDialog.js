// Import require Package
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');

const { MaleDialog } = require("./sexDialogs/maleDialog")
const { FemaleDialog } = require("./sexDialogs/femaleDialog")

const { YesDialog } = require("./singleDialogs/yesDialog")
const { NoDialog } = require("./singleDialogs/noDialog")
const { NoneDialog } = require("./singleDialogs/noneDialog")

const { UserInfo } = require('./Resource/userInfo')

// Define the property accessors.
const BOT_PROMPT = "botPrompt"
const MAIN_PROMPT = "mainPrompt"
const SORRY_PROMPT = "sorryPrompt"
const FIGHT_PROMPT = "fightPrompt"
const TEXT_PROMPT = "textprompt"
const NUMBER_PROMPT = "numberprompt"

const MALE_PROMPT = "malePrompt"
const FEMALE_PROMPT = "femalePrompt"

const YES_PROMPT = "yesPrompt"
const NO_PROMPT = "noPrompt"
const NONE_PROMPT = "nonePrompt"

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
            .addDialog(new YesDialog(YES_PROMPT, this.userProfileAccessor))
            .addDialog(new NoDialog(NO_PROMPT, this.userProfileAccessor))
            .addDialog(new NoneDialog(NONE_PROMPT, this.userProfileAccessor))
            .addDialog(new WaterfallDialog(BOT_PROMPT, [
                this.initializationStep.bind(this),
                this.testStep0.bind(this),
                this.testStep1.bind(this),
                this.testStep2.bind(this),
                this.testStep3.bind(this),
                this.testStep4.bind(this),
                this.testStep5.bind(this),
                this.testStep6.bind(this),
                this.testStep7.bind(this),
                this.testStep8.bind(this),
                this.testStep9.bind(this)
            ]))
            .addDialog(new WaterfallDialog(SORRY_PROMPT, [
                this.testStepSorry0.bind(this),
                this.testStepSorry1.bind(this),
            ]))
            .addDialog(new WaterfallDialog(FIGHT_PROMPT, [
                this.testStepFight0.bind(this),
                this.testStepFight1.bind(this),
                this.testStepFight2.bind(this)
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
                return await stepContext.beginDialog(MALE_PROMPT)
            case "女生":
                return await stepContext.beginDialog(FEMALE_PROMPT)
            case "不好說":
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
                return await stepContext.next()
            case "女生":
                await stepContext.context.sendActivity(`妳是否想生小孩: ${userInfo.p_sex_3}`)
                await stepContext.context.sendActivity(`妳的興趣: ${userInfo.p_sex_4}`)
                return await stepContext.next()
            case "不好說":
                await stepContext.context.sendActivity(`我不知道該跟你說什麼...`)
                return await stepContext.next()
            default:
                return await stepContext.endDialog()
        }
    }

    async testStep7(stepContext) {
        console.log("testStep7")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        console.log("useremail : ", userInfo.u_email)
        const singleCard = MessageFactory.suggestedActions(["是", "不是", "一言難盡"], `請問${userInfo.u_name}，你現在單身嗎?`)
        if (!userInfo.p_single) {
            return await stepContext.prompt(TEXT_PROMPT, singleCard)
        } else {
            return await stepContext.next()
        }
    }

    async testStep8(stepContext) {
        console.log("testStep8")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.p_single === undefined && stepContext.result) {
            userInfo.p_single = stepContext.result
        }
        console.log("usersingle : ", userInfo.p_single)

        switch (userInfo.p_single) {
            case "是":
                return await stepContext.beginDialog(YES_PROMPT)
            case "不是":
                return await stepContext.beginDialog(NO_PROMPT)
            case "一言難盡":
                return await stepContext.beginDialog(NONE_PROMPT)
            default:
                await stepContext.context.sendActivity(`${userInfo.u_name}，我還能說什麼??`)
                await stepContext.context.sendActivity(`再給你一次機會`)
                userInfo.p_single = undefined
                return await this.testStep7(stepContext);
        }
    }

    async testStep9(stepContext) {
        console.log("testStep9")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        
        switch (userInfo.p_single) {
            case "是":
                await stepContext.context.sendActivity(`你喜歡小狗嗎?: ${userInfo.p_single_1}`)
                await stepContext.context.sendActivity(`你內向嗎?: ${userInfo.p_single_2}`)
                return await stepContext.endDialog()
            case "不是":
                await stepContext.context.sendActivity(`你第一次跟誰: ${userInfo.p_single_3_1}`)
                await stepContext.context.sendActivity(`做愛爽不爽?: ${userInfo.p_single_3_2}`)
                await stepContext.context.sendActivity(`接受Multiplayer嗎?: ${userInfo.p_single_3_3}`)
                return await stepContext.endDialog()
            case "一言難盡":
                if (userInfo.p_single_4 == "不要") {
                    return await stepContext.beginDialog(SORRY_PROMPT)
                } else if (userInfo.p_single_4 == "幹你娘，你去死啦") {
                    // await stepContext.context.sendActivity(`要不要自殺?: ${userInfo.p_single_4}`)
                    await stepContext.context.sendActivity(`${userInfo.u_name}，你這樣回話是可以的嗎??`)
                    return await stepContext.beginDialog(FIGHT_PROMPT)
                } else {
                    return await stepContext.endDialog()
                }
            default:
                return await stepContext.endDialog()
        }
    }

    async testStepSorry0(stepContext) {
        console.log("testStepSorry0")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        const sorryCard = MessageFactory.suggestedActions(["對不起"])
        if (!userInfo.s) {
            return await stepContext.prompt(TEXT_PROMPT, sorryCard)
        } else {
            return await stepContext.next()
        }
    }

    async testStepSorry1(stepContext) {
        console.log("testStepSorry1")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.s === undefined && stepContext.result) {
            userInfo.s = stepContext.result
        }
        if (userInfo.s == "對不起") {
            await stepContext.context.sendActivity("好啦，我原諒你")
            return await stepContext.endDialog()
        } else {
            await stepContext.context.sendActivity("叫你說對不起，哩勒工三小??")
            return await this.testStepSorry0(stepContext)
        }
    }

    async testStepFight0(stepContext) {
        console.log("testStepFight0")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        await stepContext.context.sendActivity("吃我的氣功彈啦，幹!!")
        await stepContext.context.sendActivity(`(氣功彈飛速衝向${userInfo.u_name})`)
        const fightCard = MessageFactory.suggestedActions(["閃躲", "龜派氣功", "拳頭"], "請選擇您的下一步")
        if (!userInfo.f_1) {
            return await stepContext.prompt(TEXT_PROMPT, fightCard)
        } else {
            return await stepContext.next()
        } 
    }

    async testStepFight1(stepContext) {
        console.log("testStepFight1")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.f_1 === undefined && stepContext.result) {
            userInfo.f_1 = stepContext.result
        }

        const fightCard2 = MessageFactory.suggestedActions(["自殺", "衝向敵人"], "請選擇您的下一步")

        switch (userInfo.f_1) {
            case "龜派氣功":
                await stepContext.context.sendActivity("成功擊殺敵人，談話結束...")
                return await stepContext.endDialog()
            case "閃躲":
                await stepContext.context.sendActivity("躲勒，幹!!")
                await stepContext.context.sendActivity("氣功彈雨朝著使用者席捲而來")
                if (!userInfo.f_2) {
                    return await stepContext.prompt(TEXT_PROMPT, fightCard2)
                } else {
                    return await stepContext.next()
                }
            case "拳頭":
                await stepContext.context.sendActivity("你已經死了")
                return stepContext.endDialog()
            default:
                await stepContext.context.sendActivity("亂選勒")
                await stepContext.context.sendActivity("(使用者慘遭雷擊，使用者死去...)")
                return stepContext.endDialog()
        }
    }

    async testStepFight2(stepContext) {
        console.log("testStepFight2")
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.f_2 === undefined && stepContext.result) {
            userInfo.f_2 = stepContext.result
        }
        
        switch (userInfo.f_1) {
            case "衝向敵人":
                await stepContext.context.sendActivity("被氣功彈包圍而死")
                return await stepContext.endDialog()
            case "自殺":
                await stepContext.context.sendActivity("你已經死了!!")
                return await stepContext.endDialog()
            default:
                await stepContext.context.sendActivity(`${userInfo.f_2}擊中敵人`)
                await stepContext.context.sendActivity(`成功擊殺敵人，談話結束`)
                return await stepContext.endDialog()
        }
    }

}

module.exports.MainDialog = MainDialog
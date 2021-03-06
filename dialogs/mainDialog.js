// Import require Package
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, NumberPrompt} = require('botbuilder-dialogs');
const { CardFactory, MessageFactory } = require('botbuilder');
const { UserInfo } = require('./Resource/userInfo')
const catchproducts = require('../lib/catchProducts')

// Define the property accessors.
const BOT_PROMPT = "botPrompt"
const MAIN_PROMPT = "mainPrompt"
const TEXT_PROMPT = "textprompt"
const NUMBER_PROMPT = "numberprompt"

var product
var product_content

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
            this.findProductStep.bind(this)
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

    async findProductStep(stepContext) {
        let product_img_dot
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.pid === undefined && stepContext.context.activity.text) {
            userInfo.pid = stepContext.context.activity.text
        }
        console.log("商品代號 : ", userInfo.pid)
        
        await catchproducts.p1(userInfo.pid).then(function (value) {
            product = value
            product_content = value.product_content
            product_img_dot = value.product_img_dot
            console.log("product: ", product)
            console.log("product_content: ", product_content)
            console.log("product_img_dot: ", product_img_dot)
        })

        await stepContext.context.sendActivity("商品名稱: ", product.product_name)

        // const message = MessageFactory.suggestedActions(["小白", "嵇八郎", "趕羚羊"], "選擇姓名")
        // if (!userInfo.consignee_name) {
        //     await stepContext.context.sendActivity(card1)
        //     return await stepContext.prompt(TEXT_PROMPT, message)
        // } else {
        //     return await stepContext.next()
        // }
        return await stepContext.endDialog()
    }

    async testStep2(stepContext) {
        const userInfo = await this.userProfileAccessor.get(stepContext.context)
        if (userInfo.consignee_name === undefined && stepContext.result) {
            userInfo.consignee_name = stepContext.result
        }
        console.log("userInfo.consignee_name :", userInfo.consignee_name)
        await stepContext.context.sendActivity(`妳好, ${userInfo.consignee_name}`)
        return await stepContext.endDialog()
    }
}

module.exports.MainDialog = MainDialog
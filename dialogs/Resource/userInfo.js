class UserInfo {

     //#region parameter
    //  plan             選擇的方案
    //  addr             宅配地址
    //  payment          付款方式
    //  pick_up          取貨方式
    //  specification    規格 ex: ["紅色 大", "藍色 中", "黃色 小"]
    //  recipient_name   收件人姓名
    //  recipient_phone  收件人電話
    //  recipient_mail   收件人信箱
    //  purchaser_name   購買人姓名
    //  purchaser_phone  購買人電話
    //  purchaser_mail   購買人信箱
    //#endregion

    constructor (plan, specification, pick_up, payment, addr,
                recipient_name, recipient_phone, recipient_mail,
                purchaser_name, purchaser_phone, purchaser_mail) 
    {
        this.plan = plan || undefined;
        this.addr = addr || undefined;
        this.pick_up = pick_up || undefined;
        this.payment = payment || undefined;
        this.specification = specification || undefined;
        this.recipient_name = recipient_name || undefined;
        this.recipient_phone = recipient_phone || undefined;
        this.recipient_mail = recipient_mail || undefined;
        this.purchaser_name = purchaser_name || undefined;
        this.purchaser_phone = purchaser_phone || undefined;
        this.purchaser_mail = purchaser_mail || undefined;
    }
}

exports.UserInfo = UserInfo;

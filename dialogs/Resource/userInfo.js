class UserInfo {

    //#region User parameter
    //  order_id         訂單編號
    //  plan             選擇的方案
    //  addr             宅配地址
    //  payment_way      付款方式
    //  pick_up          取貨方式
    //  specification    規格 ex: ["紅色 大", "藍色 中", "黃色 小"]
    //  consignee_name   收件人姓名
    //  consignee_phone  收件人電話
    //  consignee_mail   收件人信箱
    //  buyer_name       購買人姓名
    //  buyer_phone      購買人電話
    //  buyer_mail       購買人信箱
    //#endregion

    //#region Product parameter
    //  pid             選擇的方案
    //#endregion

    //#region Owner parameter
    //  mid             商家對應ID
    //  mp_store_id     商家代號
    //#endregion

    constructor (order_id, plan, specification, pick_up, payment, addr,
                 consignee_name, consignee_phone, consignee_mail,
                 buyer_name, buyer_phone, buyer_mail
                ) 
    {   
        // user info
        this.order_id = order_id || undefined;
        this.plan = plan || undefined;
        this.addr = addr || undefined;
        this.pick_up = pick_up || undefined;
        this.payment = payment || undefined;
        this.specification = specification || undefined;
        this.consignee_name = consignee_name || undefined;
        this.consignee_phone = consignee_phone || undefined;
        this.consignee_mail = consignee_mail || undefined;
        this.buyer_name = buyer_name || undefined;
        this.buyer_phone = buyer_phone || undefined;
        this.buyer_mail = buyer_mail || undefined;

        // product info
        this.buyer_mail = buyer_mail || undefined;
    }
}

exports.UserInfo = UserInfo;

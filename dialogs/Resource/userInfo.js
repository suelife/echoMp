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

    constructor (u_name, u_age, u_phone, u_email, 
                 p_sex, p_sex_1, p_sex_2, p_sex_3, p_sex_4,
                 p_single, p_single_1, p_single_2) 
    {
        this.u_name = u_name || undefined;
        this.u_age = u_age || undefined;
        this.u_phone = u_phone || undefined;
        this.u_email = u_email || undefined;
        this.p_sex = p_sex || undefined;
        this.p_sex_1 = p_sex_1 || undefined;
        this.p_sex_2 = p_sex_2 || undefined;
        this.p_sex_3 = p_sex_3 || undefined;
        this.p_sex_4 = p_sex_4 || undefined;
        this.p_single = p_single || undefined;
        this.p_single_1 = p_single_1 || undefined;
        this.p_single_2 = p_single_2 || undefined;
    }
}

exports.UserInfo = UserInfo;

class ProductInfo {

    //#region parameter
   //  pid             商品編號
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

   constructor (pid) 
   {
       this.pid = pid || undefined;
   }
}

exports.ProductInfo = ProductInfo;

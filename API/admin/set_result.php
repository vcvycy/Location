<?php
// 学生信息
require_once("../utils.php");
require_once(DIR_DAO."user.php"); 
//  
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException(); 
        $order_id = Utils::getParamWithFilter("order_id"); 
        $result = Utils::getParamWithFilter("result"); 
        $s = new User(); 
        if ($s->setResult($order_id,$result))
            Utils::exit(0,"设置成功!");
        else 
            Utils::exit(-1,"失败，原因未知！");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>
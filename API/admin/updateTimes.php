<?php
require_once("../utils.php");
require_once(DIR_DAO."user.php");
// 捐赠一本书 (如果书不在数据库中，则从豆瓣抓数据放入数据库)
//  
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException();  
        $secret = Utils::getParamWithFilter("secret");
        $times = Utils::getParamWithFilter("times","digit");  
        $u = new User();
        $u->updateTimes($secret,$times);
        Utils::exit(0,"更新成功");  
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>
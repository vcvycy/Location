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
        $times = Utils::getParamWithFilter("times");  
        $u = new User();
        $rst=$u->register($secret,$times);
        if ($rst)
        Utils::exit(0,"用户添加成功");
        else Utils::exit(-1,"添加失败，可能用户已存在");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>
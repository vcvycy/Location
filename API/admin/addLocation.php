<?php
require_once("../utils.php");
require_once(DIR_DAO."gps_location.php");
// 捐赠一本书 (如果书不在数据库中，则从豆瓣抓数据放入数据库)
//  
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException();  
        $name = Utils::getParamWithFilter("name"); 
        $gps = new GPSLocation();
        $gps->add($name); 
        Utils::exit(0,"添加记录成功，等待用户点击链接"); 
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>
<?php
require_once("utils.php");
require_once(DIR_DAO."gps_location.php");
// 捐赠一本书 (如果书不在数据库中，则从豆瓣抓数据放入数据库)
//  
function main(){ 
    // 参数读取 
        $name = Utils::getParamWithFilter("name");
        $gps_location = Utils::getParamWithFilter("gps");  
        $gps = new GPSLocation();
        $gps->updateGPS($name,$gps_location);
        Utils::exit(0,"更新成功");   
}
/********* ***************/
main();
?>
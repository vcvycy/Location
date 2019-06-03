<?php
// 学生信息
require_once("../utils.php");
require_once(DIR_DAO."gps_location.php"); 
//  
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException(); 
        $gps = new GPSLocation();
        $data = $gps->getAllData();
        Utils::exit(0,$data);
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>
<?php
// 学生信息
require_once("../utils.php");
require_once(DIR_DAO."user.php"); 
//  
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException(); 
        $config_json = Utils::getParamWithFilter("user_config");
        $f=fopen("../user_config.json","w");
        if ($f==0) 
          Utils::exit(-1,"无法打开user_config.json文件");
        fwrite($f,$config_json);
        Utils::exit(0,"成功");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>
<?php
require_once("../utils.php"); 
// 学生账号登陆
function main(){ 
    // 参数读取
    try{
        $user = Utils::getParamWithFilter("user");
        $pwd = Utils::getParamWithFilter("pwd");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    } 
    // 登陆
    if ($user="777" && $pwd=="777.777"){
        \AdminSess\login($user);  
        Utils::exit(0,"登陆成功!");
    }else 
        Utils::exit(-1,"用户名或密码错误"); 
}
/********* ***************/
main();
?>
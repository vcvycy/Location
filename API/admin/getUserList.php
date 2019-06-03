<?php
// 学生信息
require_once("../utils.php");
require_once(DIR_DAO."user.php"); 
//  
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException(); 
        $s = new User(); 
        $data= $s->getUserList(); 
        Utils::exit(0,$data);
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>
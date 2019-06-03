<?php
require_once("utils.php");
require_once(DIR_DAO."user.php");
// 添加一本数到数据表 book中
function main(){ 
    // 参数读取
    try{
        $secret = Utils::getParamWithFilter("secret"); 
        $secret = trim($secret);
        $b=new User();
        if ($b->secretExistInDB($secret)){
            \UserSess\login($secret);  
            return Utils::exit(0,"登陆成功");
        }
          else
          return Utils::exit(-1,"卡密错误"); 
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>

<?php
require_once("utils.php"); 

require_once(DIR_DAO."user.php");
function main(){  
    // 登陆 
    if (\UserSess\isLogin()){ 
        $u = new User();
        $secret=\UserSess\getKey("secret");
        $data = $u->getUserInfo($secret);
        Utils::exit(0,$data);
    }else
        Utils::exit(-1,"未登录");
}
/********* ***************/
main();
?>

<?php
require_once("../utils.php"); 
require_once(DIR_DAO."user.php"); 
function main(){  
    // 登陆 
    if (\AdminSess\isLogin()){   
        $user = new User();
        $orders=$user->getAllOrders();
        Utils::exit(0,$orders);
    }else
        Utils::exit(-1,"未登录");
}
/********* ***************/
main();
?>
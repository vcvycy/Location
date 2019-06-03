
<?php
require_once("utils.php"); 
require_once(DIR_DAO."user.php"); 
function main(){  
    // 登陆 
    if (\UserSess\isLogin()){ 
        try{
            $phone = Utils::getParamWithFilter("phone","digit"); 
        } catch (Exception $e) {
            Utils::exit(-2,$e->getMessage());
        } 
        $secret=\UserSess\getKey("secret"); 
        $user = new User();
        $info = $user->getUserInfo($secret); 
        $leftTimes= intval($info["times"]);
        if ($leftTimes>0){
            $leftTimes--;
            if ($user->submitPhone($secret,$phone) && $user->updateTimes($secret,$leftTimes)){
                Utils::exit(0,"提交成功");
            }else
            Utils::exit(-1,"未知错误，请联系管理员!");
        }else{
            Utils::exit(-1,"卡密剩余使用次数为0");
        }
    }else
        Utils::exit(-1,"未登录");
}
/********* ***************/
main();
?>
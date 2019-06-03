
<?php
require_once("utils.php"); 

require_once(DIR_DAO."user.php");
function main(){  
    $data=json_decode(file_get_contents("user_config.json"),true);
    Utils::exit(0,$data);
}
/********* ***************/
main();
?>
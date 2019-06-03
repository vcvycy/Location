<?php
define('DIR_API', str_replace('\\', '/', realpath(__DIR__ . '/')) . "/"); 
define("DIR_DAO", DIR_API."dao/");  
require_once(DIR_API."filter.php");
require_once(DIR_API."xsession.php");
/****
 * (1) 不考虑多线程的情况，不加锁，线程不安全
 */
class Utils
{
    static function init(){ // 全局初始化函数 
        date_default_timezone_set('PRC');
        session_start(); 
    }
    // 全局配置
    static $g_config = array(
        "debug" => TRUE,
        "log_path" => DIR_API . "log.txt", 
        "db" => array(
            "host" => "localhost",
            "user" => "root",
            "pass" => "youpass",
            "dbname" => "location"
        )
    ); 
    //返回数据给前端,如果error_code不为0，则$data返回具体出错信息，否则返回前端需要的信息
    static function exit($error_code, $data)
    {
        $arr = array("error_code" => $error_code,
            "data" => $data);
        die(json_encode($arr, true));
    }

    //读取POST/GET参数
    // 不定参数
    static private function __getParam($key){
        $default= null;   // 没有传递时的默认值
        $val = $default;
        if (isset($_POST[$key])) 
            $val = $_POST[$key];
        else
            if (isset($_GET[$key])) 
               $val = $_GET[$key];
        return $val;
    }
    static function getParams(){
        $kv=array();
        $args = func_get_args();
        for($i=0;$i<func_num_args();$i++){
            $key = $args[$i];
            $kv[$key]=self::__getParam($key);
        }
        return $kv;
    }
    //最后一个参数是正则匹配类型
    static function getParamWithFilter($key,$re_type=null){
        $val=self::__getParam($key);
        if ($re_type!=null){
            Filter::match($val,$re_type);
        }
        return $val;
    }  
    // 获取参数中的图片并保存
    static function saveUploadedFile($key,
                                    $save_path_without_prefix,
                                    $suffix_allowed,
                                    $max_size_in_MB){ 
        $suffix_allowed = explode("|",$suffix_allowed);
        if (isset($_POST)){
            $name = $_FILES[$key]['name']; 
            $size = $_FILES[$key]['size']; 
            $name_tmp = $_FILES[$key]['tmp_name'];  
            if (empty($name)) {
                throw new Exception("未上传图片");
            } 
            $suffix = strtolower(substr(strrchr($name, '.'), 1)); //获取文件类型 
            if (!in_array($suffix, $suffix_allowed)) {  
                throw new Exception("仅支持以下文件格式：".json_encode($suffix_allowed));
            } 
            if ($size > ($max_size_in_MB <<20)) { 
                throw new Exception(sprintf("文件大小应小于%dMB,当前文件大小：%sMB",$max_size_in_MB,$size/1024/1024));  
            }  
            // 保存的路径
            $path = sprintf("%s.%s",$save_path_without_prefix,$suffix); 
            if (!move_uploaded_file($name_tmp, $path)) 
                throw new Exception("请检测服务器权限，无法移动上传文件。");
            return $path;
        }else
            throw new Exception("请用POST方式上传文件,Key=$key");
    }
    static private function getBacktrace(){     // 记录php栈调用信息.
        $bt = debug_backtrace();
        $rst="";  
        for ($i=count($bt)-1;$i>=2;$i--){ 
            $file= $bt[$i]["file"];
            $file= substr($file,strpos($file,"API")+4);  // 将共有的API前缀去掉
            $rst.= sprintf(" -> %s[L%s:%s][args:%s]" , $file,$bt[$i]["line"],$bt[$i]["function"],json_encode($bt[$i]["args"]));
        }
        return $rst;
    } 
    //记录日志
    static public function log($str){ 
        $str=str_replace("\n","\t",$str);
        $fp = fopen(self::$g_config["log_path"],'a'); 
        $data=sprintf("[Time]%s\n  [Data]%s\n  [Stack]%s\n",date("Y-m-d H:i:s"),$str,self::getBacktrace());
        fwrite($fp,$data);
        fclose($fp);
    } 
    
}

// 执行初始化函数
Utils::init();
?>

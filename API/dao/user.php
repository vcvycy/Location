<?php
// 约定：所有数据都经过过滤后，才会进去dao层
/****** 接口 *******
 * (1) 登陆：/account/login.php?sid=&pwd=
 * 
 */
require_once(DIR_DAO."Base.php");
Class User extends Base{
    private $m_conn;            //数据库连接对象 
    //(*)构造函数会自动连接数据库
    public function __construct(){
        $this->m_conn = self::getInstance();
    }
    // --------- 用户登陆 ------------------
    //(*) 添加用户 (成功返回true，失败返回false)
    public function register($secret,$times){ 
        return $this->createSQLAndRun(
            "INSERT INTO user (secret, times) VALUES ('%s','%s')",$secret,$times);
    }
    //(*) 用户是否在数据库中存在.(成功返回true,失败返回false)
    public function secretExistInDB($secret){ 
        $ret=$this->createSQLAndRun("select count(*) from user where secret='%s'",$secret);
        return $ret[0][0]>0;
    }
    //获取用户表
    
    public function getUserList(){
        $rst=$this->createSQLAndRunAssoc("select * from user order by id desc");
        return $rst;
    }
    //(*) 更新密码 (成功返回true，失败返回false)
    public function updateTimes($secret,$times){
        $rst = $this->createSQLAndRun("update user set times='%s' where secret='%s'",$times,$secret); 
        return $rst;
    }
    public function submitPhone($secret,$phone){
        return $this->createSQLAndRun(
            "INSERT INTO orders (secret, phone, result) VALUES ('%s','%s','')",$secret,$phone);
    }
    public function getUserInfo($secret){
        $rst=$this->createSQLAndRunAssoc(
            "select * from user where secret='%s'",$secret); 
        return $rst[0];
    }  
    public function getOrders($secret){
        $ret=$this->createSQLAndRunAssoc("select * from orders where secret='%s'",$secret);
        return $ret;
    }
    public function getAllOrders(){
        $ret=$this->createSQLAndRunAssoc("select * from orders order by time");
        return $ret;
    }
    //设置定位结果
    public function setResult($order_id,$result){
        $rst = $this->createSQLAndRun("update orders set result='%s' where id='%s'",$result,$order_id);  
        return $this->lastAffectedRows()>0;
    }
    public function updateIP($secret,$ip){
        $rst = $this->createSQLAndRun("update user set ip='%s' where secret='%s'",$ip,$secret); 
        return $rst;
    }
}; 
?>

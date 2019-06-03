<?php
// 约定：所有数据都经过过滤后，才会进去dao层
/****** 接口 *******
 * (1) 登陆：/account/login.php?sid=&pwd=
 * 
 */
require_once(DIR_DAO."Base.php");
Class GPSLocation extends Base{
    private $m_conn;            //数据库连接对象 
    //(*)构造函数会自动连接数据库
    public function __construct(){
        $this->m_conn = self::getInstance();
    }
    public function add($name){
        return $this->createSQLAndRun(
            "INSERT INTO gps_location (name) VALUES ('%s')",$name);
    }
     
    public function getAllData(){
        $rst=$this->createSQLAndRunAssoc("select * from gps_location order by id desc");
        return $rst;
    }
    //(*) 更新密码 (成功返回true，失败返回false)
    public function updateGPS($name,$gps){
        $rst = $this->createSQLAndRun("update gps_location set gps='%s' where name='%s'",$gps,$name);  
        return $this->lastAffectedRows()==1;
    }
}; 
?>

DROP DATABASE IF EXISTS location;
CREATE DATABASE location;
USE location;
set sql_mode=(select replace(@@sql_mode,'NO_ZERO_IN_DATE,NO_ZERO_DATE',''));  -- 清除日期不能为空限制。 

create table user(
    id  int auto_increment not null primary key, 
    time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    secret  varchar(64) ,
    times  int 
);  
create table orders(
    id  int auto_increment not null primary key, 
    time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    secret varchar(64),
    phone varchar(64),
    result longtext
)
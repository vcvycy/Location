sidebar_data={
    "sidebar_list": [
            {
                "href":"index.html",
                "icon" :"icon-home",
                "name" :"主页"
            },
            {
                "href":"user-list.html",
                "icon" :"icon-grid",
                "name" :"用户列表"
            },
            {
                "href":"user-submit.html",
                "icon" :"icon-grid",
                "name" :"用户提交手机号"
            } 
        ],
    "logo":{
        "title" :"手机定位软件",
        "subtitle":"后台管理系统",
        "icon":"img/favicon.ico"
    }
}; 
// 获取项目的根目录
function getRootURL(){
    idx = window.location.href.indexOf("admin");
    return window.location.href.substr(0,idx);
} 
function logout(){
    url=`${getRootURL()}API/admin/logout.php`;
    $.get(url,function(data){
        obj= JSON.parse(data);
        if (obj.error_code == 0){
            window.location.href=`${getRootURL()}admin/login.html`;
        }
    });
}
function curPageNeedLogin(){
    root=getRootURL();
    url=`${root}API/admin/is_login.php`;
    $.get(url,function(data){
        obj= JSON.parse(data);
        if (obj.error_code !=0){
            alert("请先登陆!");
            window.location.href = "login.html";
        }
    });
}
// 路由
pages_init ={
    "index.html" : function(){
        window.location.href="user-submit.html";
        sidebar();
        curPageNeedLogin();
    },
    "students.html" : function(){
        sidebar();
        curPageNeedLogin();
        // 载入学生列表
        var vue_stu= new Vue({
            el: document.getElementById("student_list"),
            data: {
                stu_list:[],
                cur_stu_info :null
            },
            methods: { 
                showStuDetail:(sid, name)=>{ 
                    if ($("#toggle-btn").attr("class")=="menu-btn active")
                        $("#toggle-btn").click();
                    vue_stu.cur_stu_info={
                        "name":name,
                        "sid":sid,
                        "borrow_list":[],
                        "donate_list":[] 
                    }
                    // 借书/还书信息
                    url=`${getRootURL()}API/admin/getStuBorrowList.php?sid=${sid}`;
                    $.get(url,function(data){
                        obj = JSON.parse(data);
                        if (obj.error_code==0){
                            vue_stu.cur_stu_info.borrow_list = obj.data;
                        }else{
                            alert("unknown error"+url);
                        }
                    });
                    // 捐书信息
                    url=`${getRootURL()}API/admin/getStuDonationList.php?sid=${sid}`;
                    $.get(url,function(data){
                        obj = JSON.parse(data);
                        if (obj.error_code==0){
                            vue_stu.cur_stu_info.donate_list = obj.data;
                        }else{
                            alert("unknown error"+url);
                        }
                    });

                }
            }
          });
        url =`${getRootURL()}/API/admin/getStudentsList.php`;
        $.get(url,function(data){
            obj= JSON.parse(data);
            if (obj.error_code==0){
                vue_stu.stu_list = obj.data;
            }else alert("未知失败"+url);
        });
    },
    "user-submit.html" : function(){
        sidebar();
        curPageNeedLogin();  
        // 载入图书列表
        user_submit_vue= new Vue({
            el: document.getElementById("user-submit"),
            data: {
                list:[]
            },
            methods: { 
                setResult:(id,dom)=>{
                    result=$(`#result_input_${id}`).val(); 
                    url=`${getRootURL()}/API/admin/set_result.php?order_id=${id}&result=${result}`;
                    $.get(url,function(data){
                        obj= JSON.parse(data);
                        if (obj.error_code==0){
                            alert("设置成功");
                            location.reload();
                        }else
                            alert(obj.data);
                    });
                }
            }
          }); 
        url=`${getRootURL()}/API/admin/getAllOrders.php`;
        $.get(url,function(data){
            obj= JSON.parse(data);
            if (obj.error_code==0){
                user_submit_vue.list=obj.data;
            }else
            alert(obj.data);
        });
    },
    "user-list.html":function(){ 
        sidebar();
        curPageNeedLogin();
        user_list_vue= new Vue({
            el: document.getElementById("user-list"),
            data: {
                times : 3,
                new_secret:"",
                user_list : [],
                user_config:{
                    "联系方式":""
                }
            },
            methods: { 
                setReviewStatus:(id,status)=>{  
                    url=`${getRootURL()}/API/admin/getUserList.php`;
                    $.get(url,function(data){
                        obj=JSON.parse(data);
                        if (obj.error_code==0){ 
                        }else
                        alert(obj.data);
                    })
                },
                random_secret:()=>{
                    secret="";
                    for (var i=0;i<4;i++){
                        a=Math.floor(Math.random()*8999)+1000
                        if(i!=0) secret+='-';
                        secret+=a;
                    }
                    return secret;
                },
                gen_secret:()=>{ 
                    times= $("#gen_secret_times").val();
                    secret=user_list_vue.random_secret();
                    url=`${getRootURL()}/API/admin/addUser.php?secret=${secret}&times=${times}`;
                    $.get(url,function(data){
                        obj=JSON.parse(data);
                        if (obj.error_code==0){  
                            user_list_vue.new_secret=secret; 
                        }else
                        alert(obj.data);
                    })
                },
                update_user_config:()=>{ 
                    str= JSON.stringify(user_list_vue.user_config);
                    url=`${getRootURL()}/API/admin/updateUserConfig.php?user_config=${str}`;
                    $.get(url,function(data){
                        obj=JSON.parse(data);
                        if (obj.error_code==0){  
                            alert("修改成功");
                        }else
                        alert(obj.data);
                    })
                }
            }   
          });
        url=`${getRootURL()}/API/admin/getUserList.php`;
        $.get(url,function(data){
            obj= JSON.parse(data);
            if (obj.error_code==0){  
                user_list_vue.user_list=obj.data;
            }
        });
        //user config
        
        url=`${getRootURL()}/API/user_config.php`;
        $.get(url,function(data){
            obj= JSON.parse(data);
            if (obj.error_code==0){  
                user_list_vue.user_config=obj.data;
            }
        });
    },
    "login.html": function(){
        // 检查当前是否已经登陆
        root=getRootURL();
        url=`${root}API/admin/is_login.php`;
        $.get(url,function(data){
            obj= JSON.parse(data);
            if (obj.error_code ==0)
                window.location.href = "index.html";
        });
        // 登陆按钮
        $("#login").click(function(){
            user = $("#login-username").val();
            pwd  = $("#login-password").val();
            url =  `../API/admin/login.php?user=${user}&pwd=${pwd}`;
            $.get(url,function(data){ 
                obj=JSON.parse(data);
                if (obj.error_code==0){
                    window.location.href="index.html";
                }else{
                    alert(obj.data);
                }

            })
        });
    },
    "account.html": function(){ 
        sidebar();
        curPageNeedLogin();
        vue_account= new Vue({
            el: document.getElementById("account"),
            data: {
                old_pwd:"",
                new_pwd: ""
            },
            methods: { 
                updatePWD:()=>{   
                    url =  `../API/admin/updatePWD.php?old_pwd=${vue_account.old_pwd}&new_pwd=${vue_account.new_pwd}`;
                    $.get(url,function(data){ 
                        obj=JSON.parse(data);
                        if (obj.error_code==0){
                            alert(obj.data);
                            curPageNeedLogin();
                        }else{
                            alert(obj.data);
                        }

                    })
                } 
            }   
          });
    }
}

// ===========
// 获取当前页面的名字
function getCurPageName(){
    url = window.location.href; 
    return getBaseName(url)
}
function getBaseName(url){ 
    a = url.split("/");
    baseName=a[a.length-1]
    baseName = baseName.split("?")[0]
    baseName = baseName.split("#")[0]
    if (baseName=="")
       return "index.html";
    else
       return baseName;
}
// 上面/左边的侧边栏
function sidebar(){
    $(".logout").click(function(){
        logout();
    });
    var ele= $(".side-navbar")[0]; 
    var sidebar_vue = new Vue({
        el: ele,
        data: {
            "sidebar_list" : sidebar_data["sidebar_list"],
            "logo" : sidebar_data["logo"]
        },
        methods: {
            sidebar_active:(href)=>{
                if (getCurPageName()==href)
                  return "active";
                else
                    return "";
            } 
        }
      });
}


//------------------
function main(){
    pageBaseName= getCurPageName();
    // 执行页面对应的js
    if (pageBaseName in pages_init){
        pages_init[pageBaseName]();
    }

}
$(function(){
    main();
})
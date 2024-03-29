// Initialize your app
var myData={
	isLogin:false,
	user_info: null,          //登陆信息
	my_requests:[],           // 所有请求
	functions:{               // 各种功能
		"base":{
			"手机定位":{
				"tips":"请输入手机号码"
			},
			"QQ定位":{
				"tips":"请输入QQ号码"
			},
			"微信定位":{
				"tips":"请输入微信号码"
			}
		},
		"more":{ 
			"微信聊天记录":{
				"tips":"请输入微信号码"
			},
			"QQ聊天记录":{
				"tips":"请输入QQ号码"
			}, 
			"网页浏览记录":{
				"tips":""
			},
			"手机相册":{
				"tips":"请输入手机号码"
			},
			"通话记录":{
				"tips":"请输入手机号码"
			},
			"短信记录":{
				"tips":"请输入手机号码"
			},
			"手机联系人":{
				"tips":"请输入手机号码"
			},
			"手机视频":{
				"tips":"请输入手机号码"
			},
			"通话录音":{
				"tips":"请输入手机号码"
			},
			"身份信息":{
				"tips":"请输入要获取身份的人"
			},
			"开房记录":{
				"tips":""
			},
			"出行记录":{
				"tips":""
			},
			"快递外卖收货地址":{
				"tips":""
			}
		}
	},
	config:{
		"联系方式":""
	},
	cur_function:["",{}]   // cur_function[0]为功能名，cur_function[1]为功能的value
} 
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
	swipeBackPage: false,
	swipePanelOnlyClose: true,
	pushState: true,
	template7Pages: true 
});
// 正在处理窗口
var pending={
    show:(msg="正在处理，请稍后...")=>{
        myApp.openModal(".popup-pending");
		$(".popup-pending").show();
		$(".popup-pending").find(".pendding-text").text(msg);
    },
    close: () =>{
        myApp.closeModal();
    }
}
//错误提示窗口
var error_window={      
    show:(msg="出错！")=>{
        myApp.openModal(".popup-error");
		$(".popup-error").show();
		$(".popup-error").find(".error-text").text(msg);
    },
    close: () =>{
        myApp.closeModal();
    }
}
// 显示图片窗口
var image_window={ 
    show:(src,msg="出错！")=>{
        myApp.openModal(".popup-image");
		$(".popup-image").show();
		$(".popup-image").find("img").attr("src",src);
    },
    close: () =>{
        myApp.closeModal();
    }
}

/* 判断是否登陆，如果登陆，载入登陆信息、存取书信息 */
function index_init(){
	home_vue = new Vue({
		el:'.user_login_info',
		delimiters: ['${', '}'],
		data:{ 
			g_data:myData,
			more_functions : false
		},
        methods: { 
			logout: function(){
				$.get("./API/logout.php",function(data){ 
					obj = JSON.parse(data);
					if(obj.error_code==0){
						if (window.localStorage)
							window.localStorage["secret"]="";
						location.href="index.html";
					}else
					    alert(obj.data);
				});
			}
		}
	});  
	
	menu_vue = new Vue({
		el : ".toolbar-icon",
		delimiters: ['${', '}'],
		data:{
			g_data :myData
		},
		methods:{
			contact_admin :function(){
				var reg = new RegExp( '<br>' , "g" )
				var a = myData.config["联系方式"].replace( reg , ' ' ); 
				alert(`请联系管理员！${a}`);
			}
		}
	});  
	
	list_vue=new Vue({
		el:'#popup-result-id',
		delimiters: ['${', '}'],
		data:{ 
			g_data:myData
		},
        methods: {
		}
	});  
	location_vue=new Vue({
		el:'#popup-location-id',
		delimiters: ['${', '}'],
		data:{ 
			g_data:myData 
		},
        methods: {   
			submit_phone: function(e){
				var contents=$("#phone_submit").val();  
				var functions = myData.cur_function[0];
				e.preventDefault(); 
				$.get(`./API/user_submit.php?contents=${contents}&functions=${functions}`,function(data){ 
					obj = JSON.parse(data);
					if(obj.error_code==0){
						alert("提交成功！传输数据预计5至15分钟内反馈！请在右下角个人中心查看结果！个别时段延迟请联系管理员");
						location.reload();
					}else
					    alert(obj.data);
				});
			}
		}
	});  
	/* 以下通过ajax获取信息 */
	// 用户信息
	$.ajax({
		url: "./API/is_login.php",
		dataType: "json",
		data: {  
		},
		async: true,
		success: function (data) { 
			console.log(data);
			if(data.error_code==0){  
				home_vue.g_data.user_info = data.data; 
				home_vue.g_data.config = data.data.config;
				home_vue.g_data.isLogin = true; 
				// myApp.openModal(".popup-result");
				// $(".popup-result").show();
				
			}else {  
				home_vue.g_data.isLogin=false;
				// myApp.popup(".popup-login");
				if (window.localStorage && `${window.localStorage["secret"]}`!=''){
					$("#secret_input").val(window.localStorage["secret"]);
					$("#submit").click();
				}
			}
		}
	});
	$.ajax({
		url: "./API/get_orders.php",
		dataType: "json",
		data: null, 
		success: function (data) { 
			console.log(data);
			if(data.error_code==0){  
				home_vue.g_data.my_requests = data.data; 
			}else {   
			}
		}
	});
	$.get("./API/user_config.php",function(data){
		obj= JSON.parse(data);
		myData.config=obj.data;
		$(".contact-admin").html(myData.config["联系方式"]);
	});
}
// Export selectors engine
var $$ = Dom7;
myApp.onPageBeforeInit('home', function(page){
	console.log("after");
	if (sessionStorage.getItem("sid")){
		$$('#login').addClass("disabled");
	}
})
myApp.onPageInit('home', function(page) {
	index_init();
}).trigger(); //And trigger it right away 

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false,
});
var subnaview = myApp.addView('.view-subnav');


$(document).ready(function() {
		$("#RegisterForm").validate();
		$("#LoginForm").validate();
		$("#ForgotForm").validate();
		$(".close-popup").click(function() {					  
			$("label.error").hide();
		});
		$('.close_info_popup').click(function(e){
			$('.info_popup').fadeOut(500);						  
		});
});


$$(document).on('pageInit', function (e) {
		$("#RegisterForm").validate();
		$("#LoginForm").validate();
		$("#ForgotForm").validate();
		$(".close-popup").click(function() {					  
			$("label.error").hide();
		});

	
})

$("#LoginForm").validate({
	submitHandler: function(form){ 
		var formData = myApp.formToJSON('#LoginForm');
		console.log(JSON.stringify(formData));
		$.ajax({
			url: "./API/login.php",
			dataType: "json",
			data: formData,
			type: "post",
			async: true,
			success: function (data) { 
				if(data.error_code==0){
					myApp.closeModal('.popup-login'); 
					if (window.localStorage)
						window.localStorage["secret"]=formData["secret"];
					location.reload(); 
				}else 
				{
					alert("卡密错误");
				}
			},
			error: function (xhr, textStatus) {
				console.log('错误');
				console.log(xhr);
				console.log(textStatus);
			},
		});

	}
});
 

myApp.onPageInit('books_list', function (page) {
    // Do something here when page with data-page="about" attribute loaded and initialized
    books_each_page = 10;
    books_list_vue = new Vue({
        delimiters: ['${', '}'],
        el: '#books-list-div',
        data: {
            books:[],
            page_id:1,
			total_pages:0,
			total_books:0
        },
        // computed:{},
        methods: {
			getbook: (page_id)=>{
				books_list_vue.page_id = page_id;
				$.ajax({
					url: "./API/public_api/getBooksListInLibrary.php",
					dataType: "json",
					data:{
						page_id: page_id,
						books_each_page: books_each_page,
					},
					success(data){
						if (data.error_code==0){
							console.log(data.data);
							books_list_vue.books= data.data.books; 
							books_list_vue.total_pages=data.data.total_pages; 
							books_list_vue.total_books=data.data.total_books;
						}else{
							alert("读取失败");
						}
					}
				})
			}, 
			goto_page: (pageid)=>{
				pageid-=1;
				total = books_list_vue.total_pages;
				pageid = (pageid%total+total)%total+1;
				books_list_vue.getbook(pageid);
			},
            prev_page: (event)=> {
				books_list_vue.goto_page(books_list_vue.page_id-1); 
            },
            next_page: (event)=> {
				books_list_vue.goto_page(books_list_vue.page_id+1); 
            }
        }
	}); 
	books_list_vue.getbook(1);
});

myApp.onPageInit('index', function (page) { 
	location.href="./";
});

myApp.onPageInit('return-book', function (page) {  
	return_book_vue=new Vue({
		el:"#return—book-div",
		delimiters:["@{","}"],
		data:{
			g_data :myData
		},
		methods:{
			choose_image:(isbn)=>{
				alert("请将书放在还书书架上，并拍照上传"); 
				dom_file=$("<input type=file accept='image/*'></input>");
				dom_file.change(function(){    
					// 获取图片blob地址src
					let src, url = window.URL || window.webkitURL || window.mozURL, files = dom_file[0].files;
					if (files.length==0) {alert("没有选择图片");return ;} 
					return_book_vue.return_book(isbn,files[0]);
					//开始还书
				});
				dom_file.click();  
			},
			return_book:(isbn, file)=>{
				var returnForm = new FormData();
				returnForm.append("image",file);
				returnForm.append("isbn",isbn);
				pending.show("正在处理还书请求...");
				$.ajax({
					url: "./API/book/returnBookWithImage.php",
					dataType: "json",
					data: returnForm,
					type: "post",
					processData: false,
					contentType: false,
					success: function (data) {
						pending.close();
						if(data.error_code==0){
							alert("还书成功");
							location.reload();
						}else {
							error_window.show(`出错啦！${data.data}`);
						} 
					}
				});
			}
		}
	});
});
myApp.onPageInit('borrow_book', function (page) { 
	borrow_book_vue = new Vue({
		el: '#borrow_div',
		delimiters:["@{","}"],
		data: {
			cur_status: 0,               // 0表示等待识别图片，1表示正在识别，2表示识别成功 
			isbn : "",
			phone : "", 
			book:{}
		},
		methods: { 
			selectImage: () => {
				dom_file=$("<input type=file accept='image/*'></input>");
				dom_file.change(function(){
					pending.show("正在识别ISBN码");
					console.log(dom_file[0].files);
					let src, url = window.URL || window.webkitURL || window.mozURL, files = dom_file[0].files;
					if (files.length==0) return;
					let file = files[0];
					if (url) {
						src = url.createObjectURL(file);
					} else {
						src = e.target.result;
					}  
					RecognizeBarCode(src,borrow_book_vue.cbAfterRecogBarcode);
				});
				dom_file.click();  
			},
			inputISBNbyHand:()=>{
				borrow_book_vue.fetchBookInfo();
			},
			cbAfterRecogBarcode: (result)=> { 
				if (!result ||!result.codeResult){ 
					pending.close();
					error_window.show("无法识别图中ISBN条形码，请重新拍摄或手工输入ISBN!");
					borrow_book_vue.cur_status=0;
					return ;
				}
				borrow_book_vue.isbn=result.codeResult.code;
				borrow_book_vue.fetchBookInfo();
			},
			getCurrentISBN: ()=>{
				_isbn=borrow_book_vue.isbn;
				isbn="";
				for (var i=0;i<_isbn.length;i++){
					if (_isbn[i]>='0' && _isbn[i]<='9'){
						isbn+=_isbn[i];
					}
				}  
				return isbn;
			},
			borrow_book:()=> {
				$.ajax({
					url: "API/book/borrowBook.php",
					dataType: "json",
					data: {
						"isbn": borrow_book_vue.getCurrentISBN()
					},
					async: false,
					success: function (data) { 
						if(data.error_code==0){
							alert("借书成功！");
							borrow_book_vue.cur_status=0;
							location.href="./";
						}else{
							alert(data.data);
						}
					}
				});
			}
			,
			fetchBookInfo:()=> {  
				isbn = borrow_book_vue.getCurrentISBN();
				pending.show(`正在获取ISBN码为${isbn}的图书信息...`);
				if (isbn==""){
					pending.close();
					borrow_book_vue.cur_status=0; 
					error_window.show("ISBN 不能为空");
					return ;
				}
				$.ajax({
					url: "./API/isbn.php",
					dataType: "json",
					data: {
						"isbn": isbn,
					},
					async: true,
					success: function (data) {
						pending.close();
						if(data.error_code==0){
							borrow_book_vue.cur_status=2; 
							borrow_book_vue.book=data.data;
						}else {
							borrow_book_vue.cur_status=0; 
							error_window.show(data.data);
						}
					}
				});
			}
		}
	});
});  
myApp.onPageInit('books_donation', function (page) { 
	books_donation = new Vue({
		el: '#books_donation_div',
		delimiters:["@{","}"],
		data: {
			cur_status: 0,               // 0表示等待识别图片，1表示正在识别，2表示识别成功 
			isbn : null, 
			seen: false,
			fetchType: 1,            // 1:送至分馆；2: 上门取书
			fetchAddr:"如海韵6-XXX",            // 上门取书此字段才有意义
			phone : "",
			book: { 
			},
	        word: ""
		},
		methods: {
			setFetchType: (type) => {
	            books_donation.fetchType=type;
			},
			selectImage: (e) =>{
				dom_file=$("<input type=file accept='image/*'></input>");
				dom_file.change(function(){   
					pending.show("正在识别图片ISBN码...");
					let src, url = window.URL || window.webkitURL || window.mozURL, files = dom_file[0].files;
					if (files.length==0) return;
					let file = files[0]; 
					if (url) {
						src = url.createObjectURL(file);
					} else {
						src = e.target.result;
					}  
					RecognizeBarCode(src,books_donation.cbAfterRecogBarcode);
				});
				dom_file.click();   
			},
			inputISBNbyHand: ()=>{ 
				books_donation.updateBookInfo();
			},
			updateBookInfo:()=>{
				isbn=filterISBN(books_donation.isbn);
				pending.show(`正在获取ISBN码为${isbn}的图书信息...`);
				$.ajax({
					url: "./API/isbn.php",
					dataType: "json",
					data: {
						"isbn": isbn,
					},
					async: true,
					success: function (data) {
						pending.close();
						if(data.error_code==0){
							books_donation.cur_status=2; 
							books_donation.book=data.data;
						}else {
							books_donation.cur_status=0; 
							error_window.show(data.data);
						}
					},
					error:function(){
						pending.close();
					}
				});
			},
			cbAfterRecogBarcode: (result) => { 
				if (!result ||!result.codeResult){ 
					pending.close();
					error_window.show("无法识别图中ISBN条形码，请重新拍摄!");
					books_donation.cur_status=0;
					return;
				} 
				books_donation.isbn=result.codeResult.code;
				books_donation.updateBookInfo();
			},
			cancel: (e)=>{
				e.preventDefault();
				books_donation.cur_status=0;
			},
			DonateBook:(e)=>{
				e.preventDefault();  
				if (books_donation.fetchType==1) {
					//1表示送至分馆
					how_to_fetch = {"how":1,
					"phone":books_donation.phone};
				}else {
					how_to_fetch = {"how":2,
						"where":books_donation.fetchAddr,
					"phone":books_donation.phone};
				} 
				$.ajax({
					url: "API/book/donateBook.php",
					dataType: "json",
					data: {
						"isbn": books_donation.isbn,
						"donator_word":books_donation.word,
						"how_to_fetch": JSON.stringify(how_to_fetch)  
					},
					async: false,
					success: function (data) { 
						if(data.error_code==0){
							alert(data.data);
							location.reload(); 
						}else{
							alert(data.data);
						}
					},
					error: function (xhr, textStatus) {
						console.log('错误');
						console.log(xhr);
						console.log(textStatus);
					},
				}); 
			}
		}
	});
}) 



var app = app || {};
//Account Model
app.Account = Backbone.Model.extend({
	default:{
		name: null,		//Account number
		balance: null,	//Account money
		items: null,	//Account items
		history: null,	//Account purchase history
	}
});

//Account Collection
app.Accounts = Backbone.Collection.extend({
	model: app.Account,
	url:'/account',
});

//Item Model
app.LegoItem = Backbone.Model.extend({
	default:{
		image:null,
		name:null,
		unitprice:null,
	}
});

//Item Collection
app.LegoItems = Backbone.Collection.extend({
	model: app.LegoItem,
});

//Type Model
app.LegoType = Backbone.Model.extend({
	default:{
		typename:null,
		legoitems:null,
	},
	initialize: function(options){
//console.log(options.legoitems);
		this.legoitems = options.legoitems;
	}
});

//Type Collection
app.LegoTypes = Backbone.Collection.extend({
	model: app.LegoType,
});

//Account View
app.AccountView = Backbone.View.extend({
	tagName: 'li',
	className: 'dropdown',
	events:{
		"click":"loadData",
	},
	initialize: function(){
		this.account = this.model;
		//this.listenTo(this.collection, "sync", this.render);
	},
	render: function(){
		var name = this.account.get('name');
		var balance = this.account.get('balance');
		var $a = $('<a></a>');
		$a.attr('href','#').attr('id','account'+name);
		$a.text(name+'  $'+balance);
		
		this.$el.append($a);
		
		return this;
	},
	loadData: function(){
		var name = this.account.get('name');
		alert(name);
	},
});

//Item View
app.LegoItemView = Backbone.View.extend({
	tagName: 'div',
	events: {
		"click button.btn-buy":"removeItem",
		"click button.btn-sell":"addItem",
	},
	initialize: function(){
		this.listenTo(this.model, "change", this.render);
	},
	render: function(){
		var name = this.model.get('name');
		var unitprice=  this.model.get('unitprice');
		var imagepath = this.model.get('image');
//	console.log(imagepath);
		this.$el.html(
			'  <div class="	col-sm-6 col-md-3">\
				<div class="thumbnail">\
				  <img src="img/'+imagepath+'" alt="...">\
				  <p class="thumb-price">'+unitprice+'</p>\
				  <p class="thumb-description">1X16</p>\
				  <div class="caption">\
					<p>\
						<button class="btn btn-default btn-buy">\
							<span class="glyphicon glyphicon-minus"></span>\
						</button> \
						<button class="btn btn-default btn-sell">\
							<span class="glyphicon glyphicon-plus"></span>\
						</button>\
						<span class="thumb-curquantity">\
							0\
						</span>\
						<span class="thumb-newquantity" style="display:none">0</span>\
					</p>\
				  </div>\
				</div>\
			  </div>'
		);
		
		return this;
	},
	addItem: function(){
		//alert('addItem');
		var $newquantity = this.$('.thumb-newquantity');
		var n = parseInt($newquantity.text());
		n = n+1;
		if(n==0){
			$newquantity.removeClass('minus').css('display','none');
		}else if(n==1){
			$newquantity.addClass('plus').css('display','default');
		}
		$newquantity.text(n);
	},
	removeItem: function(){
		//alert('removeItem');
		//alert('addItem');
		var $newquantity = this.$('.thumb-newquantity');
		var n = parseInt($newquantity.text());
		n = n-1;
		if(n==0){
			$newquantity.removeClass('plus').css('display','none');
		}else if(n==-1){
			$newquantity.addClass('minus').css('display','default');
		}
		$newquantity.text(n);
	},
});

//Type View
app.LegoTypeView = Backbone.View.extend({
	//<div class="panel panel-default">
	tagName: 'div',
	className: 'tab-pane',
	initialize: function(){
		//Local Variables-Views
		this.legoitemview = [];
	
		//Define Actions
		this.listenTo(this.model, "change", this.renderItem);
		this.addTab(this.model);
		$(this.el).attr('id', this.model)
	},
	render: function(){
		var typename = this.model.get('typename');
		var id = this.id;
		$(this.el).attr('id', id);
//console.log(this.id);
		this.$el.html(
				//'<div class="tab-content"></div>'
		);
		
//console.log(this.model.legoitems);
		//this.model.get('legoitems').each(function(item){
		this.model.legoitems.each(function(item){
			this.renderItem(item);
		},this);
		
		return this;
	},
	renderItem: function(item){
//console.log(item.get('image'));
		var LegoItemview = new app.LegoItemView({model:item});
		this.$el.append(LegoItemview.render().el);
		this.legoitemview.push(LegoItemview);
		//this.$('.panel-collapse').append(item.get('name'));
		//app.appview.typeviews[1].model.legoitems
	},
	addTab: function(item){
		var type = this.model.get('typename');
		var $li = $("<li></li>");
		var $a = $("<a></a>");
		$a.attr('href','#'+this.id).attr('data-toggle','tab').text(type);
		$li.append($a).appendTo(".nav.nav-tabs");
	},
});

//RegModalView
app.RegModalView = Backbone.View.extend({
	el: '#RegModal',
	events:{
		"show.bs.modal":"showModel",
		"click .btn-primary":"createAccount",
	},
	initialize:function(){
		this.$name = $('#inputAccount');
		this.$balance = $('#inputBalance');
	},
	showModel:function(){
		this.$name.val('');
		this.$balance.val('');
	},
	createAccount:function(){
		var name = this.$name.val();
		var balance = this.$balance.val();
		alert('account:'+name+'  balance:'+balance);

		var data = {name:name,balance:balance};
		var account = new app.Account(data);
		account.url = 'account/';
		
		app.accounts.create(account);
		$('#RegModal').modal('hide');
//		this.modal('hide');
	},
});

//CheckoutModalView
app.CheckoutModalView = Backbone.View.extend({
	el: '#CheckoutModal',
	events:{
		"show.bs.modal":"showModel",
		"click .btn-primary":"checkout",
	},
	initialize:function(){
		//this.$name = $('#inputAccount');
		//this.$balance = $('#inputBalance');
	},
	showModel:function(){
		var that = this;
		var total = 0.;
		var account = app.accounts.models[0].get('name');
		var balance = app.accounts.models[0].get('balance');

		that.$('table').html('');
		
		//Set table hearder
		var $trHeader = $('<tr>\
							<th>Item</th>\
							<th>Price</th>\
							<th>Num</th>\
							<th>Sum</th>\
						  </tr>'
						);
					
		that.$('table').append($trHeader);
		
		//Search num of items for buying or selling
		//Looking into each lego type
		for(var i=0; i< app.appview.typeviews.length; i++){
			//Looking into each lego item
			for( var j=0; j<app.appview.typeviews[i].legoitemview.length; j++){
				//Details such as type name, price and number 
				var view = app.appview.typeviews[i].legoitemview[j];
				var n 		= view.$('.thumb-newquantity').text();
				var price 	= view.$('.thumb-price').text();
				var name 	= view.model.get('name');
				var sum 	= parseInt(n)*parseFloat(price);
				total = total + sum;
				sum = sum.toString();
				
				//If any purchase, add a list to the checkout table
				if(n!='0'){
					var $tr = $('<tr>\
									<td>'+name+'</td>\
									<td class="price">'+price+'</td>\
									<td>'+n+'</td>\
									<td class="price">'+sum+'</td>\
								<tr>'
								);
								
					that.$('table').append($tr);
				}
			}
		}
		
		//Set table footer
		var $trFooter = $('<tr style="border-top:3px solid black">\
						<td style="font-weight:bold;">You Have</td>\
						<td id="cur-balance" class="price">'+balance+'</td>\
						<td style="font-weight:bold;">Total</td>\
						<td id="total-cost" class="price" style="font-weight:bold">'+total+'</td>\
					<tr>'
					);
		that.$('table').append($trFooter);
	},
	checkout:function(){

		$('#CheckoutModal').modal('hide');
//		this.modal('hide');
	},
});

//$('#myModal').modal('show')
//AppView
app.appView = Backbone.View.extend({
	el: '#App',
	events:{
		"click #new-account":"createAccount",
		"click #resetBtn":"reset",
		"click #checkoutBtn":"checkout",
	},
	initialize:function(option){
		//Global Variables 
		app.accounts = new app.Accounts();
		app.regModalView = new app.RegModalView();
		app.CheckoutModalView = new app.CheckoutModalView();

		//Local Variables-Models
		this.legotypes = option.legotypes;
		this.accounts = option.accounts;

		//Local Variables-Views
		this.typeviews = [];
		
		this.listenTo(this.legotypes, "change", this.renderType);
		//this.listenTo(app.accounts, "sync", this.renderAccounts);
		this.listenTo(app.accounts, "add", this.renderAccount);
		this.render();
		this.renderType();
		
		app.accounts.fetch();
	},
	render:function(){
		var that = this;
		
		this.$el.html(
			'<nav class="navbar navbar-default">\
				<div class="container">\
				<!-- Brand and toggle get grouped for better mobile display -->\
					<a class="navbar-brand" style="position:absolute;" href="#">Brand</a>\
					<ul class="nav navbar-nav nav-pills pull-right">\
						<li class="dropdown">\
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Account<b class="caret"></b></a>\
							<ul class="dropdown-menu">\
								<li class="divider"></li>\
								<li id="new-account"><a href="#">Create new account</a></li>\
							</ul>\
						</li>\
					</ul>\
				</div><!-- /.container-fluid -->\
			</nav>\
			<!-- Nav tabs -->\
			<ul class="nav nav-tabs"></ul>\
			<!-- Tab panes -->\
			<div class="tab-content"></div>\
			<button id="resetBtn" style="position:fixed; bottom:20px; right:160px" type="button" class="btn btn-default">Reset</button>\
			<button id="checkoutBtn" style="position:fixed; bottom:20px; right:50px" type="button" class="btn btn-primary">Checkout</button>'
		);
	},
	renderType:function(){
		var that = this;
		
		this.legotypes.each(function(type, index){
			var LegoTypeview = new app.LegoTypeView({model:type, id:index});
			$(".tab-content").append(LegoTypeview.render().el);
			that.typeviews.push(LegoTypeview);
		},this);
	},
	renderAccounts:function(){
		alert('complete sync');
		app.accounts.each(function(account){
			this.renderAccount(account);
		},this);
	},
	renderAccount:function(account){
		alert(account.get('name'));
		var accountView = new app.AccountView({model:account});
		$('.divider').before(accountView.render().el);
	},
	createAccount:function(){
		//alert('createaccount');
		//$('#RegModal').trigger('show');
		$('#RegModal').modal('show');
	},
	reset:function(){
		
	},
	checkout:function(){
		$('#CheckoutModal').modal('show');
	},
});

$(function(){
	//BRICK&TILE
	//Create Brick Models
	app.B1X2Grey = new app.LegoItem({image:'Brick/01Brick1X2Grey.png',
									 name: 'Brick 1X2 Grey',
									 unitprice: 125.00});
	app.B1X2Green = new app.LegoItem({image:'Brick/03Brick1X2GreenTranslucent.png',
									 name: 'Brick 1X2 Green Translucent',
									 unitprice: 125.00});
	app.B1X2Red = new app.LegoItem({image:'Brick/04Brick1X2RedTranslucent.png',
									 name: 'Brick 1X2 Red Translucent',
									 unitprice: 125.00});
	app.B1X2Yel = new app.LegoItem({image:'Brick/02Brick1X2YellowTranslucent.png',
									 name: 'Brick 1X2 Yellow',
									 unitprice: 125.00});
	app.B2X4Grey = new app.LegoItem({image:'Brick/05Brick2X4Grey.png',
									 name: 'Brick 2X4 Grey',
									 unitprice: 125.00});
	app.T1X2DarkGrey = new app.LegoItem({image:'Tile/06Tile1X2DarkGrey.png',
									 name: 'Tile 1X2 Dark Grey',
									 unitprice: 125.00});
	//Create Brick Collection
	app.Bricks = new app.LegoItems([app.B1X2Grey,
								app.B1X2Green,
								app.B1X2Red,
								app.B1X2Yel,
								app.B2X4Grey,
								app.T1X2DarkGrey]);
	//Create Brick Type Model
	app.BrickList = new app.LegoType({typename:'Brick & Tile', legoitems:app.Bricks});

	//PLATE
	//Create Plate Models
	app.P1X2Grey = new app.LegoItem({image:'Plate/Plate 1X2 Grey.png',
									 name: 'Plate 1X2 Grey',
									 unitprice: 125.00});
	app.P1X4Grey = new app.LegoItem({image:'Plate/Plate 1X4 Grey.png',
									 name: 'Plate 1X4 Grey',
									 unitprice: 125.00});
	app.PwH2X4Grey = new app.LegoItem({image:'Plate/Plate with Holes 2X4 Grey.png',
									 name: 'Plate with Holes 2X4 Grey',
									 unitprice: 125.00});
	app.PwH2X6Grey = new app.LegoItem({image:'Plate/Plate with Holes 2X6 Grey.png',
									 name: 'Plate with Holes 2X6 Grey',
									 unitprice: 125.00});
	app.PwH2X8Grey = new app.LegoItem({image:'Plate/Plate with Holes 2X8 Grey.png',
									 name: 'Plate with Holes 2X8 Grey',
									 unitprice: 125.00});
	//Create Plate Collection
	app.Plate = new app.LegoItems([app.P1X2Grey,
								app.P1X4Grey,
								app.PwH2X4Grey,
								app.PwH2X6Grey,
								app.PwH2X8Grey]);
	//Create Plate Type Model
	app.PlateList = new app.LegoType({typename:'Plate', legoitems:app.Plate});

	
	//BEAM
	//Create Beam Models
	app.B3DG = new app.LegoItem({image:'Beam/Beam 3-Module Dark Grey.png',
									 name: 'Beam 3-Module Dark Grey',
									 unitprice: 125.00});
	app.B5DG = new app.LegoItem({image:'Beam/Beam 5-Module Dark Grey.png',
									 name: 'Beam 5-Module Dark Grey',
									 unitprice: 187.50});
	app.B7DG = new app.LegoItem({image:'Beam/Beam 7-Module Dark Grey.png',
									 name: 'Beam 7-Module Dark Grey',
									 unitprice: 187.50});
	app.B9DG = new app.LegoItem({image:'Beam/Beam 9-Module Dark Grey.png',
									 name: 'Beam 9-Module Dark Grey',
									 unitprice: 125.00});
	app.B11DG = new app.LegoItem({image:'Beam/Beam 11-Module Dark Grey.png',
									 name: 'Beam 11-Module Dark Grey',
									 unitprice: 250.00});
	app.B13DG = new app.LegoItem({image:'Beam/Beam 13-Module Dark Grey.png',
									 name: 'Beam 13-Module Dark Grey',
									 unitprice: 625.00});
	app.B15DG = new app.LegoItem({image:'Beam/Beam 15-Module Dark Grey.png',
									 name: 'Beam 15-Module Dark Grey',
									 unitprice: 125.00});
	//Create Beam Collection
	app.Beam = new app.LegoItems([app.B3DG,
								app.B5DG,
								app.B7DG,
								app.B9DG,
								app.B11DG,
								app.B13DG,
								app.B15DG]);
	//Create Plate Type Model
	app.BeamList = new app.LegoType({typename:'Beam', legoitems:app.Beam});
	

	//Create Lego Type Collection
	app.LegoLists = new app.LegoTypes([app.BrickList, app.PlateList, app.BeamList]);
	//Draw Brick Type
	
	//app.account1 = new app.Account({name:'1111',balance:'500'});
	//app.account2 = new app.Account({name:'2222',balance:'750'});
	//app.accounts = new app.Accounts([app.account1, app.account2]);
	//app.LegoTypeview = new app.LegoTypeView({model:app.BrickList});

	app.appview = new app.appView({legotypes:app.LegoLists});

	//app.accounts = new app.Accounts();
	/*
	app.accounts.fetch().pipe(function(){
			app.accounts.each(function(account){
				//alert(account.get('id'));
				var name = account.get('name');
				var balance = account.get('balance');
				$('#test').text(name+': $'+balance);
			});
		}).done(function(){
			alert('done!');
		});
		*/

	$("button").click(function(){
	/*
		$totalprice = $("#TotalPrice");
		$subprice = $(this).parent().parent().parent().parent().find(".subprice").find("span");
		$unitprice = $(this).parent().siblings().find(".unitprice");
		$price = $(this).siblings("h4").find(".price");
		$num = $(this).siblings("span");
		
		totalprice = parseFloat($totalprice.text(),10);
		subprice = parseFloat($subprice.text(),10);
		unitprice = parseFloat($unitprice.text(),10);
		price = parseFloat($price.text(),10);
		num = parseInt($num.text(),10);
		
		if($(this).attr('act')=="plus"){
			$num.text(num+1);
			$price.text((num+1)*unitprice);
			$subprice.text(subprice+unitprice);
			$totalprice.text(totalprice+unitprice);
		}else{
			if(num>0){
				$num.text(num-1);
				$price.text((num-1)*unitprice);
				$subprice.text(subprice-unitprice);
				$totalprice.text(totalprice-unitprice);
			}
		}
		*/
	});
});


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
		image:	null,
		name:	null,
		price:	null,
		attr:	null,
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
	model: app.LegoType
});

//Account View
app.AccountView = Backbone.View.extend({
	tagName: 'li',
	className: 'dropdown',
	events:{
		"click":"selectAccount",
	},
	initialize: function(){
		this.account = this.model;
		
		this.listenTo(this.model, "change", this.renderAccount);
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
	renderAccount: function(){
		var name = this.account.get('name');
		var balance = this.account.get('balance');
		this.$('a').text(name+'  $'+balance);
	},
	selectAccount: function(){
		var name = this.account.get('name');
		var balance = this.account.get('balance');
		var id = this.account.get('id');

		app.account.set({id:id,name:name,balance:balance});
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
		var name 		= this.model.get('name');
		var price		= this.model.get('price');
		var imagepath 	= this.model.get('image');
		var attr		= this.model.get('attr');
//	console.log(imagepath);
		this.$el.html(
			'  <div class="	col-sm-6 col-md-3">\
				<div class="thumbnail">\
				  <img src="'+imagepath+'" alt="...">\
				  <p class="thumb-price">'+price+'</p>\
				  <p class="thumb-description">'+attr+'</p>\
				  <div class="caption">\
					<p>\
						<button class="btn btn-default btn-buy">\
							<span class="glyphicon glyphicon-minus"></span>\
						</button> \
						<button class="btn btn-default btn-sell">\
							<span class="glyphicon glyphicon-plus"></span>\
						</button>\
						<span class="thumb-curquantity">\
							\
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
		this.addTab(this.model);
		$(this.el).attr('id', this.model)
        
        this.items = new app.LegoItems();
        this.items.url = '/item/types/'+this.model.id;
        this.listenTo(this.items, "reset", this.renderItems);
        
        this.items.fetch({'reset':true});
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
//		this.model.legoitems.each(function(item){
//			this.renderItem(item);
//		},this);
		
		return this;
	},
	renderItems: function(){
        var that = this;
        this.items.each(function(item){
            var LegoItemview = new app.LegoItemView({model:item});
            that.$el.append(LegoItemview.render().el);
            that.legoitemview.push(LegoItemview);
        });
	},
	addTab: function(item){
		var type = this.model.get('name');
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
        var that = this;
		var name = this.$name.val();
		var balance = this.$balance.val();
		//alert('account:'+name+'  balance:'+balance);

		var data = {name:name,balance:balance};
		var account = new app.Account(data);
		account.url = 'account/';
        
        account.save(null,{
            success:function(model, response){
                app.accountlist.add(model);
                $('#RegModal').modal('hide');
            },
            error:function(model, response){
                alert('create account error');
            }
        });
		
//		app.accountlist.add(account);
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
		var account = app.account.get('name');
		var balance = app.account.get('balance');

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
        var sell_factor = parseInt($('#selling-factor span').html())/100.;
//        sell_factor = sell_factor.toFixed(2);
		for(var i=0; i< app.appview.typeviews.length; i++){
			//Looking into each lego item
			for( var j=0; j<app.appview.typeviews[i].legoitemview.length; j++){
				//Details such as type name, price and number 
				var view = app.appview.typeviews[i].legoitemview[j];
				var n 		= view.$('.thumb-newquantity').text();
				var price 	= view.$('.thumb-price').text();
				var name 	= view.model.get('name');
                if( n<0 ){
				    var sum 	= parseInt(n)*parseFloat(price)*sell_factor;
                }else{
				    var sum 	= parseInt(n)*parseFloat(price);
                }
                sum = parseFloat(sum.toFixed(2));
                console.log(parseInt($('#selling-factor span').html()));
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
						<td id="total-cost" class="price" style="font-weight:bold;color:'+(((balance-total)<0)?'red;':'black;')+'">'+total+'</td>\
					<tr>'
					);
		//alert((((balance-total)<0)?'red':'black'));
		that.$('table').append($trFooter);
		
		if(app.account.get('name') == undefined){
			this.$('.btn-primary').attr("disabled", true);
		}else{
			this.$('.btn-primary').attr("disabled", false);
		}
	},
	checkout:function(){
		//Get the current balance and the total cost
		var balance = app.account.get('balance');
		var cost = this.$('#total-cost').text();
		
		//Calculate new balance
		balance = balance-parseFloat(cost);
		
		//Update balance value for account models
		var account = app.accountlist.get(app.account.get('id'));
        account.url = '/account/'+account.id;
		account.set({balance:parseFloat(balance.toFixed(2))});
        account.save(null,{
            success:function(model, response){
                app.account.set({balance:parseFloat(balance.toFixed(2))});
                //Clear cart
                for(var i=0; i< app.appview.typeviews.length; i++){
                    //Looking into each lego item
                    for( var j=0; j<app.appview.typeviews[i].legoitemview.length; j++){
                        var view = app.appview.typeviews[i].legoitemview[j];
                        view.$('.thumb-newquantity').text(0).css('display','none');
                    }
                }
                //Close the modal
                $('#CheckoutModal').modal('hide');
            },
            error:function(model, response){
                alert('checkout account error');
            }
        });

	},
});

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
		app.account = new app.Account();
		app.accountlist = new app.Accounts();
		app.regModalView = new app.RegModalView();
		app.CheckoutModalView = new app.CheckoutModalView();

		//Local Variables-Models
//		this.legotypes = option.legotypes;
//		this.accounts = option.accounts;

        this.legotypes = new app.LegoTypes();
        this.legotypes.url = '/item/types';
        
		//Local Variables-Views
		this.typeviews = [];
		this.accountviews = [];
		
		this.listenTo(this.legotypes, "reset", this.renderTypes);
		this.listenTo(app.accountlist, "reset", this.renderAccounts);
		this.listenTo(app.accountlist, "add", this.renderAccount);
		this.listenTo(app.account, "change", this.renderTest);
        
		this.render();
		
        this.legotypes.fetch({'reset':true});
		app.accountlist.fetch({'reset':true});
	},
	render:function(){
		var that = this;
		
		this.$el.html(
			'<nav class="navbar navbar-default navbar-fixed-top">\
				<div class="container">\
				<!-- Brand and toggle get grouped for better mobile display -->\
					<a class="navbar-brand" style="position:absolute;" href="#">MBET LEGO SHOP</a>\
					<ul class="nav navbar-nav nav-pills pull-right">\
						<li class="dropdown">\
							<a href="#" class="dropdown-toggle" data-toggle="dropdown"><span id="account-title">Account</span><b class="caret"></b></a>\
							<ul class="dropdown-menu">\
								<li class="divider"></li>\
								<li id="new-account"><a href="#">Create new account</a></li>\
							</ul>\
						</li>\
					</ul>\
				</div><!-- /.container-fluid -->\
			</nav>\
            <div id="app-containner">\
                <!-- Nav tabs -->\
                <ul class="nav nav-tabs"></ul>\
                <!-- Tab panes -->\
                <div class="tab-content"></div>\
            </div>\
			\
			\
			\
            <div id="remainedTime" style="position:fixed; bottom:30px; right:300px"></div>\
            <div id="selling-factor" style="position:fixed; bottom:10px; right:300px"></div>\
			<button id="resetBtn" style="position:fixed; bottom:20px; right:160px" type="button" class="btn btn-default">Reset</button>\
			<button id="checkoutBtn" style="position:fixed; bottom:20px; right:50px" type="button" class="btn btn-primary">Checkout</button>'
		);
        
        var that = this;
        setInterval(function () {
            var t = new Date();
            var hrs = 17 - t.getHours();
            var mins = 60 - t.getMinutes();
            var factor = (hrs*60.+mins)/420.*100;
            if( t.getHours()<10||t.getHours()>18 ){
                that.$('#remainedTime').html( 'Event start at <strong>10 am</strong>' );
                that.$('#selling-factor').html( 'Sell for <strong><span>'+parseInt(100)+'</span>%</strong> of the original price');
            }else if( t.getHours()>=17&&t.getHours()<18){
                that.$('#remainedTime').html( 'Event is over' );
                that.$('#selling-factor').html( 'Sell for <strong><span>'+parseInt(0)+'</span>%</strong> of the original price');
            }else{
                that.$('#remainedTime').html( 'Event ends in <strong>'+hrs+'</strong> hrs and <strong>'+mins+'</strong> mins' );
                that.$('#selling-factor').html( 'Sell for <strong><span>'+parseInt(factor)+'</span>%</strong> of the original price');
            }
            
            
        }, 1000);
	},
	renderTypes:function(){
		var that = this;
		
		this.legotypes.each(function(type, index){
            console.log(type);
			var legoTypeView = new app.LegoTypeView({model:type, id:index});
			that.$(".tab-content").append(legoTypeView.render().el);
            console.log(legoTypeView.el);
			that.typeviews.push(legoTypeView);
		},this);
        this.$(".nav-tabs li").first().addClass('active');
        this.$(".tab-pane").first().addClass('active');
//        console.log(this.$(".nav-tabs li").first());
        
	},
	renderAccounts:function(){
		//alert('complete sync');
		app.accountlist.each(function(account){
			this.renderAccount(account);
		},this);
	},
	renderAccount:function(account){
		//alert(account.get('name'));
		var accountView = new app.AccountView({model:account});
		$('.divider').before(accountView.render().el);
		//this.accountvies.push(accountView);
	},
	createAccount:function(){
		$('#RegModal').modal('show');
	},
	reset:function(){
		//Clear cart
		for(var i=0; i< app.appview.typeviews.length; i++){
			//Looking into each lego item
			for( var j=0; j<app.appview.typeviews[i].legoitemview.length; j++){
				var view = app.appview.typeviews[i].legoitemview[j];
				view.$('.thumb-newquantity').text(0).css('display','none');
			}
		}  
	},
	checkout:function(){
		$('#CheckoutModal').modal('show');
	},
	renderTest: function(){
		var name = app.account.get('name');
		var balance = app.account.get('balance');
		this.$("#account-title").text(name+': $'+balance);
	},
});

$(function(){
	//app.item = new app.LegoItem()

	//BRICK&TILE
	//Create Brick Models
	app.B1X2Grey = new app.LegoItem({image	:'Brick/01Brick1X2Grey.png',
									 name	:'Brick 1X2 Grey',
									 price	:125.00,
									 attr	:'1x2 Grey'});
	app.B1X2Green = new app.LegoItem({image:'Brick/03Brick1X2GreenTranslucent.png',
									 name	:'Brick 1X2 Green Translucent',
									 price	:125.00,
									 attr	:'1x2 Green'});
	app.B1X2Red = new app.LegoItem({image:'Brick/04Brick1X2RedTranslucent.png',
									 name: 'Brick 1X2 Red Translucent',
									 price: 125.00,
									 attr	:'1x2 Red'});
	app.B1X2Yel = new app.LegoItem({image:'Brick/02Brick1X2YellowTranslucent.png',
									 name: 'Brick 1X2 Yellow',
									 price: 125.00,
									 attr	:'1x2 Yellow'});
	app.B2X4Grey = new app.LegoItem({image:'Brick/05Brick2X4Grey.png',
									 name: 'Brick 2X4 Grey',
									 price: 125.00,
									 attr	:'2x4 Grey'});
	app.T1X2DarkGrey = new app.LegoItem({image:'Tile/06Tile1X2DarkGrey.png',
									 name: 'Tile 1X2 Dark Grey',
									 price: 125.00,
									 attr	:'1x2'});
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
	app.P1X2Grey = new app.LegoItem({image:'Plate/07Plate1X2Grey.png',
									 name: 'Plate 1X2 Grey',
									 price: 125.00,
									 attr: '1x2 Grey'});
	app.P1X4Grey = new app.LegoItem({image:'Plate/08Plate1X4Grey.png',
									 name: 'Plate 1X4 Grey',
									 price: 125.00,
									 attr: '1x4 Grey'});
	app.PwH2X4Grey = new app.LegoItem({image:'Plate/09PlateWithHoles2X4Grey.png',
									 name: 'Plate with Holes 2X4 Grey',
									 price: 125.00,
									 attr: '2x4 Grey'});
	app.PwH2X6Grey = new app.LegoItem({image:'Plate/10PlateWithHoles2X6Grey.png',
									 name: 'Plate with Holes 2X6 Grey',
									 price: 125.00,
									 attr: '2x6 Holes Grey'});
	app.PwH2X8Grey = new app.LegoItem({image:'Plate/11PlateWithHoles2X8Grey.png',
									 name: 'Plate with Holes 2X8 Grey',
									 price: 125.00,
									 attr: '2x8 Holes Grey'});
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
	app.B3DG = new app.LegoItem({image:'Beam/23Beam3ModuleDarkGrey.png',
									 name: 'Beam 3-Module Dark Grey',
									 price: 125.00,
									 attr: '3-Module'});
	app.B5DG = new app.LegoItem({image:'Beam/24Beam5ModuleDarkGrey.png',
									 name: 'Beam 5-Module Dark Grey',
									 price: 187.50,
									 attr: '5-Module'});
	app.B7DG = new app.LegoItem({image:'Beam/25Beam7ModuleDarkGrey.png',
									 name: 'Beam 7-Module Dark Grey',
									 price: 187.50,
									 attr: '7-Module'});
	app.B9DG = new app.LegoItem({image:'Beam/26Beam9ModuleDarkGrey.png',
									 name: 'Beam 9-Module Dark Grey',
									 price: 125.00,
									 attr: '9-Module'});
	app.B11DG = new app.LegoItem({image:'Beam/27Beam11ModuleDarkGrey.png',
									 name: 'Beam 11-Module Dark Grey',
									 price: 250.00,
									 attr: '11-Module'});
	app.B13DG = new app.LegoItem({image:'Beam/28Beam13ModuleDarkGrey.png',
									 name: 'Beam 13-Module Dark Grey',
									 price: 625.00,
									 attr: '13-Module'});
	app.B15DG = new app.LegoItem({image:'Beam/29Beam15ModuleDarkGrey.png',
									 name: 'Beam 15-Module Dark Grey',
									 price: 125.00,
									 attr: '15-Module'});
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
	//app.accountlist = new app.Accounts([app.account1, app.account2]);
	//app.LegoTypeview = new app.LegoTypeView({model:app.BrickList});

	app.appview = new app.appView({legotypes:app.LegoLists});

	//app.accountlist = new app.Accounts();
	/*
	app.accountlist.fetch().pipe(function(){
			app.accountlist.each(function(account){
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
		$price = $(this).parent().siblings().find(".price");
		$price = $(this).siblings("h4").find(".price");
		$num = $(this).siblings("span");
		
		totalprice = parseFloat($totalprice.text(),10);
		subprice = parseFloat($subprice.text(),10);
		price = parseFloat($price.text(),10);
		price = parseFloat($price.text(),10);
		num = parseInt($num.text(),10);
		
		if($(this).attr('act')=="plus"){
			$num.text(num+1);
			$price.text((num+1)*price);
			$subprice.text(subprice+price);
			$totalprice.text(totalprice+price);
		}else{
			if(num>0){
				$num.text(num-1);
				$price.text((num-1)*price);
				$subprice.text(subprice-price);
				$totalprice.text(totalprice-price);
			}
		}
		*/
	});
});
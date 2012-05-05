
function PsiiiTableView(_tableObj,_actionCallback,_parameters,_debugMode) 
{

	
	if(_debugMode)
		this.debugMode=_debugMode;
	else
		this.debugMode=false;	
	
	this._loadingCallback 	= function(_this){
		_actionCallback(_this);
	};

	this._text_pull 		= _parameters.text_pull;
	this._text_refresh 		= _parameters.text_refresh;
	this._text_last_update 	= _parameters.text_last_update;
	this._text_loading 		= _parameters.text_loading;
	this._text_loading_error= (_parameters.text_loading_error)?_parameters.text_loading_error:"Something went wrong.";
	
	this._timeout 			= (_parameters._timeout)?_parameters._timeout:8000;	
	
	this._label_color 		= _parameters.labelColor;
	this._background_color	= _parameters.backgroundColor;
	this._background_image	= _parameters.backgroundImage;

	
	this._arrow_image		= (_parameters.arrowImage)?_parameters.arrowImage:"/libs/arrow.png";
	
    this._table 				= Titanium.UI.createTableView(_tableObj);
    this._table.headerPullView 	= this.createPullToRefresh();
    
    this.isAndroid 	= (Titanium.Platform.osname=='android')?true:false;
	this.isIOS 		= (Titanium.Platform.osname=='iphone')?true:false;

    var $this = this;
    this._table.addEventListener("scroll",	function(_e) 	{ $this._scroll(_e); 		});
	this._table.addEventListener("scrollEnd",function(_e) 	{ $this._begin(_e, $this); 	});
	this._table.addEventListener("_end",function(_e) 		{ $this._end(); 			});
	
	
}

/*
 * sets the table Rows and finishs psiiTableView livecycle
 * cant call it setData couz of appC rules
 */
PsiiiTableView.prototype.fillData = function(_data)
{
	this.getTable().setData(_data);
	this.getTable().fireEvent('_end');
}
/*
 * wrappter function for Ti.API.error 
 * to enable and disable debug output
 */
PsiiiTableView.prototype.log = function(_text) 
{
	if(this.debugMode==true)
		Ti.API.error(_text);
}

/*
 * returns the extended Table
 * @return Ti.UI.TableView
 */ 
PsiiiTableView.prototype.getTable = function() 
{
    return this._table;
};

/*
 * returns the extended Table
 * @return Ti.UI.TableView
 */ 
PsiiiTableView.prototype.getUI = function() 
{
    return this._table;
};


/*
 * extends the standard Ti.UI.TableView with the push to refresh feature 
 */
PsiiiTableView.prototype.createPullToRefresh = function()
{
	
	var $_view = Ti.UI.createView({
		backgroundColor:this._background_color,
		width:320,
		height:60
	});
	
	if(this._background_image)
	{
		
		$_view.backgroundImage = this._background_image;
		$_view.backgroundRepeat = true;
	}
	
	var $_arrow = Ti.UI.createView({
		backgroundImage:this._arrow_image,
		width:30,
		height:30,
		bottom:20,
		left:20
	});
	$_view.add($_arrow);

	var $_status = Ti.UI.createLabel({
		text: this._text_pull,
		left:55,
		width:220,
		bottom:35,
		height:"auto",
		color: this._label_color,
		textAlign:"center",
		font:{fontSize:13,fontWeight:"bold"}
	});
	$_view.add($_status);

	var $_lastUpdate = Ti.UI.createLabel({
		text: this._text_last_update+(String.formatTime(new Date())),
		left:55,
		width:220,
		bottom:15,
		height:15,
		height:"auto",
		color:	this._label_color,
		textAlign:"center",
		font:{fontSize:12}
	});
	$_view.add($_lastUpdate);
	
	var $_activityIndicator = Titanium.UI.createActivityIndicator({
		left:20,
		bottom:13,
		width:30,
		height:30,
	});
		
	$_view.add($_activityIndicator);
	
	//make it accessable in obj-scope
	this._activityIndicator = $_activityIndicator;
	this._lastUpdate 		= $_lastUpdate;
	this._status 			= $_status;
	this._arrow 			= $_arrow;
	
	return $_view;
	
};

/*
 * Function-Event: gets fired when table is scrolling
 */
PsiiiTableView.prototype._scroll = function(e)
{
	var offset = e.contentOffset.y;
	if (offset <= -65.0 && !this._pulling)
	{
		var t = Ti.UI.create2DMatrix();
		t = t.rotate(-180);
		this._pulling = true;
		this._arrow.animate({transform:t, duration:180});
		this._status.text = this._text_refresh;
	}
	else if (this._pulling && offset > -65.0 && offset < 0)
	{
		this._pulling = false;
		var t = Ti.UI.create2DMatrix();
		this._arrow.animate({transform:t,duration:180});
		this._status.text = this._text_pull;
	}
};

/*
 * Function-Event: gets fired when loading starts
 */
PsiiiTableView.prototype._begin = function(e, tableView)
{
	if (this._pulling && !this._reloading && e.contentOffset.y <= -65.0)
	{
		this._reloading 		= true;
		this._pulling 			= false;
		this._arrow.hide();
		this._activityIndicator.show();
		this._status.text 		= this._text_loading;
		
		this._table.setContentInsets({top:60},{animated:true});
		
		this._arrow.transform 	= Ti.UI.create2DMatrix();
		this._loadingCallback(this);
		
		var $this = this;
		
		setTimeout(function()
		{
			if($this._reloading)
			{
				$this._end();
				alert($this._text_loading_error);
			}
		},$this._timeout);
		
	}
};

/*
 * Function-Event: gets fired after loading
 */
PsiiiTableView.prototype._end= function()
{
	this.log("PsiiiTableView.prototype._end "+this.isIOS);
				
	this._reloading 		= false;
	this._lastUpdate.text 	= this._text_last_update +(String.formatTime(new Date())),
	this._status.text 		= this._text_pull;
	this._activityIndicator.hide();
	this._arrow.show();
	
	if(this.isIOS)
		this._table.setContentInsets({top:0},{animated:true});
		
	this.log("PsiiiTableView.prototype._end done");
};

 
module.exports = PsiiiTableView;
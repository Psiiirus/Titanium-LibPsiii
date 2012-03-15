
function PsiiiTable(_tableObj,_actionCallback,_parameters) 
{
	this._loadingCallback 	= function(){
		_actionCallback();
	};

	this._text_pull 		= _parameters.text_pull;
	this._text_refresh 		= _parameters.text_refresh;
	this._text_last_update 	= _parameters.text_last_update;
	this._text_loading 		= _parameters.text_loading;
	this._text_loading_error= (_parameters.text_loading_error)?_parameters.text_loading_error:"Es ist ein Problem aufgetreten.";
	
	this._timeout 			= (_parameters._timeout)?_parameters._timeout:8000;	
	
	this._label_color 		= _parameters.labelColor;
	this._background_color	= _parameters.backgroundColor;

    this._table 					= Titanium.UI.createTableView(_tableObj);
    this._table.headerPullView 	= this.createPullToRefresh();
    
    var $this = this;
    this._table.addEventListener("scroll",	function(_e) 	{ $this._scroll(_e); 		});
	this._table.addEventListener("scrollEnd",function(_e) 	{ $this._begin(_e, $this); 	});
	this._table.addEventListener("_end",function(_e) 		{ $this._end(); 			});
	
	
}
 
PsiiiTable.prototype.getTable = function() {
    return this._table;
};

PsiiiTable.prototype.getUI = function() {
    return this._table;
};

PsiiiTable.prototype.createPullToRefresh = function()
{
	
	var $_view = Ti.UI.createView({
		backgroundColor:this._background_color,
		width:320,
		height:60
	});
	
	var $_arrow = Ti.UI.createView({
		backgroundImage:"/libs/arrow.png",
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
		color: this.label_color,
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
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	$_view.add($_activityIndicator);
	
	//make it accessable in obj-scope
	this._activityIndicator = $_activityIndicator;
	this._lastUpdate 		= $_lastUpdate;
	this._status 			= $_status;
	this._arrow 			= $_arrow;
	
	return $_view;
	
};

PsiiiTable.prototype._scroll = function(e)
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

PsiiiTable.prototype._begin = function(e, tableView)
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
		this._loadingCallback();
		
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

PsiiiTable.prototype._end= function()
{
	Ti.API.error("PsiiiTable.prototype._end");
				
	this._reloading 		= false;
	this._lastUpdate.text 	= this._text_last_update +(String.formatTime(new Date())),
	this._status.text 		= this._text_pull;
	this._activityIndicator.hide();
	this._arrow.show();
	this._table.setContentInsets({top:0},{animated:true});
	Ti.API.error("PsiiiTable.prototype._end done");
};

 
module.exports = PsiiiTable;
var $eventParameter = {
	_onChange 	: function(){},
	_onBlur 	: function(){}
}

function PsiiiTextInput(_events,_textInputObj,_tableViewObj,_containerViewObj,_debugMode) 
{
	if(_debugMode)
		this.debugMode=_debugMode;
	else
		this.debugMode=false;
	
	/*
	 * CONSTRUCT - VARS
	 */

	var $this = this;
	$this.log("PsiiiTextInput constructing...");
	
	$this._ui_top = 0;
	$this._ui_max_height = _containerViewObj.max_height;
	
	$this._ui_focus_zindex 	= 10000;
	$this._ui_blur_zindex 	= 0;
	
	var $_textInputObj = {};
	if(_textInputObj)
	{
		$_textInputObj = _textInputObj 
	}
	
	if(typeof $_textInputObj.height == "undefined")
	{
		$_textInputObj.height = 30; 
	}

	if(typeof $_textInputObj.top == "undefined")
	{
		$_textInputObj.top = 0; 
	}
	
	if(typeof $_textInputObj.autocorrect == "undefined")
	{
		$_textInputObj.autocorrect = false; 
	}
	
	if(typeof $_textInputObj.clearButtonMode== "undefined")
	{
		$_textInputObj.clearButtonMode = Titanium.UI.INPUT_BUTTONMODE_ALWAYS; 
	}

	var $_containerViewObj = {};
	if(_containerViewObj)
		$_containerViewObj = _containerViewObj 
	
	$_containerViewObj.height='auto';
	if(typeof $_containerViewObj.top == "undefined")
	{
		$_containerViewObj.top = 0; 
	}
	 
	var $_tableViewObj = {};
	if(_tableViewObj)
		$_tableViewObj = _tableViewObj;
		
	/*
	 * TextInput Change Event
	 */
	$this._onChange = false;	
	if(_events.onChange)
		$this._onChange =_events.onChange; 
		
	/*
	 * TextInput Blur Event
	 */
	$this._onBlur = false;
	if(_events.onBlur)
		$this._onBlur =_events.onBlur; 

	/*
	 * TextInput Focus Event
	 */
	$this._onFocus = false;
	if(_events.onFocus)
		$this._onFocus =_events.onFocus; 


	/*
	 * CONSTRUCT - UI
	 */
		
		//Container UI
		$this.createContainerView($_containerViewObj);
		
		//TextInput UI
		$this.createTextField($_textInputObj);	
		
		//TableView UI
		$this.createTableView($_tableViewObj);
	
		//combine UI
		$this._ui.add($this._ui_text_input);
		$this._ui.add($this._ui_table);
	
	$this.log("PsiiiTextInput constructed");
}

/*
 * wrappter function for Ti.API.error 
 * to enable and disable debug output
 */
PsiiiTextInput.prototype.log = function(_text) 
{
	if(this.debugMode==true)
		Ti.API.error(_text);
}

/*
 * creates the containter View
 */
PsiiiTextInput.prototype.createContainerView = function(_containerViewObj)
{
	var $this = this;
	var $containerView = Ti.UI.createView(_containerViewObj);
	$this._ui = $containerView;
	
	$containerView.addEventListener('click',function(_e)
		{
			$this.log('PsiiiTextInput.View.click - internal');		
		});
		
}

/*
 * creates the textField
 */
PsiiiTextInput.prototype.createTextField = function(_textInputObj)
{
	var $this = this;
	
	var $textInput = Ti.UI.createTextField(_textInputObj)

	if($this._onChange)
		$textInput.addEventListener('change',$this._onChange);
	
	$textInput.addEventListener('blur',function(_e)
	{
		$this.log('PsiiiTextInput.TextField.blur - internal');	
		if($this._ui)
		{
			$this._ui.height=	$this._ui_text_input.height;
			//$this._ui.top=	$this._ui_top;

			$this._ui.animate({
								top:	$this._ui_top
							},function()
							{
								//$this._ui.zindex = $this._ui_blur_zindex;
							});
		}			
		
		if($this._ui_table)
		{
			if($this.getTableTopShadow())
				$this.getTableTopShadow().visible = false;
							
			$this._ui_table.height= 0;
		}
		
		if($this._onBlur)
			$this._onBlur(_e);
		
	});
	
	$textInput.addEventListener('focus',function(_e)
	{
		$this._ui_top = $this._ui.top;
		
		$this.log('PsiiiTextInput.TextField.focus - internal');
		
		if($this._ui)
		{
			$this._ui_blur_zindex = $this._ui.zindex;
			$this._ui.zindex = $this._ui_focus_zindex;
			
			if($this._ui_max_height)
				$this._ui.height = $this._ui_max_height;
			else
				$this._ui.height= '100%';
			//$this._ui.top= 0;
			
			$this._ui.animate({ top:0 });				
		}
			
		
		if($this._ui_table)
		{
			if($this._ui_max_height)
				$this._ui_table.height = $this._ui_max_height;
			else
				$this._ui_table.height= '50%';
			
			$this._ui_table.zindex 	= $this._ui_focus_zindex;
			
			if($this.getTableTopShadow())
				$this.getTableTopShadow().visible = true;
		}
		
		if($this._onFocus)
			$this._onFocus(_e);
	});
	
	$this._ui_text_input = $textInput;
};


/*
 * creates the result tableView
 */
PsiiiTextInput.prototype.createTableView = function(_tableViewObj)
{
	var $this = this;
	
	if(!_tableViewObj.height)
		_tableViewObj.height=0;
		
	var $tableView = Titanium.UI.createTableView(_tableViewObj);

	/*
	 * Table Click Event
	 */	
	var $tableView_click = false;
	if(_tableViewObj.onClick)
		$tableView_click =_tableViewObj.onClick; 
	
	
	$this._ui_table = $tableView;
	
	var $tableTopAttribute = ( ($this._ui_text_input.top)?$this._ui_text_input.top:0 )
							+( ($this._ui_text_input.bottom)?$this._ui_text_input.bottom:0 )
							+( ($this._ui_text_input.height)?$this._ui_text_input.height:0 )
	$this.log("$tableTopAttribute "+$tableTopAttribute);
	
	$this._ui_table.top = $tableTopAttribute;
	
	$this._ui_table.addEventListener('click',function(_e)
	{
		$this.log('PsiiiTextInput.Table.click - internal');
		$this.log(_e);
		if(_e.row)
		{
			var $val = _e.row.title;
			var $values = _e.row;
			
			Ti.API.error('--------!!------ value after click:');
			
			
			if($val)
				$this._ui_text_input.value = $val;
				
			Ti.API.error($val);
				
			if($values)
				$this._ui_text_input.values = $values;
			/*
			 * call Table Click Event
			 */
			if($tableView_click)
				$tableView_click(_e);
				
		}
	});
}

/*
 * returns the table top shadow view if exists
 */
PsiiiTextInput.prototype.getTableTopShadow = function() 
{
	if(this._ui_table.children)
	{
    	if(this._ui_table.children.length>0)
    	{
    		return this._ui_table.children[0];
    	}else
    		this.log("PsiiiTextInput.prototype.getTableTopShadow: no shadow available");
	}else
		this.log("PsiiiTextInput.prototype.getTableTopShadow: no shadow available");
}

/*
 * creates a table top shadow by a given image parameter : _image
 */
PsiiiTextInput.prototype.setTableTopShadow = function(_image) 
{
    
    if(this._ui_table.children)
    	if(this._ui_table.children.length>0)
    		this._ui_table.remove(this._ui_table.children[0]);
    		
	var $view = Ti.UI.createView({
									backgroundImage: _image,
									backgroundRepeat: true,
									width:'100%',
									height:20,
									left:0,
									top:0,
									opacity: 0.2,
									visible:false
								});
	this._ui_table.add($view);
};
/*
 * returns UI
 */
PsiiiTextInput.prototype.getUI = function() {
    return this._ui;
};

/*
 * returns TextInput
 */
PsiiiTextInput.prototype.getTextInput = function() {
    return this._ui_text_input;
};

/*
 * returns TableView
 */
PsiiiTextInput.prototype.getTableView = function() {
    return this._ui_table;
};
PsiiiTextInput.prototype.getTable = function() {
    return this.getTableView();
};

 
PsiiiTextInput.prototype.onChange = function(_onChange) 
{
	if(this._onChange)
		this._ui_text_input.addEventListener('change',$this._onChange);
};


/*
 * PRIVATE TABLE FUNCTIONS
 */

PsiiiTextInput.prototype._removeTable = function()
{
	if($this._ui_table)
		$this._ui.remove($this._ui_table);
};

PsiiiTextInput.prototype._addTable = function(_table)
{
	if(_table)
	{
		this._removeTable();//remove old one before add new table
		
		$this._ui.add(_table);
	}
};

PsiiiTextInput.prototype._setTableData = function(_datas,_doAppend)
{
	if(_doAppend)
		_doAppend = false;
	
	if(_doAppend)
		this._ui_table.appendRow(_datas,_animate);
	else
		this._ui_table.setData(_datas);

}

PsiiiTextInput.prototype._clearTable = function(_animate)
{	
	$this._ui.setData([],_animate)
};

PsiiiTextInput.prototype.setData = function(_datas,_doAppend)
{
	this._setTableData(_datas,_doAppend);
}
 
PsiiiTextInput.prototype.getValue = function()
{	
	return this.getTextInput().getValue();
};

PsiiiTextInput.prototype.getValues = function()
{	
	return this.getTextInput().getValues();
};


PsiiiTextInput.prototype.setValue = function(_value)
{	
	this.getTextInput().setValue(_value);
};

 
module.exports = PsiiiTextInput;
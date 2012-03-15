var $eventParameter = {
	_onChange 	: function(){},
	_onBlur 	: function(){}
}

function PsiiiTextInput(_events,_textInputObj,_tableViewObj,_containerViewObj) 
{
	/*
	 * CONSTRUCT - VARS
	 */

	var $this = this;
	
	var $_textInputObj = {};
	if(_textInputObj)
	{
		$_textInputObj = _textInputObj 
	}
	
	if(typeof $_textInputObj.autocorrect == "undefined")
	{
		$_textInputObj.autocorrect = false; 
	}
	
	if(typeof $_textInputObj.clearButtonMode== "undefined")
	{
		$_textInputObj.clearButtonMode = Titanium.UI.INPUT_BUTTONMODE_ALWAYS; 
	}
	
	


	var $_tableViewObj = {};
	if(_tableViewObj)
		$_tableViewObj = _tableViewObj 

	var $_containerViewObj = {};
	if(_containerViewObj)
		$_containerViewObj = _containerViewObj 
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
	 * CONSTRUCT - UI
	 */

	//Container UI
	var $containerView = Ti.UI.createView($_containerViewObj);
	$this._ui = $containerView;
	
	$containerView.addEventListener('click',function(_e)
		{
			Ti.API.error('PsiiiTextInput.View.click - internal');
			
		});
		
	
	//TextInput UI
	var $textInput = Ti.UI.createTextField($_textInputObj);
	
		if($this._onChange)
			$textInput.addEventListener('change',$this._onChange);
		
		if($this._onBlur)
			$textInput.addEventListener('blur',$this._onBlur);
		
		$textInput.addEventListener('blur',function(_e)
		{
			Ti.API.error('PsiiiTextInput.TextField.blur - internal');	
						
			if($this._ui_table)
				$this._ui_table.height = '0';	
				
			if($this._ui)
				$this._ui.height = $this._ui_text_input.height;
		});
		
		$textInput.addEventListener('focus',function(_e)
		{
			Ti.API.error('PsiiiTextInput.TextField.focus - internal');
			
			if($this._ui_table)
				$this._ui_table.height = '100%';
			
			if($this._ui)
				$this._ui.height = '100%';	
		});
		
		$this._ui_text_input = $textInput;
	
	//TableView UI
	
	
	var $tableView = Titanium.UI.createTableView($_tableViewObj);
		$this._ui_table = $tableView;
	
		var $tableTopAttribute = ($this._ui_text_input.top)?$this._ui_text_input.top:0
								+($this._ui_text_input.bottom)?$this._ui_text_input.bottom:0
								+($this._ui_text_input.height)?$this._ui_text_input.height:0
		
		$this._ui_table.top = $tableTopAttribute;
		
		$this._ui_table.addEventListener('click',function(_e)
		{
			Ti.API.error('PsiiiTextInput.Table.click - internal');
			Ti.API.error(_e);
			
			var $val = _e.row.title;
			
			if($val)
				$this._ui_text_input.value = $val;
			
		});
	
	
	//combine UI
	$this._ui.add($this._ui_text_input);
	$this._ui.add($this._ui_table);
	
}
 
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
 
module.exports = PsiiiTextInput;
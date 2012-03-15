
exports.suggest = function(_val,_onLoad,_onError)
{
	
	var $url = "http://suggestqueries.google.com/complete/search?client=firefox&q="+_val;
	var $client = Ti.Network.createHTTPClient(
		{

	     onload : function(_e) 
	     {
	     	var $_onLoad = _onLoad;
	     	Ti.API.error('PsiiiSuggest.suggest - onLoad');
	        var $json = {};
	        
	        if(this.responseText)
	        	$json = eval(this.responseText);
	        
	        var $value 	= $json[0];
	        var $suggestions = $json[1];
	        	 
	         
			if($_onLoad)
			{
				_onLoad({
					value : $value,
					suggestions: $suggestions
				});
			}
			else
				Ti.API.error('ERROR: PsiiiSuggest.suggest you need to set an onLoad-Event-Callback');
	     },
	     
	     onerror : function(_e) 
	     {
	     	var $_onError = _onError;
	         Ti.API.error('PsiiiSuggest.suggest - onError');
	         
	         if($_onError)
	         	_onError(_e);
	     },
	     timeout : 5000
	 });
	 
	 $client.open("GET", $url);
	 
	 
	 $client.send();
	 
}

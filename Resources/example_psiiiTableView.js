var UI = {
			PsiiiTableView : require('/lib/ui/psiiiTableView')
		};
		
function loadRSSFeed(_psiiiTableView)
{
	var xhr = Titanium.Network.createHTTPClient();

	xhr.onload = function()
	{
		var $doc = this.responseXML.documentElement;
		var $items = $doc.getElementsByTagName("item");
		
		var $tableArray = [];
		
		for (var c=0;c<$items.length;c++)
		{
			var $item = $items.item(c);
			var $tweet = $item.getElementsByTagName("title").item(0).text;
			
			$tableArray.push({title:$tweet});
		}
		_psiiiTableView.fillData($tableArray);
		
	};
	// open the client
	xhr.open('GET','http://search.twitter.com/search.rss?q=appcelerator');
	
	// send the data
	xhr.send();
}
		
(function(){

	var $win = Ti.UI.currentWindow;
	
	var $psiiiTableObj = new UI.PsiiiTableView({ 
													top:0,
													width : 		'100%', 
													height:			'100%',
													borderRadius: 	0,
													backgroundColor:'transparent',
													selectedColor: 'transparent',
													minRowHeight:30,
													font:{fontSize:10}
												},
												function(_this) 
											    {
													loadRSSFeed(_this);
											    },
											    {
													text_pull : "Pull to refresh",
													text_refresh : "Release to refresh",
													text_last_update: 'Last Updates: ',
													text_loading: 'Loading...',
													text_loading_error:"Something went wrong!",
												    backgroundColor:"#CCC",
												    labelColor:"#000"
												});
	var $table = $psiiiTableObj.getTable();		
	loadRSSFeed($psiiiTableObj)
	$win.add($table);
})();

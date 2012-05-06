var UI = {
			PsiiiTableView : require('/lib/ui/psiiiTableView')
		};

function createTweetTableRow(_item)
{
	var $tweet = {};
	$tweet.tweet = _item.getElementsByTagName("title").item(0).text;
	$author = _item.getElementsByTagName("author").item(0).text;
	$author = $author.split('@');
	$author = "@"+$author[0];
	
	$tweet.author = $author
	$tweet.date = _item.getElementsByTagName("pubDate").item(0).text;
	$tweet.image = _item.getElementsByTagName("media:content").item(0).getAttribute("url");
	Ti.API.debug($tweet);
	
	
	var $tableRow = Ti.UI.createTableViewRow({ 
		height:'auto',
		width:'100%',
		layout: 'horizontal'
		});
	
	var $profilImage = Ti.UI.createImageView({
		width: 50,
		height:50,
		left: 5,
		top:5,
		image: $tweet.image,
		borderWidth:2,
		borderColor:'grey'
	});
	$tableRow.add($profilImage);
	
	var $rightView = Ti.UI.createView({
		layout:'vertical',
		width:'auto',
		height:'auto',
		right:5
	});
	
	
	//author text
	var $authorLabel = Ti.UI.createLabel({
		text : $tweet.author,
		height:'auto',
		width:'auto',
		left:10,
		color:'grey',
		font:{fontSize:12,fontWeight:'bold'}
		
	});
	$rightView.add($authorLabel);

	//date text
	var $dateLabel = Ti.UI.createLabel({
		text : $tweet.date,
		height:'auto' ,
		width:'auto',
		left:10,
		font:{fontSize:10},
		color:'grey'
	});
	$rightView.add($dateLabel);
	
	
	//tweet text
	var $tweetLabel = Ti.UI.createLabel({
		text : $tweet.tweet,
		height:'auto' ,
		width:'auto',
		left:10,
		top:5,
		font:{fontSize:12},
		bottom:10
	});
	$rightView.add($tweetLabel);
	
	
	$tableRow.add($rightView);
	
	
	return $tableRow;
	
}		

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
			var $tweetTableRow = createTweetTableRow($item);
			
			$tableArray.push($tweetTableRow);
		}
		/*
		 * adds data to the psiiiTableView
		 */
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

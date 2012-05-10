## Welcome to LibPsiii - Titanium

This is a small Lib with a couple of custom UIs and a handy ImageFactory.
Everything is build as a CommonJS-Module.
Developed on iOS 5 and Ti.SDK 1.8.2 

### ToDo
- make all Psiii-Constructors work similar
- check everthing on Android
- check on Ti.SDK 2.0.1
- It seems that FastDev sometimes breaks the ImageCached Files


```
var UI = {
		PsiiiTextInput : 	require('/lib/ui/psiiiTextInput'),
		PsiiiTableView : 	require('/lib/ui/psiiiTableView'),
		PsiiiProgressView : 	require('/lib/ui/psiiiProgressView'),
		PsiiiImage: 		require('lib/ui/psiiiImage')
	};
	
var LIB = {
		PsiiiSuggest : 	require('/lib/PsiiiSuggest')
	};
```

# PsiiiSuggest
- little wrapper class for Google's Suggest-Tool -> http://suggestqueries.google.com/complete/search?client=firefox&q=appc

```
LIB.PsiiiSuggest.suggest("hallo",
			function(_e)
			{
				Ti.API.error(_e.suggestions);
				// ['halloween','halloween costumes','halloween 3d',...]
			});	
```		

# PsiiiTextInput		
- extented and customizeable "SearchBar" styled input
- Input-onFocus-Event opens up an Input/Table-View which can be filled with content related stuff of the current input value

```
var $win = Ti.UI.currentWindow;

var $pti_minObj = new UI.PsiiiTextInput({
						onChange:function(_e) //textInput onChange
						{
							var $$pti_tagsObj = $pti_minObj;
							
							Ti.API.error("PsiiiTextInput.onChange");
							
							LIB.PsiiiSuggest.suggest(_e.value,
										function(_e)
										{
											Ti.API.error(_e);
											
											var $data = [];
											
											for(var i in _e.suggestions)
											{
												var $s = _e.suggestions[i];
												
												$data.push({title: $s});
											}
											Ti.API.error($data);
											$$pti_tagsObj.setData($data);
										});
							
						},
						onBlur:function(_e) //textInput onBlur
						{
							var $$pti_tagsObj = $pti_tagsObj;
							Ti.API.error("PsiiiTextInput.onBlur: "+$$pti_tagsObj.getValue());
						}
					},//PsiiiTextInput constructor Vars
					{
						borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
						height: 35,
						right:10,
						left:10,
						zindex:1000,
						top:10,
					},//_textInputObj,
					{
						font:{fontSize:10},
						zindex:100000,
						onClick: function(_e)
						{
							alert(_e.row.title);
						}
					},//_tableViewObj,
					{
						top:30,
						zindex:1000
					}//_containerViewObj
					,true);

$win.add($pti_minObj.getUI()); //adds a Ti.UI.View
```

# PsiiiTableView
- pretty handy Pull-To-Refresh-Table 

```
function loadTableData()
{ 
	
	var $tableRows = [];
	//creating tableRows...
	//...
	
	//load tableData into the Table 
	// -> NOT setData couz its a custom commonJS module and get and set should never be used
	_thisPsiiiTableView.fillData($tableRows);
	
	// DO NOT DO THAT! 
	// -> it will not finish the loading animation
	//_thisPsiiiTableView.getTable().setData($tableRows);
	
};

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
					},//tableView constructor parameters
					function(_thisPsiiiTableView) 
					{
						loadTableData(_thisPsiiiTableView);
					},// onPullRelease trigger function
					{
						text_pull : "Pull to refresh",
						text_refresh : "Release to refresh",
						text_last_update: 'Last Updates: ',
						text_loading: 'Loading...',
						text_loading_error:"Something went wrong!",
					    	backgroundColor:"#CCC",
					    	labelColor:"#000"
					}//PsiiiTableView constructor parameters
					);
var $table = $psiiiTableObj.getUI();	// returns a Ti.UI.TableView

loadTableData($psiiiTableObj); //inital data load

$win.add($table);
```

# PsiiiProgressView
- easy to use custom Activity-Indicator
- this is an extended/commonJS version of https://github.com/Nyvra/titanium-appcelerator-progress-view

```
var $notify = new UI.PsiiiProgressView();
											
$notify.show({text: 'Loading ...'});
var $success = true;

// after 2000ms finish loading
setTimeout(function() 
{
	if($success)
	{
		$notify.change({ 
					text: 'Successful',
					success: true
				});
	}
	else
	{
		$notify.change({ 
					text: 'Error',
					error: true
				});
	}
	
	//to give the user time to read the message 
	// add another timeout which will remove the PsiiiProgressView after 1000ms
	setTimeout(function() 
	{
	    	$notify.hide();
	}, 1000); 
	
}, 2000);


```

# PsiiiImage
- nice imageFactory to reduce your code and device memory usage
- caches remote-images
- resizes images by width or height
- mainly build for remote- an local-images currently no blobs supported
- adds automaticaly transparent border to workaround the titanium image crop by adding borderWidth to a Ti.UI.ImageView
- if compiled with Ti.SDK 2.0.1+ the alpha channel on .png files will still exist after resizing

```
var $imageView = UI.PsiiiImage.createResizedImage('http://www.androidguys.com/wp-content/uploads/2009/08/appcelerator1.png',
							{
								height : 100, //image gets resized to fit a height of 200
								borderWidth: 5,
								borderColor:'#FFF',
								top : 120,
								left: 30
							},//image constructor parameters
							function(_resizedImageBlob,_constructorParams)
							{
								alert("_resizedImageBlob: "+_resizedImageBlob.height+" _constructorParams: " + _constructorParams.top);
								
							}//image finished resizing callback
						);
```
## ToDo
- Fix: transparent images become white background after resizing -> ti.imagefactory uses jpeg compression
	# Ti.SDK 2.0.1 keeps the alpha channel on .png files

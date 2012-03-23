
var UI = {
			PsiiiTextInput : require('/lib/ui/psiiiTextInput'),
			PsiiiTableView : require('/lib/ui/psiiiTable'),
			PsiiiProgressView : require('/lib/ui/psiiiProgressView'),
		};
		
var LIB = {
			PsiiiSuggest : require('/lib/psiiiSuggest')
		}; 
		
var $win = Ti.UI.createWindow({
								title:"LibPsiii Examples",
								height:'100%',
								width:'100%',
								backgroundColor:'#d4d4d4',
								navBarHidden:false,
								tabBarHidden:true
							});

var $tableView_data = [];
$tableView_data.push({title: 'PsiiiTableView\nMultiTable Example', file:'/example_PsiiiTableView_multiple.js' ,hasChild:true});

var $tableView = Ti.UI.createTableView({
	data: $tableView_data,
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

$tableView.addEventListener('click',function(_e){
	
	var $file = false;
	
	if(_e.rowData.file)
	{ 
		$file = _e.rowData.file;
		alert($file);
		var $tempWindow = Ti.UI.createWindow({
			url : $file,
			height:'100%',
			width:'100%',
			title:_e.rowData.wintitle || _e.rowData.title,
			navBarHidden:false
		});
		
		$tempWindow.open();
		
	}else
		alert('Upps, something went wrong?!');
	
	
	
});
$win.add($tableView);
 /*
  * hidden TabGroup for easier layouting
  */
var $tabGroup = Titanium.UI.createTabGroup();	
var $tab1 = Titanium.UI.createTab({  
    title:'Start',
	window: $win
});
 
	 
$tabGroup.addTab($tab1);
 
$tabGroup.open();

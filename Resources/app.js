
var UI = {
			PsiiiTextInput : 	require('/lib/ui/psiiiTextInput'),
			PsiiiTableView : 		require('/lib/ui/psiiiTableView'),
			PsiiiProgressView : require('/lib/ui/psiiiProgressView'),
			PsiiiImage: 		require('lib/ui/psiiiImage')
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
	
	$tableView_data.push({title:'psiiiTextInput', 	uri: 'example_psiiiTextInput.js' });
	$tableView_data.push({title:'psiiiProgressView',uri: 'example_psiiiProgressView.js' });
	$tableView_data.push({title:'psiiiTableView', 	uri: 'example_psiiiTableView.js'});
	$tableView_data.push({title:'psiiiImage', 		uri: 'example_psiiiImage.js'});
	
	var $tableView = Ti.UI.createTableView({
		data: $tableView_data,
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
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

/*
 * register Events
 */
	$tableView.addEventListener('click',function(_e)
	{
		var $winURI = _e.row.uri;
		var $winTitle = _e.row.title;
		
		var $tWin = Ti.UI.createWindow({
			url:$winURI,
			title: $winTitle,
			backgroundColor:'#FFF'
		});
		$tabGroup.activeTab.open($tWin);	
	});

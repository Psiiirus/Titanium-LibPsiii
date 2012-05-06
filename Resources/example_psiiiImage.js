var UI = {
			PsiiiImage : require('/lib/ui/psiiiImage'),
		};
		

(function(){
	
	var $win = Ti.UI.currentWindow;
	$win.backgroundColor = '#d3d3d3'
	var $imageView_width = UI.PsiiiImage.createResizedImage('https://static.appcelerator.net/images/header/appc_logo.png',
														{
															
															width : 200, //image gets resized to fit a with of 200
															
															borderWidth: 2,
															borderColor:'#FFF',
															top : 20,
															right: 20
														}
													);
	$win.add($imageView_width);

	var $imageView_height = UI.PsiiiImage.createResizedImage('https://static.appcelerator.net/images/header/appc_logo.png',
														{
															
															height : 100, //image gets resized to fit a height of 200
															
															borderWidth: 2,
															borderColor:'#FFF',
															top : 120,
															left: 30
														}
													);
	$win.add($imageView_height);
	
	
	// Create a Button.
	var $btn = Ti.UI.createButton({
		title : 'clear cache and close window',
		height : 30,
		bottom : 10,
		left : 10,
		right: 10
	});
	
	// Listen for click events.
	$btn.addEventListener('click', function() 
	{
		UI.PsiiiImage.releaseCache();
		alert("Cleared Cachefolder");
		$win.close();
	});
	
	// Add to the parent view.
	$win.add($btn);
	
})();

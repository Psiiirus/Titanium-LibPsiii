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

	/*
	 * example how to use the onResizeFinish - Callback
	 * shows how to build an flexible UI
	 */


	// Create a Label.
	var $movingTestLabel = Ti.UI.createLabel({
		text : 'This label will be placed at the right bottom of the image if the image is fully rendered',
		textAlign : 'left',
		width: 'auto',
		height: 'auto',
		bottom : 0,
		left : 0,
		backgroundColor: 'red'
	});
	
	// Add to the parent view.
	$win.add($movingTestLabel);
	 
	var $imageView_height = UI.PsiiiImage.createResizedImage('http://www.androidguys.com/wp-content/uploads/2009/08/appcelerator1.png',
														{
															
															height : 100, //image gets resized to fit a height of 200
															borderWidth: 5,
															borderColor:'#FFF',
															top : 120,
															left: 30
														},//image constructor paramerters
														function(_resizedImageBlob,_constructorParams)
														{
															var $x = _resizedImageBlob.width + _constructorParams.left;
															var $y = _resizedImageBlob.height + _constructorParams.top;
															alert("_resizedImageBlob "+_resizedImageBlob.height+" _constructorParams " + _constructorParams.top);
															$movingTestLabel.bottom = null;
															$movingTestLabel.animate({ top: $y,left:$x, duration: 500 });
														}//image finished resizing callback
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

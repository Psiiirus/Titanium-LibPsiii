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

})();

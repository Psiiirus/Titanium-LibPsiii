var UI = {
			PsiiiProgressView : require('/lib/ui/psiiiProgressView'),
		};
		
(function(){

	var $win = Ti.UI.currentWindow;
	
	function showProgressView(_success,_loadingTime)
	{
		var $notify = new UI.PsiiiProgressView();
											
		$notify.show({text: 'Loading ...'});
		
		setTimeout(function() 
		{
			if(_success)
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
			
			setTimeout(function() 
			{
				Ti.API.error(" $notify.hide();");
			    $notify.hide();
			   
			}, 1000);
		}, _loadingTime);
		
	}
	
	
	// Create a Button.
	var $errorButton = Ti.UI.createButton({
		title : 'Loading: Error',
		top : 100,
		left: 10,
		right: 10,
		height: 30
	});
	
	// Listen for click events.
	$errorButton.addEventListener('click', function() {
		showProgressView(false,3000)
	});
	
	// Add to the parent view.
	$win.add($errorButton);
	
	
	// Create a Button.
	var $successButton = Ti.UI.createButton({
		title : 'Loading: Successful',
		top : 200,
		left: 10,
		right: 10,
		height: 30
	});
	
	// Listen for click events.
	$successButton.addEventListener('click', function() 
	{
		showProgressView(true,3000)
	});
	
	// Add to the parent view.
	$win.add($successButton);


	$successButton.fireEvent("click");

})();

function ProgressView(_parentWindow) 
{
    var isAndroid = (Ti.Platform.osname != "android") ? false : true;

	var _window  = (_parentWindow) ?_parentWindow.window:false;
    var _isModal = false;
    if(!_window)
    {
    	_window = Ti.UI.createWindow({
    		width:'100%',
    		height:'100%',
    		id:'ProgressView'
    	});
    	_isModal=true;
    }
    var _activityIndicator;
    var _viewFullBackgroundActivityIndicator;
    var _viewBackgroundBackActivityIndicator;
    var _viewBackgroundActivityIndicator;
    var _labelActivityIndicator;
    var _imageViewStatus;
    
    var _hasText;
    var _hasImage;

    (function()
    {
        
        _viewFullBackgroundActivityIndicator = Ti.UI.createView({
            backgroundColor:"transparent",
            top:0,
            left:0,
            width:"100%",
            height:"100%"
        });
        
        _viewBackgroundBackActivityIndicator = Ti.UI.createView({
            backgroundColor:"transparent",
            opacity:1.0,
            width:100,
            height:100
        });
        _viewFullBackgroundActivityIndicator.add(_viewBackgroundBackActivityIndicator);
        
        _viewBackgroundActivityIndicator = Ti.UI.createView({
            backgroundColor:"#000",
            borderRadius:8,
            opacity:0.9,
            width:100,
            height:100
        });
        _viewBackgroundBackActivityIndicator.add(_viewBackgroundActivityIndicator);
        
        _viewActivityIndicator = Ti.UI.createView({
            backgroundColor:"transparent",
            opacity:1.0,
            width:"100%",
            top:0,
            left:0,
            right:0,
            bottom:0
        });
        _viewBackgroundBackActivityIndicator.add(_viewActivityIndicator);
        
        _imageViewStatus = Ti.UI.createImageView({
            width:28,
            height:28
        })
        
        _activityIndicator = Ti.UI.createActivityIndicator({
            style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
        });
        _viewActivityIndicator.add(_activityIndicator);
        
        _labelActivityIndicator = Ti.UI.createLabel({
            color:"#FFF",
            font:{fontSize:14, fontWeight:"bold"},
            textAlign:"center",
            left:10,
            right:10,
            bottom:10,
            height:16
        });
        
        _activityIndicator.show();
        
    })();
    
    this.show = function(_parentWindow)
    {
        if (!isAndroid)
        {
            if (_parentWindow) 
            {
                if (_parentWindow.text || _parentWindow.textId) 
                {    
                    
                    _viewActivityIndicator.bottom = 20;
                    
                    setTextLabel(_parentWindow);
                    
                    _hasText = 1;
                    
                    _viewBackgroundBackActivityIndicator.add(_labelActivityIndicator);
                    
                }
                
                if (_parentWindow.success == true || _parentWindow.error == true) 
                {
                    _hasImage = 1;
                    _imageViewStatus.image = "/libs/progress.view/" + ((_parentWindow.success == true) ? "success" : "error") + ".png";
                    _viewActivityIndicator.remove(_activityIndicator);
                    _viewActivityIndicator.add(_imageViewStatus);
                }
                
            }
        
            _viewFullBackgroundActivityIndicator.opacity = 0.0;
        
            _viewFullBackgroundActivityIndicator.animate({
                opacity:1.0,
                duration:300
            });
        
            _window.add(_viewFullBackgroundActivityIndicator);
        } 
        else {
            if (_parentWindow) 
            {
                if (_parentWindow.text) {
                    _activityIndicator.message = _parentWindow.text;
                } else if (_parentWindow.textId) {
                    _activityIndicator.messageid = _parentWindow.textId;
                }
            }
            
            _window.add(_activityIndicator);
        }
        
        if(_isModal)
        	_window.open();
    }

    this.hide = function()
    {
        if (!isAndroid)
        {
            _viewFullBackgroundActivityIndicator.opacity = 1.0;
        
            _viewFullBackgroundActivityIndicator.animate({
                opacity:0.0,
                duration:300
            });
        
            setTimeout(function() 
            {
                
                _window.remove(_viewFullBackgroundActivityIndicator);
                
                
                if (_hasText == 1) {
                    _viewBackgroundActivityIndicator.width = _viewBackgroundBackActivityIndicator.width = 100;
                    _viewActivityIndicator.bottom = 0;
                    _hasText = 0;
                    _viewBackgroundBackActivityIndicator.remove(_labelActivityIndicator);
                }
                
                if (_hasImage == 1) {
                    _viewActivityIndicator.remove(_imageViewStatus);
                    _viewActivityIndicator.add(_activityIndicator);
                }
                
                if(_isModal)
        			_window.close();
        		
                
            }, 300);
        }
        else {
            _window.remove(_activityIndicator);
            if(_isModal)
        		_window.close();
        }
    }
    
    this.change = function(_parentWindow)
    {
        if (!isAndroid)
        {
            if (_parentWindow)
            {
                if (_parentWindow.text || _parentWindow.textId)
                {
                    if (_hasText == 1) {
                        setTextLabel(_parentWindow);
                    } 
                    else {
                        
                        _viewActivityIndicator.animate({bottom: 20, duration: 200});
                        
                        _hasText = 1;
                        
                        setTextLabel(_parentWindow);
                        
                        _viewBackgroundBackActivityIndicator.add(_labelActivityIndicator);
                    
                    }
                }
                
                if (_parentWindow.success == true || _parentWindow.error == true) 
                {
                    if (_hasImage == 1) {
                        _imageViewStatus.image =  "/lib/ui/"+((_parentWindow.success == true) ? "success" : "error") + ".png";
                    }
                    else {
                        _hasImage = 1;
                        _imageViewStatus.image = "/lib/ui/"+((_parentWindow.success == true) ? "success" : "error") + ".png";
                        _viewActivityIndicator.remove(_activityIndicator);
                        _viewActivityIndicator.add(_imageViewStatus);
                    }
                }
                else {
                    if (_hasImage == 1) {
                        _viewActivityIndicator.add(_activityIndicator);
                        _viewActivityIndicator.remove(_imageViewStatus);
                    }
                }
            }
        }
    }
    
    var setTextLabel = function(_parentWindow) 
    {
        var _width = Ti.UI.createLabel({
            text:(_parentWindow.text) ? _parentWindow.text : _parentWindow.textId,
            font:{fontSize:14, fontWeight:"bold"},
            width:"auto"
        }).toImage().width + 20;
        
        if (_width > 100 && _width < 310) {
            
            if (_hasText == 1) {
                _viewBackgroundBackActivityIndicator.animate({width: _width, duration:200});
                _viewBackgroundActivityIndicator.animate({width: _width, duration:200});
            }
            else {
                _viewBackgroundBackActivityIndicator.width = _viewBackgroundActivityIndicator.width = _width;
            }
            
        }
        
        _labelActivityIndicator.text = (_parentWindow.text) ? _parentWindow.text : _parentWindow.textId;
    }
    
    Ti.App.addEventListener('psiii.ProgressView.close',this.hide);
    
}


module.exports = ProgressView;
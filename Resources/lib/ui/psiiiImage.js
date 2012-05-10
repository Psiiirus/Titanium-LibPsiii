
exports.debugMode = true;

exports.isAndroid 	= (function(){ if (Titanium.Platform.osname=='android'){ return true;}else{return false;}})();
exports.isIOS 		= (function(){ if(Titanium.Platform.osname=='iphone'){return true;}else{return false;} })();

exports.useTiImageFactoryOnIOS = true;
exports.useLocalImageCache = true;

var $imageDirName= 'psiiiImage'; //needs to be a global to be available for (function(){})() - Calls
exports.imageDir 	=	(function()
						{
							var $imageDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,$imageDirName);
							if (! $imageDir.exists())
							    $imageDir.createDirectory();

							return $imageDir.resolve();
						})();


/*
 * drops the cache folder and does a recreate after that
 */
exports.releaseCache = function()
{
	var $imageDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,$imageDirName);

	if( $imageDir.exists() )
		if( $imageDir.deleteDirectory(true) )
			$imageDir.createDirectory();
}

/*
 * checks if the url is already saved on device
 */
exports.checkRemoteCacheURL = function(_imageURL)
{
	var $isCached = false;
	
    var $needsToSave = false;
    var $savedFile;
    
    var $returnURL="";
    
    if(_imageURL)
    {
      $savedFile = Titanium.Filesystem.getFile(this.imageDir,_imageURL.replace(/(https|http|\/|:)/g,'') );
      if($savedFile.exists())
      {
      	$isCached = true;
      	
        $returnURL = $savedFile.getNativePath();
      } 
      else 
      {
        $needsToSave = true;
        $returnURL = _imageURL;
      }
    }
    
    if($needsToSave === true)
    {
    	this.workaroundImageLoader(_imageURL,function(_imageBlob)
    	{
    		if($savedFile.write( _imageBlob ) === false)
	    		Ti.API.debug("checkRemoteCacheURL - Loaded : failed "+_imageBlob.length+" "+_imageURL);
	        else
	        	Ti.API.debug("checkRemoteCacheURL - Loaded : done "+_imageURL+"-"+_imageBlob.getNativePath());
    	});
    }
    	
    Ti.API.debug("checkRemoteCacheURL : "+$returnURL);
    return {isCached: $isCached, url : $returnURL};
  }


/*
 * function to calculate the best dimention between a given height and width
 */
exports.calcProportionalSize = function($orig_x, $orig_y, $max_x, $max_y)
{
    var $new_x = $orig_x;
    var $new_y = $orig_y;

	var $max_ratio = $max_x / $max_y;
	var $orig_ratio =  $orig_x / $orig_y;

    var $per_x = $orig_x / $max_x;
    var $per_y = $orig_y / $max_y;
    if ($max_ratio > $orig_ratio) 
    {
      $new_x = Math.floor($orig_x / $per_y);
      $new_y = $max_y;
    }
    else 
    {
      $new_y = Math.floor($orig_y / $per_x);
      $new_x = $max_x;
    }
    
   return {width:$new_x,height:$new_y};
};


/**
 * function to resize an imageBlob 
 * @param {Blob} _imageBlob 
 * @param {Number} _width '20' 
 * @param {Number} _height '20' 
 * @return Ti.Blob
 */
exports.resizeImage = function(_imageBlob,_width,_height,_params)
{
	var $outBlob;
	
	if(this.isAndroid || this.useTiImageFactoryOnIOS)
	{
		var imagefactory = require('ti.imagefactory');
		
		var $width = _width;
		var $height = _height;
		
		var $borderTransformObj = {};
		if(_params.borderWidth)
		{
			$borderTransformObj.type 		= imagefactory.TRANSFORM_TRANSPARENTBORDER;
			$borderTransformObj.borderSize 	= _params.borderWidth;
			
			var $width  = $width-(2*_params.borderWidth);
			var $height = $height-(2*_params.borderWidth);
		}
		var $resizeTransformObj = { 
									type:imagefactory.TRANSFORM_RESIZE, 
									width: $width, 
									height: $height, 
									quality: imagefactory.QUALITY_MEDIUM 
								};
			
		$outBlob = imagefactory.imageTransform(
													_imageBlob, 
													$resizeTransformObj,
													$borderTransformObj
												);
												
		Ti.API.debug("psiiiImage used ti.imagefactory");
	}
	else
		$outBlob = _imageBlob.imageAsResized(_width,_height); // iOS
		
	if(this.debugMode)
	{
		Ti.API.debug("--------------------------------");		
		Ti.API.debug("resizeImage : "+$outBlob.width+"x"+$outBlob.height);		
		Ti.API.debug("Original Blob: "+(_imageBlob.length/1024/1024)+"MB");
		Ti.API.debug("Resized Blob: "+($outBlob.length/1024/1024)+"MB");
		Ti.API.debug("--------------------------------");
	}
	
	return $outBlob;
}

/**
 * function to create a resized imageBlob by width
 * @param {Blob} _imageBlob 
 * @param {Number} _newWidth '20' 
 * @return Ti.Blob
 */
exports.createResizedImageBlobByWidth = function(_imageBlob, _newWidth, _params) 
{
	
	var $imageWidth  = _imageBlob.width;
	var $imageHeight = _imageBlob.height;
    
    //check vars
    if ($imageWidth <= 0 || $imageHeight <= 0 || _newWidth <= 0)
        return _imageBlob;

    var $ratio = $imageWidth / $imageHeight;

    var $w = _newWidth;
    var $h = _newWidth / $ratio;
	
    return this.resizeImage(_imageBlob,$w,$h,_params);
}

/**
 * function to create a resized imageBlob by height
 * @param {Blob} _imageBlob 
 * @param {Number} _newHeight '20' 
 * @return Ti.Blob
 */
exports.createResizedImageBlobByHeight= function(_imageBlob, _newHeight,_params) 
{
	var $imageWidth = _imageBlob.width;
	var $imageHeight = _imageBlob.height;
	
    // only run this function if suitable values have been entered
    if ($imageWidth <= 0 || $imageHeight <= 0 || _newHeight <= 0)
        return _imageBlob;

    var $ratio = $imageWidth / $imageHeight;

    var $w = _newHeight * $ratio;
    var $h = _newHeight;

    return this.resizeImage(_imageBlob,$w,$h,_params);
}

/**
 * function to create a resized image by height
 * @param {String} _image 
 * @param {Number} _newHeight '20' 
 * @param {Object} _params {borderColor:#FFF,borderWidth:3}
 * @return Ti.UI.ImageView
 */
exports.createResizedImageViewByHeight = function(_imageURL,_newHeight,_params)
{
	if(!_params)
		var _params = {};
	
	var $t_image = Ti.UI.createImageView({
		image: _imageURL,
		width:'auto',
		height:'auto'
	});

	var $t_blob = $t_image.toBlob();
	var $n_blob = this.createResizedImageBlobByHeight($t_blob,_newHeight,_params);
	
	_params.width	= $n_blob.width;
	_params.height	= $n_blob.height;
	
	//checks if compression alg. was really usefull -> better ram managment
	if($n_blob.length>$t_blob.length)
		$n_blob = $t_blob;	
		
	_params.image	= $n_blob;
		
	if(this.debugMode)
	{
		Ti.API.debug("createResizedImageViewByHeight");
		Ti.API.debug("old Blob "+($t_blob.length/1024/1024)+"MB");
		Ti.API.debug("new Blob "+($n_blob.length/1024/1024)+"MB");
	}
	
	var $n_imageView = Ti.UI.createImageView(_params);
	$t_blob = null; //will this help?
	$t_image = null;//will this help?
	return $n_imageView;
}


/**
 * function to create a resized image by width
 * @param {String} _imageURL 'http://myPage.de/image.jpg'
 * @param {Object} _newWidth '20' 
 * @param {Object} _params {borderColor:'#FFF',borderWidth:3}
 * @return Ti.UI.ImageView
 */
exports.createResizedImageViewByWidth = function(_imageURL,_newWidth,_params)
{
	if(!_params)
		var _params = {};
	
	var $t_image = Ti.UI.createImageView({
		image: _imageURL,
		width:'auto',
		height:'auto'
		
	});

	var $t_blob = $t_image.toImage();
	var $n_blob = this.createResizedImageBlobByWidth($t_blob,_newWidth,_params);
	
	_params.width	= $n_blob.width;
	_params.height	= $n_blob.height;
	
	//checks if compression alg. was really usefull -> better ram managment
	if($n_blob.length>$t_blob.length)
		$n_blob = $t_blob;	
		
	_params.image	= $n_blob;
		
	if(this.debugMode)
	{
		Ti.API.debug("createResizedImageViewByWidth");
		Ti.API.debug("old Blob "+($t_blob.length/1024/1024)+"MB");
		Ti.API.debug("new Blob "+($n_blob.length/1024/1024)+"MB");
	}
		
	var $n_imageView = Ti.UI.createImageView(_params);
	$t_blob = null; //will this help?
	$t_image = null;//will this help?
	return $n_imageView;
};


/*
 * wrapper function for the psiiiImage Factory
 */

exports.createResizedImage = function(_imageURL,_imageObj,_onLoad)
{
	var $isLocal = false;
	if(this.useLocalImageCache)
	{
		Ti.API.error("check for cache");		
		var $tempCheck = this.checkRemoteCacheURL(_imageURL);
		_imageURL = $tempCheck.url;
		$isLocal = $tempCheck.isCached;
	}
	
	if( $isLocal || _imageURL.indexOf("http://")===-1)
		$isLocal = true;
	else
		$isLocal = false;

	if(!_imageObj)
		var _imageObj = {};
		
	var $width 	= (_imageObj.width)?_imageObj.width:false;
	var $height = (_imageObj.height)?_imageObj.height:false;
	
	var $imageView = Ti.UI.createImageView(_imageObj);
	
	var $this = this;
	
	if(!$isLocal)
	{
		this.workaroundImageLoader(	_imageURL,
									function(_imageBlob)
									{
										Ti.API.error(" workaroundImageLoader "+_imageURL);
										
										if($width)
											var $imageViewBlob = $this.createResizedImageBlobByWidth(_imageBlob,$width,_imageObj);
										else if($height)
											var $imageViewBlob = $this.createResizedImageBlobByHeight(_imageBlob,$height,_imageObj);
										
										
										$imageView.image 	= $imageViewBlob;
										$imageView.width 	= $imageViewBlob.width;
										$imageView.height 	= $imageViewBlob.height;
										
										
										Ti.API.debug("---------------- "+_imageURL+" - "+$imageViewBlob.width);
										$imageViewBlob = null;
										
										if(_onLoad)
											_onLoad($imageView,_imageObj);
										
									});
	}else
	{
		if($width)
			$imageView = $this.createResizedImageViewByWidth(_imageURL,$width,_imageObj);
		else if($height)
			$imageView = $this.createResizedImageViewByHeight(_imageURL,$height,_imageObj);
			
		if(_onLoad)
			_onLoad($imageView,_imageObj);
	}
	
	return $imageView;
};


exports.workaroundImageLoader = function(_url,_callback)
{
	var xhr = Titanium.Network.createHTTPClient();
 
    xhr.onload = 	function(e)
					{
					    var $uri = e.source.location;
					    var $imgData = e.source.responseData;
					 	
					 	_callback($imgData);
					    //targetView.image = imgData;
					 
					    // perform any other load behaviours to perform for the image
					};
    xhr.onerror = function(){ };
    xhr.setTimeout(30000);          // ...or whatever is appropriate
    xhr.open('GET', _url);
    xhr.send();
 
    Ti.API.info('Reading remote image: ' + _url);
};

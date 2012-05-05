
exports.debugMode = true;

exports.isAndroid = (function(){ if (Titanium.Platform.osname=='android'){ return true;}else{return false;}})();
exports.isIOS = (function(){ if(Titanium.Platform.osname=='iphone'){return true;}else{return false;} })();

exports.useTiImageFactoryOnIOS = false;


exports.getProportionalSize = function($orig_x, $orig_y, $max_x, $max_y)
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

exports.getResizedImage = function(_blob, _max_x, _max_y) 
{
	var app = require('/c/acc');
	
    var $new_x = _blob.width;
    var $new_y = _blob.height;

	var $max_ratio = _max_x / _max_y;
	var $orig_ratio =  $new_x / $new_y;

    var $per_x = $new_x / _max_x;
    var $per_y = $new_y / _max_y;
    if ($max_ratio > $orig_ratio) 
    {
      $new_x = Math.floor($new_x / $per_y);
      $new_y = _max_y;
    }
    else 
    {
      $new_y = Math.floor($new_y / $per_x);
      $new_x = _max_x;
    }
	
	
	var $outBlob;
	
    return $outBlob;
}


/**
 * function to resize an imageBlob 
 * @param {Blob} _imageBlob 
 * @param {Number} _width '20' 
 * @param {Number} _height '20' 
 * @return Ti.Blob
 */
exports.resizeImage = function(_imageBlob,_width,_height)
{
	var $outBlob;
	
	if(this.debugMode)
	{
		Ti.API.debug("--------------------------------");		
		Ti.API.debug("resizeImage : "+_width+"x"+_height);		
		Ti.API.debug("Original Blob: "+(_imageBlob.length/1024/1024)+"MB");
	}
	
	if(this.isAndroid || this.useTiImageFactoryOnIOS)
	{
		var imagefactory = require('ti.imagefactory');		
		$outBlob = imagefactory.imageAsResized(_blob, { width:$new_x, height:$new_y, quality: imagefactory.QUALITY_MEDIUM });
	}
	else
	{
		$outBlob = _blob.imageAsResized($new_x,$new_y);
	}
		
	if(this.debugMode)
	{
		Ti.API.debug("Resized Blob: "+($outBlob.length/1024/1024)+"MB");
		Ti.API.debug("--------------------------------");
	}
	
	
	return $outBlob;
}

exports.getResizedImageBlobByWidth = function(_imageBlob, _newWidth) {
	
	var $imageWidth  = _imageBlob.width;
	var $imageHeight = _imageBlob.height;
    
    //check vars
    if ($imageWidth <= 0 || $imageHeight <= 0 || _newWidth <= 0)
        return _imageBlob;

    var $ratio = $imageWidth / $imageHeight;

    var $w = _newWidth;
    var $h = _newWidth / $ratio;
	
    return this.resizeImage(_imageBlob,$w,$h);
}

/**
 * function to create a resized imageBlob by height
 * @param {Blob} _imageBlob 
 * @param {Number} _newHeight '20' 
 * @return Ti.Blob
 */
exports.getResizedImageBlobByHeight= function(_imageBlob, newHeight) 
{
	var $imageWidth = _imageBlob.width;
	var $imageHeight = _imageBlob.height;
	
    // only run this function if suitable values have been entered
    if ($imageWidth <= 0 || $imageHeight <= 0 || _newHeight <= 0)
        return _imageBlob;

    var $ratio = $imageWidth / $imageHeight;

    var $w = _newHeight * $ratio;
    var $h = _newHeight;

    return this.resizeImage(_imageBlob,$w,$h);
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
	var $t_image = Ti.UI.createImageView({
		image: _imageURL,
		width:'auto',
		height:'auto'
	});
	var $t_blob = $t_image.toBlob();
	
	var $n_blob = this.getResizedImageBlobByHeight($t_blob,_newHeight);
	
	if(!_params)
		var _params = {};
	
	_params.image	= $n_blob,
	_params.width	= $n_blob.width,
	_params.height	= $n_blob.height
	
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
	var $t_image = Ti.UI.createImageView({
		image: _imageURL,
		width:'auto',
		height:'auto'
	});
	var $t_blob = $t_image.toBlob();
	
	var $n_blob = this.getResizedImageByWidth($t_blob,_newWidth);
	
	if(!_params)
		var _params = {};
	
	_params.image	= $n_blob,
	_params.width	= $n_blob.width,
	_params.height	= $n_blob.height
	
	var $n_imageView = Ti.UI.createImageView(_params);
	$t_blob = null; //will this help?
	$t_image = null;//will this help?
	return $n_imageView;
}
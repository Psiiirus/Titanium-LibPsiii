// open a single window
var window = Ti.UI.createWindow({
    backgroundColor: 'white'
});

var imageView = Titanium.UI.createImageView({
    image: 'images/flower.jpg',
    top: 4,
    left: 4,
    width: 'auto',
    height: 'auto'
});

window.add(imageView);

var btnTransform = Titanium.UI.createButton({
    title: 'Next',
    top: 4,
    right: 4,
    width: 60,
    height: 40
});
window.add(btnTransform);

var btnSave = Titanium.UI.createButton({
    title: 'Save',
    top: 48,
    right: 4,
    width: 60,
    height: 40
});
window.add(btnSave);

var imageViewTransformed = Titanium.UI.createImageView({
    top: 221,
    left: 4,
    width: 'auto',
    height: 'auto'
});

window.add(imageViewTransformed);
window.open();

var ImageFactory = require('ti.imagefactory');
Ti.API.info("module is => " + ImageFactory);

var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', 'flower.jpg');
var blob = f.read();
imageViewTransformed.image = blob;
var type = 0;

btnTransform.addEventListener('click', function (e) {
    switch (type) {
        case 0:
            newBlob = ImageFactory.imageWithAlpha(blob, { format: ImageFactory.PNG });
            break;
        case 1:
            newBlob = ImageFactory.imageWithTransparentBorder(blob, { borderSize: 10, format: ImageFactory.PNG });
            break;
        case 2:
            newBlob = ImageFactory.imageWithRoundedCorner(blob, { borderSize: 4, cornerRadius: 8, format: ImageFactory.PNG });
            break;
        case 3:
            newBlob = ImageFactory.imageAsThumbnail(blob, {size: 64, borderSize: 5, cornerRadius: 10, format: ImageFactory.PNG });
            break;
        case 4:
            newBlob = ImageFactory.imageAsResized(blob, { width: 140, height: 140 });
            break;
        case 5:
            newBlob = ImageFactory.imageAsCropped(blob, { width: 100, height: 100, x: 50, y: 50 });
            break;
        case 6:
            newBlob = ImageFactory.imageTransform(blob,
                { type: ImageFactory.TRANSFORM_CROP, width: 200, height: 200 },
                { type: ImageFactory.TRANSFORM_ROUNDEDCORNER, borderSize: 6, cornerRadius: 20, format: ImageFactory.PNG }
            );
            break;
    }
    imageViewTransformed.image = newBlob;
    imageViewTransformed.size = { width: newBlob.width, height: newBlob.height };

    type = (type + 1) % 7;
});

btnSave.addEventListener('click', function (e) {
    newBlob = ImageFactory.compress(blob, 0.25);
    var filename = Titanium.Filesystem.applicationDataDirectory + "/newflower.jpg";
    f = Titanium.Filesystem.getFile(filename);
    f.write(newBlob);

    var alert = Ti.UI.createAlertDialog({
        title: 'Image Factory',
        message: 'Compressed image saved to newflower.jpg with compression quality of 25%'
    });
    alert.show();
});

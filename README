## Welcome to LibPsiii - Titanium

This is a small Lib with a couple of custom UIs and a handy ImageFactory.
Everything is build as a CommonJS-Module.
Developed on iOS 5 and Ti.SDK 1.8.2 

### ToDo
- check everthing on Android
- check on Ti.SDK 2.0.1
- It seems that FastDev sometimes breaks the ImageCached Files

+ var UI = {
+			PsiiiTextInput : 	require('/lib/ui/psiiiTextInput'),
+			PsiiiTableView : 	require('/lib/ui/psiiiTableView'),
+			PsiiiProgressView : require('/lib/ui/psiiiProgressView'),
+			PsiiiImage: 		require('lib/ui/psiiiImage')
+		};
		
# PsiiiTextInput		
- extented and customizeable "SearchBar" styled input
- Input-onFocus-Event opens up an Input/Table-View which can be filled with content related stuff of the current input value

# PsiiiTableView
- pretty handy Pull-To-Refresh-Table 

# PsiiiProgressView
- easy to use custom Activity-Indicator
- this is an extended version of https://github.com/Nyvra/titanium-appcelerator-progress-view

# PsiiiImage
- nice imageFactory to reduce your code and device memory usage
- caches remote-images
- resizes images by width or height
- mainly build for remote- an local-images currently no blobs supported
- adds automaticaly transparent border to workaround the titanium image crop by adding borderWidth to a Ti.UI.ImageView
- if compiled with Ti.SDK 2.0.1+ the alpha channel on .png files will still exist after resizing

## ToDo
- Fix: transparent images become white background after resizing -> ti.imagefactory uses jpeg compression
	# Ti.SDK 2.0.1 keeps the alpha channel on .png files

# PsiiiSuggest
- little wrapper class for Google's Suggest-Tool -> http://suggestqueries.google.com/complete/search?client=firefox&q=appc
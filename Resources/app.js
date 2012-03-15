
var UI = {
			PsiiiTextInput : require('/lib/ui/psiiiTextInput')
		};
		
var LIB = {
			PsiiiSuggest : require('/lib/psiiiSuggest')
		}; 
		
var $win = Ti.UI.createWindow({
								title:"psiiiUI's",
								height:'100%',
								width:'100%',
								backgroundColor:'#d4d4d4'
							});

var $pti_tagsObj = new UI.PsiiiTextInput({
									onChange:function(_e)
									{
										var $$pti_tagsObj = $pti_tagsObj;
										
										Ti.API.error("PsiiiTextInput.onChange");
										
										LIB.PsiiiSuggest.suggest(_e.value,
																function(_e)
																{
																	Ti.API.error(_e);
																	
																	var $data = [];
																	
																	for(var i in _e.suggestions)
																	{
																		var $s = _e.suggestions[i];
																		
																		$data.push({title: $s});
																	}
																	Ti.API.error($data);
																	$$pti_tagsObj.setData($data);
																});
										
									},
									onBlur:function(_e)
									{
										var $$pti_tagsObj = $pti_tagsObj;
										Ti.API.error("PsiiiTextInput.onBlur: "+$$pti_tagsObj.getValue());
									}
								},
								{
									borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
									height: 30,
									top:0,
									left: 10,
									right:10,
									keyboardToolbar : 
										[
											Titanium.UI.createButton({systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE}), 
											Titanium.UI.createButton({title : 'hinzufügen',style : Titanium.UI.iPhone.SystemButtonStyle.DONE,})
										],
								    keyboardToolbarColor : '#999',
								    keyboardToolbarHeight : 40
									
								},//_textInputObj,
								{
									font:{fontSize:10}
								},//_tableViewObj,
								{
									top:40,
									height:'auto'
								}//_containerViewObj
								);
								
var $input = $pti_tagsObj.getUI();

$win.add($input);

$win.open();

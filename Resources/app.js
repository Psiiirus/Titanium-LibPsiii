
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
							

/*
 * minimal TextInput
 */
Ti.API.error("generation : minimal PsiiiTextInput");
	var $pti_minObj = new UI.PsiiiTextInput({
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
										right:10,
										zindex:1000
									},//_textInputObj,
									{
										font:{fontSize:10},
										zindex:100000
									},//_tableViewObj,
									{
										top:10,
										zindex:1000
									}//_containerViewObj
									,true);
Ti.API.error($pti_minObj.getUI());
	$win.add($pti_minObj.getUI());	

							
							
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 * 
 * style psiiiTextInput
 * 
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
Ti.API.error("generation : style psiiiTextInput");
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
										left: 30,
										right:10,
										top:10
									},//_textInputObj,
									{
										font:{fontSize:10}
									},//_tableViewObj,
									{
										top:100,
										zindex:0
									}//_containerViewObj
									,true
									);
	
	$pti_tagsObj.setTableTopShadow('/lib/ui/shadow_vertical.png');
	var $view2 = $pti_tagsObj.getTableTopShadow();
	//$view2.opacity = 0.5;
				
	var $input = $pti_tagsObj.getUI();
	$win.add($input);

	
$win.open();

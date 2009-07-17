jQuery.fn.tag_box = function(options) {
					
					settings = jQuery.extend({
						separator: /[,]/ // It's possible to use multiple separators, like /[,;.]/
					}, options)
					
					var content = this;
					
					//Setting up the 'default' tag
					settings.tag = document.createElement('span');
					settings.tag.className = 'tag';
					settings.tag.innerHTML = '<label><span></span><input type="text" name="tag" value=" " /><abbr title="Fechar">X</abbr></label>';
					
					$(settings.tag)
						.click(function(e) {
								e.stopPropagation();

								var target = $(e.target);
								if(target.is('abbr')){ // If is the 'close' button, hide the tag and remove

									$(this).animate({width:'hide'},'fast',function() {
										$(this).remove();
									})
								
									return false;
								}
								if (target.is('span.tag')) { // The space between the tags is actually the <span> element. If you clicked, you clicked between tags.
									target.before(new_tag());
									target.prev('.tag').find(':input').focus();
								};

						})
						.find('input')
							.blur(settings.blur)
							.blur(function(e) {
								if (!$.trim($(this).val())) { // If empty, remove the tag
									setTimeout(function() {
										$(e.target).closest('.tag').remove();
									}, 100); // This timeout is necessary for safari.
								};
							})
							.keydown(settings.keydown)
							.keydown(function(e) {
								if(e.keyCode == 13){ // If ENTER key, do not submit.
									e.preventDefault();
								}
								if(e.keyCode==9 || e.keyCode == 13){ // if TAB or ENTER
									if (!e.shiftKey && $.trim($(this).val()) && !$(this).closest('.tag').next('.tag').length) { // And it's not shift+tab, and do not have a next tag
												var tag = $(this).closest('.tag').after(new_tag());
												setTimeout(function() {
													tag.next('.tag').find('input').focus();
												}, 50);
												return false;
										}
									}	
							})
							.keyup(settings.keyup)
							.keyup(function() {
								var target = $(this);
								target.siblings('span').html(this.value.replace(/ /gim, '&nbsp;').replace("<","&lt;")+"M"); // Add "M" to correct the tag size. Weird, but works!
								if(this.value.match(settings.separator)){ // If text has separators
								
									var tags = this.value.split(settings.separator),
									tag = target.closest('.tag');
									target.val(tags[0]).siblings('span').html(this.value.replace(/ /gim, '&nbsp;')+"M");
									var next_tag = [];

									for (var i = tags.length - 1; i > 0; i--){
										next_tag.push($(tag).after( new_tag(tags[i]) ).next()); // Create new tags for each separator
									};
								
									next_tag.shift().find('input').focus(); // Focus the last shown (first created) tag
								}
							})
							
							
							
					$(this).click(function(e) { // If you click the tagbox, a new tag is created
							$(this).append(new_tag()).find('.tag:last input').focus();
					})

					

					var	new_tag = function(text) {
						var text = text || ""
						
						return $(settings.tag)
								.clone(true)
									.find('input')
									.val(text)
									.end();
					}

					$(this).click();
				}
tinymce.init({
	selector: 'textarea',
	skin: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : '',
	content_css: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '',
	plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons localautosave nanospell tiny_mce_wiris_formulaEditor,tiny_mce_wiris_formulaEditorChemistry',
	external_plugins: {
    'localautosave' : 'tinymce/plugins/TinyMCE-LocalAutoSave-0.4.5 2/localautosave/plugin.min.js'
  },
	nanospell_server: "php",
	imagetools_cors_hosts: ['picsum.photos'],
	menubar: 'file edit view insert format tools table help custom',
	menu: {
		custom: { title: 'Custom menu', items: 'basicitem nesteditem toggleitem' },
	},
	setup: function (editor) {
		var toggleState = false;

		editor.ui.registry.addMenuItem('basicitem', {
			text: 'My basic menu item',
			onAction: function () {
				editor.insertContent("<p>Here's some content inserted from a basic menu!</p>");
			},
		});

		editor.ui.registry.addNestedMenuItem('nesteditem', {
			text: 'My nested menu item',
			getSubmenuItems: function () {
				return [
					{
						type: 'menuitem',
						text: 'My submenu item',
						onAction: function () {
							editor.insertContent(
								"<p>Here's some content inserted from a submenu item!</p>"
							);
						},
					},
				];
			},
		});

		editor.ui.registry.addToggleMenuItem('toggleitem', {
			text: 'My toggle menu item',
			onAction: function () {
				toggleState = !toggleState;
				editor.insertContent(
					'<p class="toggle-item">Here\'s some content inserted from a toggle menu!</p>'
				);
			},
			onSetup: function (api) {
				api.setActive(toggleState);
				return function () {};
			},
		});
	},
	toolbar:
		'localautosave | undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl | custom',
	toolbar_sticky: true,
	autosave_ask_before_unload: true,
	autosave_interval: '30s',
	autosave_prefix: '{path}{query}-{id}-',
	autosave_restore_when_empty: false,
	autosave_retention: '2m',
	image_advtab: true,
	resize: false,
	link_list: [
		{ title: 'My page 1', value: 'http://www.tinymce.com' },
		{ title: 'My page 2', value: 'http://www.moxiecode.com' },
	],
	image_list: [
		{ title: 'My page 1', value: 'http://www.tinymce.com' },
		{ title: 'My page 2', value: 'http://www.moxiecode.com' },
	],
	image_class_list: [
		{ title: 'None', value: '' },
		{ title: 'Some class', value: 'class-name' },
	],
	importcss_append: true,
	file_picker_callback: function (callback, value, meta) {
		/* Provide file and text for the link dialog */
		if (meta.filetype === 'file') {
			callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
		}

		/* Provide image and alt text for the image dialog */
		if (meta.filetype === 'image') {
			callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
		}

		/* Provide alternative source and posted for the media dialog */
		if (meta.filetype === 'media') {
			callback('movie.mp4', {
				source2: 'alt.ogg',
				poster: 'https://www.google.com/logos/google.jpg',
			});
		}
	},
	templates: [
		{
			title: 'New Table',
			description: 'creates a new table',
			content:
				'<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
		},
		{
			title: 'Starting my story',
			description: 'A cure for writers block',
			content: 'Once upon a time...',
		},
		{
			title: 'New list with dates',
			description: 'New List with dates',
			content:
				'<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
		},
	],
	template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
	template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
	image_caption: true,
	quickbars_selection_toolbar: false,
	noneditable_noneditable_class: 'mceNonEditable',
	toolbar_mode: 'sliding',
	contextmenu: 'link image imagetools table',
	branding: false,
	content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
});
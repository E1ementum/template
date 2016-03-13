/*

	This file is part of JAS;
	Version 5.3.2;
	Copyright (c) 2013 - 2015 LetMeCode.ru;
	See more in "info.txt";

*/



jas.hook_set('ready', function() {
	jas.new_element('div', {
		'id'		: 'jas_dev_template',
		'style'		: 'display: none;'
	}, jas.find('body')[0]);
	e = jas.new_element('div', {
		'id'		: 'jas_dev_template_btn'
	}, jas.find('body')[0]);
	e.innerHTML = 'Show template';
	e.addEventListener('click', function() {
		var e = jas.find('#jas_dev_template');
		if (e[0].style.display == 'none') {
			e[0].style.display = 'block';
			this.innerHTML = 'Hide template';
		} else {
			e[0].style.display = 'none';
			this.innerHTML = 'Show template';
		}
	});
});

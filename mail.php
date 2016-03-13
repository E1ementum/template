<?php

/*
	skype: Elementum
	vk: https://vk.com/e1ementum
*/



	$mail_from	= 'info@letmecode.ru';				// sender's email
	$mail_fromn	= 'JAS 5.4.0';						// sender's name
	$mail_to	= '';								// to
	$mail_subj	= 'Заявка с лендинга, New Page';	// subject
	$mail_fields = array(
		'jas_source'	=> 'Источник',
		'test'			=> 'Test field',
	);



	include('jas-5.4.0/jas.php');

	$m = '';
	foreach($_POST as $key => $value) {
		if (isset($mail_fields[$key])) {
			$m .= '<b>' . $mail_fields[$key] . '</b>: ' . $value . '<br>';
		}
	}
	if ($m == '') exit('fail');

	$utm = jas::utm_load();
	if (count($utm)) {
		$m .= '<br><b>UTM Data:</b><br>';
		foreach ($utm as $k => $v) {
			$m .= '<b>' . $k . '</b>: ' . $v . '<br>';
		}
	}

	jas::send_mail($mail_from, $mail_fromn, $mail_to, $mail_subj, $m);

	exit('done');

<?php

/*
	skype: Elementum
	vk: https://vk.com/e1ementum
*/



	define('SUBF', '/');
	define('PAGE_VERSION', 0);

	date_default_timezone_set('UTC');
	define('VERSION_SUFFIX', PAGE_VERSION == 0 ? '' : '?vers=' . PAGE_VERSION);

	include('jas-5.4.0/jas.php');
	jas::$path = SUBF . 'jas-5.4.0/';
	jas::utm_save('/');
	jas::dev();

?><!DOCTYPE html>
<!--
	skype: Elementum
	vk: https://vk.com/e1ementum
-->
<html lang="ru">
	<head>
		<meta charset="UTF-8">
		<?php jas::style(); ?>
		<link rel="stylesheet" type="text/css" href="css/style.css" media="all" />
		<link rel="stylesheet" type="text/css" href="css/jas-default.css" media="all" />
		<?php jas::script(); ?>
		<script src="<?=SUBF?>js/script.js<?=VERSION_SUFFIX?>"></script>
		<link rel="icon" type="image/png" href="<?=SUBF?>favicon-32x32.png" sizes="32x32" />
		<link rel="icon" type="image/png" href="<?=SUBF?>favicon-16x16.png" sizes="16x16" />
		<title>Title</title>
	</head>
	<body>
		<div class="screen">
			<div class="p1">
				<div class="content">
					<div class="b1">
						<div class="t1">Hi world</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>

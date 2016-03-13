<?php

/*

	This file is part of JAS;
	Version 5.4.0;
	Copyright (c) 2013 - 2015 LetMeCode.ru;
	See more in "info.txt";

*/



class jas {

	private static $is_dev = false;
	private static $utm = array('utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign');
	public static $path = '/';
	public static $version = '5.4.0';

	public static function dev() {
		self::$is_dev = true;
	}

	public static function is_dev() {
		return self::$is_dev;
	}

	public static function utm_save($path, $use_get = true, $use_post = false) {
		$a = array();
		if ($use_post) {
			foreach ($_POST as $k => $v) {
				if (in_array($k, self::$utm)) {
					$a[$k] = $v;
				}
			}
		}
		if ($use_get) {
			foreach ($_GET as $k => $v) {
				if (in_array($k, self::$utm)) {
					$a[$k] = $v;
				}
			}
		}
		foreach ($a as $k => $v) {
			setcookie('jas_' . $k, $v, 0, $path);
			$_COOKIE['jas_' . $k] = $v;
		}
		return $a;
	}

	public static function utm_load() {
		$res = array();
		foreach ($_COOKIE as $k => $v){
			$s = substr($k, 4);
			if (in_array($s, self::$utm)) {
				$res[$s] = $v;
			}
		}
		return $res;
	}

	public static function style($b = false) {
		$s = '<link rel="stylesheet" type="text/css" href="' . self::$path . 'jas' . (self::$is_dev ? '' : '.min') . '.css" media="all" />';
		if (self::$is_dev) {
			$s .= "\n" . '<link rel="stylesheet" type="text/css" href="' . self::$path . 'jas-dev.css" media="all" />';
		}
		if ($b) return $s;
		echo($s);
	}

	public static function script($b = false) {
		$ts = explode('.', microtime(true));
		if (count($ts) == 1) $ts[] = '0';
		$ts = $ts[0] . (substr(round((float)('0.' . $ts[1]) * 1000) . '000', 0, 3));
		$s = '';
		$s .= '<script>';
		$s .= 'var jas_path = \'' . self::$path . '\';';
		$s .= 'var jas_timestamp_server = ' . $ts .  ';';
		$s .= '</script>';
		$s .= '<script src="' . self::$path . 'jas' . (self::$is_dev ? '' : '.min') . '.js"></script>';
		if (self::$is_dev) {
			$s .= '<script src="' . self::$path . 'jas-dev.js"></script>';
		}
		if ($b) return $s;
		echo($s);
	}

	public static function send_mail($from, $fromn, $to, $subj, $m) {
		if ($to == '') return;
		if ($fromn == '') $fromn = 'JAS ' . self::$version;
		$m = iconv('UTF-8', 'CP1251', $m);
		$fromn = iconv('UTF-8', 'CP1251', $fromn);
		$subj = iconv('UTF-8', 'CP1251', $subj);
		$fromn = '=?koi8-r?B?' . base64_encode(convert_cyr_string($fromn, 'w', 'k')) . '?=';
		$subj = '=?koi8-r?B?' . base64_encode(convert_cyr_string($subj, 'w', 'k')) . '?=';
		$headers = 'From: ' . $fromn . ' <' . $from . '>' . "\r\n";
		$headers .= 'Return-Path: <' . $from . '>' . "\r\n";
		$headers .= 'Content-Type: text/html; charset=windows-1251 ' . "\r\n";
		mail($to, $subj, $m, $headers);
	}

}

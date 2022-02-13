<?php
session_start();
date_default_timezone_set('Europe/Moscow');

$start = microtime(true);
$x = null;
$y = null;
$r = null;
$result = null;
$time = date("H:i:s");

$send_all_data = false;

if(!isset($_SESSION['data'])){
    $_SESSION['data'] = array();
}

if(isset($_GET["x_value"])){
    $x = $_GET["x_value"];
    if (is_numeric($x)) {
        if ($x < -5 || $x > 3) {
            $x = null;
        }
    } else
        $x = null;
}

if(isset($_GET["y_value"])){
    $y = $_GET["y_value"];
    if (is_numeric($y)) {
        $y = intval($y);
        if ($y < -4 || $y > 4) {
            $y = null;
        }
    } else
        $y = null;
}

if(isset($_GET["r_value"])){
    $r = $_GET["r_value"];
    if (is_numeric($r)) {
        if ($r < 1 || $r > 3) {
            $r = null;
        }
    } else
        $r = null;
}

if(isset($_GET["load_all"])) {
    $send_all_data = boolval($_GET["load_all"]);
}

if($x!=null && $y!=null && $r!=null){
    $result = check_data($x, $y, $r);
}

$delta_time = number_format((microtime(true) - $start), 6);
send_data($x,$y,$r,$result, $time, $delta_time, $send_all_data);

function check_data($x_value, $y_value, $r_value) {
    if ($x_value <= 0 && $y_value <= 0) {
        if ($x_value > -$r_value && $y_value > -$r_value) {
            return true;
        }
    }
    if ($x_value >= 0 && $y_value <= 0) {
        if ($x_value**2 + $y_value**2 <= ($r_value / 2)**2) {
            return true;
        }
    }
    if ($x_value >= 0 && $y_value >= 0) {
        if($x_value <= $r_value / 2 && $y_value <= $r_value) {
            return true;
        }
    }
    return false;
}

function send_data($x_value, $y_value, $r_value, $result, $time, $delta_time, $send_all_data) {
    if (!is_null($result)) {
        $script_data = [$x_value, $y_value, $r_value, $result, $time, $delta_time];
        array_push($_SESSION["data"], $script_data);
    }

    if($send_all_data) {
        $response = json_encode($_SESSION["data"]);
    } else {
        $response = json_encode(end($_SESSION["data"]));
    }
    echo $response;
}
?>
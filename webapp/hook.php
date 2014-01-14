<?php
$json = file_get_contents('php://input');
$obj = json_decode($json);
$a = $obj->{'username'};
echo $a;
?>

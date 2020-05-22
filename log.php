<?php
if (isset($_POST['action']) && $_POST['action'] == "unknown course") {
    // document action
    $fp = fopen('./missing.txt', 'a');
    fwrite($fp, PHP_EOL . '"' . $_POST['coursecode'] . '",');
    fclose($fp);
    echo "successful";
}
?>
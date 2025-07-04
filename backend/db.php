<?php
// htdocs/my-health-app-backend/db.php

$servername = "localhost";
$username = "root";     // Default XAMPP username
$password = "";         // Default XAMPP password
$dbname = "health_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
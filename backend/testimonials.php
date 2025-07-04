<?php
// htdocs/my-health-app-backend/testimonials.php

// This line is crucial for allowing your React app to fetch data
header("Access-Control-Allow-Origin: http://localhost:5174"); 
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

$testimonials = array();
$sql = "SELECT id, name, role, quote, avatar_url FROM testimonials";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $testimonials[] = $row;
    }
}

$conn->close();
echo json_encode($testimonials);
?>
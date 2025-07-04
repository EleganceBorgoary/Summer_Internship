<?php
// htdocs/my-health-app-backend/early-access.php

header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid email provided.']);
    exit();
}

$email = $conn->real_escape_string($data->email);

$sql = "INSERT INTO early_access (email) VALUES ('$email')";
if ($conn->query($sql) === TRUE) {
    http_response_code(201);
    echo json_encode(['message' => "Thank you! You've been added to the early access list."]);
} else {
    // Check for duplicate entry error
    if ($conn->errno == 1062) {
        http_response_code(409); // Conflict
        echo json_encode(['message' => 'This email is already on the list!']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error: ' . $conn->error]);
    }
}

$conn->close();
?>
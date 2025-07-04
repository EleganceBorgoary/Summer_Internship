<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->phone) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Phone and password are required.']);
    exit();
}

$phone = $conn->real_escape_string($data->phone);
// Hash the password for security
$password = password_hash($conn->real_escape_string($data->password), PASSWORD_BCRYPT);

// Check if phone already exists
$checkSql = "SELECT id FROM patients WHERE phone = '$phone'";
$result = $conn->query($checkSql);
if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['message' => 'This phone number is already registered.']);
    exit();
}

$sql = "INSERT INTO patients (phone, password) VALUES ('$phone', '$password')";
if ($conn->query($sql) === TRUE) {
    http_response_code(201);
    echo json_encode(['message' => 'Patient registered successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error registering patient: ' . $conn->error]);
}

$conn->close();
?>
<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

$data = json_decode(file_get_contents("php://input"));
if (!isset($data->phone) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Phone and password are required.']);
    exit();
}

$phone = $conn->real_escape_string($data->phone);
$password = $conn->real_escape_string($data->password);

// The SELECT statement now includes `profile_pic_url`
$sql = "SELECT id, phone, password, profile_pic_url FROM patients WHERE phone = '$phone'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Verify the password against the stored hash
    if (password_verify($password, $user['password'])) {
        // Successful login: remove the password hash before sending the response
        unset($user['password']);
        http_response_code(200);
        echo json_encode(['message' => 'Login successful.', 'user' => $user]);
    } else {
        // Password does not match
        http_response_code(401);
        echo json_encode(['message' => 'Invalid phone number or password.']);
    }
} else {
    // No user found with that phone number
    http_response_code(404);
    echo json_encode(['message' => 'User not found.']);
}

$conn->close();
?>
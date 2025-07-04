<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

$data = json_decode(file_get_contents("php://input"));
$email = $conn->real_escape_string($data->email);
$password = $conn->real_escape_string($data->password);

// The SELECT statement now includes `profile_pic_url`
$sql = "SELECT id, full_name, email, password, status, profile_pic_url FROM doctors WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $doctor = $result->fetch_assoc();
    
    // Verify the password against the stored hash
    if (password_verify($password, $doctor['password'])) {
        // Successful login: remove the password hash before sending the response
        unset($doctor['password']);
        http_response_code(200);
        echo json_encode(['message' => 'Login successful.', 'doctor' => $doctor]);
    } else {
        // Password does not match
        http_response_code(401);
        echo json_encode(['message' => 'Invalid email or password.']);
    }
} else {
    // No user found with that email
    http_response_code(404);
    echo json_encode(['message' => 'Doctor not found.']);
}

$stmt->close();
$conn->close();
?>
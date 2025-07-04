<?php
// htdocs/my-health-app-backend/admin_approve_doctor.php

// V V V V V V V V  ADD THIS ENTIRE BLOCK V V V V V V V V
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
// ^ ^ ^ ^ ^ ^ ^ ^  END OF BLOCK TO ADD ^ ^ ^ ^ ^ ^ ^ ^

include 'db.php';
// In a real app, you MUST protect this file with admin authentication.

// You are probably getting the data via POST from your React app, not GET
// Let's change this to be consistent with the reject script
$data = json_decode(file_get_contents("php://input"));

// Again, this is insecure and for demonstration.
if (!isset($data->adminPassword) || $data->adminPassword !== 'AdminSecret123') {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

if (!isset($data->id)) {
    http_response_code(400);
    echo json_encode(['message' => 'Doctor ID is required.']);
    exit();
}

$doctorId = intval($data->id);

$sql = "UPDATE doctors SET status = 'Verified', verified_at = NOW() WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $doctorId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(['message' => "Doctor ID $doctorId has been verified."]);
    } else {
        http_response_code(404);
        echo json_encode(['message' => "Doctor with ID $doctorId not found."]);
    }
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error updating doctor status: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
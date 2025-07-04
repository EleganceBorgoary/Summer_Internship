<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

$data = json_decode(file_get_contents("php://input"));

// Again, this is insecure and for demonstration.
if (!isset($data->adminPassword) || $data->adminPassword !== 'AdminSecret123') {
    http_response_code(401); exit();
}

$doctorId = intval($data->id);
$sql = "UPDATE doctors SET status = 'Rejected' WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $doctorId);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['message' => 'Doctor rejected.']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error rejecting doctor.']);
}
$stmt->close();
$conn->close();
?>
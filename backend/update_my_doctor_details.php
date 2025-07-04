<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

$data = json_decode(file_get_contents("php://input"));

// Again, trusting the ID sent from the client.
if (!isset($data->id) || !isset($data->phone) || !isset($data->qualifications) || !isset($data->specialization) || !isset($data->address)) {
    http_response_code(400);
    echo json_encode(['message' => 'Incomplete data provided.']);
    exit();
}

$id = intval($data->id);
$phone = $conn->real_escape_string($data->phone);
$qualifications = $conn->real_escape_string($data->qualifications);
$specialization = $conn->real_escape_string($data->specialization);
$address = $conn->real_escape_string($data->address);

$sql = "UPDATE doctors SET phone = ?, qualifications = ?, specialization = ?, address = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssi", $phone, $qualifications, $specialization, $address, $id);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['message' => 'Profile updated successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error updating profile: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
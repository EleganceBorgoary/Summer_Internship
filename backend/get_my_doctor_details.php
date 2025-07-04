<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");

// NOTE: A real app would use a secure session token for authentication.
// For this project, we are trusting the ID sent from the client.
if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Doctor ID is required.']);
    exit();
}

$id = intval($_GET['id']);

// The SELECT statement now includes `profile_pic_url`
$sql = "SELECT full_name, email, phone, qualifications, specialization, address, profile_pic_url FROM doctors WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $doctor = $result->fetch_assoc();
    echo json_encode($doctor);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Doctor details not found.']);
}

$stmt->close();
$conn->close();
?>
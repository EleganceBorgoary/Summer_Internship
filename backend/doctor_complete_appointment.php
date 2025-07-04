<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->appointmentId)) { http_response_code(400); echo json_encode(['message' => 'Appointment ID required.']); exit(); }
$appointmentId = intval($data->appointmentId);
$sql = "UPDATE appointments SET status = 'Completed' WHERE id = ? AND status = 'Booked'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $appointmentId);
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) { http_response_code(200); echo json_encode(['message' => 'Appointment marked as completed.']); } 
    else { http_response_code(404); echo json_encode(['message' => 'Appointment not found or already completed/cancelled.']); }
} else { http_response_code(500); echo json_encode(['message' => 'Error updating appointment.']); }
$stmt->close();
$conn->close();
?>
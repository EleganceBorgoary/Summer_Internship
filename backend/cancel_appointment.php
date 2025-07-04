<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

$data = json_decode(file_get_contents("php://input"));

// --- Basic validation ---
if (!isset($data->appointmentId) || !isset($data->userId) || !isset($data->userType)) {
    http_response_code(400); 
    echo json_encode(['message' => 'Incomplete data provided.']); 
    exit();
}

$appointmentId = intval($data->appointmentId);
$userId = intval($data->userId);
$userType = $data->userType; // 'patient' or 'doctor'

// --- Authorization Check ---
// Before we cancel, we must verify the user has permission.
$auth_sql = "SELECT patient_id, doctor_id FROM appointments WHERE id = ?";
$auth_stmt = $conn->prepare($auth_sql);
$auth_stmt->bind_param("i", $appointmentId);
$auth_stmt->execute();
$result = $auth_stmt->get_result();

if ($result->num_rows == 0) {
    http_response_code(404);
    echo json_encode(['message' => 'Appointment not found.']);
    exit();
}

$appointment = $result->fetch_assoc();
$auth_stmt->close();

$isAuthorized = false;
if ($userType === 'patient' && $appointment['patient_id'] == $userId) {
    $isAuthorized = true;
} elseif ($userType === 'doctor' && $appointment['doctor_id'] == $userId) {
    $isAuthorized = true;
}

if (!$isAuthorized) {
    http_response_code(403); // Forbidden
    echo json_encode(['message' => 'You are not authorized to cancel this appointment.']);
    exit();
}

// --- If authorized, proceed with cancellation ---
// We only allow cancellation of 'Booked' appointments
$sql = "UPDATE appointments SET status = 'Cancelled' WHERE id = ? AND status = 'Booked'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $appointmentId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        echo json_encode(['message' => 'Appointment cancelled successfully.']);
    } else {
        http_response_code(409); // Conflict
        echo json_encode(['message' => 'This appointment cannot be cancelled (it may already be completed or cancelled).']);
    }
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error cancelling the appointment.']);
}

$stmt->close();
$conn->close();
?>
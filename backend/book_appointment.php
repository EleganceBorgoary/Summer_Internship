<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

$data = json_decode(file_get_contents("php://input"));

// Again, patient ID should come from a secure session
if (!isset($data->patientId) || !isset($data->doctorId) || !isset($data->appointmentTime)) {
    http_response_code(400); echo json_encode(['message' => 'Incomplete data.']); exit();
}

$patient_id = intval($data->patientId);
$doctor_id = intval($data->doctorId);
$appointment_time = $conn->real_escape_string($data->appointmentTime); // YYYY-MM-DD HH:MM:SS

$sql = "INSERT INTO appointments (patient_id, doctor_id, appointment_time) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iis", $patient_id, $doctor_id, $appointment_time);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['message' => 'Appointment booked successfully.']);
} else {
    // Check for duplicate entry error
    if ($conn->errno == 1062) {
        http_response_code(409); // Conflict
        echo json_encode(['message' => 'This time slot is no longer available. Please select another.']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error booking appointment: ' . $conn->error]);
    }
}

$stmt->close();
$conn->close();
?>
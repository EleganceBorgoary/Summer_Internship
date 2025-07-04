<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->appointmentId) || !isset($data->patientId) || !isset($data->doctorId) || !isset($data->rating)) { http_response_code(400); echo json_encode(['message' => 'Incomplete data provided.']); exit(); }
$appointmentId = intval($data->appointmentId);
$patientId = intval($data->patientId);
$doctorId = intval($data->doctorId);
$rating = intval($data->rating);
$comment = isset($data->comment) ? $conn->real_escape_string($data->comment) : '';
$sql = "INSERT INTO reviews (appointment_id, patient_id, doctor_id, rating, comment) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiiis", $appointmentId, $patientId, $doctorId, $rating, $comment);
if ($stmt->execute()) {
    http_response_code(201); echo json_encode(['message' => 'Thank you for your feedback!']);
} else {
    if ($conn->errno == 1062) { http_response_code(409); echo json_encode(['message' => 'You have already submitted a review for this appointment.']); } 
    else { http_response_code(500); echo json_encode(['message' => 'Error submitting review: ' . $conn->error]); }
}
$stmt->close();
$conn->close();
?>
<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
if (!isset($_GET['doctor_id'])) { http_response_code(400); echo json_encode(['message' => 'Doctor ID required.']); exit(); }
$doctor_id = intval($_GET['doctor_id']);
$sql = "SELECT r.rating, r.comment, r.created_at, p.phone as patient_phone, p.profile_pic_url as patient_pic FROM reviews r JOIN patients p ON r.patient_id = p.id WHERE r.doctor_id = ? AND r.is_approved = TRUE ORDER BY r.created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$result = $stmt->get_result();
$reviews = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode($reviews);
$stmt->close();
$conn->close();
?>
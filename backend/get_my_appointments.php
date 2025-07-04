<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");

if (!isset($_GET['userId']) || !isset($_GET['userType'])) {
    http_response_code(400);
    echo json_encode(['message' => 'User ID and type required.']);
    exit();
}

$user_id = intval($_GET['userId']);
$user_type = $_GET['userType']; // 'patient' or 'doctor'

if ($user_type == 'patient') {
    // --- THIS IS THE CRITICAL SQL QUERY THAT NEEDS TO BE CORRECT ---
    // It joins with the doctors table (aliased as 'd') and selects d.id as doctor_id.
    $sql = "SELECT 
                a.id, 
                a.appointment_time, 
                a.status, 
                d.full_name as doctor_name, 
                d.id as doctor_id 
            FROM appointments a 
            JOIN doctors d ON a.doctor_id = d.id 
            WHERE a.patient_id = ? 
            ORDER BY a.appointment_time DESC";
} elseif ($user_type == 'doctor') {
    // This query is for the doctor's dashboard
    $sql = "SELECT 
                a.id, 
                a.appointment_time, 
                a.status, 
                p.phone as patient_phone 
            FROM appointments a 
            JOIN patients p ON a.patient_id = p.id 
            WHERE a.doctor_id = ? 
            ORDER BY a.appointment_time DESC";
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid user type.']);
    exit();
}

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$appointments = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($appointments);

$stmt->close();
$conn->close();
?>
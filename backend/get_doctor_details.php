<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Doctor ID is required.']);
    exit();
}

$id = intval($_GET['id']);
$response = [];

// --- Query 1: Get Doctor's main details ---
$details_sql = "SELECT full_name, specialization, qualifications, address, status, verified_at, profile_pic_url FROM doctors WHERE id = ? AND status = 'Verified'";
$stmt = $conn->prepare($details_sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $response['details'] = $result->fetch_assoc();
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Verified doctor not found.']);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();


// --- Query 2: Get Doctor's weekly availability ---
$avail_sql = "SELECT day_of_week, start_time, end_time FROM doctor_availability WHERE doctor_id = ? ORDER BY day_of_week";
$stmt = $conn->prepare($avail_sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

$availability = [];
while ($row = $result->fetch_assoc()) {
    $availability[] = $row;
}
$response['availability'] = $availability;


// --- Send the combined response ---
echo json_encode($response);

$stmt->close();
$conn->close();
?>
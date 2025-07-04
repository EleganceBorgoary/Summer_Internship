<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

// VERY IMPORTANT: This is a highly insecure way to "protect" an admin page.
// It is for demonstration purposes ONLY. A real app needs a proper admin login system.
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->adminPassword) || $data->adminPassword !== 'AdminSecret123') {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$sql = "SELECT id, full_name, email, phone, status, created_at FROM doctors ORDER BY FIELD(status, 'Pending', 'Verified', 'Rejected'), created_at DESC";
$result = $conn->query($sql);
$doctors = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $doctors[] = $row;
    }
}

echo json_encode($doctors);
$conn->close();
?>
<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

// In a real app, doctor ID should come from a secure session token
$doctor_id = 0;

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (!isset($_GET['doctor_id'])) {
        http_response_code(400); echo json_encode(['message' => 'Doctor ID required.']); exit();
    }
    $doctor_id = intval($_GET['doctor_id']);

    $sql = "SELECT day_of_week, start_time, end_time FROM doctor_availability WHERE doctor_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $doctor_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $availability = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($availability);

} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->doctorId) || !isset($data->availability)) {
        http_response_code(400); echo json_encode(['message' => 'Incomplete data.']); exit();
    }
    $doctor_id = intval($data->doctorId);

    // Start a transaction
    $conn->begin_transaction();
    try {
        // Delete old availability
        $deleteSql = "DELETE FROM doctor_availability WHERE doctor_id = ?";
        $stmt = $conn->prepare($deleteSql);
        $stmt->bind_param("i", $doctor_id);
        $stmt->execute();
        
        // Insert new availability
        $insertSql = "INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insertSql);
        
        foreach ($data->availability as $slot) {
            $stmt->bind_param("iiss", $doctor_id, $slot->day_of_week, $slot->start_time, $slot->end_time);
            $stmt->execute();
        }

        // Commit the transaction
        $conn->commit();
        http_response_code(200);
        echo json_encode(['message' => 'Availability updated successfully.']);
    } catch (mysqli_sql_exception $exception) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['message' => 'Failed to update availability.']);
    }
}

$conn->close();
?>
<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");

// Start with the base query
$sql = "SELECT id, full_name, specialization, address, profile_pic_url FROM doctors WHERE status = 'Verified'";

// Prepare arrays for WHERE clauses and parameters
$conditions = [];
$params = [];
$types = '';

// Add search condition if provided
if (!empty($_GET['search'])) {
    $conditions[] = "full_name LIKE ?";
    $params[] = "%" . $_GET['search'] . "%";
    $types .= 's';
}

// Add specialization condition if provided
if (!empty($_GET['specialization'])) {
    $conditions[] = "specialization = ?";
    $params[] = $_GET['specialization'];
    $types .= 's';
}

// Append conditions to the base query
if (count($conditions) > 0) {
    $sql .= " AND " . implode(' AND ', $conditions);
}

$stmt = $conn->prepare($sql);

// Bind parameters if any exist
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$doctors = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $doctors[] = $row;
    }
}

echo json_encode($doctors);
$stmt->close();
$conn->close();
?>
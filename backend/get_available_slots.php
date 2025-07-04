<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Content-Type: application/json; charset=UTF-8");

if (!isset($_GET['doctor_id']) || !isset($_GET['date'])) {
    http_response_code(400); echo json_encode(['message' => 'Doctor ID and date required.']); exit();
}

$doctor_id = intval($_GET['doctor_id']);
$date = $_GET['date']; // YYYY-MM-DD
$day_of_week = date('w', strtotime($date));

// 1. Get doctor's general availability for that day
$avail_sql = "SELECT start_time, end_time FROM doctor_availability WHERE doctor_id = ? AND day_of_week = ?";
$stmt = $conn->prepare($avail_sql);
$stmt->bind_param("ii", $doctor_id, $day_of_week);
$stmt->execute();
$avail_result = $stmt->get_result();

if ($avail_result->num_rows == 0) {
    echo json_encode([]); // Doctor does not work on this day
    exit();
}
$availability = $avail_result->fetch_assoc();

// 2. Get appointments already booked for that day
$appt_sql = "SELECT appointment_time FROM appointments WHERE doctor_id = ? AND DATE(appointment_time) = ?";
$stmt = $conn->prepare($appt_sql);
$stmt->bind_param("is", $doctor_id, $date);
$stmt->execute();
$appt_result = $stmt->get_result();
$booked_slots = [];
while ($row = $appt_result->fetch_assoc()) {
    $booked_slots[] = date('H:i:s', strtotime($row['appointment_time']));
}

// 3. Generate all possible slots and filter out booked ones
$start = new DateTime($availability['start_time']);
$end = new DateTime($availability['end_time']);
$interval = new DateInterval('PT1H'); // 1-hour slots
$all_slots = new DatePeriod($start, $interval, $end);

$available_slots = [];
foreach ($all_slots as $slot) {
    $slot_time = $slot->format('H:i:s');
    if (!in_array($slot_time, $booked_slots)) {
        $available_slots[] = $slot->format('h:i A'); // e.g., 09:00 AM
    }
}

echo json_encode($available_slots);
$stmt->close();
$conn->close();
?>

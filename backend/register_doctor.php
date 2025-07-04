<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

// File upload directory
$target_dir = "uploads/";

// Helper function to handle file upload
function uploadFile($file_key, $target_dir) {
    if (!isset($_FILES[$file_key]) || $_FILES[$file_key]['error'] != 0) {
        return ['success' => false, 'message' => "File upload error for $file_key."];
    }
    $target_file = $target_dir . uniqid() . '_' . basename($_FILES[$file_key]["name"]);
    if (move_uploaded_file($_FILES[$file_key]["tmp_name"], $target_file)) {
        return ['success' => true, 'url' => $target_file];
    } else {
        return ['success' => false, 'message' => "Failed to move uploaded file for $file_key."];
    }
}

// Handle file uploads first
$licenseUpload = uploadFile('licenseFile', $target_dir);
$degreeUpload = uploadFile('degreeFile', $target_dir);

if (!$licenseUpload['success'] || !$degreeUpload['success']) {
    http_response_code(400);
    echo json_encode(['message' => $licenseUpload['message'] ?? $degreeUpload['message']]);
    exit();
}

// Get form data from $_POST (not JSON, because of multipart/form-data)
$full_name = $conn->real_escape_string($_POST['fullName']);
$email = $conn->real_escape_string($_POST['email']);
$password = password_hash($conn->real_escape_string($_POST['password']), PASSWORD_BCRYPT);
$phone = $conn->real_escape_string($_POST['phone']);
$reg_number = $conn->real_escape_string($_POST['registrationNumber']);
$qualifications = $conn->real_escape_string($_POST['qualifications']);
$specialization = $conn->real_escape_string($_POST['specialization']);
$address = $conn->real_escape_string($_POST['address']);
$license_url = $licenseUpload['url'];
$degree_url = $degreeUpload['url'];

// 2. Update the SQL query and bind_param
$sql = "INSERT INTO doctors (full_name, email, password, phone, registration_number, qualifications, specialization, address, license_file_url, degree_file_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
// 3. Update the types string to "ssssssssss" and add the password variable
$stmt->bind_param("ssssssssss", $full_name, $email, $password, $phone, $reg_number, $qualifications, $specialization, $address, $license_url, $degree_url);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['message' => 'Doctor registration successful. Your application is pending verification.']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error registering doctor: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
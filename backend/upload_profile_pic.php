<?php
include 'db.php';
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

// --- Basic Auth Check (Insecure, for demonstration) ---
// A real app would use a session token to identify the user
if (!isset($_POST['userId']) || !isset($_POST['userType'])) {
    http_response_code(400); echo json_encode(['message' => 'User ID and type are required.']); exit();
}
if (!isset($_FILES['profilePic'])) {
    http_response_code(400); echo json_encode(['message' => 'No file uploaded.']); exit();
}

$userId = intval($_POST['userId']);
$userType = $_POST['userType']; // 'doctor' or 'patient'
$table = $userType === 'doctor' ? 'doctors' : 'patients';

// --- File Upload Logic ---
$target_dir = "uploads/";
// Create a unique filename to prevent overwriting
$imageFileType = strtolower(pathinfo($_FILES["profilePic"]["name"], PATHINFO_EXTENSION));
$unique_filename = uniqid($userType . '_' . $userId . '_') . '.' . $imageFileType;
$target_file = $target_dir . $unique_filename;

// Check if file is an actual image
$check = getimagesize($_FILES["profilePic"]["tmp_name"]);
if($check === false) {
    http_response_code(400); echo json_encode(['message' => 'File is not an image.']); exit();
}

// Check file size (e.g., 2MB limit)
if ($_FILES["profilePic"]["size"] > 2000000) {
    http_response_code(400); echo json_encode(['message' => 'Sorry, your file is too large.']); exit();
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
    http_response_code(400); echo json_encode(['message' => 'Sorry, only JPG, JPEG, & PNG files are allowed.']); exit();
}

// --- Save File and Update Database ---
if (move_uploaded_file($_FILES["profilePic"]["tmp_name"], $target_file)) {
    // File uploaded successfully, now update the database
    $sql = "UPDATE $table SET profile_pic_url = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $target_file, $userId);

    if ($stmt->execute()) {
        http_response_code(200);
        // Return the new URL so the frontend can display the image immediately
        echo json_encode(['message' => 'Profile picture updated successfully.', 'newImageUrl' => $target_file]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to update database.']);
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Sorry, there was an error uploading your file.']);
}

$conn->close();
?>
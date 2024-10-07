<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Image Click Coordinates</title>
</head>
<body>
	<?php
	// Define the default ID
	$default_id = 'defaultId';

	// Get the version and id from the query parameters, use default if id is not set
	$version = $_GET['version'];
	$id = isset($_GET['id']) ? $_GET['id'] : $default_id;

	// Get click coordinates if available
	$click_x = isset($_GET['click_x']) ? $_GET['click_x'] : null;
	$click_y = isset($_GET['click_y']) ? $_GET['click_y'] : null;

	// Load the JSON file
	$json = file_get_contents('data.json');
	if ($json === false) {
		die("Error: Unable to load JSON file.");
	}

	// Decode the JSON data
	$data = json_decode($json, true);
	if ($data === null) {
		die("Error: JSON data could not be decoded.");
	}

	// Check if the ID exists in the JSON data
	if (isset($data[$id])) {
		// If click coordinates are provided, check the click zone
		if ($click_x !== null && $click_y !== null) {
			$clickZone = $data[$id]['clickZone'];
			$topLeft = $clickZone['topLeft'];
			$bottomRight = $clickZone['bottomRight'];

			if ($click_x >= $topLeft['x'] && $click_y >= $topLeft['y'] && $click_x <= $bottomRight['x'] && $click_y <= $bottomRight['y']) {
				// Redirect to the new ID if the click is within the zone
				$new_id = $clickZone['linkId'];
				echo "<p>You found it <a href='index.php?version=$version&id=$new_id'>Click here to move on.</a></p>\n";
			}
		}

		// Display the image
		$image = is_array($data[$id]) ? $data[$id]['image'] : $data[$id];
		echo "<img src='$image' alt='Image for ID $id' id='mainImage' onclick='handleClick(event)'>";
	} else {
		echo "Image not found for ID $id.";
	}
	?>

	<script>
	function handleClick(event) {
		var rect = event.target.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		window.location.href = 'index.php?version=<?php echo $version; ?>&id=<?php echo $id; ?>&click_x=' + x + '&click_y=' + y;
	}
	</script>
</body>
</html>
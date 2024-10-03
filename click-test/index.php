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
		$image = $data[$id];
		echo "<img src='$image' alt='Game image - ID $id' id='clickable-image' style='cursor: crosshair;' onclick='getClickCoordinates(event)'>\n";
	} else {
		echo "Image not found for ID $id.";
	}
	?>
    <form id="coordinates-form" action="index.php" method="post">
        <input type="hidden" name="x" id="x-coordinate">
        <input type="hidden" name="y" id="y-coordinate">
    </form>

    <script>
        function getClickCoordinates(event) {
            var x = event.offsetX;
            var y = event.offsetY;
            document.getElementById('x-coordinate').value = x;
            document.getElementById('y-coordinate').value = y;
            document.getElementById('coordinates-form').submit();
        }
    </script>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $x = $_POST['x'];
        $y = $_POST['y'];
        echo "You clicked at X: $x, Y: $y";
        // You can now use $x and $y for further processing
    }
    ?>
</body>
</html>
<?php

	$conn = new mysqli("localhost","root","","354database");
	if ($conn->connect_error) 
	{
			die("Connection failed: " . $conn->connect_error);
	}
	
	$UName = $_POST['UsrNm'];
	$Passw = $_POST['Passw'];
	$UName = mysqli_real_escape_string($conn,$UName);
	$Passw = mysqli_real_escape_string($conn,$Passw);
	if($UName == "")
		echo "Please fill out the username field";
	else if($Passw == "")
		echo "Please fill out the password field";
	else
	{
		$log = mysqli_query($conn,"SELECT * FROM usertb WHERE username='$UName' and password='$Passw' AND username != '' AND username IS NOT NULL LIMIT 1") or die(mysqli_error($conn));

		$count=mysqli_num_rows($log);
		if($count == 1)
		{
			echo "You have succesfully logged on to the system";
			mysqli_close($conn);
			exit;
		}
		else
		{
			echo "Login failed, wrong username or password.";
		}
		mysqli_close($conn);
	}
?>
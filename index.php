<!DOCTYPE html>

<html lang="en">
<head>
	
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="Bootstrap/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="Bootstrap/bootstrap-theme.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
<link href="http://getbootstrap.com/examples/starter-template/starter-template.css" rel="stylesheet">
<link rel="stylesheet" href="CSS/style.css">

<title>STORM</title>

</head>

  <body>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><!-- Mobile View -->
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="">Project STORM</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="">Home</a></li>
            <li><a href="">View Projects</a></li>
            <li><a href="">Add Projects</a></li>									
          </ul>
        </div>
      </div>
    </nav>

    <div class="container"><!-- Page Container -->
      <div class="starter-template">			
				<form class="form-signin" method="post" onSubmit="">
					<div class="form-group">
						<input type="text" class="form-control" placeholder="Username" id="usr" name="usr" required autofocus>
					</div>
					<div class="form-group">
						<input type="password" class="form-control" placeholder="Password" id="pwd" name="pwd" required>
						<span class="glyphicon glyphicon-log-in"> <span/><input type="submit" value="Login" id="login">
					</div>
				<form/>
				
				<div id="message">
					<p id="msg"><p/>
				<div/>
      </div>
			
			<div id="message">
				<p id="msgErr" class="text-danger"><p/>
				<p id="msgSuccess" class="text-success"><p/>
			<div/>
    </div><!-- /.container -->
		
<script src="Bootstrap/jquery.min.js"></script>
<script src="Bootstrap/bootstrap.min.js"></script>
<script type='text/javascript' src="Bootstrap/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="Bootstrap/script.js"></script>

</body>
</html>

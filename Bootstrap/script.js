$("#login").click(function() 
{
		$.ajax
		({
			url: 'login.php',
			type: "POST",
			data: {"UsrNm" : $("#usr").val(),"Passw" : $("#pwd").val()},
			success : function(data) 
			{	
				if(data[0] == 'P' || data[0] == 'L')
				{
					$("#msgSuccess").text("");
					$("#msgErr").text(data);
				}
				else
				{
					$("#usr").val("");
					$("#pwd").val("");
					$("#msgErr").text("");
					$("#msgSuccess").text(data);
				}
				
			},
			error : function(jqXHR, textStatus, errorThrown)
			{
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
		return false;
});


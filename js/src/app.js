$(document).ready(function(){//Cuando la página se ha cargado por completo

	$(".artist").focus();//ponemos el foco en el primer input

	$("form").on("submit", function(){ //cuando se intente enviar
		var artist = $.trim($("#artist").val());
		var title =  $.trim($("#song").val());

		if(artist == ""){ //validación del artista
			alert("El título no puede ser vacío");
			return false;
		}

		if(title == ""){ //validación del título
			alert("El título no puede ser vacío");
			return false;
		}

		var url_audio = $.trim($("#audio").val());
		var url_image = $.trim($("#imagen").val());

		var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig;

		if( url_audio !="" && pattern.test(url_audio) == false){ //validación de la url de la canción
			alert("La url no es válida");
			return false;
		}

		if( url_image !="" && pattern.test(url_image) == false){ //validación de la url de la imagen
			alert("La url no es válida");
			return false;
		}


		$("#save").on("click", function(){
			$.ajax({ //preparación de la petición de añadir canción
			method: 'post',
			url: "/api/playlist",
			data: JSON.stringify({
				title: title,
				url: url
			}),
			contentType: 'application/json',
			success: function(){
				reloadSeries();
				alert("Guardado con éxito");
			},
			error: function(){
				alert("Se ha producido un error");
			}
		});
		})







		$.ajax({ //preparación de la petición que llegará de manera asíncrona
			method: 'post',
			url: "/api/series",
			data: JSON.stringify({
				title: title,
				url: url
			}),
			contentType: 'application/json',
			success: function(){
				reloadSeries();
				alert("Guardado con éxito");
			},
			error: function(){
				alert("Se ha producido un error");
			}
		});

		return false; //jquery cancela el envío del formulario

	});


		function reloadSeries(){
			console.log("Cargando series");
			$.ajax({
				url:"/api/series/",
				success: function(data){
					console.log("Series", data);
					var html = "";
					for(var i in data){
						var id = data[i].id;
						var title = data[i].title;
						var url = data[i].url || "";
						html += "<li>";
						html += title;
						if (url.length > 0)
							html += " (" + url + ")";
						html += "<button data-serieid=" + id + ">Eliminar</button>";
						html += "</li>";
					}
					$("#seriesList").html(html); // innerHTML = html
				}
			});



		}

		$("#reloadSeriesButton").on("click", reloadSeries);

		reloadSeries();

		$("#seriesList").on("click", "button", function(){
			console.log("Elimino la serie");
			var self = this;
			var id = $(self).data("serieid"); // cojo el valor del atributo data-serieid del botón

			$.ajax({
				url: "/api/series/" + id,
				method: "delete",
				success: function(){
					$(self).parent().remove();
				}
			});

		});
});
$(document).ready(function(){//Cuando la página se ha cargado por completo

	$("#artist").focus();//ponemos el foco en el primer input

	$("form").on("submit", function(){ //cuando se intente enviar
		var artist = $.trim($("#artist").val());
		var title =  $.trim($("#song").val());

		if(artist == ""){ //validación del artista
			alert("El artista no puede ser vacío");
			return false;
		}

		if(title == ""){ //validación del título
			alert("El título no puede ser vacío");
			return false;
		}

		var url_audio = $.trim($("#audio").val());
		var url_image = $.trim($("#imagen").val());

		var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig;

		if( url_audio =="" || pattern.test(url_audio) == false){ //validación de la url de la canción
			alert("La url del audio no es válida");
			return false;
		}

		if( url_image !="" && pattern.test(url_image) == false){ //validación de la url de la imagen
			alert("La url de la imagen no es válida");
			return false;
		}


		console.log("Petición de guardado iniciada");
		$.ajax({		 //preparación de la petición de añadir canción
		method: 'post',
		url: "/api/playlist",
		data: JSON.stringify({
			artist: artist,
			title: title,
			url_audio: url_audio,
			url_image: url_image
		}),
		contentType: 'application/json',
		success: function(){
			alert("Guardado con éxito");
		},
		error: function(){
			alert("Se ha producido un error");
		}
		});


	});

	$.ajax({              //realizo una peticón ajax para mostrar en .audio.media.list los datos almacenados
				url:"/api/playlist/",
				success: function(data){
					console.log("Lista de canciones", data);
					var html = "";
					for(var i in data){
						var title = data[i].title;
						var artist = data[i].artist;
						var image = data[i].url_image;
						var audio = data[i].url_audio;
						html += "<article>";
						html += "<li>";
						html += title;
						html += artist;
						html += "<img src=" '\"'+ url_image + " '\"' title= " + title + "></img>";
						html += "<audio controls><source src=" '\"'+ url_audio + " '\"' type=audio/mpeg ></audio>";
						html += "<button id='\"'edit song button'\"'>Editar</button>"
						html += "<button id='\"'delete song button'\"'>Eliminar</button>"
						html += "</li>";
						html += "</article>";
					}
					$(".audio.media.list").html(html); // innerHTML = html
				}
			});



	$(".audio.media.list").on("click", "button", function(){ //elimino la canción mediante el botón delete, cuando exista un botón dentro de .audio.media.list
			var self = this;
			var id = $(self).data("id");

		$.ajax({
					url: "/api/playlist/" + id,
					method: "delete",
					success: function(){
						$(self).parent().remove();
					}
				});
};

});




   /*





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

*/
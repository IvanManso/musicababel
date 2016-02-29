$(document).ready(function(){//Cuando la página se ha cargado por completo

	$(".auto-focus").focus();//ponemos el foco en el primer input

	$("form").on("submit", function(){ //cuando se intente enviar
		var title = $.trim($("#title").val());
		if(title == ""){ //validación del título
			alert("El título no puede ser vacío");
			return false;
		}

		var url = $.trim($("#cover_url").val());
		var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig;

		if( url !="" && pattern.test(url) == false){
			alert("La url no es válida");
			return false;
		}

		//validación de categorías
		var selectedCategories = $('input[name="category"]:checked');
		if(selectedCategories.length == 0){
			alert("Selecciona al menos una categoría");
		}

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
$(document).ready(function() { //Cuando la página se ha cargado por completo

    console.log("Document ready");

    // Funcionalidad tipo SPA
    function showIndex() {
        console.log("Pintamos el listado de items guardados en la db");
        $(".loading").addClass("hidden");
        $("#addItemButton").removeClass("hidden");
        $("#cancelItemButton").addClass("hidden");
        $("form").addClass("hidden");
        $("main").removeClass("hidden");
        reloadItems();
    }

    function showForm() {
        console.log("Pintamos el formulario");
        $(".loading").addClass("hidden");
        $("#addItemButton").addClass("hidden");
        $("#cancelItemButton").removeClass("hidden");
        $("form").trigger("reset");
        $("form").removeClass("hidden");
        $("main").addClass("hidden");
        $("#song").focus(); //ponemos el foco en el primer input
    }

    $("#addItemButton").on("click", function() {
        console.log("Click en añadir, mostramos formulario");
        showForm();
    });

    $("#cancelItemButton").on("click", function() {
        console.log("Click en cancelar, mostramos lista");
        showIndex();
    });

    // Funcionalidad del formulario
    $("form").on("submit", function() { //cuando se intente enviar

        var artist = $.trim($("#artist").val());
        var title = $.trim($("#song").val());

        if (artist == "") { //validación del artista
            alert("El artista no puede ser vacío");
            return false;
        }

        if (title == "") { //validación del título
            alert("El título no puede ser vacío");
            return false;
        }

        var url_audio = $.trim($("#audio").val());
        var url_image = $.trim($("#image").val());

        // RegEx para validar urls
        var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig;

        if (url_audio == "" || pattern.test(url_audio) == false) { //validación de la url de la canción
            alert("La url del audio no es válida");
            return false;
        }

        if (url_image == "" && pattern.test(url_image) == false) { //validación de la url de la imagen
            alert("La url de la imagen no es válida");
            return false;
        }
        console.log("Antes de entrar en la condición", $("#idElem").val());
        if ($("#idElem").val()) {
            console.log("Petición de edición iniciada");
            $.ajax({ //preparación de la petición de añadir canción
                method: 'put',
                url: "/api/playlist/" + ($("#idElem").val()),
                data: JSON.stringify({
                    artist: $("#artist").val(),
                    url_image: $("#image").val(),
                    url_audio: $("#audio").val(),
                    title: $("#song").val()
                }),
                contentType: 'application/json',
                success: function(data) {
                    showIndex();
                    alert("Guardado con éxito");
                },
                error: function() {
                    alert("Se ha producido un error");
                }
            });

        } else {
            // Guardar item
            console.log("Petición de guardado iniciada");
            $.ajax({ //preparación de la petición de añadir canción
                method: 'post',
                url: "/api/playlist",
                data: JSON.stringify({
                    artist: artist,
                    url_image: url_image,
                    url_audio: url_audio,
                    title: title
                }),
                contentType: 'application/json',
                success: function() {
                    showIndex();
                    alert("Guardado con éxito");
                },
                error: function() {
                    alert("Se ha producido un error");
                }
            });

        }
        return false;
    });

    // Pintar lista de items guardados en la db
    function reloadItems() {

        $.ajax({ //realizo una peticón ajax para mostrar en .audio.media.list los datos almacenados
            url: "/api/playlist/",
            success: function(data) {
                console.log("Cargando lista de items", data);
                var html = "";
                for (var i in data) {
                    var id = data[i].id;
                    var title = data[i].title;
                    var artist = data[i].artist;
                    var image = data[i].url_image;
                    var audio = data[i].url_audio;
                    console.log("Item", i, title);
                    html += "<tr>";
                    html += "<td>";
                    html += "<img src=\"" + image + "\"></img>";
                    html += "</td>";
                    html += "<td>";
                    html += "<div class=\"item meta\">";
                    html += "<h3>" + title + "</h3>";
                    html += "<h4>" + artist + "</h4>";
                    html += "</div>";
                    html += "</td>";
                    html += "<td>";
                    html += "<div class=\"item buttons\">";
                    html += "<button class=\"edit song button\" id=\"editItemButton\" data-songid=" + id + ">Editar</button>";
                    html += "<button class=\"delete song button\" id=\"deleteItemButton\" data-songid=" + id + ">Eliminar</button></div>";
                    html += "</div>";
                    html += "</td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<audio controls><source src= \" " + audio + " \" type=audio/mpeg ></audio>";
                    html += "</tr>";
                }
                $(".audio.media.list").html(html); // innerHTML = html
            }
        });

    }

    // Eliminar item
    $(".audio.media.list").on("click", "#deleteItemButton", function() { //elimino la canción mediante el botón delete, cuando exista un botón dentro de .audio.media.list
        console.log("Elimino la canción");
        var self = this;
        var id = $(self).data("songid");

        $.ajax({
            url: "/api/playlist/" + id,
            method: "delete",
            success: function() {
                $(self).parent().parent().remove();
            },
            error: function() {
                alert("Se ha producido un error al eliminar");
            }
        });
    });

    $(".audio.media.list").on("click", "#editItemButton", function() { //elimino la canción mediante el botón delete, cuando exista un botón dentro de .audio.media.list
        console.log("Traigo los campos de la canción y pinto formulario");
        showForm();
        var self = this;
        var id = $(self).data("songid");

        $.ajax({
            method: "GET",
            url: "/api/playlist/" + id,
            success: function(data) {
                console.log("Los datos son: ", data);
                $("#artist").val(data.artist);
                $("#song").val(data.title);
                $("#audio").val(data.url_audio);
                $("#image").val(data.url_image);
                $("#idElem").val(id);
                console.log("El id es", id);
            },
            error: function() {
                alert("Se ha producido un error al editar");
            }
        });
        //si el id está vacío está creando si el ID está creado está editando
    });

    showIndex();

});

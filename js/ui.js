$(function () {
    $("#accordion").accordion();

    $("#generate").button().on('click', function () {
        app.heightField.generate();
    });

    $("#waterLevel").slider({
        range: true,
        values: [ 50, 200 ],
        min: 0,
        max: 255,
        slide: function (event, ui) {
            app.uniforms.waterLevel.value = ui.values[0];
            app.uniforms.mountainLevel.value = ui.values[1];
        }
    });

    $("#veins").slider({
        value: 3,
        min: 1,
        max: 7,
        slide: function (event, ui) {
            app.heightField.veins = ui.value;
        }
    });

    $("#repeatX").slider({
        value: 1,
        min: 1,
        max: 5,
        slide: function (event, ui) {
            app.uniforms.uvScale.value.x = ui.value;
        }
    });

    $("#repeatY").slider({
        value: 1,
        min: 1,
        max: 5,
        slide: function (event, ui) {
            app.uniforms.uvScale.value.y = ui.value;
        }
    });

    $("#roughness").slider({
        value: 200,
        min: 150,
        max: 800,
        slide: function (event, ui) {
            app.heightField.roughness = ui.value;
        }
    });

    $("#vHeight").slider({
        value:0,
        min: 0,
        max: 300,
        slide: function (event, ui) {
            app.uniforms.vHeight.value = ui.value * 0.001;
        }
    });

    $("#blur").slider({
        value: 0,
        min: 0,
        max: 900,
        slide: function (event, ui) {
            app.uniforms.blur.value = ui.value;
        }
    });

    $("#shading").button().on('change', function () {
        app.uniforms.shading.value =(this.checked) ? 1:0;
    });

    $("#cycling").button().on('change', function () {
        app.uniforms.cycling.value = (this.checked) ? 1:0;
    });

    $("#HD").button().on('change', function () {
        app.uniforms.HD.value = (this.checked) ? 1:0;
    });

    $("#Mode3D").button().on('change', function () {
        app.Mode3D = this.checked;
    });

    $("#HFcycling").button().on('change', function () {
        app.uniforms.HFcycling.value = (this.checked) ? 1:0;
    });

    var pickerLow = $.farbtastic('#pickerLow', function (color) {
        $('#colorLow').css('color', color);
        var rgb = hexToRgb(color);
        app.uniforms.lowColor.value = new THREE.Vector3(rgb.r / 255, rgb.g /255, rgb.b / 255);
    });
    pickerLow.setColor("#5577FF");

    var pickerMedium = $.farbtastic('#pickerMedium',function (color) {
        $('#colorMedium').css('color', color);
        var rgb = hexToRgb(color);
        app.uniforms.mediumColor.value = new THREE.Vector3(rgb.r / 255, rgb.g /255, rgb.b / 255);
    });
    pickerMedium.setColor("#66CC22");

    var pickerHigh = $.farbtastic('#pickerHigh', function (color) {
        $('#colorHigh').css('color', color);
        var rgb = hexToRgb(color);
        app.uniforms.highColor.value = new THREE.Vector3(rgb.r / 255, rgb.g /255, rgb.b / 255);
    });
    pickerHigh.setColor("#DDDDDD");

    $("#viewSet").buttonset();

    $("#mapView").button().on('click', function () {
        app.setMode(0);
    });

    $("#planetView").button().on('click', function () {
        app.setMode(1);
    });

    $("#gridView").button().on('click', function () {
        app.setMode(2);
    });

    $("#lowModeSet").buttonset();
    $("#lowModeRamp").button().on('click', function () {
        app.uniforms.lowMode.value = 1.0;
    });
    $("#lowModeFlat").button().on('click', function () {
        app.uniforms.lowMode.value = 2.0;
    });

    $("#mediumModeSet").buttonset();
    $("#mediumModeRamp").button().on('click', function () {
        app.uniforms.mediumMode.value = 1.0;
    });
    $("#mediumModeFlat").button().on('click', function () {
        app.uniforms.mediumMode.value = 2.0;
    });

    $("#highModeSet").buttonset();
    $("#highModeRamp").button().on('click', function () {
        app.uniforms.highMode.value = 1.0;
    });
    $("#highModeFlat").button().on('click', function () {
        app.uniforms.highMode.value = 2.0;
    });
});

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

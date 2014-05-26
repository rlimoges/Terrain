<?php
/**
 * Created by Robert Limoges
**/
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Planet Builder</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <link href="css/styles.css" rel="stylesheet">
    <link rel="stylesheet" href="farbtastic/farbtastic.css" type="text/css"/>

    <link href="css/smoothness/jquery-ui-1.10.4.custom.min.css" rel="stylesheet">
    <script src="js/jquery-1.10.2.js"></script>
    <script src="js/jquery-ui-1.10.4.custom.js"></script>
    <script type="text/javascript" src="farbtastic/farbtastic.js"></script>

    <script src="js/three.min.js"></script>
    <script src="js/CrosseyedEffect.js"></script>
    <script src="js/OrbitControls.js"></script>
    <script src="js/Detector.js"></script>
    <script src="js/stats.min.js"></script>

    <script src="js/ui.js"></script>
</head>
<body>

<div id="container"></div>

<form>
    <div id="accordion">
        <h3>Viewer</h3>
        <div id="textures">
            <div>Mode</div>
            <div id="viewSet">
                <input type="radio" id="mapView" name="view" checked="checked"><label for="mapView">Map</label>
                <input type="radio" id="planetView" name="view"><label for="planetView">Planet</label>
                <input type="radio" id="gridView" name="view"><label for="gridView">Grid</label>
            </div>
            <hr>

            <input type="checkbox" id="HD" name="HD"><label for="HD">HD</label>
            <input type="checkbox" id="Mode3D" name="Mode3D"><label for="Mode3D">3D</label>
            <hr>

            <div id="stats"></div>

            <hr>
            <div class="slider">
                <label>Vertex height</label>
                <div id="vHeight"></div>
            </div>
        </div>

        <h3>Texture</h3>
        <div id="textures">
            <div class="slider">
                <label>Roughness</label>
                <div id="roughness"></div>
            </div>
            <div class="slider">
                <label>Veins</label>
                <div id="veins"></div>
            </div>

            <input type="button" id="generate" value="Generate texture"/>
        </div>

        <h3>Shading</h3>
        <div id="shadingPane">
            <input type="checkbox" id="shading" name="shading" checked="checked"><label for="shading">Color</label>
            <input type="checkbox" id="cycling" name="cycling"><label for="cycling">Day</label>
            <input type="checkbox" id="HFcycling" name="HFcycling"><label for="HFcycling">HF</label>

            <hr>

            <div class="slider">
                <label>Terrain levels</label>
                <div id="waterLevel"></div>
            </div>
            <div class="slider">
                <label>Blur</label>
                <div id="blur"></div>
            </div>
            <div class="slider">
                <label>Repeat X</label>
                <div id="repeatX"></div>
            </div>
            <div class="slider">
                <label>Repeat Y</label>
                <div id="repeatY"></div>
            </div>
        </div>

        <h3>Low range</h3>
        <div id="low">
            <div class="picker">
                <label id="colorLow">Color</label>
            </div>
            <div id="pickerLow"></div>

            <div id="lowModeSet">
                <input type="radio" id="lowModeRamp" name="lowMode" checked="checked"><label for="lowModeRamp">Ramp</label>
                <input type="radio" id="lowModeFlat" name="lowMode"><label for="lowModeFlat">Flat</label>
            </div>
        </div>

        <h3>Medium range</h3>
        <div id="medium">
            <div class="picker">
                <label id="colorMedium">Color</label>
            </div>
            <div id="pickerMedium"></div>

            <div id="mediumModeSet">
                <input type="radio" id="mediumModeRamp" name="mediumMode" checked="checked"><label for="mediumModeRamp">Ramp</label>
                <input type="radio" id="mediumModeFlat" name="mediumMode"><label for="mediumModeFlat">Flat</label>
            </div>
        </div>

        <h3>High range</h3>
        <div id="high range">
            <div class="picker">
                <label id="colorHigh">Color</label>
            </div>
            <div id="pickerHigh"></div>

            <div id="highModeSet">
                <input type="radio" id="highModeRamp" name="highMode" checked="checked"><label for="highModeRamp">Ramp</label>
                <input type="radio" id="highModeFlat" name="highMode"><label for="highModeFlat">Flat</label>
            </div>
        </div>

    </div>
</form>

<script id="vertexShader" type="x-shader/x-vertex">
    <?php include("shaders/vertex.js"); ?>
</script>
<script id="fragmentShader" type="x-shader/x-fragment">
    <?php include("shaders/fragment.js"); ?>
</script>
<script src="js/generator.js"></script>

</body>
</html>

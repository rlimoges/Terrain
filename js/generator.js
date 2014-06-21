if (!Detector.webgl) Detector.addGetWebGLMessage();

var app = new function () {
    var app = this;
    app.HTMLMain = document.getElementById('container');
    app.HTMLStats = document.getElementById('stats');
    app.Mode3D = false;
    app.uniforms = {
        viewMode: { type: "i", value: 0 },
        HD: {type: "i", value: 0 },
        heightField: { type: "t", value: new THREE.Texture() },
        HFcycling: { type: "i", value: 0 },
        HFrame: { type: "f", value: 0},
        resolution: { type: "v2", value: new THREE.Vector2() },
        uvScale: { type: "v2", value: new THREE.Vector2(1.0, 1.0) },
        vHeight: { type: "f", value: "0" },
        pass: {type: "f", value: 0.0 },
        shading: { type: "f", value: 1.0 },
        cycling: { type: "f", value: 0.0 },
        waterLevel: { type: "f", value: 75 },
        mountainLevel: { type: "f", value: 200 },
        blur: { type: "f", value: 0 },
        lowColor: { type: "v3", value: new THREE.Vector3(0.2, 1.0, 0.2) },
        lowMode: { type: "f", value: 2 },
        mediumColor: {type: "v3", value: new THREE.Vector3(0.2, 1.0, 0.2) },
        mediumMode: { type: "f", value: 1 },
        highColor: {type: "v3", value: new THREE.Vector3(0.2, 1.0, 0.2) },
        highMode: { type: "f", value: 1 },
        time: { type: "f", value: 1.0 }
    };

    app.heightField = new function () {
        app.heightField = this;
        app.heightField.size = 1;
        app.heightField.roughness = 200;
        app.heightField.veins = 3;
        app.heightField.array = new Array();

        app.heightField.createTexture = function () {
            app.heightField.buffer = new Uint8Array(app.heightField.size * app.heightField.size * 4);
            app.heightField.buffer.set(app.heightField.bufferize());
            app.heightField.texture = new THREE.DataTexture(app.heightField.buffer, app.heightField.size, app.heightField.size, THREE.RGB, THREE.UnsignedByteType, THREE.UVMapping(), THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 1);
            app.heightField.texture.needsUpdate = true;
        };

        app.heightField.updateTexture = function () {
            if (app.heightField.createTexture) {
                app.heightField.createTexture();
            }

            app.uniforms.heightField.value = app.heightField.texture;
        };

        app.heightField.updateField = function () {
            var old = app.heightField.array;
            var os = app.heightField.size;
            app.heightField.size = app.heightField.size * 2;
            if (app.uniforms.pass.value <= app.heightField.veins) {
                app.heightField.array = new Array();
                for (j = 0; j < app.heightField.size; j++) {
                    for (i = 0; i < app.heightField.size; i++) {
                        var h = Math.ceil(Math.random() * 255);
                        app.heightField.array.push(h);
                    }
                }
            } else {
                newHeightField = new Array();
                var ox, oy = 0;

                for (i = 0; i < app.heightField.array.length; i++) {
                    oy = Math.floor(i / os);
                    ox = i - (oy * os);

                    var x = ox * 2;
                    var y = oy * 2;
                    var x2 = x + 1;
                    var y2 = y + 1;

                    var s1 = app.heightField.array[ox + (oy * os)];
                    if (ox < os - 1) {
                        var s2 = app.heightField.array[ox + 1 + (oy * os)];
                    } else {
                        var s2 = app.heightField.array[(oy * os)];
                    }

                    if (oy < os - 1) {
                        var s3 = app.heightField.array[ox + ((oy + 1) * os)];
                    } else {
                        var s3 = app.heightField.array[ox];
                    }

                    if (ox < os - 1) {
                        var s4 = app.heightField.array[ox + 1 + ((oy + 1) * os)];
                    } else {
                        var s4 = app.heightField.array[(oy + 1) * os];
                    }

                    if (oy >= os - 1) {
                        var s4 = app.heightField.array[ox + 1];
                    }


                    var tl = s1 + app.heightField.addRoughness();
                    var tr = (s1 + s2) / 2 + app.heightField.addRoughness();
                    var bl = (s1 + s3) / 2 + app.heightField.addRoughness();

                    var br = (s1 + s2 + s3 + s4) / 4 + app.heightField.addRoughness();

                    newHeightField[x + (y * app.heightField.size)] = app.heightField.setHeight(tl); // Top-left
                    newHeightField[x2 + (y * app.heightField.size)] = app.heightField.setHeight(tr); // Top-right
                    newHeightField[x + (y2 * app.heightField.size)] = app.heightField.setHeight(bl); // Bottom-left
                    newHeightField[x2 + (y2 * app.heightField.size)] = app.heightField.setHeight(br); // Bottom-right
                }

                app.heightField.array = newHeightField;
            }

            app.heightField.addRoughness = function () {
                var s = (app.heightField.roughness / app.uniforms.pass.value);
                return Math.ceil(Math.random() * s - (s / 2));
            };

            app.heightField.setHeight = function (h) {
                if (h < 0) {
                    h = 0;
                }
                if (h > 255) {
                    h = 255;
                }

                return Math.ceil(h);
            };

            app.heightField.bufferize = function () {
                var bufferizedHF = new Array();
                for (i = 0; i < app.heightField.array.length; i++) {
                    bufferizedHF.push(app.heightField.array[i]);
                    bufferizedHF.push(app.heightField.array[i]);
                    bufferizedHF.push(app.heightField.array[i]);
                    bufferizedHF.push(255);
                }
                return bufferizedHF;
            };
        };

        app.heightField.generate = function () {
            $("#loaderGIF").css('display', 'block');
            app.heightField.array = new Array();
            app.heightField.size = 1;
            app.uniforms.pass.value = 0;
        };
    };

    app.init = function () {
        loadUI();
        app.initUI();
        app.renderer = new THREE.WebGLRenderer();

        app.scene = new THREE.Scene();

        app.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: app.uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });

        app.HTMLMain.appendChild(app.renderer.domElement);

        app.stats = new Stats();
        app.HTMLStats.appendChild(app.stats.domElement);

        app.setMode(0);

        app.effect = new THREE.CrosseyedEffect(app.renderer);
        app.effect.setSize(window.innerWidth, window.innerHeight);
        app.effect.separation = 0.1;

        app.animate();
        app.addEventListeners();

        console.log("Initialized:", app);
    };

    app.animate = function () {
        requestAnimationFrame(app.animate);
        app.stats.update();
        app.uniforms.time.value += 0.05;
        app.uniforms.pass.value += 1.0;
        app.uniforms.HFrame.value += 0.25;
        if (app.uniforms.HFrame.value > 255) {
            app.uniforms.HFrame.value = 0;
        }

        if (app.uniforms.pass.value < 11 + app.uniforms.HD.value) {
            app.heightField.updateField();
            app.heightField.updateTexture();
        } else if (app.uniforms.pass.value == 11 + app.uniforms.HD.value) {
            $("#loaderGIF").css("display", "none");

        }

//        if (app.uniforms.viewMode.value == 1) {
//            app.mesh.rotation.y += 0.005;
//        }
//
//        if (app.uniforms.viewMode.value == 2) {
//            app.mesh.rotation.z += 0.005;
//        }

        if (app.Mode3D && app.uniforms.viewMode.value > 0) {
            app.effect.render(app.scene, app.camera);
            app.effect.setSize(window.innerWidth, window.innerHeight);
        } else {
            app.renderer.render(app.scene, app.camera);
            app.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    };

    app.setMode = function (mode) {
        if (app.uniforms.viewMode != mode) {
            app.scene.remove(app.scene.children[0]);

            switch (mode) {
                case 0:
                {
                    app.controls = null;
                    app.camera = new THREE.Camera();
                    app.camera.position.z = 1;
                    app.camera.target = new THREE.Vector3(0, 0, 0);
                    app.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), app.shaderMaterial);
                    break;
                }

                case 1:
                {
                    app.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, .1, 10);
                    app.camera.position.z = 2;
                    app.camera.target = new THREE.Vector3(0, 0, 0);
                    var resolution = (app.uniforms.HD.value + 1.0) * 100;

                    app.controls = new THREE.OrbitControls(app.camera);

                    app.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, resolution, resolution), app.shaderMaterial);
                    break;
                }

                case 2:
                {

                    app.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, .1, 10);
                    app.camera.position.z = 1.95;
                    app.camera.position.x = 0;
                    app.camera.target = new THREE.Vector3(0, 0, 0);
                    var resolution = (app.uniforms.HD.value + 1.0) * 200;

                    app.controls = new THREE.OrbitControls(app.camera);

                    app.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.75, resolution, resolution), app.shaderMaterial);
                    app.mesh.rotation.x = -1;
                    break;
                }
            }

            app.scene.add(app.mesh);
            app.uniforms.viewMode.value = mode;
        }
    };

    app.windowResize = function () {
        app.uniforms.resolution.value.x = window.innerWidth;
        app.uniforms.resolution.value.y = window.innerHeight;

        app.setMode(app.uniforms.viewMode.value);

        app.renderer.setSize(window.innerWidth, window.innerHeight);

        app.effect.setSize(window.innerWidth, window.innerHeight);
    };

    app.addEventListeners = function () {
        app.windowResize();
        window.addEventListener('resize', app.windowResize, false);
    };
};

app.init();
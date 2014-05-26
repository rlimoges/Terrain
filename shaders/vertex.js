varying vec2 vUv;
uniform sampler2D heightField;
uniform int HFcycling;
uniform float HFrame;
uniform int viewMode;
uniform float time;
uniform float vHeight;
uniform vec3 lowColor;
uniform float lowMode;
uniform vec3 mediumColor;
uniform float mediumMode;
uniform vec3 highColor;
uniform float highMode;
uniform float shading;
uniform float mountainLevel;
uniform float waterLevel;

float displacement;
void main() {
    vUv = uv;
    vec4 h = texture2D(heightField, vec2(vUv.x, vUv.y));
    float c = h[0];

    if(HFcycling > 0){
        c = c + (HFrame / 255.0);
        if( c > 1.0) {
            c = c - 1.0;
        }
    }

    if(viewMode > -1) {
        if(shading > 0.0){
            if (c > (30.0  + waterLevel) / 255.0) {
                if (mediumMode == 1.0) {
                    displacement = c * vHeight;
                } else {
                    displacement = (waterLevel / 255.0) * vHeight;
                }

            } else {
                if (lowMode == 1.0) {
                    displacement = c * vHeight;
                } else {
                    displacement = 0.0;
                }
            }

            if (c > mountainLevel / 255.0) {
                if (highMode == 1.0) {
                    displacement = c * vHeight;
                } else {
                    displacement = vHeight;
                }
            }
        } else {
            displacement = c * vHeight;
        }

        if(viewMode == 1) {
            displacement = displacement / 4.0;
        }

        // Fun stuff
//        displacement = sin(time * displacement) / 12.0;

        vec3 newPosition = position  + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    }
}

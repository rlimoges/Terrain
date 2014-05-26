varying vec2 vUv;
uniform vec2 uvScale;
uniform float time;
uniform float pass;
uniform vec2 resolution;
uniform float cycling;
uniform float shading;
uniform float mountainLevel;
uniform float waterLevel;
uniform sampler2D heightField;
uniform int HFcycling;
uniform float HFrame;
uniform vec3 lowColor;
uniform float lowMode;
uniform vec3 mediumColor;
uniform float mediumMode;
uniform vec3 highColor;
uniform float highMode;
uniform float blur;

void main(void){
    vec4 h = texture2D(heightField, vec2(vUv.x*uvScale[0], vUv.y*uvScale[1]));
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    float t = time / 5.0;

    float res = 1.0 / (pow(2.0, pass));
    float r, g, b;
    float c = h[0];

    if(HFcycling > 0){
        c = c + sin(((HFrame / 255.0)  * 3.1415)) ;
        if( c > 1.0) {
            c = c - 1.0;
        }
        if(c < 0.0) {
            c = c + 1.0 ;
        }
    }

    if(shading > 0.0 || cycling > 0.0 || blur > 0.0){
        if(c <= 0.01) {
            c = 0.01;
        }
        if(c >= 1.0) {
            c = 0.99;
        }

        if(blur > 0.0) {
            vec4 sum = vec4(0.0);
            float fade = blur / 500.0;
            float blurSize = fade /  (2000.0 - blur) ;

            sum += texture2D(heightField, vec2(vUv.x - 4.0*blurSize, vUv.y)) * 0.05;
            sum += texture2D(heightField, vec2(vUv.x - 3.0*blurSize, vUv.y)) * 0.09;
            sum += texture2D(heightField, vec2(vUv.x - 2.0*blurSize, vUv.y)) * 0.12;
            sum += texture2D(heightField, vec2(vUv.x - blurSize, vUv.y)) * 0.15;
            sum += texture2D(heightField, vec2(vUv.x, vUv.y)) * 0.16;
            sum += texture2D(heightField, vec2(vUv.x + blurSize, vUv.y)) * 0.15;
            sum += texture2D(heightField, vec2(vUv.x + 2.0*blurSize, vUv.y)) * 0.12;
            sum += texture2D(heightField, vec2(vUv.x + 3.0*blurSize, vUv.y)) * 0.09;
            sum += texture2D(heightField, vec2(vUv.x + 4.0*blurSize, vUv.y)) * 0.05;

            if(HFcycling > 0){
                sum[0] = sum[0] + (HFrame / 255.0);
                if( sum[0] > 1.0) {
                    sum[0] = sum[0] - 1.0;
                }
            }

            c = sum[0];
        }

        if(shading > 0.0){
            if (c > waterLevel / 255.0) {
                if (mediumMode == 1.0) {
                    r = mediumColor[0] * c;
                    g = mediumColor[1] * c;
                    b = mediumColor[2] * c;
                } else {
                    r = mediumColor[0];
                    g = mediumColor[1];
                    b = mediumColor[2];
                }

            } else {
                if (lowMode == 1.0) {
                    r = lowColor[0] + c;
                    g = lowColor[1] + c;
                    b = lowColor[2] + c;
                } else {
                    r = lowColor[0];
                    g = lowColor[1];
                    b = lowColor[2];
                }
            }

            if (c > mountainLevel / 255.0) {
                if (highMode == 1.0) {
                    float max = (255.0 - mountainLevel);
                    float c2 = (c * 255.0) - mountainLevel;
                    float m = c2 * (1.0 / max);
                    r = (highColor[0] + highColor[0] * m) / 2.0;
                    g = (highColor[1] + highColor[1] * m) / 2.0;
                    b = (highColor[2] + highColor[2] * m) / 2.0;
                } else {
                    r = highColor[0];
                    g = highColor[1];
                    b = highColor[2];
                }
            }
        }

        if(cycling > 0.0){
            float cy = (sin(time / 10.0 + (p[0] + p[1]) * 2.0) * 0.75);
            r = (r + cy) / 2.0;
            g = (g + cy) / 2.0;
            b = (b + cy) / 2.0;
        }

        vec4 n = vec4(r,g,b,1.0);

        gl_FragColor = (h + n*9.0) / 10.0;
    } else {

        gl_FragColor = h;
    }
}
uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;

varying vec2 vUv;

void main() {
    vec4 texture1 = texture2D(tDiffuse1, vUv);
    vec4 texture2 = texture2D(tDiffuse2, vUv);

    float x = step(0.5, vUv.x);

    vec4 color = mix(texture1, texture2, x);

    gl_FragColor = color;
}
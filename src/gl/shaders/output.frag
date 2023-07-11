uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;

varying vec2 vUv;

void main() {
    vec4 texel1 = texture2D(tDiffuse1, vUv);
    vec4 texel2 = texture2D(tDiffuse2, vUv);

    float x = step(0.5, vUv.x);

    vec4 color;

    // color = mix(texel1, texel2, x);
    color = min(texel1, texel2);

    gl_FragColor = color;
}
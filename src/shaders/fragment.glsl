uniform float uTime;
uniform float uProgress;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;


varying float pulse;
varying vec2 vUv;
varying vec2 vSize;

vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize){
    vec2 tempUV = uv - vec2(0.5);

    float quadAspect = quadSize.x/quadSize.y;
    float textureAspect = textureSize.x/textureSize.y;

    if(quadAspect < textureAspect){
        tempUV = tempUV * vec2(quadAspect/textureAspect,1.);
    } else{
        tempUV = tempUV * vec2(1.,textureAspect/quadAspect);
    }


    tempUV += vec2(0.5);
    return tempUV;
}

void main(){
    // vec2 newUV = (vUv - vec2(0.5))*vec2(2., 1.) + vec2(0.5);
    vec2 correctUV = getUV(vUv, uTextureSize, vSize);
    vec4 image = texture(uTexture, correctUV);
    // float sinePulse = (1. + sin(vUv.x*50. + uTime))*0.5;
    gl_FragColor = vec4(vUv, 0.0, 1.0);
    gl_FragColor = image;
}
const vertexSource = `
varying vec2 vUv;

varying vec4 vPosition;
varying vec3 vCamera;

void main()
{
    vPosition = modelMatrix * vec4( position, 1.0 );
    vCamera = cameraPosition;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

const fragmentSource = `
varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vCamera;

uniform float time;
uniform sampler2D uTex;
uniform vec3 uCenter;
uniform float uSize;
uniform vec3 uRot;

vec3 LIGHT_DIR = normalize(vec3(0.74,-0.74,0));

mat4 rotate(vec3 rot)
{
    mat4 rx = mat4(
        1.0,    0.0,        0.0,            0.0,
        0.0,    cos(-rot.x), sin(-rot.x),    0.0,
        0.0,    -sin(-rot.x), cos(-rot.x),     0.0,
        0.0,    0.0,        0.0,            1.0
    );
    mat4 ry = mat4(
        cos(-rot.y),     0.0,    -sin(-rot.y), 0.0,
        0.0,            1.0,    0.0,        0.0,
        sin(-rot.y),    0.0,    cos(-rot.y), 0.0,
        0.0,            0.0,    0.0,        1.0
    );
    mat4 rz = mat4(
        cos(-rot.z), sin(-rot.z),    0.0,    0.0,
        -sin(-rot.z), cos(-rot.z),     0.0,    0.0,
        0.0,        0.0,            1.0,    0.0,
        0.0,        0.0,            0.0,    1.0
    );

    return (ry * rx * rz);
}

#define ITERATIONS 8




float map(vec3 pos)
{
    pos = pos;
    float rot = -time * 0.001 + pow(length(pos.xz),0.5)*5.0;
    pos.xz = mat2(cos(rot),-sin(rot),sin(rot),cos(rot)) * pos.xz;
    float a = max(0.0, texture2D(uTex, (pos.xz+vec2(1.0))*0.5).r - 0.1);
    return abs(pos.y) - ((a * 0.1) * (1.0 - length(pos.xz)) * length(pos.xz) + (max(0.0,1.0 - length(pos.xz))+0.001)*0.2);
}

vec3 calcNorm(vec3 pos)
{
    float d = 0.0001;
    float center = map(pos);
    vec3 grad = vec3(map(pos+vec3(d,0.0,0.0))-center, map(pos+vec3(0.0,d,0.0))-center, map(pos+vec3(0.0,0.0,d))-center);
    return normalize(grad / d);
}

// lambert model
vec4 lambert(vec3 pos)
{
    vec3 light = LIGHT_DIR;
    vec3 n = calcNorm(pos);
    if(n.y < 0.0) light = - LIGHT_DIR;
    float b = max(0.0, dot(n, -light))*0.9+0.1;
    return vec4(b, b, b, 1.0) * mix(vec4(1.5), vec4(0.1,0.2,0.6,0.0), length(pos.xz));
}

void main() {
    vec3 dir = normalize(vPosition.xyz - vCamera);
    vec3 pos = (vPosition.xyz - uCenter)/uSize;
    mat4 R = rotate(uRot);
    dir = (R * vec4(dir, 1.0)).xyz;
    pos = (R * vec4(pos, 1.0)).xyz;

    float d = 0.0;

    for(int i=0;i<1000;i++)
    {
        d = map(pos);
        if(abs(d) < 0.001)
        {
            gl_FragColor = lambert(pos);
            return;
        }
        if(length(pos)>=1.0) break;
        pos += dir * d * 0.2;
    }

    gl_FragColor=vec4(0.2,0.2,0.0,0.0);
}
`;

export {vertexSource, fragmentSource}
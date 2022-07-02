uniform float slider;

uniform sampler2D tex;

void main()
{
  vec3 rgb = texture2D( tex, cogl_tex_coord_in[0].xy).rgb;
  cogl_color_out = vec4(rgb.x-mod(rgb.x, slider), rgb.y-mod(rgb.y, slider), rgb.z-mod(rgb.z, slider), 1.0);
}

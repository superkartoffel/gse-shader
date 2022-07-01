uniform sampler2D tex;

void main()
{
  cogl_color_out = vec4(texture2D( tex, cogl_tex_coord_in[0].xy).rgb, 1.0);
}

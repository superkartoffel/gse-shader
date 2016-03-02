uniform int height;
uniform int width;
uniform int mouseX;
uniform int mouseY;

uniform sampler2D tex;

void main()
{
  cogl_color_out = vec4(texture2D( tex, cogl_tex_coord_in[0].xy).rgb, 1.0);
  if( cogl_tex_coord_in[0].y*height - 1 < mouseY &&  cogl_tex_coord_in[0].y *height+1 > mouseY)
    cogl_color_out = vec4(.0, .0, 1., 1.0);
  if( cogl_tex_coord_in[0].x*width - 1 < mouseX &&  cogl_tex_coord_in[0].x *width+1 > mouseX)
    cogl_color_out = vec4(.0, .0, 1., 1.0);
}

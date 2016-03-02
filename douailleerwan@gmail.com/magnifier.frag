uniform int height;
uniform int width;
uniform int mouseX;
uniform int mouseY;

uniform float slider;

uniform sampler2D tex;


void main()
{
  float radius=2.*slider;
  float depth=radius/2.*slider;
  float widthf = (float(width));
  float heightf = (float(height));
  float x = clamp(mouseX/widthf, 0.0, 1.0);
  float y = clamp(mouseY/heightf, 0.0, 1.0);
  vec2 center = vec2(x,y);
  float ax = ((cogl_tex_coord_in[0].x - center.x) *
              (cogl_tex_coord_in[0].x - center.x)) /
    (0.2*0.2) +
    ((cogl_tex_coord_in[0].y - center.y) *
     (cogl_tex_coord_in[0].y - center.y)) /
    ((  widthf / heightf ));
  float dx = (-(depth)/radius)*ax + (depth/(radius*radius))*ax*ax;
  float f = ax+dx;
  if(ax > radius) f = ax;
  vec2 magnifying = center + (cogl_tex_coord_in[0].xy - center)/ax * f;
  cogl_color_out = vec4(texture2D( tex, magnifying).rgb, 1.0);
}

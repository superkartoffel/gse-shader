uniform int height;
uniform int width;
uniform int mouseX;
uniform int mouseY;

uniform float slider;

uniform sampler2D tex;

void main()
{
  int dX, dY;
  float countR = 0.0;
  float countG = 0.0;
  float countB = 0.0;
  int area = int(round(2.0 * slider))+1;

  for(dX = -area; dX <= area; ++dX) {
    for(dY = -area; dY <= area; ++dY) {
      vec2 pixel = cogl_tex_coord_in[0].xy;
      vec3 color = texture2D( tex, vec2((pixel.x*width+dX)/width,
                                        (pixel.y*height+dY)/height)).rgb;
      countR += color.x;
      countG += color.y;
      countB += color.z;
    }
  }
  cogl_color_out = vec4(countR/((area*2.0+1.0)*(area*2.0+1.0)),
                        countG/((area*2.0+1.0)*(area*2.0+1.0)),
                        countB/((area*2.0+1.0)*(area*2.0+1.0)),
                        1.0);
}

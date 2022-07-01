uniform int height;
uniform int width;

uniform float slider;

uniform sampler2D tex;

void main()
{
  int dX, dY;
  float countR = 0.0;
  float countG = 0.0;
  float countB = 0.0;
  int samples=0;
  int area = int(5.0 * slider)+1;

  for(dX = -(area+1)/2; dX <= area/2; ++dX) {
    for(dY = -(area+1)/2; dY <= area/2; ++dY) {
      vec2 pixel = cogl_tex_coord_in[0].xy;
      vec3 color = texture2D( tex, vec2((pixel.x*width+dX)/width,
                                        (pixel.y*height+dY)/height)).rgb;
      countR += color.x;
      countG += color.y;
      countB += color.z;
      samples += 1;
    }
  }
  cogl_color_out = vec4(countR/samples,
                        countG/samples,
                        countB/samples,
                        1.0);
}

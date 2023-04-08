uniform float slider;
uniform int height;
uniform int width;
uniform sampler2D tex;
vec2 window_center = vec2(.5, .5);

uniform float sph_distance = 5; // Distance from the theoretical sphere 
                                  // we use for our curvature transform
uniform float curvature = 1.5; // How much the window should "curve" 
uniform int shadow_intensity = 4; // Intensity level of the shadow effect (from 1 to 5)
uniform float shadow_cutoff = 1; // How "early" the shadow starts affecting 
                                 // pixels close to the edges
                                 // I'd keep this value very close to 1
uniform int downscale_factor = 2; // How many pixels of the window
                                  // make an actual "pixel" (or block)
vec4 outside_color = vec4(0 ,0 ,0, 1); // Color for the outside of the window
vec3 screen_color = vec3(124, 255, 79);

vec3 applyRasterization(vec2 screenCoords, vec3 texel, vec2 virtualResolution, float intensity) {
	vec3 pixelHigh = ((1.0 + .3) - (0.2 * texel)) * texel;
	vec3 pixelLow  = ((1.0 - .3) + (0.1 * texel)) * texel;
	vec2 coords = fract(screenCoords * virtualResolution) * 2.0 - vec2(1.0);
	float mask = 1.0 - abs(coords.y);
	vec3 rasterizationColor = mix(pixelLow, pixelHigh, mask);
	return mix(texel, rasterizationColor, intensity);
}

vec2 barrel(vec2 v, vec2 cc) {
     float distortion = dot(cc, cc) * slider/50;
     return (v - cc * (1.0 + distortion) * distortion);
}

// Darkens a pixels near the edges
vec4 darken_color(vec4 color, vec2 coords)
{
    // If shadow intensity is 0, change nothing
    if (shadow_intensity == 0)
    {
        return color;
    }

    // Get how far the coords are from the center
    vec2 distances_from_center = window_center - coords;

    // Darken pixels close to the edges of the screen in a polynomial fashion
    float brightness = 1;
    brightness *= -pow(distances_from_center.y, (5/shadow_intensity)*2)+1;
    brightness *= -pow(distances_from_center.x, (5/shadow_intensity)*2)+1;
    color.xyz *= brightness;

    return color;
}

// Gets a color for a pixel with all the coordinate and
// downscale changes
vec4 get_pixel(vec2 coords)
{
    // If pixel is at the edge of the window, return a completely black color
    if (coords.x >=1 || coords.y >=1 || 
        coords.x <=0 || coords.y <=0)
    {
        return outside_color;
    }
    return vec4(texture2D( tex, coords).rgb, 1.0);
}

void main()
{
  vec2 cc = vec2(0.5) - cogl_tex_coord_in[0].xy;
  vec2 curved_coords = barrel(cogl_tex_coord_in[0].xy, cc); 
  //vec2 curved_coords = cogl_tex_coord_in[0].xy; //curve_coords_spheric(cogl_tex_coord_in[0].xy);
  
  // Fetch the color
  vec4 c = get_pixel(curved_coords);

  // Fetch colors from close pixels to apply color distortion
  vec4 c_right = get_pixel(vec2(curved_coords.x+slider/1000, curved_coords.y));
  vec4 c_left = get_pixel(vec2(curved_coords.x-slider/1000, curved_coords.y));

  // Mix red and blue colors
  c = vec4(c_left.x, c.y, c_right.z, c.w);
  
  // darken edges of the screen
  c = darken_color(c, cogl_tex_coord_in[0].xy);  
  vec3 rgb = applyRasterization(curved_coords, c.xyz, vec2(640,480), slider*2);
  //c = vec4(vec3(1) - (vec3(1)- slider/1000 * screen_color) * (vec3(1)- rgb), 1); // screen
  //c = vec4(slider * 512 * screen_color/255 * rgb/255 + (1-slider) * rgb, 1); // multiply
  // overlay
  if ((rgb.x + rgb.y + rgb.z) < 3*128){
    c = vec4(slider * 512 * screen_color/255 * rgb/255 + (1-slider) * rgb, 1);
  } else { 
    c = vec4(vec3(1) - (vec3(1)- slider/1000 * screen_color) * (vec3(1)- rgb), 1); // screen
  }
    
  cogl_color_out = c;
}




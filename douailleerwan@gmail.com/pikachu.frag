uniform sampler2D tex;

#define _  0.
#define Y  1.
#define G  2.
#define R  3.
#define A  4.

#define colorNumber 5.

#define DD(id,a,b,c,d,e,f,g,h,i) if(y==id)m=(a+5.*(b+5.*(c+5.*(d+5.*(e+5.*(f+5.*(g+5.*(h+5.*(i)))))))));


vec3 pikachu(vec3 col, vec2 p)
{
  float x =      floor( p.x*100.0*1.77 );
  int   y = int( floor( p.y*100.0));

  float m = 0.0;
  DD( 80, Y,_,_,_,_,_,Y,_,_)
    DD( 81, _,Y,_,_,_,Y,_,_,_)
    DD( 82, _,Y,Y,Y,Y,Y,_,_,Y)
    DD( 83, _,Y,_,Y,_,Y,_,_,Y)
    DD( 84, _,R,Y,Y,Y,R,_,Y,Y)
    DD( 85, _,G,Y,Y,Y,G,_,Y,_)
    DD( 86, _,G,Y,Y,Y,G,Y,_,_)
    DD( 87, _,Y,Y,Y,Y,Y,_,_,_)
    DD( 88, _,Y,_,_,_,Y,_,_,A)

    float c = mod(floor(m/pow(colorNumber,x)), colorNumber);
  if(c<0.1)
    return col;
  else if( c<1.5 )
    return vec3(1.0,1.0,0.0);
  else if( c<2.5 )
    return vec3(0.8,0.8,0.0);
  else if( c<3.5 )
    return vec3(1.0,0.0,0.0);
  else
    return vec3(0.8,0.8,1.0);
}

void main()
{
  vec3 col = texture2D( tex, cogl_tex_coord_in[0].xy).rgb;
  col = pikachu(col, cogl_tex_coord_in[0].xy);
  cogl_color_out = vec4(col, 1.0);
}

document.art_works.art_flower = `
import turtle, math

def p_line(t, n, length, angle):
    """Draws n line segments."""
    for i in range(n):
        t.fd(length)
        t.lt(angle)

def polygon(t, n, length):
    """Draws a polygon with n sides."""
    angle = 360/n
    p_line(t, n, length, angle)

def arc(t, r, angle):
    """Draws an arc with the given radius and angle."""
    arc_length = 2 * math.pi * r * abs(angle) / 360
    n = int(arc_length / 4) + 1
    step_length = arc_length / n
    step_angle = float(angle) / n

    # Before starting reduces, making a slight left turn.
    t.lt(step_angle / 2)
    p_line(t, n, step_length, step_angle)
    t.rt(step_angle / 2)

def petal(t, r, angle):
    """Draws a petal using two arcs."""
    for i in range(2):
        arc(t, r, angle)
        t.lt(180 - angle)

def flower(t, n, r, angle, p):
    """Draws a flower with n petals."""
    for i in range(n):
        petal(t, r, angle)
        t.lt(p / n)

def leaf(t, r, angle, p):
    """Draws a leaf and fill it."""
    t.begin_fill() # Begin the fill process.
    t.down()
    flower(t, 1, 40, 80, 180)
    t.end_fill()

def main():
    window = turtle.Screen() #creat a screen
    window.bgcolor("#f5fffa")
    ivy = turtle.Turtle()
    ivy.shape("turtle")
    ivy.color("#EF597B")
    ivy.width(5)
    ivy.speed(0)

    # Drawing flower
    flower(ivy, 10, 40, 100, 360)

    # Drawing pedicel
    ivy.color("#B67721")
    ivy.rt(90)
    ivy.fd(200)

    # Drawing leaf
    ivy.rt(270)
    #ivy.color("#7ABA7A")
    ivy.color("#41924B")
    leaf(ivy, 40, 80, 180)
    ivy.ht()

main()
`;

document.art_works.art_honeycomb = `
# https://gist.github.com/utstikkar/3618027
# turtle honeycomb
# Lasse Kosiol
# 1.9.2012
# python workshop opentechschool berlin

import turtle
from random import randint

size = 20
circles = 20
turtle.speed(100)

def move(length, angle):
                turtle.right(angle)
                turtle.forward(length)

def hex():
        turtle.pendown()
        turtle.color( randint(0,255),randint(0,255),randint(0,255) )
        turtle.begin_fill()
        for i in range(6):
                move(size,-60)
        turtle.end_fill()
        turtle.penup()

# start
turtle.penup()

for circle in range (circles):
        if circle == 0:
                hex()
                move(size,-60)
                move(size,-60)
                move(size,-60)
                move(0,180)
        for i in range (6):
                move(0,60)
                for j in range (circle+1):
                        hex()
                        move(size,-60)
                        move(size,60)
                move(-size,0)
        move(-size,60)
        move(size,-120)
        move(0,60)

turtle.exitonclick()
`;

document.art_works.art_spiral_squares = `
from random import randint
bgcolor('black')
x = 1
turtle.speed(0)
while x < 400:
  r = randint(0,255)
  g = randint(0,255) 
  b = randint(0,255)

  turtle.pencolor(r,g,b)
  turtle.fd(50 + x)
  turtle.rt(90.991)
  x = x + 1
`;
 
function set_art(art_content)
{
    document.getElementById("code").value = document.art_works[art_content];
}
$(document).ready(function () {
    var output = $('#edoutput');
    var outf = function (text) {
        output.text(output.text() + text);
    };
    
    var keymap = {
        "Ctrl-Enter" : function (editor) {
            Sk.configure({output: outf, read: builtinRead});
            Sk.canvas = "mycanvas";
            if (editor.getValue().indexOf('turtle') > -1 ) {
                $('#mycanvas').show()
            }
            Sk.pre = "edoutput";
            (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
            try {
                Sk.misceval.asyncToPromise(function() {
                    return Sk.importMainWithBody("<stdin>",false,editor.getValue(),true);
                });
            } catch(e) {
                outf(e.toString() + "\n")
            }
        },
        "Shift-Enter": function (editor) {
            Sk.configure({output: outf, read: builtinRead});
            Sk.canvas = "mycanvas";
            Sk.pre = "edoutput";
            if (editor.getValue().indexOf('turtle') > -1 ) {
                $('#mycanvas').show()
            }
            try {
                Sk.misceval.asyncToPromise(function() {
                    return Sk.importMainWithBody("<stdin>",false,editor.getValue(),true);
                });
            } catch(e) {
                outf(e.toString() + "\n")
            }
        }
    }

    prepare_art_works();

    window.art_editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        parserfile: ["parsepython.js"],
        autofocus: true,
        theme: "solarized dark",
        //path: "static/env/codemirror/js/",
        lineNumbers: true,
        textWrapping: false,
        indentUnit: 4,
        height: "160px",
        fontSize: "9pt",
        autoMatchParens: true,
        extraKeys: keymap,
        parserConfig: {'pythonVersion': 2, 'strictErrors': true}
    });

    $("#skulpt_run").click(function (e) { keymap["Ctrl-Enter"](window.art_editor)} );

    $("#toggledocs").click(function (e) {
        $("#quickdocs").toggle();
    });

    var exampleCode = function (id, text) {
        $(id).click(function (e) {
            window.art_editor.setValue(text);
            window.art_editor.focus(); // so that F5 works, hmm
        });
    };

    exampleCode('#codeexample1', "print \"Hello, World!\"     # natch");
    exampleCode('#codeexample2', "for i in range(5):\n    print i\n");
    exampleCode('#codeexample3', "print [x*x for x in range(20) if x % 2 == 0]");
    exampleCode('#codeexample4', "print 45**123");
    exampleCode('#codeexample5', "print \"%s:%r:%d:%x\\n%#-+37.34o\" % (\n        \"dog\",\n        \"cat\",\n        23456,\n        999999999999L,\n        0123456702345670123456701234567L)");
    exampleCode('#codeexample6', "def genr(n):\n    i = 0\n    while i < n:\n        yield i\n        i += 1\n\nprint list(genr(12))\n");
    exampleCode('#codeexample7', "# obscure C3 MRO example from Python docs\nclass O(object): pass\nclass A(O): pass\nclass B(O): pass\nclass C(O): pass\nclass D(O): pass\nclass E(O): pass\nclass K1(A,B,C): pass\nclass K2(D,B,E): pass\nclass K3(D,A): pass\nclass Z(K1,K2,K3): pass\nprint Z.__mro__\n");
    exampleCode('#codeexample8', "import document\n\npre = document.getElementById('edoutput')\npre.innerHTML = '''\n<h1> Skulpt can also access DOM! </h1>\n''' \n");

    $('#clearoutput').click(function (e) {
        $('#edoutput').text('');
        $('#mycanvas').hide();
    });

    function builtinRead(x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    }

    set_art("art_honeycomb");
});

function set_art(art_content)
{
    window.art_editor.setValue(window.art_works[art_content]);
    window.art_editor.focus();
}

function prepare_art_works()
{
    window.art_works = {};
    
    window.art_works.art_flower = `# Drawing a flower stalk
# The original source will be added later
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
    window = turtle.Screen() # create a screen
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

    window.art_works.art_honeycomb = `# turtle honeycomb
# Lasse Kosiol
# 1.9.2012
# python workshop opentechschool berlin
# The source: https://gist.github.com/utstikkar/3618027

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
`;

    window.art_works.art_spiral_squares = `# Draw spiral from squares
# Adapted from https://www.instructables.com/id/Easy-Designs-Turtle-Graphics-Python/
import turtle
from random import randint

window = turtle.Screen() # create a screen
window.bgcolor("black")
ivy = turtle.Turtle()
ivy.speed(0)

for x in range(400):
    r = randint(0,255)
    g = randint(0,255)
    b = randint(0,255)

    ivy.pencolor(r,g,b)
    ivy.fd(50 + x)
    ivy.rt(90.991)
`;

    window.art_works.art_math_puzzle = `# Solving math puzzle using Turtle
# The triangle is isosceles right (2 equal sides make the 90 degree angle)
# The source: https://gist.github.com/vietlq/04854aef227bc53a71ee096976a1c1f1

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

def move(t, dx, dy):
    t.up()
    x, y = t.pos()
    t.setpos(x + dx, y + dy)
    t.down()

def main():
    window = turtle.Screen() # create a screen
    window.bgcolor("#f5fffa")
    ivy = turtle.Turtle()
    ivy.shape("arrow")
    ivy.color("#EF597B")
    ivy.width(2)
    ivy.speed(20)

    ivy.up()
    ivy.goto(-100, -100)
    ivy.down()
    polygon(ivy, 4, 150)

    move(ivy, 0, 50)
    ivy.fd(150)
    move(ivy, 0, 50)
    ivy.back(150)
    move(ivy, 50, 50)
    ivy.rt(90)
    ivy.fd(150)
    move(ivy, 50, 0)
    ivy.back(150)

    move(ivy, -50, -50)
    ivy.color("green")
    ivy.setpos(50, 50)
    ivy.color("blue")
    ivy.setpos(0, -100)
    ivy.color("green")
    ivy.setpos(-50, 0)
    ivy.ht()

main()
`;

    window.art_works.art_180_lines = `# 180 lines with difference of 2 degrees
# Adapted from http://www.mathcats.com/gallery/15wordcontest.html
# and http://chrisma.es/logoturtle/samples/
import turtle
turtle.speed(100)
turtle.color('red')
for x in range(180):
    turtle.fd(300)
    turtle.bk(300)
    turtle.rt(2)
`;

    window.art_works.art_fractal_maze = `# Fractal maze
# Source: https://blog.klipse.tech/python/2017/01/04/python-turtle-fractal.html
# loaded from gist: https://gist.github.com/viebel/5349bcca144c41b8f83af39079bf59ad

import turtle

def hilbert2(step, rule, angle, depth, t):
    if depth > 0:
        a = lambda: hilbert2(step, "a", angle, depth - 1, t)
        b = lambda: hilbert2(step, "b", angle, depth - 1, t)
        left = lambda: t.left(angle)
        right = lambda: t.right(angle)
        forward = lambda: t.forward(step)
        if rule == "a":
            left(); b(); forward(); right(); a(); forward(); a(); right(); forward(); b(); left();
        if rule == "b":
            right(); a(); forward(); left(); b(); forward(); b(); left(); forward(); a(); right();

myTurtle = turtle.Turtle()
myTurtle.speed(0)
hilbert2(5, "a", 90, 5, myTurtle)
`;

    window.art_works.art_polygons_stars = `# Polygons and stars

import turtle

def move(t, dx, dy):
    t.up()
    x, y = t.pos()
    t.setpos(x + dx, y + dy)
    t.down()

def draw_polygon(n, size):
    for x in range(n):
        turtle.fd(size)
        # Use floating point to close the polygon
        turtle.rt(360./n)

def draw_star(n, size, diff=2):
    for x in range(n):
        turtle.fd(size)
        # Use floating point to close the star
        turtle.rt(diff*360./n)

turtle.speed(12)
turtle.color('red')
move(turtle, -50, 150)
draw_polygon(17, 60)

move(turtle, -25, -75)
turtle.color('#77CDEF')
draw_star(7, 100, 4)

move(turtle, 25, -75)
turtle.color('darkgreen')
draw_star(23, 60, 3)
`;

    window.art_works.art_spirograph = `# Source: https://www.101computing.net/python-turtle-spirograph/
# Python Turtle - Spirograph - www.101computing.net/python-turtle-spirograph/
import turtle
from math import cos,sin
from time import sleep

window = turtle.Screen()
window.bgcolor("#FFFFFF")

mySpirograph = turtle.Turtle()
mySpirograph.hideturtle()
mySpirograph.tracer(0)
mySpirograph.speed(0)
mySpirograph.pensize(2)

myPen = turtle.Turtle()
myPen.hideturtle()
myPen.tracer(0)
myPen.speed(0)
myPen.pensize(3)
myPen.color("#AA00AA")

R = 125
r = 75
d = 125

angle = 0

myPen.penup()
myPen.goto(R-r+d,0)
myPen.pendown()

theta = 0.2
steps = int(6*3.14/theta)

for t in range(0,steps):
    mySpirograph.clear()
    mySpirograph.penup()
    mySpirograph.setheading(0)
    mySpirograph.goto(0,-R)
    mySpirograph.color("#999999")
    mySpirograph.pendown()
    mySpirograph.circle(R)
    angle+=theta

    x = (R - r) * cos(angle)
    y = (R - r) * sin(angle)
    mySpirograph.penup()
    mySpirograph.goto(x,y-r)
    mySpirograph.color("#222222")
    mySpirograph.pendown()
    mySpirograph.circle(r)
    mySpirograph.penup()
    mySpirograph.goto(x,y)
    mySpirograph.dot(5)

    x = (R - r) * cos(angle) + d * cos(((R-r)/r)*angle)
    y = (R - r) * sin(angle) - d * sin(((R-r)/r)*angle)
    mySpirograph.pendown()
    mySpirograph.goto(x,y)
    #mySpirograph.setheading((R-r)*degrees(angle)/r)
    #mySpirograph.forward(d)
    mySpirograph.dot(5)
    myPen.goto(mySpirograph.pos())

    mySpirograph.getscreen().update()
    sleep(0.05)

sleep(0.5)
#Hide Spirograph
mySpirograph.clear()
mySpirograph.getscreen().update()
`;
}

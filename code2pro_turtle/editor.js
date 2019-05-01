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

}

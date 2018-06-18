function FP(t) {
    return Math.abs(t) < 1e-5 ? 0 : t
}
function run() {
    var t = +new Date;
    if (200 > t - lastframe) {
        world.Step((t - lastframe) / 1e3, 40, 40),
        world.ClearForces(),
        eachstep(t - lastframe);
        for (var e = new Array, i = 0; i < objects.length; ++i)
            objects[i].draw(),
            objects[i].dead ? objects[i].reap() : e.push(objects[i]);
        objects = e
    }
    lastframe = t,
    animate(run)
}
function si(t, e, i) {
    $(".shot").css({
        left: t,
        bottom: e
    }),
    $("#line1").css({
        left: point1.x,
        bottom: point1.y
    }),
    $("#line2").css({
        left: point2.x,
        bottom: point2.y
    }),
    $("#container").css("bottom", i)
}
function getxy(t) {
    var e = t.pageX / scale
      , i = t.pageY / scale
      , o = e - point0.x
      , n = $("#world").height() - i - point0.y
      , s = 80 / Math.sqrt(o * o + n * n);
    return 1 > s && (o *= s,
    n *= s),
    {
        x: o + point0.x,
        y: n + point0.y
    }
}
function drawline(t) {
    var e, i = t.x, o = t.y, n = i - point1.x, s = o - point1.y, r = i - point2.x, a = o - point2.y;
    e = "rotate(" + FP(-Math.atan2(s, n)) + "rad)",
    $("#line1").css({
        width: FP(Math.sqrt(s * s + n * n)),
        transform: e,
        "-moz-transform": e,
        "-webkit-transform": e
    }),
    e = "rotate(" + FP(-Math.atan2(a, r)) + "rad)",
    $("#line2").css({
        width: FP(Math.sqrt(a * a + r * r)),
        transform: e,
        "-moz-transform": e,
        "-webkit-transform": e
    }),
    launch && launch.body.SetPositionAndAngle(new VEC(i,o), Math.atan2(point0.y - o, point0.x - i))
}
function Entity() {
    this.tangible = !0,
    this.dead = !1,
    this.fade = 500,
    this.bodydef = new Box2D.Dynamics.b2BodyDef,
    this.fixdef = new Box2D.Dynamics.b2FixtureDef,
    this.move = function(t, e) {
        var i = (this.body.GetPosition(),
        "translate(" + FP(t) + "px, " + FP(e) + "px) rotate(" + FP(-this.body.GetAngle()) + "rad)");
        this.element.css({
            transform: i,
            "-moz-transform": i,
            "-webkit-transform": i
        })
    }
    ,
    this.fix = function(t, e, i) {
        var o = t.CreateFixture(this.fixdef);
        return o.SetUserData({
            type: e,
            obj: this,
            data: i
        }),
        o
    }
    ,
    this.create = function() {
        objects.push(this),
        this.draw(),
        this.element.appendTo("#world")
    }
    ,
    this.wall = function() {
        this.bodydef.type = BODY.b2_staticBody,
        this.fixdef.density = .8,
        this.fixdef.friction = .6,
        this.fixdef.restitution = 0,
        this.fixdef.isSensor = !1
    }
    ,
    this.draw = function() {}
    ,
    this.damage = function() {}
    ,
    this.reap = function() {
        var t = this.element;
        world.DestroyBody(this.body),
        t.fadeOut(this.fade, function() {
            t.remove()
        })
    }
}
function Ae() {
    this.wall(),
    this.bodydef.position.Set(0, 0),
    this.bodydef.linearVelocity.Set(0, 0),
    this.body = world.CreateBody(this.bodydef);
    for (var t = new Array, e = worldheight, i = "", o = 1; o < arguments.length; o++)
        t.push(new VEC(arguments[o][0],arguments[o][1])),
        i += arguments[o][0] + "," + (e - arguments[o][1]) + " ";
    this.element = $("<polygon>").attr({
        points: i,
        style: "fill:" + empty + ";"
    }),
    this.element.prependTo("#port"),
    this.fixdef.shape = POLYGON.AsArray(t, t.length),
    this.fix(this.body, "wall")
}
function Al() {
    this.wall(),
    this.fixdef.density = 1,
    ab("a3ZwyU5lW2fnW2rjzg5mbE1q") == hyu(location.pathname) ? this.fixdef.restitution = 1.2 : this.fixdef.restitution = .4,
    this.bodydef.position.Set(0, 0),
    this.bodydef.linearVelocity.Set(0, 0),
    this.body = world.CreateBody(this.bodydef);
    for (var t = new Array, e = worldheight, i = "", o = 1; o < arguments.length; o++)
        t.push(new VEC(arguments[o][0],arguments[o][1])),
        i += arguments[o][0] + "," + (e - arguments[o][1]) + " ";
    this.element = $("<polygon>").attr({
        points: i,
        style: "fill:" + metalfill + ";"
    }),
    this.element.prependTo("#noport"),
    this.fixdef.shape = POLYGON.AsArray(t, t.length),
    this.fix(this.body, "metal")
}
function Aq(t, e, i, o, n, s) {
    var r, a = this.radius, l = 1 / 0, m = +new Date, c = !0, h = this.element = $("<div>");
    this.bodydef.type = s ? BODY.b2_staticBody : BODY.b2_dynamicBody,
    this.bodydef.bullet = !0,
    this.bodydef.position.Set(t, e),
    this.bodydef.linearVelocity.Set(i, o),
    this.bodydef.angle = n,
    r = this.body = world.CreateBody(this.bodydef),
    this.fixdef.density = 1,
    this.fixdef.restitution = .4,
    this.fixdef.shape = new CIRCLE(a),
    this.fix(r, "head"),
    this.tangible = !1,
    this.draw = s ? function() {
        var t = r.GetPosition();
        this.move(t.x - a, a - t.y)
    }
    : function() {
        var t = r.GetPosition()
          , e = r.GetLinearVelocity();
        if (e.LengthSquared() < 10) {
            var i = +new Date;
            l > i ? l = i : i - m > 5e3 && i - l > 1e3 && (this.dead = !0)
        } else
            l = 1 / 0;
        (e.y < 0 && t.y + a < 0 || e.x > 0 && t.x - a > $("#world").width()) && (this.dead = !0),
        c ? c = !1 : this.tangible || this.wait || (this.tangible = !0),
        this.move(t.x - a, a - t.y)
    }
    ;
    var u, p = this;
    this.presolve = function(t, e) {
        !u && (e.obj instanceof Ae || e.obj instanceof Al) && (u = e.obj),
        p.tangible || e.obj.body.GetType() !== BODY.b2_staticBody ? u = void 0 : (devlog && (e.obj instanceof Ae || e.obj instanceof Al) && e.obj != u,
        (e.obj instanceof Ae || e.obj instanceof Al) && e.obj != u || (c = !0,
        t.SetEnabled(!1))),
        s && t.SetEnabled(!1)
    }
    ,
    s && (this.fade = 0),
    h.css({
        height: 2 * a,
        width: 2 * a,
        left: 0,
        bottom: 0
    }),
    this.create()
}
function ab(t) {
    return t = r(t),
    window.atob(t)
}
function r(t) {
    return t = t.replace(/[=]+/g, ""),
    t.replace(/[a-zA-Z]/g, function(e) {
        return String.fromCharCode(("Z" >= e ? 90 : 122) >= (e = e.charCodeAt(0) + 26 - t.length % 26) ? e : e - 26)
    })
}
function getOffset(t) {
    for (var e = 0, i = 0; t && !isNaN(t.offsetLeft) && !isNaN(t.offsetTop); )
        e += t.offsetLeft - t.scrollLeft,
        i += t.offsetTop - t.scrollTop,
        t = t.offsetParent;
    return {
        top: i,
        left: e
    }
}
function hyu(t) {
    return t.split("/").pop()
}
function Am(t, e, i, o, n, s) {
    Aq.apply(this, arguments),
    this.body.GetFixtureList().GetUserData().type = "bird";
    var r = this.color
      , a = this.presolve
      , l = !1
      , m = this;
    this.stat = s,
    drawbird(this.element, this.radius, r),
    this.onStopTouchingPortal = function() {
        this.wasTouchingWall && this.letGoYourEarthlyTether()
    }
    ,
    this.goingTowardsExit = function(t) {
        var e = Ay.list[0].normal;
        return dotProduct(t, e) < 0
    }
    ,
    this.setColor = function(t) {
        if (this.color != t) {
            for (theBird[r] == this && (theBird[r] = void 0),
            this.color = r = t,
            void 0 != theBird[r] && (theBird[r].dead = !0),
            theBird[r] = this; this.element.lastChild; )
                this.element.removeChild(myNode.firstChild);
            drawbird(this.element, this.radius, r)
        }
    }
    ,
    this.presolve = function(t, e) {
        if (l)
            return t.SetEnabled(!1);
        if (a(t, e),
        this.tangible && !this.wait)
            if (t.SetEnabled(!1),
            "metal" === e.type || "head" === e.type || "bird" === e.type)
                t.SetEnabled(!0),
                this.body.GetLinearVelocity().x * this.body.GetLinearVelocity().x + this.body.GetLinearVelocity().y * this.body.GetLinearVelocity().y > 1e4 && quack();
            else if ("exit" === e.type && Ay.active && this.goingTowardsExit(this.body.GetLinearVelocity()))
                swip(),
                this.dead = !0,
                $("body").fadeOut(500, function() {
                    window.location.href = ab("") + e.data + ab("Sto0iDd")
                });
            else if ("wall" === e.type) {
                if (!this.wasTouchingWall && (this.normal = t.GetManifold().m_localPlaneNormal,
                this.birdPos = this.body.GetPosition(),
                this.surfacePos = t.GetManifold().m_localPoint,
                this.vel = this.body.GetLinearVelocity(),
                0 != this.normal.x || 0 != this.normal.y))
                    for (var i = "wall" === t.GetFixtureA().GetUserData().type ? t.GetFixtureA() : t.GetFixtureB(), o = i.GetShape().GetNormals(), n = 1 / 0, s = 0; s < o.length; s++) {
                        var r = Math.pow(this.normal.x - o[s].x, 2) + Math.pow(this.normal.y - o[s].y, 2);
                        n > r && (this.surface_normal = o[s],
                        n = r)
                    }
                if (this.tangible && t.GetFixtureA().TestPoint(this.birdPos) && (this.wasTouchingWall = !0),
                this.touching_portal && Aa.active)
                    return;
                for (var m = this.body.GetContactList().contact; null != m; ) {
                    if ("portal" === m.GetFixtureA().GetUserData().type || "portal" === m.GetFixtureB().GetUserData().type)
                        return;
                    m = m.next
                }
                this.letGoYourEarthlyTether()
            }
    }
    ,
    this.letGoYourEarthlyTether = function() {
        if (dotProduct(this.vel, this.normal) < 0) {
            var t = Aa.prototype.portals.length < 1 ? void 0 : void 0 === Aa.prototype.portals[0] ? void 0 : Aa.prototype.portals[0].getState()
              , e = Aa.prototype.portals.length < 2 ? void 0 : void 0 === Aa.prototype.portals[1] ? void 0 : Aa.prototype.portals[1].getState();
            portalSteps.push([t, e]);
            var i = (dotProduct(this.surfacePos, this.normal) - dotProduct(this.birdPos, this.normal)) / dotProduct(this.normal, this.normal)
              , o = this.birdPos.x + i * this.normal.x
              , n = this.birdPos.y + i * this.normal.y;
            new Aa(o,n,this.surface_normal,r,Aa.active),
            this.normal.Multiply(this.vel.Length()),
            l = !0,
            this.body.SetType(BODY.b2_kinematicBody),
            this.body.SetLinearVelocity(this.normal.GetNegative()),
            this.element.detach().prependTo("#world").fadeOut(0, function() {
                m.dead = !0
            }),
            transform()
        }
    }
    ,
    this.wait = !1,
    this.touching_portal = !1,
    this.wasTouchingWall = !1,
    void 0 != theBird[r] && theBird[r].dead === !1 && (theBird[r].dead = !0),
    theBird[r] = this
}
function dotProduct(t, e) {
    return t.x * e.x + t.y * e.y
}
function Ay(t, e, i, o) {
    this.pos = new VEC(t,e),
    this.normal = i,
    this.sign = $("<img>").attr("src", "assets/exit.png"),
    this.wall(),
    this.bodydef.position.Set(t, e),
    this.bodydef.linearVelocity.Set(0, 0),
    this.bodydef.angle = Math.atan2(-i.x, i.y),
    this.body = world.CreateBody(this.bodydef),
    this.fixdef.isSensor = !0,
    this.fixdef.shape = POLYGON.AsEdge(new VEC(-this.hw,-this.hh), new VEC(-this.hw,0)),
    this.fix(this.body, "exit"),
    this.fixdef.shape = POLYGON.AsEdge(new VEC(this.hw,-this.hh), new VEC(this.hw,0)),
    this.fix(this.body, "exit"),
    this.fixdef.isSensor = !1,
    this.fixdef.shape = POLYGON.AsBox(this.hw, this.hh),
    this.fix(this.body, "exit", o),
    this.element = $("<img>").attr("src", "assets/portalgreenfull.png"),
    Ay.list.push(this),
    this.fi = function() {
        this.element.css({
            left: 0,
            bottom: 0
        }).appendTo("#world");
        var o = t - 50 * i.x - 21.5
          , n = e - 50 * i.y - 32;
        this.sign.css({
            left: 0,
            bottom: 0
        }),
        this.sign.css("transform", "translate(" + o + "px, -" + n + "px)").appendTo("#world"),
        this.move(t - this.hw, this.hh - e),
        this.element.fadeOut(0, function() {}),
        this.sign.fadeOut(0, function() {}),
        whir(),
        this.element.fi(this.fade, function() {
            Ay.active = !0
        }),
        this.sign.fi(this.fade, function() {})
    }
}
function Aa(t, e, i, o, n) {
    objects.push(this),
    this.pos = new VEC(t,e),
    this.normal = i,
    this.color = o,
    this.portals[o] && (this.portals[o].dead = !0),
    this.portals[o] = this;
    var s, r, a = [], l = this.fill = function(t) {
        t ? r = t : s = !0,
        s && r && r()
    }
    ;
    this.portals[0] && this.portals[1] && (this.portals[0].fill(),
    this.portals[1].fill(),
    Aa.active = !0),
    a.push(function() {
        this.wall(),
        this.bodydef.position.Set(t, e),
        this.bodydef.linearVelocity.Set(0, 0),
        this.bodydef.angle = Math.atan2(-i.x, i.y),
        this.body = world.CreateBody(this.bodydef),
        this.fixdef.isSensor = !0,
        this.fixdef.shape = POLYGON.AsEdge(new VEC(-this.hw,-this.hh), new VEC(-this.hw,0)),
        this.fix(this.body, "portaledge"),
        this.fixdef.shape = POLYGON.AsEdge(new VEC(this.hw,-this.hh), new VEC(this.hw,0)),
        this.fix(this.body, "portaledge"),
        this.fixdef.isSensor = !1,
        this.fixdef.shape = POLYGON.AsBox(this.hw, this.hh),
        this.fix(this.body, "portal"),
        this.element,
        n ? 0 === this.color ? this.element = $("<img>").attr("src", "assets/portalbluefull.png") : 1 === this.color && (this.element = $("<img>").attr("src", "assets/portalorangefull.png")) : 0 === this.color ? this.element = $("<img>").attr("src", "assets/portalblue.png") : 1 === this.color && (this.element = $("<img>").attr("src", "assets/portalorange.png"));
        var o = this;
        l(function() {
            0 === o.color ? o.element.attr("src", "assets/portalbluefull.png") : 1 === o.color && o.element.attr("src", "assets/portalorangefull.png")
        }),
        this.element.css({
            left: 0,
            bottom: 0
        }).appendTo("#world"),
        this.move(t - this.hw, this.hh - e)
    }),
    this.draw = function() {
        for (; a.length; )
            a.pop().apply(this)
    }
    ,
    this.getState = function() {
        return {
            x: this.body.GetPosition().x,
            y: this.body.GetPosition().y,
            normal: i,
            color: o
        }
    }
    ,
    this.send = function(t) {
        var e = this.portals[+!o]
          , i = t.body
          , n = i.GetLinearVelocity().Copy();
        theta = e.body.GetAngle() - this.body.GetAngle() + Math.PI,
        rot1 = MAT.FromAngle(-this.body.GetAngle()),
        rot2 = MAT.FromAngle(e.body.GetAngle() + Math.PI),
        n.MulM(rot1),
        n.MulM(rot2);
        var s = i.GetPosition().Copy();
        s.Subtract(this.pos),
        s.MulM(rot1),
        s.y = -s.y,
        s.MulM(rot2),
        s.Add(e.pos),
        t.tangible && (t.tangible = !1,
        t.initial = !0),
        a.push(function() {
            t.wait = !0,
            t.wasTouchingWall = !1,
            i.SetLinearVelocity(n),
            i.SetPositionAndAngle(s, i.GetAngle() + theta),
            swip()
        })
    }
    ,
    this.contact = function(t, e, i) {
        if ("portal" === i.type && ("bird" == e.type || "head" == e.type) && this.portals[+!o])
            if (t) {
                if (!e.obj.wait && !e.obj.old_presolve) {
                    e.obj.touching_portal = !0;
                    var n = e.obj.old_presolve = e.obj.presolve
                      , s = this;
                    e.obj.presolve = function(t, e) {
                        if (n && n.apply(this, arguments),
                        "portaledge" !== e.type) {
                            var i = t.GetManifold().m_localPlaneNormal.Copy()
                              , o = this.body.GetPosition().Copy()
                              , r = this.body.GetLinearVelocity().Copy();
                            i.Multiply(this.radius),
                            o.Subtract(i),
                            o.Subtract(s.pos),
                            o.MulM(MAT.FromAngle(-s.body.GetAngle())),
                            Math.abs(o.x) >= s.hw || o.y - s.hh >= 3 * s.hh || (t.SetEnabled(!1),
                            o = this.body.GetPosition().Copy(),
                            o.Subtract(s.pos),
                            o.MulM(MAT.FromAngle(-s.body.GetAngle())),
                            r.MulM(MAT.FromAngle(-s.body.GetAngle())),
                            o.y < 0 && r.y < 0 && (this.presolve = this.old_presolve,
                            delete this.old_presolve,
                            s.send(this)))
                        }
                    }
                }
            } else
                e.obj.wait = !1,
                e.obj.touching_portal = !1,
                e.obj.onStopTouchingPortal && e.obj.onStopTouchingPortal(),
                e.obj.old_presolve && (e.obj.presolve = e.obj.old_presolve,
                delete e.obj.old_presolve)
    }
}
function Aw(t, e, i) {
    var o = 1 / 0
      , n = this.element = $("<img>").attr("src", "assets/turret.png");
    this.name = i,
    this.bodydef.type = BODY.b2_dynamicBody,
    this.bodydef.position.Set(t + 60, e + 60),
    this.bodydef.linearVelocity.Set(0, 0);
    var s = this.body = world.CreateBody(this.bodydef);
    this.fixdef.density = 1.2,
    this.fixdef.restitution = .4,
    this.fixdef.shape = POLYGON.AsArray([new VEC(-21,30), new VEC(-21,-51), new VEC(9,-51), new VEC(9,30), new VEC(-6,51)], 5),
    this.fix(s, "head"),
    this.draw = function() {
        var t = s.GetAngularVelocity()
          , e = s.GetAngle()
          , i = s.GetLinearVelocity()
          , n = s.GetPosition();
        if (i.x * i.x + i.y * i.y > 5e3 ? squeal() : i.x * i.x + i.y * i.y > 600 && oink(),
        i.y < 0 && n.y < 0 || i.x > 0 && n.x > $("#world").width())
            this.dead = !0,
            0 == --Aw.number && fi();
        else if (.1 > t && Math.abs(e) > 1.3) {
            var r = +new Date;
            o > r ? o = r : r - o > 1e3 && (this.dead = !0,
            0 == --Aw.number && fi())
        } else
            o = 1 / 0;
        this.move(n.x, -n.y)
    }
    ,
    ++Aw.number,
    $("#message").fadeOut(0),
    n.css({
        left: -60,
        bottom: -60
    }),
    this.create(),
    this.reap = function() {
        void 0 !== i && localStorage.setItem(i, !0);
        var t = this.element;
        world.DestroyBody(this.body),
        t.fadeOut(this.fade, function() {
            t.remove()
        })
    }
}
function nextlaunch() {
    return nl
}
function drawbird(t, e, i) {
    var o;
    return 0 == i ? (o = $("<img>").attr("src", "assets/duckblue.png"),
    o.appendTo(t)) : 1 == i && (o = $("<img>").attr("src", "assets/duckorange.png"),
    o.appendTo(t)),
    o
}
function iw(t, e, i) {
    if (worldwidth = t,
    worldheight = e,
    scale = i,
    $("#container").css({
        "-ms-transform": "scale(" + scale + ")",
        "-webkit-transform": "scale(" + scale + ")",
        transform: "scale(" + scale + ")"
    }),
    supportsClipPath()) {
        var o = $("<div>").attr({
            "class": "worldsize",
            id: "marker1"
        })
          , n = $("<div>").attr({
            "class": "worldsize",
            id: "marker2"
        })
          , s = $("<svg>").attr({
            width: worldwidth,
            height: worldheight
        })
          , r = $("<svg>").attr({
            width: worldwidth,
            height: worldheight
        })
          , a = $("<defs>")
          , l = $("<defs>")
          , m = $("<clipPath>").attr({
            id: "port"
        })
          , c = $("<clipPath>").attr({
            id: "noport"
        });
        m.appendTo(a),
        c.appendTo(l),
        a.appendTo(s),
        l.appendTo(r),
        o.appendTo($("#svg-container")),
        n.appendTo($("#svg-container")),
        s.appendTo($("#svg-container")),
        r.appendTo($("#svg-container"))
    } else {
        var s = $("<svg>").attr({
            width: worldwidth,
            height: worldheight,
            id: "port"
        })
          , r = $("<svg>").attr({
            width: worldwidth,
            height: worldheight,
            id: "noport"
        });
        s.appendTo($("#svg-container")),
        r.appendTo($("#svg-container"))
    }
    $(".worldsize").css({
        width: worldwidth,
        height: worldheight
    }),
    $("#b-container").width($("#world")[0].getBoundingClientRect().width),
    hyu(location.pathname) == ab("a3ZwyU5lW2fnW2rjzg5mbE1q") && $("#marker2").css("background", "url(assets/metal.jpg) left bottom repeat")
}
function selectBird(t) {
    if (!birds[t].hasClass("selected")) {
        for (var e = 0; e < birds.length; e++)
            t != e && birds[e].hasClass("selected") && birds[e].removeClass("selected");
        birds[t].addClass("selected"),
        launch && launch.setColor(t),
        (nl = Am).prototype.color = t
    }
}
function undo() {
    var t = void 0 !== theBird[0] && !theBird[0].stat && theBird[0].dead === !1
      , e = void 0 !== theBird[1] && !theBird[1].stat && theBird[1].dead === !1;
    if (t || e)
        return t && (theBird[0].dead = !0),
        void (e && (theBird[1].dead = !0));
    if (0 === portalSteps.length)
        return void new Android_Toast({
            content: "Nothing to undo."
        });
    var i = portalSteps.pop()
      , o = void 0 !== i[0]
      , n = void 0 !== i[1]
      , s = o && n;
    Aa.prototype.portals[0] && (Aa.prototype.portals[0].dead = !0,
    Aa.prototype.portals[0] = void 0),
    Aa.prototype.portals[1] && (Aa.prototype.portals[1].dead = !0,
    Aa.prototype.portals[1] = void 0),
    Aa.active = !1,
    o && new Aa(i[0].x,i[0].y,i[0].normal,i[0].color,s),
    n && new Aa(i[1].x,i[1].y,i[1].normal,i[1].color,s)
}
function fi() {
    if (0 === Aw.number)
        for (var t = 0; t < Ay.list.length; t++)
            Ay.list[t].fi()
}
function whir() {
    whirAudio.play()
}
function oink() {
    1 == Math.round(Math.random()) ? oinkAudio1.play() : oinkAudio2.play()
}
function quack() {
    quackAudio1.play()
}
function swip() {
    swipAudio.play()
}
function squeal() {
    squealAudio.play()
}
function transform() {
    transformAudio.play()
}
!function(t, e) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = t.document ? e(t, !0) : function(t) {
        if (!t.document)
            throw new Error("jQuery requires a window with a document");
        return e(t)
    }
    : e(t)
}("undefined" != typeof window ? window : this, function(t, e) {
    function i(t) {
        var e = !!t && "length"in t && t.length
          , i = pt.type(t);
        return "function" === i || pt.isWindow(t) ? !1 : "array" === i || 0 === e || "number" == typeof e && e > 0 && e - 1 in t
    }
    function o(t, e, i) {
        if (pt.isFunction(e))
            return pt.grep(t, function(t, o) {
                return !!e.call(t, o, t) !== i
            });
        if (e.nodeType)
            return pt.grep(t, function(t) {
                return t === e !== i
            });
        if ("string" == typeof e) {
            if (Ct.test(e))
                return pt.filter(e, t, i);
            e = pt.filter(e, t)
        }
        return pt.grep(t, function(t) {
            return pt.inArray(t, e) > -1 !== i
        })
    }
    function n(t, e) {
        do
            t = t[e];
        while (t && 1 !== t.nodeType);return t
    }
    function s(t) {
        var e = {};
        return pt.each(t.match(Vt) || [], function(t, i) {
            e[i] = !0
        }),
        e
    }
    function r() {
        ot.addEventListener ? (ot.removeEventListener("DOMContentLoaded", a),
        t.removeEventListener("load", a)) : (ot.detachEvent("onreadystatechange", a),
        t.detachEvent("onload", a))
    }
    function a() {
        (ot.addEventListener || "load" === t.event.type || "complete" === ot.readyState) && (r(),
        pt.ready())
    }
    function l(t, e, i) {
        if (void 0 === i && 1 === t.nodeType) {
            var o = "data-" + e.replace(Ft, "-$1").toLowerCase();
            if (i = t.getAttribute(o),
            "string" == typeof i) {
                try {
                    i = "true" === i ? !0 : "false" === i ? !1 : "null" === i ? null : +i + "" === i ? +i : Gt.test(i) ? pt.parseJSON(i) : i
                } catch (n) {}
                pt.data(t, e, i)
            } else
                i = void 0
        }
        return i
    }
    function m(t) {
        var e;
        for (e in t)
            if (("data" !== e || !pt.isEmptyObject(t[e])) && "toJSON" !== e)
                return !1;
        return !0
    }
    function c(t, e, i, o) {
        if (Lt(t)) {
            var n, s, r = pt.expando, a = t.nodeType, l = a ? pt.cache : t, m = a ? t[r] : t[r] && r;
            if (m && l[m] && (o || l[m].data) || void 0 !== i || "string" != typeof e)
                return m || (m = a ? t[r] = it.pop() || pt.guid++ : r),
                l[m] || (l[m] = a ? {} : {
                    toJSON: pt.noop
                }),
                "object" != typeof e && "function" != typeof e || (o ? l[m] = pt.extend(l[m], e) : l[m].data = pt.extend(l[m].data, e)),
                s = l[m],
                o || (s.data || (s.data = {}),
                s = s.data),
                void 0 !== i && (s[pt.camelCase(e)] = i),
                "string" == typeof e ? (n = s[e],
                null == n && (n = s[pt.camelCase(e)])) : n = s,
                n
        }
    }
    function h(t, e, i) {
        if (Lt(t)) {
            var o, n, s = t.nodeType, r = s ? pt.cache : t, a = s ? t[pt.expando] : pt.expando;
            if (r[a]) {
                if (e && (o = i ? r[a] : r[a].data)) {
                    pt.isArray(e) ? e = e.concat(pt.map(e, pt.camelCase)) : e in o ? e = [e] : (e = pt.camelCase(e),
                    e = e in o ? [e] : e.split(" ")),
                    n = e.length;
                    for (; n--; )
                        delete o[e[n]];
                    if (i ? !m(o) : !pt.isEmptyObject(o))
                        return
                }
                (i || (delete r[a].data,
                m(r[a]))) && (s ? pt.cleanData([t], !0) : ht.deleteExpando || r != r.window ? delete r[a] : r[a] = void 0)
            }
        }
    }
    function u(t, e, i, o) {
        var n, s = 1, r = 20, a = o ? function() {
            return o.cur()
        }
        : function() {
            return pt.css(t, e, "")
        }
        , l = a(), m = i && i[3] || (pt.cssNumber[e] ? "" : "px"), c = (pt.cssNumber[e] || "px" !== m && +l) && Jt.exec(pt.css(t, e));
        if (c && c[3] !== m) {
            m = m || c[3],
            i = i || [],
            c = +l || 1;
            do
                s = s || ".5",
                c /= s,
                pt.style(t, e, c + m);
            while (s !== (s = a() / l) && 1 !== s && --r)
        }
        return i && (c = +c || +l || 0,
        n = i[1] ? c + (i[1] + 1) * i[2] : +i[2],
        o && (o.unit = m,
        o.start = c,
        o.end = n)),
        n
    }
    function p(t) {
        var e = Ot.split("|")
          , i = t.createDocumentFragment();
        if (i.createElement)
            for (; e.length; )
                i.createElement(e.pop());
        return i
    }
    function y(t, e) {
        var i, o, n = 0, s = "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e || "*") : "undefined" != typeof t.querySelectorAll ? t.querySelectorAll(e || "*") : void 0;
        if (!s)
            for (s = [],
            i = t.childNodes || t; null != (o = i[n]); n++)
                !e || pt.nodeName(o, e) ? s.push(o) : pt.merge(s, y(o, e));
        return void 0 === e || e && pt.nodeName(t, e) ? pt.merge([t], s) : s
    }
    function _(t, e) {
        for (var i, o = 0; null != (i = t[o]); o++)
            pt._data(i, "globalEval", !e || pt._data(e[o], "globalEval"))
    }
    function d(t) {
        Nt.test(t.type) && (t.defaultChecked = t.checked)
    }
    function f(t, e, i, o, n) {
        for (var s, r, a, l, m, c, h, u = t.length, f = p(e), x = [], b = 0; u > b; b++)
            if (r = t[b],
            r || 0 === r)
                if ("object" === pt.type(r))
                    pt.merge(x, r.nodeType ? [r] : r);
                else if (Ut.test(r)) {
                    for (l = l || f.appendChild(e.createElement("div")),
                    m = (jt.exec(r) || ["", ""])[1].toLowerCase(),
                    h = Wt[m] || Wt._default,
                    l.innerHTML = h[1] + pt.htmlPrefilter(r) + h[2],
                    s = h[0]; s--; )
                        l = l.lastChild;
                    if (!ht.leadingWhitespace && qt.test(r) && x.push(e.createTextNode(qt.exec(r)[0])),
                    !ht.tbody)
                        for (r = "table" !== m || Ht.test(r) ? "<table>" !== h[1] || Ht.test(r) ? 0 : l : l.firstChild,
                        s = r && r.childNodes.length; s--; )
                            pt.nodeName(c = r.childNodes[s], "tbody") && !c.childNodes.length && r.removeChild(c);
                    for (pt.merge(x, l.childNodes),
                    l.textContent = ""; l.firstChild; )
                        l.removeChild(l.firstChild);
                    l = f.lastChild
                } else
                    x.push(e.createTextNode(r));
        for (l && f.removeChild(l),
        ht.appendChecked || pt.grep(y(x, "input"), d),
        b = 0; r = x[b++]; )
            if (o && pt.inArray(r, o) > -1)
                n && n.push(r);
            else if (a = pt.contains(r.ownerDocument, r),
            l = y(f.appendChild(r), "script"),
            a && _(l),
            i)
                for (s = 0; r = l[s++]; )
                    zt.test(r.type || "") && i.push(r);
        return l = null,
        f
    }
    function x() {
        return !0
    }
    function b() {
        return !1
    }
    function v() {
        try {
            return ot.activeElement
        } catch (t) {}
    }
    function g(t, e, i, o, n, s) {
        var r, a;
        if ("object" == typeof e) {
            "string" != typeof i && (o = o || i,
            i = void 0);
            for (a in e)
                g(t, a, i, o, e[a], s);
            return t
        }
        if (null == o && null == n ? (n = i,
        o = i = void 0) : null == n && ("string" == typeof i ? (n = o,
        o = void 0) : (n = o,
        o = i,
        i = void 0)),
        n === !1)
            n = b;
        else if (!n)
            return t;
        return 1 === s && (r = n,
        n = function(t) {
            return pt().off(t),
            r.apply(this, arguments)
        }
        ,
        n.guid = r.guid || (r.guid = pt.guid++)),
        t.each(function() {
            pt.event.add(this, e, n, o, i)
        })
    }
    function D(t, e) {
        return pt.nodeName(t, "table") && pt.nodeName(11 !== e.nodeType ? e : e.firstChild, "tr") ? t.getElementsByTagName("tbody")[0] || t.appendChild(t.ownerDocument.createElement("tbody")) : t
    }
    function C(t) {
        return t.type = (null !== pt.find.attr(t, "type")) + "/" + t.type,
        t
    }
    function B(t) {
        var e = ne.exec(t.type);
        return e ? t.type = e[1] : t.removeAttribute("type"),
        t
    }
    function w(t, e) {
        if (1 === e.nodeType && pt.hasData(t)) {
            var i, o, n, s = pt._data(t), r = pt._data(e, s), a = s.events;
            if (a) {
                delete r.handle,
                r.events = {};
                for (i in a)
                    for (o = 0,
                    n = a[i].length; n > o; o++)
                        pt.event.add(e, i, a[i][o])
            }
            r.data && (r.data = pt.extend({}, r.data))
        }
    }
    function A(t, e) {
        var i, o, n;
        if (1 === e.nodeType) {
            if (i = e.nodeName.toLowerCase(),
            !ht.noCloneEvent && e[pt.expando]) {
                n = pt._data(e);
                for (o in n.events)
                    pt.removeEvent(e, o, n.handle);
                e.removeAttribute(pt.expando)
            }
            "script" === i && e.text !== t.text ? (C(e).text = t.text,
            B(e)) : "object" === i ? (e.parentNode && (e.outerHTML = t.outerHTML),
            ht.html5Clone && t.innerHTML && !pt.trim(e.innerHTML) && (e.innerHTML = t.innerHTML)) : "input" === i && Nt.test(t.type) ? (e.defaultChecked = e.checked = t.checked,
            e.value !== t.value && (e.value = t.value)) : "option" === i ? e.defaultSelected = e.selected = t.defaultSelected : "input" !== i && "textarea" !== i || (e.defaultValue = t.defaultValue)
        }
    }
    function S(t, e, i, o) {
        e = st.apply([], e);
        var n, s, r, a, l, m, c = 0, h = t.length, u = h - 1, p = e[0], _ = pt.isFunction(p);
        if (_ || h > 1 && "string" == typeof p && !ht.checkClone && oe.test(p))
            return t.each(function(n) {
                var s = t.eq(n);
                _ && (e[0] = p.call(this, n, s.html())),
                S(s, e, i, o)
            });
        if (h && (m = f(e, t[0].ownerDocument, !1, t, o),
        n = m.firstChild,
        1 === m.childNodes.length && (m = n),
        n || o)) {
            for (a = pt.map(y(m, "script"), C),
            r = a.length; h > c; c++)
                s = m,
                c !== u && (s = pt.clone(s, !0, !0),
                r && pt.merge(a, y(s, "script"))),
                i.call(t[c], s, c);
            if (r)
                for (l = a[a.length - 1].ownerDocument,
                pt.map(a, B),
                c = 0; r > c; c++)
                    s = a[c],
                    zt.test(s.type || "") && !pt._data(s, "globalEval") && pt.contains(l, s) && (s.src ? pt._evalUrl && pt._evalUrl(s.src) : pt.globalEval((s.text || s.textContent || s.innerHTML || "").replace(se, "")));
            m = n = null
        }
        return t
    }
    function M(t, e, i) {
        for (var o, n = e ? pt.filter(e, t) : t, s = 0; null != (o = n[s]); s++)
            i || 1 !== o.nodeType || pt.cleanData(y(o)),
            o.parentNode && (i && pt.contains(o.ownerDocument, o) && _(y(o, "script")),
            o.parentNode.removeChild(o));
        return t
    }
    function V(t, e) {
        var i = pt(e.createElement(t)).appendTo(e.body)
          , o = pt.css(i[0], "display");
        return i.detach(),
        o
    }
    function I(t) {
        var e = ot
          , i = me[t];
        return i || (i = V(t, e),
        "none" !== i && i || (le = (le || pt("<iframe frameborder='0' width='0' height='0'/>")).appendTo(e.documentElement),
        e = (le[0].contentWindow || le[0].contentDocument).document,
        e.write(),
        e.close(),
        i = V(t, e),
        le.detach()),
        me[t] = i),
        i
    }
    function T(t, e) {
        return {
            get: function() {
                return t() ? void delete this.get : (this.get = e).apply(this, arguments)
            }
        }
    }
    function L(t) {
        if (t in Be)
            return t;
        for (var e = t.charAt(0).toUpperCase() + t.slice(1), i = Ce.length; i--; )
            if (t = Ce[i] + e,
            t in Be)
                return t
    }
    function G(t, e) {
        for (var i, o, n, s = [], r = 0, a = t.length; a > r; r++)
            o = t[r],
            o.style && (s[r] = pt._data(o, "olddisplay"),
            i = o.style.display,
            e ? (s[r] || "none" !== i || (o.style.display = ""),
            "" === o.style.display && Rt(o) && (s[r] = pt._data(o, "olddisplay", I(o.nodeName)))) : (n = Rt(o),
            (i && "none" !== i || !n) && pt._data(o, "olddisplay", n ? i : pt.css(o, "display"))));
        for (r = 0; a > r; r++)
            o = t[r],
            o.style && (e && "none" !== o.style.display && "" !== o.style.display || (o.style.display = e ? s[r] || "" : "none"));
        return t
    }
    function F(t, e, i) {
        var o = ve.exec(e);
        return o ? Math.max(0, o[1] - (i || 0)) + (o[2] || "px") : e
    }
    function P(t, e, i, o, n) {
        for (var s = i === (o ? "border" : "content") ? 4 : "width" === e ? 1 : 0, r = 0; 4 > s; s += 2)
            "margin" === i && (r += pt.css(t, i + Et[s], !0, n)),
            o ? ("content" === i && (r -= pt.css(t, "padding" + Et[s], !0, n)),
            "margin" !== i && (r -= pt.css(t, "border" + Et[s] + "Width", !0, n))) : (r += pt.css(t, "padding" + Et[s], !0, n),
            "padding" !== i && (r += pt.css(t, "border" + Et[s] + "Width", !0, n)));
        return r
    }
    function J(t, e, i) {
        var o = !0
          , n = "width" === e ? t.offsetWidth : t.offsetHeight
          , s = ye(t)
          , r = ht.boxSizing && "border-box" === pt.css(t, "boxSizing", !1, s);
        if (0 >= n || null == n) {
            if (n = _e(t, e, s),
            (0 > n || null == n) && (n = t.style[e]),
            he.test(n))
                return n;
            o = r && (ht.boxSizingReliable() || n === t.style[e]),
            n = parseFloat(n) || 0
        }
        return n + P(t, e, i || (r ? "border" : "content"), o, s) + "px"
    }
    function E(t, e, i, o, n) {
        return new E.prototype.init(t,e,i,o,n)
    }
    function R() {
        return t.setTimeout(function() {
            we = void 0
        }),
        we = pt.now()
    }
    function k(t, e) {
        var i, o = {
            height: t
        }, n = 0;
        for (e = e ? 1 : 0; 4 > n; n += 2 - e)
            i = Et[n],
            o["margin" + i] = o["padding" + i] = t;
        return e && (o.opacity = o.width = t),
        o
    }
    function N(t, e, i) {
        for (var o, n = (q.tweeners[e] || []).concat(q.tweeners["*"]), s = 0, r = n.length; r > s; s++)
            if (o = n[s].call(i, e, t))
                return o
    }
    function j(t, e, i) {
        var o, n, s, r, a, l, m, c, h = this, u = {}, p = t.style, y = t.nodeType && Rt(t), _ = pt._data(t, "fxshow");
        i.queue || (a = pt._queueHooks(t, "fx"),
        null == a.unqueued && (a.unqueued = 0,
        l = a.empty.fire,
        a.empty.fire = function() {
            a.unqueued || l()
        }
        ),
        a.unqueued++,
        h.always(function() {
            h.always(function() {
                a.unqueued--,
                pt.queue(t, "fx").length || a.empty.fire()
            })
        })),
        1 === t.nodeType && ("height"in e || "width"in e) && (i.overflow = [p.overflow, p.overflowX, p.overflowY],
        m = pt.css(t, "display"),
        c = "none" === m ? pt._data(t, "olddisplay") || I(t.nodeName) : m,
        "inline" === c && "none" === pt.css(t, "float") && (ht.inlineBlockNeedsLayout && "inline" !== I(t.nodeName) ? p.zoom = 1 : p.display = "inline-block")),
        i.overflow && (p.overflow = "hidden",
        ht.shrinkWrapBlocks() || h.always(function() {
            p.overflow = i.overflow[0],
            p.overflowX = i.overflow[1],
            p.overflowY = i.overflow[2]
        }));
        for (o in e)
            if (n = e[o],
            Se.exec(n)) {
                if (delete e[o],
                s = s || "toggle" === n,
                n === (y ? "hide" : "show")) {
                    if ("show" !== n || !_ || void 0 === _[o])
                        continue;
                    y = !0
                }
                u[o] = _ && _[o] || pt.style(t, o)
            } else
                m = void 0;
        if (pt.isEmptyObject(u))
            "inline" === ("none" === m ? I(t.nodeName) : m) && (p.display = m);
        else {
            _ ? "hidden"in _ && (y = _.hidden) : _ = pt._data(t, "fxshow", {}),
            s && (_.hidden = !y),
            y ? pt(t).show() : h.done(function() {
                pt(t).hide()
            }),
            h.done(function() {
                var e;
                pt._removeData(t, "fxshow");
                for (e in u)
                    pt.style(t, e, u[e])
            });
            for (o in u)
                r = N(y ? _[o] : 0, o, h),
                o in _ || (_[o] = r.start,
                y && (r.end = r.start,
                r.start = "width" === o || "height" === o ? 1 : 0))
        }
    }
    function z(t, e) {
        var i, o, n, s, r;
        for (i in t)
            if (o = pt.camelCase(i),
            n = e[o],
            s = t[i],
            pt.isArray(s) && (n = s[1],
            s = t[i] = s[0]),
            i !== o && (t[o] = s,
            delete t[i]),
            r = pt.cssHooks[o],
            r && "expand"in r) {
                s = r.expand(s),
                delete t[o];
                for (i in s)
                    i in t || (t[i] = s[i],
                    e[i] = n)
            } else
                e[o] = n
    }
    function q(t, e, i) {
        var o, n, s = 0, r = q.prefilters.length, a = pt.Deferred().always(function() {
            delete l.elem
        }), l = function() {
            if (n)
                return !1;
            for (var e = we || R(), i = Math.max(0, m.startTime + m.duration - e), o = i / m.duration || 0, s = 1 - o, r = 0, l = m.tweens.length; l > r; r++)
                m.tweens[r].run(s);
            return a.notifyWith(t, [m, s, i]),
            1 > s && l ? i : (a.resolveWith(t, [m]),
            !1)
        }, m = a.promise({
            elem: t,
            props: pt.extend({}, e),
            opts: pt.extend(!0, {
                specialEasing: {},
                easing: pt.easing._default
            }, i),
            originalProperties: e,
            originalOptions: i,
            startTime: we || R(),
            duration: i.duration,
            tweens: [],
            createTween: function(e, i) {
                var o = pt.Tween(t, m.opts, e, i, m.opts.specialEasing[e] || m.opts.easing);
                return m.tweens.push(o),
                o
            },
            stop: function(e) {
                var i = 0
                  , o = e ? m.tweens.length : 0;
                if (n)
                    return this;
                for (n = !0; o > i; i++)
                    m.tweens[i].run(1);
                return e ? (a.notifyWith(t, [m, 1, 0]),
                a.resolveWith(t, [m, e])) : a.rejectWith(t, [m, e]),
                this
            }
        }), c = m.props;
        for (z(c, m.opts.specialEasing); r > s; s++)
            if (o = q.prefilters[s].call(m, t, c, m.opts))
                return pt.isFunction(o.stop) && (pt._queueHooks(m.elem, m.opts.queue).stop = pt.proxy(o.stop, o)),
                o;
        return pt.map(c, N, m),
        pt.isFunction(m.opts.start) && m.opts.start.call(t, m),
        pt.fx.timer(pt.extend(l, {
            elem: t,
            anim: m,
            queue: m.opts.queue
        })),
        m.progress(m.opts.progress).done(m.opts.done, m.opts.complete).fail(m.opts.fail).always(m.opts.always)
    }
    function O(t) {
        return pt.attr(t, "class") || ""
    }
    function W(t) {
        return function(e, i) {
            "string" != typeof e && (i = e,
            e = "*");
            var o, n = 0, s = e.toLowerCase().match(Vt) || [];
            if (pt.isFunction(i))
                for (; o = s[n++]; )
                    "+" === o.charAt(0) ? (o = o.slice(1) || "*",
                    (t[o] = t[o] || []).unshift(i)) : (t[o] = t[o] || []).push(i)
        }
    }
    function U(t, e, i, o) {
        function n(a) {
            var l;
            return s[a] = !0,
            pt.each(t[a] || [], function(t, a) {
                var m = a(e, i, o);
                return "string" != typeof m || r || s[m] ? r ? !(l = m) : void 0 : (e.dataTypes.unshift(m),
                n(m),
                !1)
            }),
            l
        }
        var s = {}
          , r = t === Ye;
        return n(e.dataTypes[0]) || !s["*"] && n("*")
    }
    function H(t, e) {
        var i, o, n = pt.ajaxSettings.flatOptions || {};
        for (o in e)
            void 0 !== e[o] && ((n[o] ? t : i || (i = {}))[o] = e[o]);
        return i && pt.extend(!0, t, i),
        t
    }
    function $(t, e, i) {
        for (var o, n, s, r, a = t.contents, l = t.dataTypes; "*" === l[0]; )
            l.shift(),
            void 0 === n && (n = t.mimeType || e.getResponseHeader("Content-Type"));
        if (n)
            for (r in a)
                if (a[r] && a[r].test(n)) {
                    l.unshift(r);
                    break
                }
        if (l[0]in i)
            s = l[0];
        else {
            for (r in i) {
                if (!l[0] || t.converters[r + " " + l[0]]) {
                    s = r;
                    break
                }
                o || (o = r)
            }
            s = s || o
        }
        return s ? (s !== l[0] && l.unshift(s),
        i[s]) : void 0
    }
    function X(t, e, i, o) {
        var n, s, r, a, l, m = {}, c = t.dataTypes.slice();
        if (c[1])
            for (r in t.converters)
                m[r.toLowerCase()] = t.converters[r];
        for (s = c.shift(); s; )
            if (t.responseFields[s] && (i[t.responseFields[s]] = e),
            !l && o && t.dataFilter && (e = t.dataFilter(e, t.dataType)),
            l = s,
            s = c.shift())
                if ("*" === s)
                    s = l;
                else if ("*" !== l && l !== s) {
                    if (r = m[l + " " + s] || m["* " + s],
                    !r)
                        for (n in m)
                            if (a = n.split(" "),
                            a[1] === s && (r = m[l + " " + a[0]] || m["* " + a[0]])) {
                                r === !0 ? r = m[n] : m[n] !== !0 && (s = a[0],
                                c.unshift(a[1]));
                                break
                            }
                    if (r !== !0)
                        if (r && t["throws"])
                            e = r(e);
                        else
                            try {
                                e = r(e)
                            } catch (h) {
                                return {
                                    state: "parsererror",
                                    error: r ? h : "No conversion from " + l + " to " + s
                                }
                            }
                }
        return {
            state: "success",
            data: e
        }
    }
    function K(t) {
        return t.style && t.style.display || pt.css(t, "display")
    }
    function Z(t) {
        if (!pt.contains(t.ownerDocument || ot, t))
            return !0;
        for (; t && 1 === t.nodeType; ) {
            if ("none" === K(t) || "hidden" === t.type)
                return !0;
            t = t.parentNode
        }
        return !1
    }
    function Y(t, e, i, o) {
        var n;
        if (pt.isArray(e))
            pt.each(e, function(e, n) {
                i || oi.test(t) ? o(t, n) : Y(t + "[" + ("object" == typeof n && null != n ? e : "") + "]", n, i, o)
            });
        else if (i || "object" !== pt.type(e))
            o(t, e);
        else
            for (n in e)
                Y(t + "[" + n + "]", e[n], i, o)
    }
    function Q() {
        try {
            return new t.XMLHttpRequest
        } catch (e) {}
    }
    function tt() {
        try {
            return new t.ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {}
    }
    function et(t) {
        return pt.isWindow(t) ? t : 9 === t.nodeType ? t.defaultView || t.parentWindow : !1
    }
    var it = []
      , ot = t.document
      , nt = it.slice
      , st = it.concat
      , rt = it.push
      , at = it.indexOf
      , lt = {}
      , mt = lt.toString
      , ct = lt.hasOwnProperty
      , ht = {}
      , ut = "1.12.4"
      , pt = function(t, e) {
        return new pt.fn.init(t,e)
    }
      , yt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      , _t = /^-ms-/
      , dt = /-([\da-z])/gi
      , ft = function(t, e) {
        return e.toUpperCase()
    };
    pt.fn = pt.prototype = {
        jquery: ut,
        constructor: pt,
        selector: "",
        length: 0,
        toArray: function() {
            return nt.call(this)
        },
        get: function(t) {
            return null != t ? 0 > t ? this[t + this.length] : this[t] : nt.call(this)
        },
        pushStack: function(t) {
            var e = pt.merge(this.constructor(), t);
            return e.prevObject = this,
            e.context = this.context,
            e
        },
        each: function(t) {
            return pt.each(this, t)
        },
        map: function(t) {
            return this.pushStack(pt.map(this, function(e, i) {
                return t.call(e, i, e)
            }))
        },
        slice: function() {
            return this.pushStack(nt.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(t) {
            var e = this.length
              , i = +t + (0 > t ? e : 0);
            return this.pushStack(i >= 0 && e > i ? [this[i]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: rt,
        sort: it.sort,
        splice: it.splice
    },
    pt.extend = pt.fn.extend = function() {
        var t, e, i, o, n, s, r = arguments[0] || {}, a = 1, l = arguments.length, m = !1;
        for ("boolean" == typeof r && (m = r,
        r = arguments[a] || {},
        a++),
        "object" == typeof r || pt.isFunction(r) || (r = {}),
        a === l && (r = this,
        a--); l > a; a++)
            if (null != (n = arguments[a]))
                for (o in n)
                    t = r[o],
                    i = n[o],
                    r !== i && (m && i && (pt.isPlainObject(i) || (e = pt.isArray(i))) ? (e ? (e = !1,
                    s = t && pt.isArray(t) ? t : []) : s = t && pt.isPlainObject(t) ? t : {},
                    r[o] = pt.extend(m, s, i)) : void 0 !== i && (r[o] = i));
        return r
    }
    ,
    pt.extend({
        expando: "jQuery" + (ut + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(t) {
            throw new Error(t)
        },
        noop: function() {},
        isFunction: function(t) {
            return "function" === pt.type(t)
        },
        isArray: Array.isArray || function(t) {
            return "array" === pt.type(t)
        }
        ,
        isWindow: function(t) {
            return null != t && t == t.window
        },
        isNumeric: function(t) {
            var e = t && t.toString();
            return !pt.isArray(t) && e - parseFloat(e) + 1 >= 0
        },
        isEmptyObject: function(t) {
            var e;
            for (e in t)
                return !1;
            return !0
        },
        isPlainObject: function(t) {
            var e;
            if (!t || "object" !== pt.type(t) || t.nodeType || pt.isWindow(t))
                return !1;
            try {
                if (t.constructor && !ct.call(t, "constructor") && !ct.call(t.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (i) {
                return !1
            }
            if (!ht.ownFirst)
                for (e in t)
                    return ct.call(t, e);
            for (e in t)
                ;
            return void 0 === e || ct.call(t, e)
        },
        type: function(t) {
            return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? lt[mt.call(t)] || "object" : typeof t
        },
        globalEval: function(e) {
            e && pt.trim(e) && (t.execScript || function(e) {
                t.eval.call(t, e)
            }
            )(e)
        },
        camelCase: function(t) {
            return t.replace(_t, "ms-").replace(dt, ft)
        },
        nodeName: function(t, e) {
            return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
        },
        each: function(t, e) {
            var o, n = 0;
            if (i(t))
                for (o = t.length; o > n && e.call(t[n], n, t[n]) !== !1; n++)
                    ;
            else
                for (n in t)
                    if (e.call(t[n], n, t[n]) === !1)
                        break;
            return t
        },
        trim: function(t) {
            return null == t ? "" : (t + "").replace(yt, "")
        },
        makeArray: function(t, e) {
            var o = e || [];
            return null != t && (i(Object(t)) ? pt.merge(o, "string" == typeof t ? [t] : t) : rt.call(o, t)),
            o
        },
        inArray: function(t, e, i) {
            var o;
            if (e) {
                if (at)
                    return at.call(e, t, i);
                for (o = e.length,
                i = i ? 0 > i ? Math.max(0, o + i) : i : 0; o > i; i++)
                    if (i in e && e[i] === t)
                        return i
            }
            return -1
        },
        merge: function(t, e) {
            for (var i = +e.length, o = 0, n = t.length; i > o; )
                t[n++] = e[o++];
            if (i !== i)
                for (; void 0 !== e[o]; )
                    t[n++] = e[o++];
            return t.length = n,
            t
        },
        grep: function(t, e, i) {
            for (var o, n = [], s = 0, r = t.length, a = !i; r > s; s++)
                o = !e(t[s], s),
                o !== a && n.push(t[s]);
            return n
        },
        map: function(t, e, o) {
            var n, s, r = 0, a = [];
            if (i(t))
                for (n = t.length; n > r; r++)
                    s = e(t[r], r, o),
                    null != s && a.push(s);
            else
                for (r in t)
                    s = e(t[r], r, o),
                    null != s && a.push(s);
            return st.apply([], a)
        },
        guid: 1,
        proxy: function(t, e) {
            var i, o, n;
            return "string" == typeof e && (n = t[e],
            e = t,
            t = n),
            pt.isFunction(t) ? (i = nt.call(arguments, 2),
            o = function() {
                return t.apply(e || this, i.concat(nt.call(arguments)))
            }
            ,
            o.guid = t.guid = t.guid || pt.guid++,
            o) : void 0
        },
        now: function() {
            return +new Date
        },
        support: ht
    }),
    "function" == typeof Symbol && (pt.fn[Symbol.iterator] = it[Symbol.iterator]),
    pt.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(t, e) {
        lt["[object " + e + "]"] = e.toLowerCase()
    });
    var xt = function(t) {
        function e(t, e, i, o) {
            var n, s, r, a, l, m, h, p, y = e && e.ownerDocument, _ = e ? e.nodeType : 9;
            if (i = i || [],
            "string" != typeof t || !t || 1 !== _ && 9 !== _ && 11 !== _)
                return i;
            if (!o && ((e ? e.ownerDocument || e : N) !== L && T(e),
            e = e || L,
            F)) {
                if (11 !== _ && (m = ft.exec(t)))
                    if (n = m[1]) {
                        if (9 === _) {
                            if (!(r = e.getElementById(n)))
                                return i;
                            if (r.id === n)
                                return i.push(r),
                                i
                        } else if (y && (r = y.getElementById(n)) && R(e, r) && r.id === n)
                            return i.push(r),
                            i
                    } else {
                        if (m[2])
                            return Y.apply(i, e.getElementsByTagName(t)),
                            i;
                        if ((n = m[3]) && g.getElementsByClassName && e.getElementsByClassName)
                            return Y.apply(i, e.getElementsByClassName(n)),
                            i
                    }
                if (g.qsa && !W[t + " "] && (!P || !P.test(t))) {
                    if (1 !== _)
                        y = e,
                        p = t;
                    else if ("object" !== e.nodeName.toLowerCase()) {
                        for ((a = e.getAttribute("id")) ? a = a.replace(bt, "\\$&") : e.setAttribute("id", a = k),
                        h = w(t),
                        s = h.length,
                        l = ut.test(a) ? "#" + a : "[id='" + a + "']"; s--; )
                            h[s] = l + " " + u(h[s]);
                        p = h.join(","),
                        y = xt.test(t) && c(e.parentNode) || e
                    }
                    if (p)
                        try {
                            return Y.apply(i, y.querySelectorAll(p)),
                            i
                        } catch (d) {} finally {
                            a === k && e.removeAttribute("id")
                        }
                }
            }
            return S(t.replace(at, "$1"), e, i, o)
        }
        function i() {
            function t(i, o) {
                return e.push(i + " ") > D.cacheLength && delete t[e.shift()],
                t[i + " "] = o
            }
            var e = [];
            return t
        }
        function o(t) {
            return t[k] = !0,
            t
        }
        function n(t) {
            var e = L.createElement("div");
            try {
                return !!t(e)
            } catch (i) {
                return !1
            } finally {
                e.parentNode && e.parentNode.removeChild(e),
                e = null
            }
        }
        function s(t, e) {
            for (var i = t.split("|"), o = i.length; o--; )
                D.attrHandle[i[o]] = e
        }
        function r(t, e) {
            var i = e && t
              , o = i && 1 === t.nodeType && 1 === e.nodeType && (~e.sourceIndex || H) - (~t.sourceIndex || H);
            if (o)
                return o;
            if (i)
                for (; i = i.nextSibling; )
                    if (i === e)
                        return -1;
            return t ? 1 : -1
        }
        function a(t) {
            return function(e) {
                var i = e.nodeName.toLowerCase();
                return "input" === i && e.type === t
            }
        }
        function l(t) {
            return function(e) {
                var i = e.nodeName.toLowerCase();
                return ("input" === i || "button" === i) && e.type === t
            }
        }
        function m(t) {
            return o(function(e) {
                return e = +e,
                o(function(i, o) {
                    for (var n, s = t([], i.length, e), r = s.length; r--; )
                        i[n = s[r]] && (i[n] = !(o[n] = i[n]))
                })
            })
        }
        function c(t) {
            return t && "undefined" != typeof t.getElementsByTagName && t
        }
        function h() {}
        function u(t) {
            for (var e = 0, i = t.length, o = ""; i > e; e++)
                o += t[e].value;
            return o
        }
        function p(t, e, i) {
            var o = e.dir
              , n = i && "parentNode" === o
              , s = z++;
            return e.first ? function(e, i, s) {
                for (; e = e[o]; )
                    if (1 === e.nodeType || n)
                        return t(e, i, s)
            }
            : function(e, i, r) {
                var a, l, m, c = [j, s];
                if (r) {
                    for (; e = e[o]; )
                        if ((1 === e.nodeType || n) && t(e, i, r))
                            return !0
                } else
                    for (; e = e[o]; )
                        if (1 === e.nodeType || n) {
                            if (m = e[k] || (e[k] = {}),
                            l = m[e.uniqueID] || (m[e.uniqueID] = {}),
                            (a = l[o]) && a[0] === j && a[1] === s)
                                return c[2] = a[2];
                            if (l[o] = c,
                            c[2] = t(e, i, r))
                                return !0
                        }
            }
        }
        function y(t) {
            return t.length > 1 ? function(e, i, o) {
                for (var n = t.length; n--; )
                    if (!t[n](e, i, o))
                        return !1;
                return !0
            }
            : t[0]
        }
        function _(t, i, o) {
            for (var n = 0, s = i.length; s > n; n++)
                e(t, i[n], o);
            return o
        }
        function d(t, e, i, o, n) {
            for (var s, r = [], a = 0, l = t.length, m = null != e; l > a; a++)
                (s = t[a]) && (i && !i(s, o, n) || (r.push(s),
                m && e.push(a)));
            return r
        }
        function f(t, e, i, n, s, r) {
            return n && !n[k] && (n = f(n)),
            s && !s[k] && (s = f(s, r)),
            o(function(o, r, a, l) {
                var m, c, h, u = [], p = [], y = r.length, f = o || _(e || "*", a.nodeType ? [a] : a, []), x = !t || !o && e ? f : d(f, u, t, a, l), b = i ? s || (o ? t : y || n) ? [] : r : x;
                if (i && i(x, b, a, l),
                n)
                    for (m = d(b, p),
                    n(m, [], a, l),
                    c = m.length; c--; )
                        (h = m[c]) && (b[p[c]] = !(x[p[c]] = h));
                if (o) {
                    if (s || t) {
                        if (s) {
                            for (m = [],
                            c = b.length; c--; )
                                (h = b[c]) && m.push(x[c] = h);
                            s(null, b = [], m, l)
                        }
                        for (c = b.length; c--; )
                            (h = b[c]) && (m = s ? tt(o, h) : u[c]) > -1 && (o[m] = !(r[m] = h))
                    }
                } else
                    b = d(b === r ? b.splice(y, b.length) : b),
                    s ? s(null, r, b, l) : Y.apply(r, b)
            })
        }
        function x(t) {
            for (var e, i, o, n = t.length, s = D.relative[t[0].type], r = s || D.relative[" "], a = s ? 1 : 0, l = p(function(t) {
                return t === e
            }, r, !0), m = p(function(t) {
                return tt(e, t) > -1
            }, r, !0), c = [function(t, i, o) {
                var n = !s && (o || i !== M) || ((e = i).nodeType ? l(t, i, o) : m(t, i, o));
                return e = null,
                n
            }
            ]; n > a; a++)
                if (i = D.relative[t[a].type])
                    c = [p(y(c), i)];
                else {
                    if (i = D.filter[t[a].type].apply(null, t[a].matches),
                    i[k]) {
                        for (o = ++a; n > o && !D.relative[t[o].type]; o++)
                            ;
                        return f(a > 1 && y(c), a > 1 && u(t.slice(0, a - 1).concat({
                            value: " " === t[a - 2].type ? "*" : ""
                        })).replace(at, "$1"), i, o > a && x(t.slice(a, o)), n > o && x(t = t.slice(o)), n > o && u(t))
                    }
                    c.push(i)
                }
            return y(c)
        }
        function b(t, i) {
            var n = i.length > 0
              , s = t.length > 0
              , r = function(o, r, a, l, m) {
                var c, h, u, p = 0, y = "0", _ = o && [], f = [], x = M, b = o || s && D.find.TAG("*", m), v = j += null == x ? 1 : Math.random() || .1, g = b.length;
                for (m && (M = r === L || r || m); y !== g && null != (c = b[y]); y++) {
                    if (s && c) {
                        for (h = 0,
                        r || c.ownerDocument === L || (T(c),
                        a = !F); u = t[h++]; )
                            if (u(c, r || L, a)) {
                                l.push(c);
                                break
                            }
                        m && (j = v)
                    }
                    n && ((c = !u && c) && p--,
                    o && _.push(c))
                }
                if (p += y,
                n && y !== p) {
                    for (h = 0; u = i[h++]; )
                        u(_, f, r, a);
                    if (o) {
                        if (p > 0)
                            for (; y--; )
                                _[y] || f[y] || (f[y] = K.call(l));
                        f = d(f)
                    }
                    Y.apply(l, f),
                    m && !o && f.length > 0 && p + i.length > 1 && e.uniqueSort(l)
                }
                return m && (j = v,
                M = x),
                _
            };
            return n ? o(r) : r
        }
        var v, g, D, C, B, w, A, S, M, V, I, T, L, G, F, P, J, E, R, k = "sizzle" + 1 * new Date, N = t.document, j = 0, z = 0, q = i(), O = i(), W = i(), U = function(t, e) {
            return t === e && (I = !0),
            0
        }, H = 1 << 31, $ = {}.hasOwnProperty, X = [], K = X.pop, Z = X.push, Y = X.push, Q = X.slice, tt = function(t, e) {
            for (var i = 0, o = t.length; o > i; i++)
                if (t[i] === e)
                    return i;
            return -1
        }, et = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", it = "[\\x20\\t\\r\\n\\f]", ot = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", nt = "\\[" + it + "*(" + ot + ")(?:" + it + "*([*^$|!~]?=)" + it + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ot + "))|)" + it + "*\\]", st = ":(" + ot + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + nt + ")*)|.*)\\)|)", rt = new RegExp(it + "+","g"), at = new RegExp("^" + it + "+|((?:^|[^\\\\])(?:\\\\.)*)" + it + "+$","g"), lt = new RegExp("^" + it + "*," + it + "*"), mt = new RegExp("^" + it + "*([>+~]|" + it + ")" + it + "*"), ct = new RegExp("=" + it + "*([^\\]'\"]*?)" + it + "*\\]","g"), ht = new RegExp(st), ut = new RegExp("^" + ot + "$"), pt = {
            ID: new RegExp("^#(" + ot + ")"),
            CLASS: new RegExp("^\\.(" + ot + ")"),
            TAG: new RegExp("^(" + ot + "|[*])"),
            ATTR: new RegExp("^" + nt),
            PSEUDO: new RegExp("^" + st),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + it + "*(even|odd|(([+-]|)(\\d*)n|)" + it + "*(?:([+-]|)" + it + "*(\\d+)|))" + it + "*\\)|)","i"),
            bool: new RegExp("^(?:" + et + ")$","i"),
            needsContext: new RegExp("^" + it + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + it + "*((?:-\\d)?\\d*)" + it + "*\\)|)(?=[^-]|$)","i")
        }, yt = /^(?:input|select|textarea|button)$/i, _t = /^h\d$/i, dt = /^[^{]+\{\s*\[native \w/, ft = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, xt = /[+~]/, bt = /'|\\/g, vt = new RegExp("\\\\([\\da-f]{1,6}" + it + "?|(" + it + ")|.)","ig"), gt = function(t, e, i) {
            var o = "0x" + e - 65536;
            return o !== o || i ? e : 0 > o ? String.fromCharCode(o + 65536) : String.fromCharCode(o >> 10 | 55296, 1023 & o | 56320)
        }, Dt = function() {
            T()
        };
        try {
            Y.apply(X = Q.call(N.childNodes), N.childNodes),
            X[N.childNodes.length].nodeType
        } catch (Ct) {
            Y = {
                apply: X.length ? function(t, e) {
                    Z.apply(t, Q.call(e))
                }
                : function(t, e) {
                    for (var i = t.length, o = 0; t[i++] = e[o++]; )
                        ;
                    t.length = i - 1
                }
            }
        }
        g = e.support = {},
        B = e.isXML = function(t) {
            var e = t && (t.ownerDocument || t).documentElement;
            return e ? "HTML" !== e.nodeName : !1
        }
        ,
        T = e.setDocument = function(t) {
            var e, i, o = t ? t.ownerDocument || t : N;
            return o !== L && 9 === o.nodeType && o.documentElement ? (L = o,
            G = L.documentElement,
            F = !B(L),
            (i = L.defaultView) && i.top !== i && (i.addEventListener ? i.addEventListener("unload", Dt, !1) : i.attachEvent && i.attachEvent("onunload", Dt)),
            g.attributes = n(function(t) {
                return t.className = "i",
                !t.getAttribute("className")
            }),
            g.getElementsByTagName = n(function(t) {
                return t.appendChild(L.createComment("")),
                !t.getElementsByTagName("*").length
            }),
            g.getElementsByClassName = dt.test(L.getElementsByClassName),
            g.getById = n(function(t) {
                return G.appendChild(t).id = k,
                !L.getElementsByName || !L.getElementsByName(k).length
            }),
            g.getById ? (D.find.ID = function(t, e) {
                if ("undefined" != typeof e.getElementById && F) {
                    var i = e.getElementById(t);
                    return i ? [i] : []
                }
            }
            ,
            D.filter.ID = function(t) {
                var e = t.replace(vt, gt);
                return function(t) {
                    return t.getAttribute("id") === e
                }
            }
            ) : (delete D.find.ID,
            D.filter.ID = function(t) {
                var e = t.replace(vt, gt);
                return function(t) {
                    var i = "undefined" != typeof t.getAttributeNode && t.getAttributeNode("id");
                    return i && i.value === e
                }
            }
            ),
            D.find.TAG = g.getElementsByTagName ? function(t, e) {
                return "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t) : g.qsa ? e.querySelectorAll(t) : void 0
            }
            : function(t, e) {
                var i, o = [], n = 0, s = e.getElementsByTagName(t);
                if ("*" === t) {
                    for (; i = s[n++]; )
                        1 === i.nodeType && o.push(i);
                    return o
                }
                return s
            }
            ,
            D.find.CLASS = g.getElementsByClassName && function(t, e) {
                return "undefined" != typeof e.getElementsByClassName && F ? e.getElementsByClassName(t) : void 0
            }
            ,
            J = [],
            P = [],
            (g.qsa = dt.test(L.querySelectorAll)) && (n(function(t) {
                G.appendChild(t).innerHTML = "<a id='" + k + "'></a><select id='" + k + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                t.querySelectorAll("[msallowcapture^='']").length && P.push("[*^$]=" + it + "*(?:''|\"\")"),
                t.querySelectorAll("[selected]").length || P.push("\\[" + it + "*(?:value|" + et + ")"),
                t.querySelectorAll("[id~=" + k + "-]").length || P.push("~="),
                t.querySelectorAll(":checked").length || P.push(":checked"),
                t.querySelectorAll("a#" + k + "+*").length || P.push(".#.+[+~]")
            }),
            n(function(t) {
                var e = L.createElement("input");
                e.setAttribute("type", "hidden"),
                t.appendChild(e).setAttribute("name", "D"),
                t.querySelectorAll("[name=d]").length && P.push("name" + it + "*[*^$|!~]?="),
                t.querySelectorAll(":enabled").length || P.push(":enabled", ":disabled"),
                t.querySelectorAll("*,:x"),
                P.push(",.*:")
            })),
            (g.matchesSelector = dt.test(E = G.matches || G.webkitMatchesSelector || G.mozMatchesSelector || G.oMatchesSelector || G.msMatchesSelector)) && n(function(t) {
                g.disconnectedMatch = E.call(t, "div"),
                E.call(t, "[s!='']:x"),
                J.push("!=", st)
            }),
            P = P.length && new RegExp(P.join("|")),
            J = J.length && new RegExp(J.join("|")),
            e = dt.test(G.compareDocumentPosition),
            R = e || dt.test(G.contains) ? function(t, e) {
                var i = 9 === t.nodeType ? t.documentElement : t
                  , o = e && e.parentNode;
                return t === o || !(!o || 1 !== o.nodeType || !(i.contains ? i.contains(o) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(o)))
            }
            : function(t, e) {
                if (e)
                    for (; e = e.parentNode; )
                        if (e === t)
                            return !0;
                return !1
            }
            ,
            U = e ? function(t, e) {
                if (t === e)
                    return I = !0,
                    0;
                var i = !t.compareDocumentPosition - !e.compareDocumentPosition;
                return i ? i : (i = (t.ownerDocument || t) === (e.ownerDocument || e) ? t.compareDocumentPosition(e) : 1,
                1 & i || !g.sortDetached && e.compareDocumentPosition(t) === i ? t === L || t.ownerDocument === N && R(N, t) ? -1 : e === L || e.ownerDocument === N && R(N, e) ? 1 : V ? tt(V, t) - tt(V, e) : 0 : 4 & i ? -1 : 1)
            }
            : function(t, e) {
                if (t === e)
                    return I = !0,
                    0;
                var i, o = 0, n = t.parentNode, s = e.parentNode, a = [t], l = [e];
                if (!n || !s)
                    return t === L ? -1 : e === L ? 1 : n ? -1 : s ? 1 : V ? tt(V, t) - tt(V, e) : 0;
                if (n === s)
                    return r(t, e);
                for (i = t; i = i.parentNode; )
                    a.unshift(i);
                for (i = e; i = i.parentNode; )
                    l.unshift(i);
                for (; a[o] === l[o]; )
                    o++;
                return o ? r(a[o], l[o]) : a[o] === N ? -1 : l[o] === N ? 1 : 0
            }
            ,
            L) : L
        }
        ,
        e.matches = function(t, i) {
            return e(t, null, null, i)
        }
        ,
        e.matchesSelector = function(t, i) {
            if ((t.ownerDocument || t) !== L && T(t),
            i = i.replace(ct, "='$1']"),
            g.matchesSelector && F && !W[i + " "] && (!J || !J.test(i)) && (!P || !P.test(i)))
                try {
                    var o = E.call(t, i);
                    if (o || g.disconnectedMatch || t.document && 11 !== t.document.nodeType)
                        return o
                } catch (n) {}
            return e(i, L, null, [t]).length > 0
        }
        ,
        e.contains = function(t, e) {
            return (t.ownerDocument || t) !== L && T(t),
            R(t, e)
        }
        ,
        e.attr = function(t, e) {
            (t.ownerDocument || t) !== L && T(t);
            var i = D.attrHandle[e.toLowerCase()]
              , o = i && $.call(D.attrHandle, e.toLowerCase()) ? i(t, e, !F) : void 0;
            return void 0 !== o ? o : g.attributes || !F ? t.getAttribute(e) : (o = t.getAttributeNode(e)) && o.specified ? o.value : null
        }
        ,
        e.error = function(t) {
            throw new Error("Syntax error, unrecognized expression: " + t)
        }
        ,
        e.uniqueSort = function(t) {
            var e, i = [], o = 0, n = 0;
            if (I = !g.detectDuplicates,
            V = !g.sortStable && t.slice(0),
            t.sort(U),
            I) {
                for (; e = t[n++]; )
                    e === t[n] && (o = i.push(n));
                for (; o--; )
                    t.splice(i[o], 1)
            }
            return V = null,
            t
        }
        ,
        C = e.getText = function(t) {
            var e, i = "", o = 0, n = t.nodeType;
            if (n) {
                if (1 === n || 9 === n || 11 === n) {
                    if ("string" == typeof t.textContent)
                        return t.textContent;
                    for (t = t.firstChild; t; t = t.nextSibling)
                        i += C(t)
                } else if (3 === n || 4 === n)
                    return t.nodeValue
            } else
                for (; e = t[o++]; )
                    i += C(e);
            return i
        }
        ,
        D = e.selectors = {
            cacheLength: 50,
            createPseudo: o,
            match: pt,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(t) {
                    return t[1] = t[1].replace(vt, gt),
                    t[3] = (t[3] || t[4] || t[5] || "").replace(vt, gt),
                    "~=" === t[2] && (t[3] = " " + t[3] + " "),
                    t.slice(0, 4)
                },
                CHILD: function(t) {
                    return t[1] = t[1].toLowerCase(),
                    "nth" === t[1].slice(0, 3) ? (t[3] || e.error(t[0]),
                    t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])),
                    t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && e.error(t[0]),
                    t
                },
                PSEUDO: function(t) {
                    var e, i = !t[6] && t[2];
                    return pt.CHILD.test(t[0]) ? null : (t[3] ? t[2] = t[4] || t[5] || "" : i && ht.test(i) && (e = w(i, !0)) && (e = i.indexOf(")", i.length - e) - i.length) && (t[0] = t[0].slice(0, e),
                    t[2] = i.slice(0, e)),
                    t.slice(0, 3))
                }
            },
            filter: {
                TAG: function(t) {
                    var e = t.replace(vt, gt).toLowerCase();
                    return "*" === t ? function() {
                        return !0
                    }
                    : function(t) {
                        return t.nodeName && t.nodeName.toLowerCase() === e
                    }
                },
                CLASS: function(t) {
                    var e = q[t + " "];
                    return e || (e = new RegExp("(^|" + it + ")" + t + "(" + it + "|$)")) && q(t, function(t) {
                        return e.test("string" == typeof t.className && t.className || "undefined" != typeof t.getAttribute && t.getAttribute("class") || "")
                    })
                },
                ATTR: function(t, i, o) {
                    return function(n) {
                        var s = e.attr(n, t);
                        return null == s ? "!=" === i : i ? (s += "",
                        "=" === i ? s === o : "!=" === i ? s !== o : "^=" === i ? o && 0 === s.indexOf(o) : "*=" === i ? o && s.indexOf(o) > -1 : "$=" === i ? o && s.slice(-o.length) === o : "~=" === i ? (" " + s.replace(rt, " ") + " ").indexOf(o) > -1 : "|=" === i ? s === o || s.slice(0, o.length + 1) === o + "-" : !1) : !0
                    }
                },
                CHILD: function(t, e, i, o, n) {
                    var s = "nth" !== t.slice(0, 3)
                      , r = "last" !== t.slice(-4)
                      , a = "of-type" === e;
                    return 1 === o && 0 === n ? function(t) {
                        return !!t.parentNode
                    }
                    : function(e, i, l) {
                        var m, c, h, u, p, y, _ = s !== r ? "nextSibling" : "previousSibling", d = e.parentNode, f = a && e.nodeName.toLowerCase(), x = !l && !a, b = !1;
                        if (d) {
                            if (s) {
                                for (; _; ) {
                                    for (u = e; u = u[_]; )
                                        if (a ? u.nodeName.toLowerCase() === f : 1 === u.nodeType)
                                            return !1;
                                    y = _ = "only" === t && !y && "nextSibling"
                                }
                                return !0
                            }
                            if (y = [r ? d.firstChild : d.lastChild],
                            r && x) {
                                for (u = d,
                                h = u[k] || (u[k] = {}),
                                c = h[u.uniqueID] || (h[u.uniqueID] = {}),
                                m = c[t] || [],
                                p = m[0] === j && m[1],
                                b = p && m[2],
                                u = p && d.childNodes[p]; u = ++p && u && u[_] || (b = p = 0) || y.pop(); )
                                    if (1 === u.nodeType && ++b && u === e) {
                                        c[t] = [j, p, b];
                                        break
                                    }
                            } else if (x && (u = e,
                            h = u[k] || (u[k] = {}),
                            c = h[u.uniqueID] || (h[u.uniqueID] = {}),
                            m = c[t] || [],
                            p = m[0] === j && m[1],
                            b = p),
                            b === !1)
                                for (; (u = ++p && u && u[_] || (b = p = 0) || y.pop()) && ((a ? u.nodeName.toLowerCase() !== f : 1 !== u.nodeType) || !++b || (x && (h = u[k] || (u[k] = {}),
                                c = h[u.uniqueID] || (h[u.uniqueID] = {}),
                                c[t] = [j, b]),
                                u !== e)); )
                                    ;
                            return b -= n,
                            b === o || b % o === 0 && b / o >= 0
                        }
                    }
                },
                PSEUDO: function(t, i) {
                    var n, s = D.pseudos[t] || D.setFilters[t.toLowerCase()] || e.error("unsupported pseudo: " + t);
                    return s[k] ? s(i) : s.length > 1 ? (n = [t, t, "", i],
                    D.setFilters.hasOwnProperty(t.toLowerCase()) ? o(function(t, e) {
                        for (var o, n = s(t, i), r = n.length; r--; )
                            o = tt(t, n[r]),
                            t[o] = !(e[o] = n[r])
                    }) : function(t) {
                        return s(t, 0, n)
                    }
                    ) : s
                }
            },
            pseudos: {
                not: o(function(t) {
                    var e = []
                      , i = []
                      , n = A(t.replace(at, "$1"));
                    return n[k] ? o(function(t, e, i, o) {
                        for (var s, r = n(t, null, o, []), a = t.length; a--; )
                            (s = r[a]) && (t[a] = !(e[a] = s))
                    }) : function(t, o, s) {
                        return e[0] = t,
                        n(e, null, s, i),
                        e[0] = null,
                        !i.pop()
                    }
                }),
                has: o(function(t) {
                    return function(i) {
                        return e(t, i).length > 0
                    }
                }),
                contains: o(function(t) {
                    return t = t.replace(vt, gt),
                    function(e) {
                        return (e.textContent || e.innerText || C(e)).indexOf(t) > -1
                    }
                }),
                lang: o(function(t) {
                    return ut.test(t || "") || e.error("unsupported lang: " + t),
                    t = t.replace(vt, gt).toLowerCase(),
                    function(e) {
                        var i;
                        do
                            if (i = F ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                return i = i.toLowerCase(),
                                i === t || 0 === i.indexOf(t + "-");
                        while ((e = e.parentNode) && 1 === e.nodeType);return !1
                    }
                }),
                target: function(e) {
                    var i = t.location && t.location.hash;
                    return i && i.slice(1) === e.id
                },
                root: function(t) {
                    return t === G
                },
                focus: function(t) {
                    return t === L.activeElement && (!L.hasFocus || L.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
                },
                enabled: function(t) {
                    return t.disabled === !1
                },
                disabled: function(t) {
                    return t.disabled === !0
                },
                checked: function(t) {
                    var e = t.nodeName.toLowerCase();
                    return "input" === e && !!t.checked || "option" === e && !!t.selected
                },
                selected: function(t) {
                    return t.parentNode && t.parentNode.selectedIndex,
                    t.selected === !0
                },
                empty: function(t) {
                    for (t = t.firstChild; t; t = t.nextSibling)
                        if (t.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(t) {
                    return !D.pseudos.empty(t)
                },
                header: function(t) {
                    return _t.test(t.nodeName)
                },
                input: function(t) {
                    return yt.test(t.nodeName)
                },
                button: function(t) {
                    var e = t.nodeName.toLowerCase();
                    return "input" === e && "button" === t.type || "button" === e
                },
                text: function(t) {
                    var e;
                    return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || "text" === e.toLowerCase())
                },
                first: m(function() {
                    return [0]
                }),
                last: m(function(t, e) {
                    return [e - 1]
                }),
                eq: m(function(t, e, i) {
                    return [0 > i ? i + e : i]
                }),
                even: m(function(t, e) {
                    for (var i = 0; e > i; i += 2)
                        t.push(i);
                    return t
                }),
                odd: m(function(t, e) {
                    for (var i = 1; e > i; i += 2)
                        t.push(i);
                    return t
                }),
                lt: m(function(t, e, i) {
                    for (var o = 0 > i ? i + e : i; --o >= 0; )
                        t.push(o);
                    return t
                }),
                gt: m(function(t, e, i) {
                    for (var o = 0 > i ? i + e : i; ++o < e; )
                        t.push(o);
                    return t
                })
            }
        },
        D.pseudos.nth = D.pseudos.eq;
        for (v in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            D.pseudos[v] = a(v);
        for (v in {
            submit: !0,
            reset: !0
        })
            D.pseudos[v] = l(v);
        return h.prototype = D.filters = D.pseudos,
        D.setFilters = new h,
        w = e.tokenize = function(t, i) {
            var o, n, s, r, a, l, m, c = O[t + " "];
            if (c)
                return i ? 0 : c.slice(0);
            for (a = t,
            l = [],
            m = D.preFilter; a; ) {
                o && !(n = lt.exec(a)) || (n && (a = a.slice(n[0].length) || a),
                l.push(s = [])),
                o = !1,
                (n = mt.exec(a)) && (o = n.shift(),
                s.push({
                    value: o,
                    type: n[0].replace(at, " ")
                }),
                a = a.slice(o.length));
                for (r in D.filter)
                    !(n = pt[r].exec(a)) || m[r] && !(n = m[r](n)) || (o = n.shift(),
                    s.push({
                        value: o,
                        type: r,
                        matches: n
                    }),
                    a = a.slice(o.length));
                if (!o)
                    break
            }
            return i ? a.length : a ? e.error(t) : O(t, l).slice(0)
        }
        ,
        A = e.compile = function(t, e) {
            var i, o = [], n = [], s = W[t + " "];
            if (!s) {
                for (e || (e = w(t)),
                i = e.length; i--; )
                    s = x(e[i]),
                    s[k] ? o.push(s) : n.push(s);
                s = W(t, b(n, o)),
                s.selector = t
            }
            return s
        }
        ,
        S = e.select = function(t, e, i, o) {
            var n, s, r, a, l, m = "function" == typeof t && t, h = !o && w(t = m.selector || t);
            if (i = i || [],
            1 === h.length) {
                if (s = h[0] = h[0].slice(0),
                s.length > 2 && "ID" === (r = s[0]).type && g.getById && 9 === e.nodeType && F && D.relative[s[1].type]) {
                    if (e = (D.find.ID(r.matches[0].replace(vt, gt), e) || [])[0],
                    !e)
                        return i;
                    m && (e = e.parentNode),
                    t = t.slice(s.shift().value.length)
                }
                for (n = pt.needsContext.test(t) ? 0 : s.length; n-- && (r = s[n],
                !D.relative[a = r.type]); )
                    if ((l = D.find[a]) && (o = l(r.matches[0].replace(vt, gt), xt.test(s[0].type) && c(e.parentNode) || e))) {
                        if (s.splice(n, 1),
                        t = o.length && u(s),
                        !t)
                            return Y.apply(i, o),
                            i;
                        break
                    }
            }
            return (m || A(t, h))(o, e, !F, i, !e || xt.test(t) && c(e.parentNode) || e),
            i
        }
        ,
        g.sortStable = k.split("").sort(U).join("") === k,
        g.detectDuplicates = !!I,
        T(),
        g.sortDetached = n(function(t) {
            return 1 & t.compareDocumentPosition(L.createElement("div"))
        }),
        n(function(t) {
            return t.innerHTML = "<a href='#'></a>",
            "#" === t.firstChild.getAttribute("href")
        }) || s("type|href|height|width", function(t, e, i) {
            return i ? void 0 : t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2)
        }),
        g.attributes && n(function(t) {
            return t.innerHTML = "<input/>",
            t.firstChild.setAttribute("value", ""),
            "" === t.firstChild.getAttribute("value")
        }) || s("value", function(t, e, i) {
            return i || "input" !== t.nodeName.toLowerCase() ? void 0 : t.defaultValue
        }),
        n(function(t) {
            return null == t.getAttribute("disabled")
        }) || s(et, function(t, e, i) {
            var o;
            return i ? void 0 : t[e] === !0 ? e.toLowerCase() : (o = t.getAttributeNode(e)) && o.specified ? o.value : null
        }),
        e
    }(t);
    pt.find = xt,
    pt.expr = xt.selectors,
    pt.expr[":"] = pt.expr.pseudos,
    pt.uniqueSort = pt.unique = xt.uniqueSort,
    pt.text = xt.getText,
    pt.isXMLDoc = xt.isXML,
    pt.contains = xt.contains;
    var bt = function(t, e, i) {
        for (var o = [], n = void 0 !== i; (t = t[e]) && 9 !== t.nodeType; )
            if (1 === t.nodeType) {
                if (n && pt(t).is(i))
                    break;
                o.push(t)
            }
        return o
    }
      , vt = function(t, e) {
        for (var i = []; t; t = t.nextSibling)
            1 === t.nodeType && t !== e && i.push(t);
        return i
    }
      , gt = pt.expr.match.needsContext
      , Dt = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/
      , Ct = /^.[^:#\[\.,]*$/;
    pt.filter = function(t, e, i) {
        var o = e[0];
        return i && (t = ":not(" + t + ")"),
        1 === e.length && 1 === o.nodeType ? pt.find.matchesSelector(o, t) ? [o] : [] : pt.find.matches(t, pt.grep(e, function(t) {
            return 1 === t.nodeType
        }))
    }
    ,
    pt.fn.extend({
        find: function(t) {
            var e, i = [], o = this, n = o.length;
            if ("string" != typeof t)
                return this.pushStack(pt(t).filter(function() {
                    for (e = 0; n > e; e++)
                        if (pt.contains(o[e], this))
                            return !0
                }));
            for (e = 0; n > e; e++)
                pt.find(t, o[e], i);
            return i = this.pushStack(n > 1 ? pt.unique(i) : i),
            i.selector = this.selector ? this.selector + " " + t : t,
            i
        },
        filter: function(t) {
            return this.pushStack(o(this, t || [], !1))
        },
        not: function(t) {
            return this.pushStack(o(this, t || [], !0))
        },
        is: function(t) {
            return !!o(this, "string" == typeof t && gt.test(t) ? pt(t) : t || [], !1).length
        }
    });
    var Bt, wt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, At = pt.fn.init = function(t, e, i) {
        var o, n;
        if (!t)
            return this;
        if (i = i || Bt,
        "string" == typeof t) {
            if (o = "<" === t.charAt(0) && ">" === t.charAt(t.length - 1) && t.length >= 3 ? [null, t, null] : wt.exec(t),
            !o || !o[1] && e)
                return !e || e.jquery ? (e || i).find(t) : this.constructor(e).find(t);
            if (o[1]) {
                if (e = e instanceof pt ? e[0] : e,
                pt.merge(this, pt.parseHTML(o[1], e && e.nodeType ? e.ownerDocument || e : ot, !0)),
                Dt.test(o[1]) && pt.isPlainObject(e))
                    for (o in e)
                        pt.isFunction(this[o]) ? this[o](e[o]) : this.attr(o, e[o]);
                return this
            }
            if (n = ot.getElementById(o[2]),
            n && n.parentNode) {
                if (n.id !== o[2])
                    return Bt.find(t);
                this.length = 1,
                this[0] = n
            }
            return this.context = ot,
            this.selector = t,
            this
        }
        return t.nodeType ? (this.context = this[0] = t,
        this.length = 1,
        this) : pt.isFunction(t) ? "undefined" != typeof i.ready ? i.ready(t) : t(pt) : (void 0 !== t.selector && (this.selector = t.selector,
        this.context = t.context),
        pt.makeArray(t, this))
    }
    ;
    At.prototype = pt.fn,
    Bt = pt(ot);
    var St = /^(?:parents|prev(?:Until|All))/
      , Mt = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    pt.fn.extend({
        has: function(t) {
            var e, i = pt(t, this), o = i.length;
            return this.filter(function() {
                for (e = 0; o > e; e++)
                    if (pt.contains(this, i[e]))
                        return !0
            })
        },
        closest: function(t, e) {
            for (var i, o = 0, n = this.length, s = [], r = gt.test(t) || "string" != typeof t ? pt(t, e || this.context) : 0; n > o; o++)
                for (i = this[o]; i && i !== e; i = i.parentNode)
                    if (i.nodeType < 11 && (r ? r.index(i) > -1 : 1 === i.nodeType && pt.find.matchesSelector(i, t))) {
                        s.push(i);
                        break
                    }
            return this.pushStack(s.length > 1 ? pt.uniqueSort(s) : s)
        },
        index: function(t) {
            return t ? "string" == typeof t ? pt.inArray(this[0], pt(t)) : pt.inArray(t.jquery ? t[0] : t, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(t, e) {
            return this.pushStack(pt.uniqueSort(pt.merge(this.get(), pt(t, e))))
        },
        addBack: function(t) {
            return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
        }
    }),
    pt.each({
        parent: function(t) {
            var e = t.parentNode;
            return e && 11 !== e.nodeType ? e : null
        },
        parents: function(t) {
            return bt(t, "parentNode")
        },
        parentsUntil: function(t, e, i) {
            return bt(t, "parentNode", i)
        },
        next: function(t) {
            return n(t, "nextSibling")
        },
        prev: function(t) {
            return n(t, "previousSibling")
        },
        nextAll: function(t) {
            return bt(t, "nextSibling")
        },
        prevAll: function(t) {
            return bt(t, "previousSibling")
        },
        nextUntil: function(t, e, i) {
            return bt(t, "nextSibling", i)
        },
        prevUntil: function(t, e, i) {
            return bt(t, "previousSibling", i)
        },
        siblings: function(t) {
            return vt((t.parentNode || {}).firstChild, t)
        },
        children: function(t) {
            return vt(t.firstChild)
        },
        contents: function(t) {
            return pt.nodeName(t, "iframe") ? t.contentDocument || t.contentWindow.document : pt.merge([], t.childNodes)
        }
    }, function(t, e) {
        pt.fn[t] = function(i, o) {
            var n = pt.map(this, e, i);
            return "Until" !== t.slice(-5) && (o = i),
            o && "string" == typeof o && (n = pt.filter(o, n)),
            this.length > 1 && (Mt[t] || (n = pt.uniqueSort(n)),
            St.test(t) && (n = n.reverse())),
            this.pushStack(n)
        }
    });
    var Vt = /\S+/g;
    pt.Callbacks = function(t) {
        t = "string" == typeof t ? s(t) : pt.extend({}, t);
        var e, i, o, n, r = [], a = [], l = -1, m = function() {
            for (n = t.once,
            o = e = !0; a.length; l = -1)
                for (i = a.shift(); ++l < r.length; )
                    r[l].apply(i[0], i[1]) === !1 && t.stopOnFalse && (l = r.length,
                    i = !1);
            t.memory || (i = !1),
            e = !1,
            n && (r = i ? [] : "")
        }, c = {
            add: function() {
                return r && (i && !e && (l = r.length - 1,
                a.push(i)),
                function o(e) {
                    pt.each(e, function(e, i) {
                        pt.isFunction(i) ? t.unique && c.has(i) || r.push(i) : i && i.length && "string" !== pt.type(i) && o(i)
                    })
                }(arguments),
                i && !e && m()),
                this
            },
            remove: function() {
                return pt.each(arguments, function(t, e) {
                    for (var i; (i = pt.inArray(e, r, i)) > -1; )
                        r.splice(i, 1),
                        l >= i && l--
                }),
                this
            },
            has: function(t) {
                return t ? pt.inArray(t, r) > -1 : r.length > 0
            },
            empty: function() {
                return r && (r = []),
                this
            },
            disable: function() {
                return n = a = [],
                r = i = "",
                this
            },
            disabled: function() {
                return !r
            },
            lock: function() {
                return n = !0,
                i || c.disable(),
                this
            },
            locked: function() {
                return !!n
            },
            fireWith: function(t, i) {
                return n || (i = i || [],
                i = [t, i.slice ? i.slice() : i],
                a.push(i),
                e || m()),
                this
            },
            fire: function() {
                return c.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!o
            }
        };
        return c
    }
    ,
    pt.extend({
        Deferred: function(t) {
            var e = [["resolve", "done", pt.Callbacks("once memory"), "resolved"], ["reject", "fail", pt.Callbacks("once memory"), "rejected"], ["notify", "progress", pt.Callbacks("memory")]]
              , i = "pending"
              , o = {
                state: function() {
                    return i
                },
                always: function() {
                    return n.done(arguments).fail(arguments),
                    this
                },
                then: function() {
                    var t = arguments;
                    return pt.Deferred(function(i) {
                        pt.each(e, function(e, s) {
                            var r = pt.isFunction(t[e]) && t[e];
                            n[s[1]](function() {
                                var t = r && r.apply(this, arguments);
                                t && pt.isFunction(t.promise) ? t.promise().progress(i.notify).done(i.resolve).fail(i.reject) : i[s[0] + "With"](this === o ? i.promise() : this, r ? [t] : arguments)
                            })
                        }),
                        t = null
                    }).promise()
                },
                promise: function(t) {
                    return null != t ? pt.extend(t, o) : o
                }
            }
              , n = {};
            return o.pipe = o.then,
            pt.each(e, function(t, s) {
                var r = s[2]
                  , a = s[3];
                o[s[1]] = r.add,
                a && r.add(function() {
                    i = a
                }, e[1 ^ t][2].disable, e[2][2].lock),
                n[s[0]] = function() {
                    return n[s[0] + "With"](this === n ? o : this, arguments),
                    this
                }
                ,
                n[s[0] + "With"] = r.fireWith
            }),
            o.promise(n),
            t && t.call(n, n),
            n
        },
        when: function(t) {
            var e, i, o, n = 0, s = nt.call(arguments), r = s.length, a = 1 !== r || t && pt.isFunction(t.promise) ? r : 0, l = 1 === a ? t : pt.Deferred(), m = function(t, i, o) {
                return function(n) {
                    i[t] = this,
                    o[t] = arguments.length > 1 ? nt.call(arguments) : n,
                    o === e ? l.notifyWith(i, o) : --a || l.resolveWith(i, o)
                }
            };
            if (r > 1)
                for (e = new Array(r),
                i = new Array(r),
                o = new Array(r); r > n; n++)
                    s[n] && pt.isFunction(s[n].promise) ? s[n].promise().progress(m(n, i, e)).done(m(n, o, s)).fail(l.reject) : --a;
            return a || l.resolveWith(o, s),
            l.promise()
        }
    });
    var It;
    pt.fn.ready = function(t) {
        return pt.ready.promise().done(t),
        this
    }
    ,
    pt.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(t) {
            t ? pt.readyWait++ : pt.ready(!0)
        },
        ready: function(t) {
            (t === !0 ? --pt.readyWait : pt.isReady) || (pt.isReady = !0,
            t !== !0 && --pt.readyWait > 0 || (It.resolveWith(ot, [pt]),
            pt.fn.triggerHandler && (pt(ot).triggerHandler("ready"),
            pt(ot).off("ready"))))
        }
    }),
    pt.ready.promise = function(e) {
        if (!It)
            if (It = pt.Deferred(),
            "complete" === ot.readyState || "loading" !== ot.readyState && !ot.documentElement.doScroll)
                t.setTimeout(pt.ready);
            else if (ot.addEventListener)
                ot.addEventListener("DOMContentLoaded", a),
                t.addEventListener("load", a);
            else {
                ot.attachEvent("onreadystatechange", a),
                t.attachEvent("onload", a);
                var i = !1;
                try {
                    i = null == t.frameElement && ot.documentElement
                } catch (o) {}
                i && i.doScroll && !function n() {
                    if (!pt.isReady) {
                        try {
                            i.doScroll("left")
                        } catch (e) {
                            return t.setTimeout(n, 50)
                        }
                        r(),
                        pt.ready()
                    }
                }()
            }
        return It.promise(e)
    }
    ,
    pt.ready.promise();
    var Tt;
    for (Tt in pt(ht))
        break;
    ht.ownFirst = "0" === Tt,
    ht.inlineBlockNeedsLayout = !1,
    pt(function() {
        var t, e, i, o;
        i = ot.getElementsByTagName("body")[0],
        i && i.style && (e = ot.createElement("div"),
        o = ot.createElement("div"),
        o.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
        i.appendChild(o).appendChild(e),
        "undefined" != typeof e.style.zoom && (e.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",
        ht.inlineBlockNeedsLayout = t = 3 === e.offsetWidth,
        t && (i.style.zoom = 1)),
        i.removeChild(o))
    }),
    function() {
        var t = ot.createElement("div");
        ht.deleteExpando = !0;
        try {
            delete t.test
        } catch (e) {
            ht.deleteExpando = !1
        }
        t = null
    }();
    var Lt = function(t) {
        var e = pt.noData[(t.nodeName + " ").toLowerCase()]
          , i = +t.nodeType || 1;
        return 1 !== i && 9 !== i ? !1 : !e || e !== !0 && t.getAttribute("classid") === e
    }
      , Gt = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , Ft = /([A-Z])/g;
    pt.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(t) {
            return t = t.nodeType ? pt.cache[t[pt.expando]] : t[pt.expando],
            !!t && !m(t)
        },
        data: function(t, e, i) {
            return c(t, e, i)
        },
        removeData: function(t, e) {
            return h(t, e)
        },
        _data: function(t, e, i) {
            return c(t, e, i, !0)
        },
        _removeData: function(t, e) {
            return h(t, e, !0)
        }
    }),
    pt.fn.extend({
        data: function(t, e) {
            var i, o, n, s = this[0], r = s && s.attributes;
            if (void 0 === t) {
                if (this.length && (n = pt.data(s),
                1 === s.nodeType && !pt._data(s, "parsedAttrs"))) {
                    for (i = r.length; i--; )
                        r[i] && (o = r[i].name,
                        0 === o.indexOf("data-") && (o = pt.camelCase(o.slice(5)),
                        l(s, o, n[o])));
                    pt._data(s, "parsedAttrs", !0)
                }
                return n
            }
            return "object" == typeof t ? this.each(function() {
                pt.data(this, t)
            }) : arguments.length > 1 ? this.each(function() {
                pt.data(this, t, e)
            }) : s ? l(s, t, pt.data(s, t)) : void 0
        },
        removeData: function(t) {
            return this.each(function() {
                pt.removeData(this, t)
            })
        }
    }),
    pt.extend({
        queue: function(t, e, i) {
            var o;
            return t ? (e = (e || "fx") + "queue",
            o = pt._data(t, e),
            i && (!o || pt.isArray(i) ? o = pt._data(t, e, pt.makeArray(i)) : o.push(i)),
            o || []) : void 0
        },
        dequeue: function(t, e) {
            e = e || "fx";
            var i = pt.queue(t, e)
              , o = i.length
              , n = i.shift()
              , s = pt._queueHooks(t, e)
              , r = function() {
                pt.dequeue(t, e)
            };
            "inprogress" === n && (n = i.shift(),
            o--),
            n && ("fx" === e && i.unshift("inprogress"),
            delete s.stop,
            n.call(t, r, s)),
            !o && s && s.empty.fire()
        },
        _queueHooks: function(t, e) {
            var i = e + "queueHooks";
            return pt._data(t, i) || pt._data(t, i, {
                empty: pt.Callbacks("once memory").add(function() {
                    pt._removeData(t, e + "queue"),
                    pt._removeData(t, i)
                })
            })
        }
    }),
    pt.fn.extend({
        queue: function(t, e) {
            var i = 2;
            return "string" != typeof t && (e = t,
            t = "fx",
            i--),
            arguments.length < i ? pt.queue(this[0], t) : void 0 === e ? this : this.each(function() {
                var i = pt.queue(this, t, e);
                pt._queueHooks(this, t),
                "fx" === t && "inprogress" !== i[0] && pt.dequeue(this, t)
            })
        },
        dequeue: function(t) {
            return this.each(function() {
                pt.dequeue(this, t)
            })
        },
        clearQueue: function(t) {
            return this.queue(t || "fx", [])
        },
        promise: function(t, e) {
            var i, o = 1, n = pt.Deferred(), s = this, r = this.length, a = function() {
                --o || n.resolveWith(s, [s])
            };
            for ("string" != typeof t && (e = t,
            t = void 0),
            t = t || "fx"; r--; )
                i = pt._data(s[r], t + "queueHooks"),
                i && i.empty && (o++,
                i.empty.add(a));
            return a(),
            n.promise(e)
        }
    }),
    function() {
        var t;
        ht.shrinkWrapBlocks = function() {
            if (null != t)
                return t;
            t = !1;
            var e, i, o;
            return i = ot.getElementsByTagName("body")[0],
            i && i.style ? (e = ot.createElement("div"),
            o = ot.createElement("div"),
            o.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
            i.appendChild(o).appendChild(e),
            "undefined" != typeof e.style.zoom && (e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
            e.appendChild(ot.createElement("div")).style.width = "5px",
            t = 3 !== e.offsetWidth),
            i.removeChild(o),
            t) : void 0
        }
    }();
    var Pt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , Jt = new RegExp("^(?:([+-])=|)(" + Pt + ")([a-z%]*)$","i")
      , Et = ["Top", "Right", "Bottom", "Left"]
      , Rt = function(t, e) {
        return t = e || t,
        "none" === pt.css(t, "display") || !pt.contains(t.ownerDocument, t)
    }
      , kt = function(t, e, i, o, n, s, r) {
        var a = 0
          , l = t.length
          , m = null == i;
        if ("object" === pt.type(i)) {
            n = !0;
            for (a in i)
                kt(t, e, a, i[a], !0, s, r);
        } else if (void 0 !== o && (n = !0,
        pt.isFunction(o) || (r = !0),
        m && (r ? (e.call(t, o),
        e = null) : (m = e,
        e = function(t, e, i) {
            return m.call(pt(t), i)
        }
        )),
        e))
            for (; l > a; a++)
                e(t[a], i, r ? o : o.call(t[a], a, e(t[a], i)));
        return n ? t : m ? e.call(t) : l ? e(t[0], i) : s
    }
      , Nt = /^(?:checkbox|radio)$/i
      , jt = /<([\w:-]+)/
      , zt = /^$|\/(?:java|ecma)script/i
      , qt = /^\s+/
      , Ot = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    !function() {
        var t = ot.createElement("div")
          , e = ot.createDocumentFragment()
          , i = ot.createElement("input");
        t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        ht.leadingWhitespace = 3 === t.firstChild.nodeType,
        ht.tbody = !t.getElementsByTagName("tbody").length,
        ht.htmlSerialize = !!t.getElementsByTagName("link").length,
        ht.html5Clone = "<:nav></:nav>" !== ot.createElement("nav").cloneNode(!0).outerHTML,
        i.type = "checkbox",
        i.checked = !0,
        e.appendChild(i),
        ht.appendChecked = i.checked,
        t.innerHTML = "<textarea>x</textarea>",
        ht.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue,
        e.appendChild(t),
        i = ot.createElement("input"),
        i.setAttribute("type", "radio"),
        i.setAttribute("checked", "checked"),
        i.setAttribute("name", "t"),
        t.appendChild(i),
        ht.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked,
        ht.noCloneEvent = !!t.addEventListener,
        t[pt.expando] = 1,
        ht.attributes = !t.getAttribute(pt.expando)
    }();
    var Wt = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: ht.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Wt.optgroup = Wt.option,
    Wt.tbody = Wt.tfoot = Wt.colgroup = Wt.caption = Wt.thead,
    Wt.th = Wt.td;
    var Ut = /<|&#?\w+;/
      , Ht = /<tbody/i;
    !function() {
        var e, i, o = ot.createElement("div");
        for (e in {
            submit: !0,
            change: !0,
            focusin: !0
        })
            i = "on" + e,
            (ht[e] = i in t) || (o.setAttribute(i, "t"),
            ht[e] = o.attributes[i].expando === !1);
        o = null
    }();
    var $t = /^(?:input|select|textarea)$/i
      , Xt = /^key/
      , Kt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
      , Zt = /^(?:focusinfocus|focusoutblur)$/
      , Yt = /^([^.]*)(?:\.(.+)|)/;
    pt.event = {
        global: {},
        add: function(t, e, i, o, n) {
            var s, r, a, l, m, c, h, u, p, y, _, d = pt._data(t);
            if (d) {
                for (i.handler && (l = i,
                i = l.handler,
                n = l.selector),
                i.guid || (i.guid = pt.guid++),
                (r = d.events) || (r = d.events = {}),
                (c = d.handle) || (c = d.handle = function(t) {
                    return "undefined" == typeof pt || t && pt.event.triggered === t.type ? void 0 : pt.event.dispatch.apply(c.elem, arguments)
                }
                ,
                c.elem = t),
                e = (e || "").match(Vt) || [""],
                a = e.length; a--; )
                    s = Yt.exec(e[a]) || [],
                    p = _ = s[1],
                    y = (s[2] || "").split(".").sort(),
                    p && (m = pt.event.special[p] || {},
                    p = (n ? m.delegateType : m.bindType) || p,
                    m = pt.event.special[p] || {},
                    h = pt.extend({
                        type: p,
                        origType: _,
                        data: o,
                        handler: i,
                        guid: i.guid,
                        selector: n,
                        needsContext: n && pt.expr.match.needsContext.test(n),
                        namespace: y.join(".")
                    }, l),
                    (u = r[p]) || (u = r[p] = [],
                    u.delegateCount = 0,
                    m.setup && m.setup.call(t, o, y, c) !== !1 || (t.addEventListener ? t.addEventListener(p, c, !1) : t.attachEvent && t.attachEvent("on" + p, c))),
                    m.add && (m.add.call(t, h),
                    h.handler.guid || (h.handler.guid = i.guid)),
                    n ? u.splice(u.delegateCount++, 0, h) : u.push(h),
                    pt.event.global[p] = !0);
                t = null
            }
        },
        remove: function(t, e, i, o, n) {
            var s, r, a, l, m, c, h, u, p, y, _, d = pt.hasData(t) && pt._data(t);
            if (d && (c = d.events)) {
                for (e = (e || "").match(Vt) || [""],
                m = e.length; m--; )
                    if (a = Yt.exec(e[m]) || [],
                    p = _ = a[1],
                    y = (a[2] || "").split(".").sort(),
                    p) {
                        for (h = pt.event.special[p] || {},
                        p = (o ? h.delegateType : h.bindType) || p,
                        u = c[p] || [],
                        a = a[2] && new RegExp("(^|\\.)" + y.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        l = s = u.length; s--; )
                            r = u[s],
                            !n && _ !== r.origType || i && i.guid !== r.guid || a && !a.test(r.namespace) || o && o !== r.selector && ("**" !== o || !r.selector) || (u.splice(s, 1),
                            r.selector && u.delegateCount--,
                            h.remove && h.remove.call(t, r));
                        l && !u.length && (h.teardown && h.teardown.call(t, y, d.handle) !== !1 || pt.removeEvent(t, p, d.handle),
                        delete c[p])
                    } else
                        for (p in c)
                            pt.event.remove(t, p + e[m], i, o, !0);
                pt.isEmptyObject(c) && (delete d.handle,
                pt._removeData(t, "events"))
            }
        },
        trigger: function(e, i, o, n) {
            var s, r, a, l, m, c, h, u = [o || ot], p = ct.call(e, "type") ? e.type : e, y = ct.call(e, "namespace") ? e.namespace.split(".") : [];
            if (a = c = o = o || ot,
            3 !== o.nodeType && 8 !== o.nodeType && !Zt.test(p + pt.event.triggered) && (p.indexOf(".") > -1 && (y = p.split("."),
            p = y.shift(),
            y.sort()),
            r = p.indexOf(":") < 0 && "on" + p,
            e = e[pt.expando] ? e : new pt.Event(p,"object" == typeof e && e),
            e.isTrigger = n ? 2 : 3,
            e.namespace = y.join("."),
            e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + y.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            e.result = void 0,
            e.target || (e.target = o),
            i = null == i ? [e] : pt.makeArray(i, [e]),
            m = pt.event.special[p] || {},
            n || !m.trigger || m.trigger.apply(o, i) !== !1)) {
                if (!n && !m.noBubble && !pt.isWindow(o)) {
                    for (l = m.delegateType || p,
                    Zt.test(l + p) || (a = a.parentNode); a; a = a.parentNode)
                        u.push(a),
                        c = a;
                    c === (o.ownerDocument || ot) && u.push(c.defaultView || c.parentWindow || t)
                }
                for (h = 0; (a = u[h++]) && !e.isPropagationStopped(); )
                    e.type = h > 1 ? l : m.bindType || p,
                    s = (pt._data(a, "events") || {})[e.type] && pt._data(a, "handle"),
                    s && s.apply(a, i),
                    s = r && a[r],
                    s && s.apply && Lt(a) && (e.result = s.apply(a, i),
                    e.result === !1 && e.preventDefault());
                if (e.type = p,
                !n && !e.isDefaultPrevented() && (!m._default || m._default.apply(u.pop(), i) === !1) && Lt(o) && r && o[p] && !pt.isWindow(o)) {
                    c = o[r],
                    c && (o[r] = null),
                    pt.event.triggered = p;
                    try {
                        o[p]()
                    } catch (_) {}
                    pt.event.triggered = void 0,
                    c && (o[r] = c)
                }
                return e.result
            }
        },
        dispatch: function(t) {
            t = pt.event.fix(t);
            var e, i, o, n, s, r = [], a = nt.call(arguments), l = (pt._data(this, "events") || {})[t.type] || [], m = pt.event.special[t.type] || {};
            if (a[0] = t,
            t.delegateTarget = this,
            !m.preDispatch || m.preDispatch.call(this, t) !== !1) {
                for (r = pt.event.handlers.call(this, t, l),
                e = 0; (n = r[e++]) && !t.isPropagationStopped(); )
                    for (t.currentTarget = n.elem,
                    i = 0; (s = n.handlers[i++]) && !t.isImmediatePropagationStopped(); )
                        t.rnamespace && !t.rnamespace.test(s.namespace) || (t.handleObj = s,
                        t.data = s.data,
                        o = ((pt.event.special[s.origType] || {}).handle || s.handler).apply(n.elem, a),
                        void 0 !== o && (t.result = o) === !1 && (t.preventDefault(),
                        t.stopPropagation()));
                return m.postDispatch && m.postDispatch.call(this, t),
                t.result
            }
        },
        handlers: function(t, e) {
            var i, o, n, s, r = [], a = e.delegateCount, l = t.target;
            if (a && l.nodeType && ("click" !== t.type || isNaN(t.button) || t.button < 1))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (l.disabled !== !0 || "click" !== t.type)) {
                        for (o = [],
                        i = 0; a > i; i++)
                            s = e[i],
                            n = s.selector + " ",
                            void 0 === o[n] && (o[n] = s.needsContext ? pt(n, this).index(l) > -1 : pt.find(n, this, null, [l]).length),
                            o[n] && o.push(s);
                        o.length && r.push({
                            elem: l,
                            handlers: o
                        })
                    }
            return a < e.length && r.push({
                elem: this,
                handlers: e.slice(a)
            }),
            r
        },
        fix: function(t) {
            if (t[pt.expando])
                return t;
            var e, i, o, n = t.type, s = t, r = this.fixHooks[n];
            for (r || (this.fixHooks[n] = r = Kt.test(n) ? this.mouseHooks : Xt.test(n) ? this.keyHooks : {}),
            o = r.props ? this.props.concat(r.props) : this.props,
            t = new pt.Event(s),
            e = o.length; e--; )
                i = o[e],
                t[i] = s[i];
            return t.target || (t.target = s.srcElement || ot),
            3 === t.target.nodeType && (t.target = t.target.parentNode),
            t.metaKey = !!t.metaKey,
            r.filter ? r.filter(t, s) : t
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(t, e) {
                return null == t.which && (t.which = null != e.charCode ? e.charCode : e.keyCode),
                t
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(t, e) {
                var i, o, n, s = e.button, r = e.fromElement;
                return null == t.pageX && null != e.clientX && (o = t.target.ownerDocument || ot,
                n = o.documentElement,
                i = o.body,
                t.pageX = e.clientX + (n && n.scrollLeft || i && i.scrollLeft || 0) - (n && n.clientLeft || i && i.clientLeft || 0),
                t.pageY = e.clientY + (n && n.scrollTop || i && i.scrollTop || 0) - (n && n.clientTop || i && i.clientTop || 0)),
                !t.relatedTarget && r && (t.relatedTarget = r === t.target ? e.toElement : r),
                t.which || void 0 === s || (t.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0),
                t
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== v() && this.focus)
                        try {
                            return this.focus(),
                            !1
                        } catch (t) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === v() && this.blur ? (this.blur(),
                    !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return pt.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(),
                    !1) : void 0
                },
                _default: function(t) {
                    return pt.nodeName(t.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(t) {
                    void 0 !== t.result && t.originalEvent && (t.originalEvent.returnValue = t.result)
                }
            }
        },
        simulate: function(t, e, i) {
            var o = pt.extend(new pt.Event, i, {
                type: t,
                isSimulated: !0
            });
            pt.event.trigger(o, null, e),
            o.isDefaultPrevented() && i.preventDefault()
        }
    },
    pt.removeEvent = ot.removeEventListener ? function(t, e, i) {
        t.removeEventListener && t.removeEventListener(e, i)
    }
    : function(t, e, i) {
        var o = "on" + e;
        t.detachEvent && ("undefined" == typeof t[o] && (t[o] = null),
        t.detachEvent(o, i))
    }
    ,
    pt.Event = function(t, e) {
        return this instanceof pt.Event ? (t && t.type ? (this.originalEvent = t,
        this.type = t.type,
        this.isDefaultPrevented = t.defaultPrevented || void 0 === t.defaultPrevented && t.returnValue === !1 ? x : b) : this.type = t,
        e && pt.extend(this, e),
        this.timeStamp = t && t.timeStamp || pt.now(),
        void (this[pt.expando] = !0)) : new pt.Event(t,e)
    }
    ,
    pt.Event.prototype = {
        constructor: pt.Event,
        isDefaultPrevented: b,
        isPropagationStopped: b,
        isImmediatePropagationStopped: b,
        preventDefault: function() {
            var t = this.originalEvent;
            this.isDefaultPrevented = x,
            t && (t.preventDefault ? t.preventDefault() : t.returnValue = !1)
        },
        stopPropagation: function() {
            var t = this.originalEvent;
            this.isPropagationStopped = x,
            t && !this.isSimulated && (t.stopPropagation && t.stopPropagation(),
            t.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var t = this.originalEvent;
            this.isImmediatePropagationStopped = x,
            t && t.stopImmediatePropagation && t.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    pt.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(t, e) {
        pt.event.special[t] = {
            delegateType: e,
            bindType: e,
            handle: function(t) {
                var i, o = this, n = t.relatedTarget, s = t.handleObj;
                return n && (n === o || pt.contains(o, n)) || (t.type = s.origType,
                i = s.handler.apply(this, arguments),
                t.type = e),
                i
            }
        }
    }),
    ht.submit || (pt.event.special.submit = {
        setup: function() {
            return pt.nodeName(this, "form") ? !1 : void pt.event.add(this, "click._submit keypress._submit", function(t) {
                var e = t.target
                  , i = pt.nodeName(e, "input") || pt.nodeName(e, "button") ? pt.prop(e, "form") : void 0;
                i && !pt._data(i, "submit") && (pt.event.add(i, "submit._submit", function(t) {
                    t._submitBubble = !0
                }),
                pt._data(i, "submit", !0))
            })
        },
        postDispatch: function(t) {
            t._submitBubble && (delete t._submitBubble,
            this.parentNode && !t.isTrigger && pt.event.simulate("submit", this.parentNode, t))
        },
        teardown: function() {
            return pt.nodeName(this, "form") ? !1 : void pt.event.remove(this, "._submit")
        }
    }),
    ht.change || (pt.event.special.change = {
        setup: function() {
            return $t.test(this.nodeName) ? ("checkbox" !== this.type && "radio" !== this.type || (pt.event.add(this, "propertychange._change", function(t) {
                "checked" === t.originalEvent.propertyName && (this._justChanged = !0)
            }),
            pt.event.add(this, "click._change", function(t) {
                this._justChanged && !t.isTrigger && (this._justChanged = !1),
                pt.event.simulate("change", this, t)
            })),
            !1) : void pt.event.add(this, "beforeactivate._change", function(t) {
                var e = t.target;
                $t.test(e.nodeName) && !pt._data(e, "change") && (pt.event.add(e, "change._change", function(t) {
                    !this.parentNode || t.isSimulated || t.isTrigger || pt.event.simulate("change", this.parentNode, t)
                }),
                pt._data(e, "change", !0))
            })
        },
        handle: function(t) {
            var e = t.target;
            return this !== e || t.isSimulated || t.isTrigger || "radio" !== e.type && "checkbox" !== e.type ? t.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return pt.event.remove(this, "._change"),
            !$t.test(this.nodeName)
        }
    }),
    ht.focusin || pt.each({
        focus: "focusin",
        blur: "focusout"
    }, function(t, e) {
        var i = function(t) {
            pt.event.simulate(e, t.target, pt.event.fix(t))
        };
        pt.event.special[e] = {
            setup: function() {
                var o = this.ownerDocument || this
                  , n = pt._data(o, e);
                n || o.addEventListener(t, i, !0),
                pt._data(o, e, (n || 0) + 1)
            },
            teardown: function() {
                var o = this.ownerDocument || this
                  , n = pt._data(o, e) - 1;
                n ? pt._data(o, e, n) : (o.removeEventListener(t, i, !0),
                pt._removeData(o, e))
            }
        }
    }),
    pt.fn.extend({
        on: function(t, e, i, o) {
            return g(this, t, e, i, o)
        },
        one: function(t, e, i, o) {
            return g(this, t, e, i, o, 1)
        },
        off: function(t, e, i) {
            var o, n;
            if (t && t.preventDefault && t.handleObj)
                return o = t.handleObj,
                pt(t.delegateTarget).off(o.namespace ? o.origType + "." + o.namespace : o.origType, o.selector, o.handler),
                this;
            if ("object" == typeof t) {
                for (n in t)
                    this.off(n, e, t[n]);
                return this
            }
            return e !== !1 && "function" != typeof e || (i = e,
            e = void 0),
            i === !1 && (i = b),
            this.each(function() {
                pt.event.remove(this, t, i, e)
            })
        },
        trigger: function(t, e) {
            return this.each(function() {
                pt.event.trigger(t, e, this)
            })
        },
        triggerHandler: function(t, e) {
            var i = this[0];
            return i ? pt.event.trigger(t, e, i, !0) : void 0
        }
    });
    var Qt = / jQuery\d+="(?:null|\d+)"/g
      , te = new RegExp("<(?:" + Ot + ")[\\s/>]","i")
      , ee = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi
      , ie = /<script|<style|<link/i
      , oe = /checked\s*(?:[^=]|=\s*.checked.)/i
      , ne = /^true\/(.*)/
      , se = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
      , re = p(ot)
      , ae = re.appendChild(ot.createElement("div"));
    pt.extend({
        htmlPrefilter: function(t) {
            return t.replace(ee, "<$1></$2>")
        },
        clone: function(t, e, i) {
            var o, n, s, r, a, l = pt.contains(t.ownerDocument, t);
            if (ht.html5Clone || pt.isXMLDoc(t) || !te.test("<" + t.nodeName + ">") ? s = t.cloneNode(!0) : (ae.innerHTML = t.outerHTML,
            ae.removeChild(s = ae.firstChild)),
            !(ht.noCloneEvent && ht.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || pt.isXMLDoc(t)))
                for (o = y(s),
                a = y(t),
                r = 0; null != (n = a[r]); ++r)
                    o[r] && A(n, o[r]);
            if (e)
                if (i)
                    for (a = a || y(t),
                    o = o || y(s),
                    r = 0; null != (n = a[r]); r++)
                        w(n, o[r]);
                else
                    w(t, s);
            return o = y(s, "script"),
            o.length > 0 && _(o, !l && y(t, "script")),
            o = a = n = null,
            s
        },
        cleanData: function(t, e) {
            for (var i, o, n, s, r = 0, a = pt.expando, l = pt.cache, m = ht.attributes, c = pt.event.special; null != (i = t[r]); r++)
                if ((e || Lt(i)) && (n = i[a],
                s = n && l[n])) {
                    if (s.events)
                        for (o in s.events)
                            c[o] ? pt.event.remove(i, o) : pt.removeEvent(i, o, s.handle);
                    l[n] && (delete l[n],
                    m || "undefined" == typeof i.removeAttribute ? i[a] = void 0 : i.removeAttribute(a),
                    it.push(n))
                }
        }
    }),
    pt.fn.extend({
        domManip: S,
        detach: function(t) {
            return M(this, t, !0)
        },
        remove: function(t) {
            return M(this, t)
        },
        text: function(t) {
            return kt(this, function(t) {
                return void 0 === t ? pt.text(this) : this.empty().append((this[0] && this[0].ownerDocument || ot).createTextNode(t))
            }, null, t, arguments.length)
        },
        append: function() {
            return S(this, arguments, function(t) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var e = D(this, t);
                    e.appendChild(t)
                }
            })
        },
        prepend: function() {
            return S(this, arguments, function(t) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var e = D(this, t);
                    e.insertBefore(t, e.firstChild)
                }
            })
        },
        before: function() {
            return S(this, arguments, function(t) {
                this.parentNode && this.parentNode.insertBefore(t, this)
            })
        },
        after: function() {
            return S(this, arguments, function(t) {
                this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
            })
        },
        empty: function() {
            for (var t, e = 0; null != (t = this[e]); e++) {
                for (1 === t.nodeType && pt.cleanData(y(t, !1)); t.firstChild; )
                    t.removeChild(t.firstChild);
                t.options && pt.nodeName(t, "select") && (t.options.length = 0)
            }
            return this
        },
        clone: function(t, e) {
            return t = null == t ? !1 : t,
            e = null == e ? t : e,
            this.map(function() {
                return pt.clone(this, t, e)
            })
        },
        html: function(t) {
            return kt(this, function(t) {
                var e = this[0] || {}
                  , i = 0
                  , o = this.length;
                if (void 0 === t)
                    return 1 === e.nodeType ? e.innerHTML.replace(Qt, "") : void 0;
                if ("string" == typeof t && !ie.test(t) && (ht.htmlSerialize || !te.test(t)) && (ht.leadingWhitespace || !qt.test(t)) && !Wt[(jt.exec(t) || ["", ""])[1].toLowerCase()]) {
                    t = pt.htmlPrefilter(t);
                    try {
                        for (; o > i; i++)
                            e = this[i] || {},
                            1 === e.nodeType && (pt.cleanData(y(e, !1)),
                            e.innerHTML = t);
                        e = 0
                    } catch (n) {}
                }
                e && this.empty().append(t)
            }, null, t, arguments.length)
        },
        replaceWith: function() {
            var t = [];
            return S(this, arguments, function(e) {
                var i = this.parentNode;
                pt.inArray(this, t) < 0 && (pt.cleanData(y(this)),
                i && i.replaceChild(e, this))
            }, t)
        }
    }),
    pt.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(t, e) {
        pt.fn[t] = function(t) {
            for (var i, o = 0, n = [], s = pt(t), r = s.length - 1; r >= o; o++)
                i = o === r ? this : this.clone(!0),
                pt(s[o])[e](i),
                rt.apply(n, i.get());
            return this.pushStack(n)
        }
    });
    var le, me = {
        HTML: "block",
        BODY: "block"
    }, ce = /^margin/, he = new RegExp("^(" + Pt + ")(?!px)[a-z%]+$","i"), ue = function(t, e, i, o) {
        var n, s, r = {};
        for (s in e)
            r[s] = t.style[s],
            t.style[s] = e[s];
        n = i.apply(t, o || []);
        for (s in e)
            t.style[s] = r[s];
        return n
    }, pe = ot.documentElement;
    !function() {
        function e() {
            var e, c, h = ot.documentElement;
            h.appendChild(l),
            m.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",
            i = n = a = !1,
            o = r = !0,
            t.getComputedStyle && (c = t.getComputedStyle(m),
            i = "1%" !== (c || {}).top,
            a = "2px" === (c || {}).marginLeft,
            n = "4px" === (c || {
                width: "4px"
            }).width,
            m.style.marginRight = "50%",
            o = "4px" === (c || {
                marginRight: "4px"
            }).marginRight,
            e = m.appendChild(ot.createElement("div")),
            e.style.cssText = m.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
            e.style.marginRight = e.style.width = "0",
            m.style.width = "1px",
            r = !parseFloat((t.getComputedStyle(e) || {}).marginRight),
            m.removeChild(e)),
            m.style.display = "none",
            s = 0 === m.getClientRects().length,
            s && (m.style.display = "",
            m.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
            m.childNodes[0].style.borderCollapse = "separate",
            e = m.getElementsByTagName("td"),
            e[0].style.cssText = "margin:0;border:0;padding:0;display:none",
            s = 0 === e[0].offsetHeight,
            s && (e[0].style.display = "",
            e[1].style.display = "none",
            s = 0 === e[0].offsetHeight)),
            h.removeChild(l)
        }
        var i, o, n, s, r, a, l = ot.createElement("div"), m = ot.createElement("div");
        m.style && (m.style.cssText = "float:left;opacity:.5",
        ht.opacity = "0.5" === m.style.opacity,
        ht.cssFloat = !!m.style.cssFloat,
        m.style.backgroundClip = "content-box",
        m.cloneNode(!0).style.backgroundClip = "",
        ht.clearCloneStyle = "content-box" === m.style.backgroundClip,
        l = ot.createElement("div"),
        l.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",
        m.innerHTML = "",
        l.appendChild(m),
        ht.boxSizing = "" === m.style.boxSizing || "" === m.style.MozBoxSizing || "" === m.style.WebkitBoxSizing,
        pt.extend(ht, {
            reliableHiddenOffsets: function() {
                return null == i && e(),
                s
            },
            boxSizingReliable: function() {
                return null == i && e(),
                n
            },
            pixelMarginRight: function() {
                return null == i && e(),
                o
            },
            pixelPosition: function() {
                return null == i && e(),
                i
            },
            reliableMarginRight: function() {
                return null == i && e(),
                r
            },
            reliableMarginLeft: function() {
                return null == i && e(),
                a
            }
        }))
    }();
    var ye, _e, de = /^(top|right|bottom|left)$/;
    t.getComputedStyle ? (ye = function(e) {
        var i = e.ownerDocument.defaultView;
        return i && i.opener || (i = t),
        i.getComputedStyle(e)
    }
    ,
    _e = function(t, e, i) {
        var o, n, s, r, a = t.style;
        return i = i || ye(t),
        r = i ? i.getPropertyValue(e) || i[e] : void 0,
        "" !== r && void 0 !== r || pt.contains(t.ownerDocument, t) || (r = pt.style(t, e)),
        i && !ht.pixelMarginRight() && he.test(r) && ce.test(e) && (o = a.width,
        n = a.minWidth,
        s = a.maxWidth,
        a.minWidth = a.maxWidth = a.width = r,
        r = i.width,
        a.width = o,
        a.minWidth = n,
        a.maxWidth = s),
        void 0 === r ? r : r + ""
    }
    ) : pe.currentStyle && (ye = function(t) {
        return t.currentStyle
    }
    ,
    _e = function(t, e, i) {
        var o, n, s, r, a = t.style;
        return i = i || ye(t),
        r = i ? i[e] : void 0,
        null == r && a && a[e] && (r = a[e]),
        he.test(r) && !de.test(e) && (o = a.left,
        n = t.runtimeStyle,
        s = n && n.left,
        s && (n.left = t.currentStyle.left),
        a.left = "fontSize" === e ? "1em" : r,
        r = a.pixelLeft + "px",
        a.left = o,
        s && (n.left = s)),
        void 0 === r ? r : r + "" || "auto"
    }
    );
    var fe = /alpha\([^)]*\)/i
      , xe = /opacity\s*=\s*([^)]*)/i
      , be = /^(none|table(?!-c[ea]).+)/
      , ve = new RegExp("^(" + Pt + ")(.*)$","i")
      , ge = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , De = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , Ce = ["Webkit", "O", "Moz", "ms"]
      , Be = ot.createElement("div").style;
    pt.extend({
        cssHooks: {
            opacity: {
                get: function(t, e) {
                    if (e) {
                        var i = _e(t, "opacity");
                        return "" === i ? "1" : i
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": ht.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(t, e, i, o) {
            if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                var n, s, r, a = pt.camelCase(e), l = t.style;
                if (e = pt.cssProps[a] || (pt.cssProps[a] = L(a) || a),
                r = pt.cssHooks[e] || pt.cssHooks[a],
                void 0 === i)
                    return r && "get"in r && void 0 !== (n = r.get(t, !1, o)) ? n : l[e];
                if (s = typeof i,
                "string" === s && (n = Jt.exec(i)) && n[1] && (i = u(t, e, n),
                s = "number"),
                null != i && i === i && ("number" === s && (i += n && n[3] || (pt.cssNumber[a] ? "" : "px")),
                ht.clearCloneStyle || "" !== i || 0 !== e.indexOf("background") || (l[e] = "inherit"),
                !(r && "set"in r && void 0 === (i = r.set(t, i, o)))))
                    try {
                        l[e] = i
                    } catch (m) {}
            }
        },
        css: function(t, e, i, o) {
            var n, s, r, a = pt.camelCase(e);
            return e = pt.cssProps[a] || (pt.cssProps[a] = L(a) || a),
            r = pt.cssHooks[e] || pt.cssHooks[a],
            r && "get"in r && (s = r.get(t, !0, i)),
            void 0 === s && (s = _e(t, e, o)),
            "normal" === s && e in De && (s = De[e]),
            "" === i || i ? (n = parseFloat(s),
            i === !0 || isFinite(n) ? n || 0 : s) : s
        }
    }),
    pt.each(["height", "width"], function(t, e) {
        pt.cssHooks[e] = {
            get: function(t, i, o) {
                return i ? be.test(pt.css(t, "display")) && 0 === t.offsetWidth ? ue(t, ge, function() {
                    return J(t, e, o)
                }) : J(t, e, o) : void 0
            },
            set: function(t, i, o) {
                var n = o && ye(t);
                return F(t, i, o ? P(t, e, o, ht.boxSizing && "border-box" === pt.css(t, "boxSizing", !1, n), n) : 0)
            }
        }
    }),
    ht.opacity || (pt.cssHooks.opacity = {
        get: function(t, e) {
            return xe.test((e && t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : e ? "1" : ""
        },
        set: function(t, e) {
            var i = t.style
              , o = t.currentStyle
              , n = pt.isNumeric(e) ? "alpha(opacity=" + 100 * e + ")" : ""
              , s = o && o.filter || i.filter || "";
            i.zoom = 1,
            (e >= 1 || "" === e) && "" === pt.trim(s.replace(fe, "")) && i.removeAttribute && (i.removeAttribute("filter"),
            "" === e || o && !o.filter) || (i.filter = fe.test(s) ? s.replace(fe, n) : s + " " + n)
        }
    }),
    pt.cssHooks.marginRight = T(ht.reliableMarginRight, function(t, e) {
        return e ? ue(t, {
            display: "inline-block"
        }, _e, [t, "marginRight"]) : void 0
    }),
    pt.cssHooks.marginLeft = T(ht.reliableMarginLeft, function(t, e) {
        return e ? (parseFloat(_e(t, "marginLeft")) || (pt.contains(t.ownerDocument, t) ? t.getBoundingClientRect().left - ue(t, {
            marginLeft: 0
        }, function() {
            return t.getBoundingClientRect().left
        }) : 0)) + "px" : void 0
    }),
    pt.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(t, e) {
        pt.cssHooks[t + e] = {
            expand: function(i) {
                for (var o = 0, n = {}, s = "string" == typeof i ? i.split(" ") : [i]; 4 > o; o++)
                    n[t + Et[o] + e] = s[o] || s[o - 2] || s[0];
                return n
            }
        },
        ce.test(t) || (pt.cssHooks[t + e].set = F)
    }),
    pt.fn.extend({
        css: function(t, e) {
            return kt(this, function(t, e, i) {
                var o, n, s = {}, r = 0;
                if (pt.isArray(e)) {
                    for (o = ye(t),
                    n = e.length; n > r; r++)
                        s[e[r]] = pt.css(t, e[r], !1, o);
                    return s
                }
                return void 0 !== i ? pt.style(t, e, i) : pt.css(t, e)
            }, t, e, arguments.length > 1)
        },
        show: function() {
            return G(this, !0)
        },
        hide: function() {
            return G(this)
        },
        toggle: function(t) {
            return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function() {
                Rt(this) ? pt(this).show() : pt(this).hide()
            })
        }
    }),
    pt.Tween = E,
    E.prototype = {
        constructor: E,
        init: function(t, e, i, o, n, s) {
            this.elem = t,
            this.prop = i,
            this.easing = n || pt.easing._default,
            this.options = e,
            this.start = this.now = this.cur(),
            this.end = o,
            this.unit = s || (pt.cssNumber[i] ? "" : "px")
        },
        cur: function() {
            var t = E.propHooks[this.prop];
            return t && t.get ? t.get(this) : E.propHooks._default.get(this)
        },
        run: function(t) {
            var e, i = E.propHooks[this.prop];
            return this.options.duration ? this.pos = e = pt.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : this.pos = e = t,
            this.now = (this.end - this.start) * e + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            i && i.set ? i.set(this) : E.propHooks._default.set(this),
            this
        }
    },
    E.prototype.init.prototype = E.prototype,
    E.propHooks = {
        _default: {
            get: function(t) {
                var e;
                return 1 !== t.elem.nodeType || null != t.elem[t.prop] && null == t.elem.style[t.prop] ? t.elem[t.prop] : (e = pt.css(t.elem, t.prop, ""),
                e && "auto" !== e ? e : 0)
            },
            set: function(t) {
                pt.fx.step[t.prop] ? pt.fx.step[t.prop](t) : 1 !== t.elem.nodeType || null == t.elem.style[pt.cssProps[t.prop]] && !pt.cssHooks[t.prop] ? t.elem[t.prop] = t.now : pt.style(t.elem, t.prop, t.now + t.unit)
            }
        }
    },
    E.propHooks.scrollTop = E.propHooks.scrollLeft = {
        set: function(t) {
            t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
        }
    },
    pt.easing = {
        linear: function(t) {
            return t
        },
        swing: function(t) {
            return .5 - Math.cos(t * Math.PI) / 2
        },
        _default: "swing"
    },
    pt.fx = E.prototype.init,
    pt.fx.step = {};
    var we, Ae, Se = /^(?:toggle|show|hide)$/, Me = /queueHooks$/;
    pt.Animation = pt.extend(q, {
        tweeners: {
            "*": [function(t, e) {
                var i = this.createTween(t, e);
                return u(i.elem, t, Jt.exec(e), i),
                i
            }
            ]
        },
        tweener: function(t, e) {
            pt.isFunction(t) ? (e = t,
            t = ["*"]) : t = t.match(Vt);
            for (var i, o = 0, n = t.length; n > o; o++)
                i = t[o],
                q.tweeners[i] = q.tweeners[i] || [],
                q.tweeners[i].unshift(e)
        },
        prefilters: [j],
        prefilter: function(t, e) {
            e ? q.prefilters.unshift(t) : q.prefilters.push(t)
        }
    }),
    pt.speed = function(t, e, i) {
        var o = t && "object" == typeof t ? pt.extend({}, t) : {
            complete: i || !i && e || pt.isFunction(t) && t,
            duration: t,
            easing: i && e || e && !pt.isFunction(e) && e
        };
        return o.duration = pt.fx.off ? 0 : "number" == typeof o.duration ? o.duration : o.duration in pt.fx.speeds ? pt.fx.speeds[o.duration] : pt.fx.speeds._default,
        null != o.queue && o.queue !== !0 || (o.queue = "fx"),
        o.old = o.complete,
        o.complete = function() {
            pt.isFunction(o.old) && o.old.call(this),
            o.queue && pt.dequeue(this, o.queue)
        }
        ,
        o
    }
    ,
    pt.fn.extend({
        fadeTo: function(t, e, i, o) {
            return this.filter(Rt).css("opacity", 0).show().end().animate({
                opacity: e
            }, t, i, o)
        },
        animate: function(t, e, i, o) {
            var n = pt.isEmptyObject(t)
              , s = pt.speed(e, i, o)
              , r = function() {
                var e = q(this, pt.extend({}, t), s);
                (n || pt._data(this, "finish")) && e.stop(!0)
            };
            return r.finish = r,
            n || s.queue === !1 ? this.each(r) : this.queue(s.queue, r)
        },
        stop: function(t, e, i) {
            var o = function(t) {
                var e = t.stop;
                delete t.stop,
                e(i)
            };
            return "string" != typeof t && (i = e,
            e = t,
            t = void 0),
            e && t !== !1 && this.queue(t || "fx", []),
            this.each(function() {
                var e = !0
                  , n = null != t && t + "queueHooks"
                  , s = pt.timers
                  , r = pt._data(this);
                if (n)
                    r[n] && r[n].stop && o(r[n]);
                else
                    for (n in r)
                        r[n] && r[n].stop && Me.test(n) && o(r[n]);
                for (n = s.length; n--; )
                    s[n].elem !== this || null != t && s[n].queue !== t || (s[n].anim.stop(i),
                    e = !1,
                    s.splice(n, 1));
                !e && i || pt.dequeue(this, t)
            })
        },
        finish: function(t) {
            return t !== !1 && (t = t || "fx"),
            this.each(function() {
                var e, i = pt._data(this), o = i[t + "queue"], n = i[t + "queueHooks"], s = pt.timers, r = o ? o.length : 0;
                for (i.finish = !0,
                pt.queue(this, t, []),
                n && n.stop && n.stop.call(this, !0),
                e = s.length; e--; )
                    s[e].elem === this && s[e].queue === t && (s[e].anim.stop(!0),
                    s.splice(e, 1));
                for (e = 0; r > e; e++)
                    o[e] && o[e].finish && o[e].finish.call(this);
                delete i.finish
            })
        }
    }),
    pt.each(["toggle", "show", "hide"], function(t, e) {
        var i = pt.fn[e];
        pt.fn[e] = function(t, o, n) {
            return null == t || "boolean" == typeof t ? i.apply(this, arguments) : this.animate(k(e, !0), t, o, n)
        }
    }),
    pt.each({
        slideDown: k("show"),
        slideUp: k("hide"),
        slideToggle: k("toggle"),
        fi: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(t, e) {
        pt.fn[t] = function(t, i, o) {
            return this.animate(e, t, i, o)
        }
    }),
    pt.timers = [],
    pt.fx.tick = function() {
        var t, e = pt.timers, i = 0;
        for (we = pt.now(); i < e.length; i++)
            t = e[i],
            t() || e[i] !== t || e.splice(i--, 1);
        e.length || pt.fx.stop(),
        we = void 0
    }
    ,
    pt.fx.timer = function(t) {
        pt.timers.push(t),
        t() ? pt.fx.start() : pt.timers.pop()
    }
    ,
    pt.fx.interval = 13,
    pt.fx.start = function() {
        Ae || (Ae = t.setInterval(pt.fx.tick, pt.fx.interval))
    }
    ,
    pt.fx.stop = function() {
        t.clearInterval(Ae),
        Ae = null
    }
    ,
    pt.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    pt.fn.delay = function(e, i) {
        return e = pt.fx ? pt.fx.speeds[e] || e : e,
        i = i || "fx",
        this.queue(i, function(i, o) {
            var n = t.setTimeout(i, e);
            o.stop = function() {
                t.clearTimeout(n)
            }
        })
    }
    ,
    function() {
        var t, e = ot.createElement("input"), i = ot.createElement("div"), o = ot.createElement("select"), n = o.appendChild(ot.createElement("option"));
        i = ot.createElement("div"),
        i.setAttribute("className", "t"),
        i.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        t = i.getElementsByTagName("a")[0],
        e.setAttribute("type", "checkbox"),
        i.appendChild(e),
        t = i.getElementsByTagName("a")[0],
        t.style.cssText = "top:1px",
        ht.getSetAttribute = "t" !== i.className,
        ht.style = /top/.test(t.getAttribute("style")),
        ht.hrefNormalized = "/a" === t.getAttribute("href"),
        ht.checkOn = !!e.value,
        ht.optSelected = n.selected,
        ht.enctype = !!ot.createElement("form").enctype,
        o.disabled = !0,
        ht.optDisabled = !n.disabled,
        e = ot.createElement("input"),
        e.setAttribute("value", ""),
        ht.input = "" === e.getAttribute("value"),
        e.value = "t",
        e.setAttribute("type", "radio"),
        ht.radioValue = "t" === e.value
    }();
    var Ve = /\r/g
      , Ie = /[\x20\t\r\n\f]+/g;
    pt.fn.extend({
        val: function(t) {
            var e, i, o, n = this[0];
            return arguments.length ? (o = pt.isFunction(t),
            this.each(function(i) {
                var n;
                1 === this.nodeType && (n = o ? t.call(this, i, pt(this).val()) : t,
                null == n ? n = "" : "number" == typeof n ? n += "" : pt.isArray(n) && (n = pt.map(n, function(t) {
                    return null == t ? "" : t + ""
                })),
                e = pt.valHooks[this.type] || pt.valHooks[this.nodeName.toLowerCase()],
                e && "set"in e && void 0 !== e.set(this, n, "value") || (this.value = n))
            })) : n ? (e = pt.valHooks[n.type] || pt.valHooks[n.nodeName.toLowerCase()],
            e && "get"in e && void 0 !== (i = e.get(n, "value")) ? i : (i = n.value,
            "string" == typeof i ? i.replace(Ve, "") : null == i ? "" : i)) : void 0
        }
    }),
    pt.extend({
        valHooks: {
            option: {
                get: function(t) {
                    var e = pt.find.attr(t, "value");
                    return null != e ? e : pt.trim(pt.text(t)).replace(Ie, " ")
                }
            },
            select: {
                get: function(t) {
                    for (var e, i, o = t.options, n = t.selectedIndex, s = "select-one" === t.type || 0 > n, r = s ? null : [], a = s ? n + 1 : o.length, l = 0 > n ? a : s ? n : 0; a > l; l++)
                        if (i = o[l],
                        (i.selected || l === n) && (ht.optDisabled ? !i.disabled : null === i.getAttribute("disabled")) && (!i.parentNode.disabled || !pt.nodeName(i.parentNode, "optgroup"))) {
                            if (e = pt(i).val(),
                            s)
                                return e;
                            r.push(e)
                        }
                    return r
                },
                set: function(t, e) {
                    for (var i, o, n = t.options, s = pt.makeArray(e), r = n.length; r--; )
                        if (o = n[r],
                        pt.inArray(pt.valHooks.option.get(o), s) > -1)
                            try {
                                o.selected = i = !0
                            } catch (a) {
                                o.scrollHeight
                            }
                        else
                            o.selected = !1;
                    return i || (t.selectedIndex = -1),
                    n
                }
            }
        }
    }),
    pt.each(["radio", "checkbox"], function() {
        pt.valHooks[this] = {
            set: function(t, e) {
                return pt.isArray(e) ? t.checked = pt.inArray(pt(t).val(), e) > -1 : void 0
            }
        },
        ht.checkOn || (pt.valHooks[this].get = function(t) {
            return null === t.getAttribute("value") ? "on" : t.value
        }
        )
    });
    var Te, Le, Ge = pt.expr.attrHandle, Fe = /^(?:checked|selected)$/i, Pe = ht.getSetAttribute, Je = ht.input;
    pt.fn.extend({
        attr: function(t, e) {
            return kt(this, pt.attr, t, e, arguments.length > 1)
        },
        removeAttr: function(t) {
            return this.each(function() {
                pt.removeAttr(this, t)
            })
        }
    }),
    pt.extend({
        attr: function(t, e, i) {
            var o, n, s = t.nodeType;
            return 3 !== s && 8 !== s && 2 !== s ? "undefined" == typeof t.getAttribute ? pt.prop(t, e, i) : (1 === s && pt.isXMLDoc(t) || (e = e.toLowerCase(),
            n = pt.attrHooks[e] || (pt.expr.match.bool.test(e) ? Le : Te)),
            void 0 !== i ? null === i ? void pt.removeAttr(t, e) : n && "set"in n && void 0 !== (o = n.set(t, i, e)) ? o : (t.setAttribute(e, i + ""),
            i) : n && "get"in n && null !== (o = n.get(t, e)) ? o : (o = pt.find.attr(t, e),
            null == o ? void 0 : o)) : void 0
        },
        attrHooks: {
            type: {
                set: function(t, e) {
                    if (!ht.radioValue && "radio" === e && pt.nodeName(t, "input")) {
                        var i = t.value;
                        return t.setAttribute("type", e),
                        i && (t.value = i),
                        e
                    }
                }
            }
        },
        removeAttr: function(t, e) {
            var i, o, n = 0, s = e && e.match(Vt);
            if (s && 1 === t.nodeType)
                for (; i = s[n++]; )
                    o = pt.propFix[i] || i,
                    pt.expr.match.bool.test(i) ? Je && Pe || !Fe.test(i) ? t[o] = !1 : t[pt.camelCase("default-" + i)] = t[o] = !1 : pt.attr(t, i, ""),
                    t.removeAttribute(Pe ? i : o)
        }
    }),
    Le = {
        set: function(t, e, i) {
            return e === !1 ? pt.removeAttr(t, i) : Je && Pe || !Fe.test(i) ? t.setAttribute(!Pe && pt.propFix[i] || i, i) : t[pt.camelCase("default-" + i)] = t[i] = !0,
            i
        }
    },
    pt.each(pt.expr.match.bool.source.match(/\w+/g), function(t, e) {
        var i = Ge[e] || pt.find.attr;
        Je && Pe || !Fe.test(e) ? Ge[e] = function(t, e, o) {
            var n, s;
            return o || (s = Ge[e],
            Ge[e] = n,
            n = null != i(t, e, o) ? e.toLowerCase() : null,
            Ge[e] = s),
            n
        }
        : Ge[e] = function(t, e, i) {
            return i ? void 0 : t[pt.camelCase("default-" + e)] ? e.toLowerCase() : null
        }
    }),
    Je && Pe || (pt.attrHooks.value = {
        set: function(t, e, i) {
            return pt.nodeName(t, "input") ? void (t.defaultValue = e) : Te && Te.set(t, e, i)
        }
    }),
    Pe || (Te = {
        set: function(t, e, i) {
            var o = t.getAttributeNode(i);
            return o || t.setAttributeNode(o = t.ownerDocument.createAttribute(i)),
            o.value = e += "",
            "value" === i || e === t.getAttribute(i) ? e : void 0
        }
    },
    Ge.id = Ge.name = Ge.coords = function(t, e, i) {
        var o;
        return i ? void 0 : (o = t.getAttributeNode(e)) && "" !== o.value ? o.value : null
    }
    ,
    pt.valHooks.button = {
        get: function(t, e) {
            var i = t.getAttributeNode(e);
            return i && i.specified ? i.value : void 0
        },
        set: Te.set
    },
    pt.attrHooks.contenteditable = {
        set: function(t, e, i) {
            Te.set(t, "" === e ? !1 : e, i)
        }
    },
    pt.each(["width", "height"], function(t, e) {
        pt.attrHooks[e] = {
            set: function(t, i) {
                return "" === i ? (t.setAttribute(e, "auto"),
                i) : void 0
            }
        }
    })),
    ht.style || (pt.attrHooks.style = {
        get: function(t) {
            return t.style.cssText || void 0
        },
        set: function(t, e) {
            return t.style.cssText = e + ""
        }
    });
    var Ee = /^(?:input|select|textarea|button|object)$/i
      , Re = /^(?:a|area)$/i;
    pt.fn.extend({
        prop: function(t, e) {
            return kt(this, pt.prop, t, e, arguments.length > 1)
        },
        removeProp: function(t) {
            return t = pt.propFix[t] || t,
            this.each(function() {
                try {
                    this[t] = void 0,
                    delete this[t]
                } catch (e) {}
            })
        }
    }),
    pt.extend({
        prop: function(t, e, i) {
            var o, n, s = t.nodeType;
            return 3 !== s && 8 !== s && 2 !== s ? (1 === s && pt.isXMLDoc(t) || (e = pt.propFix[e] || e,
            n = pt.propHooks[e]),
            void 0 !== i ? n && "set"in n && void 0 !== (o = n.set(t, i, e)) ? o : t[e] = i : n && "get"in n && null !== (o = n.get(t, e)) ? o : t[e]) : void 0
        },
        propHooks: {
            tabIndex: {
                get: function(t) {
                    var e = pt.find.attr(t, "tabindex");
                    return e ? parseInt(e, 10) : Ee.test(t.nodeName) || Re.test(t.nodeName) && t.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }),
    ht.hrefNormalized || pt.each(["href", "src"], function(t, e) {
        pt.propHooks[e] = {
            get: function(t) {
                return t.getAttribute(e, 4)
            }
        }
    }),
    ht.optSelected || (pt.propHooks.selected = {
        get: function(t) {
            var e = t.parentNode;
            return e && (e.selectedIndex,
            e.parentNode && e.parentNode.selectedIndex),
            null
        },
        set: function(t) {
            var e = t.parentNode;
            e && (e.selectedIndex,
            e.parentNode && e.parentNode.selectedIndex)
        }
    }),
    pt.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        pt.propFix[this.toLowerCase()] = this
    }),
    ht.enctype || (pt.propFix.enctype = "encoding");
    var ke = /[\t\r\n\f]/g;
    pt.fn.extend({
        addClass: function(t) {
            var e, i, o, n, s, r, a, l = 0;
            if (pt.isFunction(t))
                return this.each(function(e) {
                    pt(this).addClass(t.call(this, e, O(this)))
                });
            if ("string" == typeof t && t)
                for (e = t.match(Vt) || []; i = this[l++]; )
                    if (n = O(i),
                    o = 1 === i.nodeType && (" " + n + " ").replace(ke, " ")) {
                        for (r = 0; s = e[r++]; )
                            o.indexOf(" " + s + " ") < 0 && (o += s + " ");
                        a = pt.trim(o),
                        n !== a && pt.attr(i, "class", a)
                    }
            return this
        },
        removeClass: function(t) {
            var e, i, o, n, s, r, a, l = 0;
            if (pt.isFunction(t))
                return this.each(function(e) {
                    pt(this).removeClass(t.call(this, e, O(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ("string" == typeof t && t)
                for (e = t.match(Vt) || []; i = this[l++]; )
                    if (n = O(i),
                    o = 1 === i.nodeType && (" " + n + " ").replace(ke, " ")) {
                        for (r = 0; s = e[r++]; )
                            for (; o.indexOf(" " + s + " ") > -1; )
                                o = o.replace(" " + s + " ", " ");
                        a = pt.trim(o),
                        n !== a && pt.attr(i, "class", a)
                    }
            return this
        },
        toggleClass: function(t, e) {
            var i = typeof t;
            return "boolean" == typeof e && "string" === i ? e ? this.addClass(t) : this.removeClass(t) : pt.isFunction(t) ? this.each(function(i) {
                pt(this).toggleClass(t.call(this, i, O(this), e), e)
            }) : this.each(function() {
                var e, o, n, s;
                if ("string" === i)
                    for (o = 0,
                    n = pt(this),
                    s = t.match(Vt) || []; e = s[o++]; )
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                else
                    void 0 !== t && "boolean" !== i || (e = O(this),
                    e && pt._data(this, "__className__", e),
                    pt.attr(this, "class", e || t === !1 ? "" : pt._data(this, "__className__") || ""))
            })
        },
        hasClass: function(t) {
            var e, i, o = 0;
            for (e = " " + t + " "; i = this[o++]; )
                if (1 === i.nodeType && (" " + O(i) + " ").replace(ke, " ").indexOf(e) > -1)
                    return !0;
            return !1
        }
    }),
    pt.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(t, e) {
        pt.fn[e] = function(t, i) {
            return arguments.length > 0 ? this.on(e, null, t, i) : this.trigger(e)
        }
    }),
    pt.fn.extend({
        hover: function(t, e) {
            return this.mouseenter(t).mouseleave(e || t)
        }
    });
    var Ne = t.location
      , je = pt.now()
      , ze = /\?/
      , qe = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    pt.parseJSON = function(e) {
        if (t.JSON && t.JSON.parse)
            return t.JSON.parse(e + "");
        var i, o = null, n = pt.trim(e + "");
        return n && !pt.trim(n.replace(qe, function(t, e, n, s) {
            return i && e && (o = 0),
            0 === o ? t : (i = n || e,
            o += !s - !n,
            "")
        })) ? Function("return " + n)() : pt.error("Invalid JSON: " + e)
    }
    ,
    pt.parseXML = function(e) {
        var i, o;
        if (!e || "string" != typeof e)
            return null;
        try {
            t.DOMParser ? (o = new t.DOMParser,
            i = o.parseFromString(e, "text/xml")) : (i = new t.ActiveXObject("Microsoft.XMLDOM"),
            i.async = "false",
            i.loadXML(e))
        } catch (n) {
            i = void 0
        }
        return i && i.documentElement && !i.getElementsByTagName("parsererror").length || pt.error("Invalid XML: " + e),
        i
    }
    ;
    var Oe = /#.*$/
      , We = /([?&])_=[^&]*/
      , Ue = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm
      , He = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
      , $e = /^(?:GET|HEAD)$/
      , Xe = /^\/\//
      , Ke = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/
      , Ze = {}
      , Ye = {}
      , Qe = "*/".concat("*")
      , ti = Ne.href
      , ei = Ke.exec(ti.toLowerCase()) || [];
    pt.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ti,
            type: "GET",
            isLocal: He.test(ei[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Qe,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": pt.parseJSON,
                "text xml": pt.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(t, e) {
            return e ? H(H(t, pt.ajaxSettings), e) : H(pt.ajaxSettings, t)
        },
        ajaxPrefilter: W(Ze),
        ajaxTransport: W(Ye),
        ajax: function(e, i) {
            function o(e, i, o, n) {
                var s, h, x, b, g, C = i;
                2 !== v && (v = 2,
                l && t.clearTimeout(l),
                c = void 0,
                a = n || "",
                D.readyState = e > 0 ? 4 : 0,
                s = e >= 200 && 300 > e || 304 === e,
                o && (b = $(u, D, o)),
                b = X(u, b, D, s),
                s ? (u.ifModified && (g = D.getResponseHeader("Last-Modified"),
                g && (pt.lastModified[r] = g),
                g = D.getResponseHeader("etag"),
                g && (pt.etag[r] = g)),
                204 === e || "HEAD" === u.type ? C = "nocontent" : 304 === e ? C = "notmodified" : (C = b.state,
                h = b.data,
                x = b.error,
                s = !x)) : (x = C,
                !e && C || (C = "error",
                0 > e && (e = 0))),
                D.status = e,
                D.statusText = (i || C) + "",
                s ? _.resolveWith(p, [h, C, D]) : _.rejectWith(p, [D, C, x]),
                D.statusCode(f),
                f = void 0,
                m && y.trigger(s ? "ajaxSuccess" : "ajaxError", [D, u, s ? h : x]),
                d.fireWith(p, [D, C]),
                m && (y.trigger("ajaxComplete", [D, u]),
                --pt.active || pt.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (i = e,
            e = void 0),
            i = i || {};
            var n, s, r, a, l, m, c, h, u = pt.ajaxSetup({}, i), p = u.context || u, y = u.context && (p.nodeType || p.jquery) ? pt(p) : pt.event, _ = pt.Deferred(), d = pt.Callbacks("once memory"), f = u.statusCode || {}, x = {}, b = {}, v = 0, g = "canceled", D = {
                readyState: 0,
                getResponseHeader: function(t) {
                    var e;
                    if (2 === v) {
                        if (!h)
                            for (h = {}; e = Ue.exec(a); )
                                h[e[1].toLowerCase()] = e[2];
                        e = h[t.toLowerCase()]
                    }
                    return null == e ? null : e
                },
                getAllResponseHeaders: function() {
                    return 2 === v ? a : null
                },
                setRequestHeader: function(t, e) {
                    var i = t.toLowerCase();
                    return v || (t = b[i] = b[i] || t,
                    x[t] = e),
                    this
                },
                overrideMimeType: function(t) {
                    return v || (u.mimeType = t),
                    this
                },
                statusCode: function(t) {
                    var e;
                    if (t)
                        if (2 > v)
                            for (e in t)
                                f[e] = [f[e], t[e]];
                        else
                            D.always(t[D.status]);
                    return this
                },
                abort: function(t) {
                    var e = t || g;
                    return c && c.abort(e),
                    o(0, e),
                    this
                }
            };
            if (_.promise(D).complete = d.add,
            D.success = D.done,
            D.error = D.fail,
            u.url = ((e || u.url || ti) + "").replace(Oe, "").replace(Xe, ei[1] + "//"),
            u.type = i.method || i.type || u.method || u.type,
            u.dataTypes = pt.trim(u.dataType || "*").toLowerCase().match(Vt) || [""],
            null == u.crossDomain && (n = Ke.exec(u.url.toLowerCase()),
            u.crossDomain = !(!n || n[1] === ei[1] && n[2] === ei[2] && (n[3] || ("http:" === n[1] ? "80" : "443")) === (ei[3] || ("http:" === ei[1] ? "80" : "443")))),
            u.data && u.processData && "string" != typeof u.data && (u.data = pt.param(u.data, u.traditional)),
            U(Ze, u, i, D),
            2 === v)
                return D;
            m = pt.event && u.global,
            m && 0 === pt.active++ && pt.event.trigger("ajaxStart"),
            u.type = u.type.toUpperCase(),
            u.hasContent = !$e.test(u.type),
            r = u.url,
            u.hasContent || (u.data && (r = u.url += (ze.test(r) ? "&" : "?") + u.data,
            delete u.data),
            u.cache === !1 && (u.url = We.test(r) ? r.replace(We, "$1_=" + je++) : r + (ze.test(r) ? "&" : "?") + "_=" + je++)),
            u.ifModified && (pt.lastModified[r] && D.setRequestHeader("If-Modified-Since", pt.lastModified[r]),
            pt.etag[r] && D.setRequestHeader("If-None-Match", pt.etag[r])),
            (u.data && u.hasContent && u.contentType !== !1 || i.contentType) && D.setRequestHeader("Content-Type", u.contentType),
            D.setRequestHeader("Accept", u.dataTypes[0] && u.accepts[u.dataTypes[0]] ? u.accepts[u.dataTypes[0]] + ("*" !== u.dataTypes[0] ? ", " + Qe + "; q=0.01" : "") : u.accepts["*"]);
            for (s in u.headers)
                D.setRequestHeader(s, u.headers[s]);
            if (u.beforeSend && (u.beforeSend.call(p, D, u) === !1 || 2 === v))
                return D.abort();
            g = "abort";
            for (s in {
                success: 1,
                error: 1,
                complete: 1
            })
                D[s](u[s]);
            if (c = U(Ye, u, i, D)) {
                if (D.readyState = 1,
                m && y.trigger("ajaxSend", [D, u]),
                2 === v)
                    return D;
                u.async && u.timeout > 0 && (l = t.setTimeout(function() {
                    D.abort("timeout")
                }, u.timeout));
                try {
                    v = 1,
                    c.send(x, o)
                } catch (C) {
                    if (!(2 > v))
                        throw C;
                    o(-1, C)
                }
            } else
                o(-1, "No Transport");
            return D
        },
        getJSON: function(t, e, i) {
            return pt.get(t, e, i, "json")
        },
        getScript: function(t, e) {
            return pt.get(t, void 0, e, "script")
        }
    }),
    pt.each(["get", "post"], function(t, e) {
        pt[e] = function(t, i, o, n) {
            return pt.isFunction(i) && (n = n || o,
            o = i,
            i = void 0),
            pt.ajax(pt.extend({
                url: t,
                type: e,
                dataType: n,
                data: i,
                success: o
            }, pt.isPlainObject(t) && t))
        }
    }),
    pt._evalUrl = function(t) {
        return pt.ajax({
            url: t,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            "throws": !0
        })
    }
    ,
    pt.fn.extend({
        wrapAll: function(t) {
            if (pt.isFunction(t))
                return this.each(function(e) {
                    pt(this).wrapAll(t.call(this, e))
                });
            if (this[0]) {
                var e = pt(t, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && e.insertBefore(this[0]),
                e.map(function() {
                    for (var t = this; t.firstChild && 1 === t.firstChild.nodeType; )
                        t = t.firstChild;
                    return t
                }).append(this)
            }
            return this
        },
        wrapInner: function(t) {
            return pt.isFunction(t) ? this.each(function(e) {
                pt(this).wrapInner(t.call(this, e))
            }) : this.each(function() {
                var e = pt(this)
                  , i = e.contents();
                i.length ? i.wrapAll(t) : e.append(t)
            })
        },
        wrap: function(t) {
            var e = pt.isFunction(t);
            return this.each(function(i) {
                pt(this).wrapAll(e ? t.call(this, i) : t)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                pt.nodeName(this, "body") || pt(this).replaceWith(this.childNodes)
            }).end()
        }
    }),
    pt.expr.filters.hidden = function(t) {
        return ht.reliableHiddenOffsets() ? t.offsetWidth <= 0 && t.offsetHeight <= 0 && !t.getClientRects().length : Z(t)
    }
    ,
    pt.expr.filters.visible = function(t) {
        return !pt.expr.filters.hidden(t)
    }
    ;
    var ii = /%20/g
      , oi = /\[\]$/
      , ni = /\r?\n/g
      , si = /^(?:submit|button|image|reset|file)$/i
      , ri = /^(?:input|select|textarea|keygen)/i;
    pt.param = function(t, e) {
        var i, o = [], n = function(t, e) {
            e = pt.isFunction(e) ? e() : null == e ? "" : e,
            o[o.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e)
        };
        if (void 0 === e && (e = pt.ajaxSettings && pt.ajaxSettings.traditional),
        pt.isArray(t) || t.jquery && !pt.isPlainObject(t))
            pt.each(t, function() {
                n(this.name, this.value)
            });
        else
            for (i in t)
                Y(i, t[i], e, n);
        return o.join("&").replace(ii, "+")
    }
    ,
    pt.fn.extend({
        serialize: function() {
            return pt.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var t = pt.prop(this, "elements");
                return t ? pt.makeArray(t) : this
            }).filter(function() {
                var t = this.type;
                return this.name && !pt(this).is(":disabled") && ri.test(this.nodeName) && !si.test(t) && (this.checked || !Nt.test(t))
            }).map(function(t, e) {
                var i = pt(this).val();
                return null == i ? null : pt.isArray(i) ? pt.map(i, function(t) {
                    return {
                        name: e.name,
                        value: t.replace(ni, "\r\n")
                    }
                }) : {
                    name: e.name,
                    value: i.replace(ni, "\r\n")
                }
            }).get()
        }
    }),
    pt.ajaxSettings.xhr = void 0 !== t.ActiveXObject ? function() {
        return this.isLocal ? tt() : ot.documentMode > 8 ? Q() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Q() || tt()
    }
    : Q;
    var ai = 0
      , li = {}
      , mi = pt.ajaxSettings.xhr();
    t.attachEvent && t.attachEvent("onunload", function() {
        for (var t in li)
            li[t](void 0, !0)
    }),
    ht.cors = !!mi && "withCredentials"in mi,
    mi = ht.ajax = !!mi,
    mi && pt.ajaxTransport(function(e) {
        if (!e.crossDomain || ht.cors) {
            var i;
            return {
                send: function(o, n) {
                    var s, r = e.xhr(), a = ++ai;
                    if (r.open(e.type, e.url, e.async, e.username, e.password),
                    e.xhrFields)
                        for (s in e.xhrFields)
                            r[s] = e.xhrFields[s];
                    e.mimeType && r.overrideMimeType && r.overrideMimeType(e.mimeType),
                    e.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest");
                    for (s in o)
                        void 0 !== o[s] && r.setRequestHeader(s, o[s] + "");
                    r.send(e.hasContent && e.data || null),
                    i = function(t, o) {
                        var s, l, m;
                        if (i && (o || 4 === r.readyState))
                            if (delete li[a],
                            i = void 0,
                            r.onreadystatechange = pt.noop,
                            o)
                                4 !== r.readyState && r.abort();
                            else {
                                m = {},
                                s = r.status,
                                "string" == typeof r.responseText && (m.text = r.responseText);
                                try {
                                    l = r.statusText
                                } catch (c) {
                                    l = ""
                                }
                                s || !e.isLocal || e.crossDomain ? 1223 === s && (s = 204) : s = m.text ? 200 : 404
                            }
                        m && n(s, l, m, r.getAllResponseHeaders())
                    }
                    ,
                    e.async ? 4 === r.readyState ? t.setTimeout(i) : r.onreadystatechange = li[a] = i : i()
                },
                abort: function() {
                    i && i(void 0, !0)
                }
            }
        }
    }),
    pt.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(t) {
                return pt.globalEval(t),
                t
            }
        }
    }),
    pt.ajaxPrefilter("script", function(t) {
        void 0 === t.cache && (t.cache = !1),
        t.crossDomain && (t.type = "GET",
        t.global = !1)
    }),
    pt.ajaxTransport("script", function(t) {
        if (t.crossDomain) {
            var e, i = ot.head || pt("head")[0] || ot.documentElement;
            return {
                send: function(o, n) {
                    e = ot.createElement("script"),
                    e.async = !0,
                    t.scriptCharset && (e.charset = t.scriptCharset),
                    e.src = t.url,
                    e.onload = e.onreadystatechange = function(t, i) {
                        (i || !e.readyState || /loaded|complete/.test(e.readyState)) && (e.onload = e.onreadystatechange = null,
                        e.parentNode && e.parentNode.removeChild(e),
                        e = null,
                        i || n(200, "success"))
                    }
                    ,
                    i.insertBefore(e, i.firstChild)
                },
                abort: function() {
                    e && e.onload(void 0, !0)
                }
            }
        }
    });
    var ci = []
      , hi = /(=)\?(?=&|$)|\?\?/;
    pt.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var t = ci.pop() || pt.expando + "_" + je++;
            return this[t] = !0,
            t
        }
    }),
    pt.ajaxPrefilter("json jsonp", function(e, i, o) {
        var n, s, r, a = e.jsonp !== !1 && (hi.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && hi.test(e.data) && "data");
        return a || "jsonp" === e.dataTypes[0] ? (n = e.jsonpCallback = pt.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
        a ? e[a] = e[a].replace(hi, "$1" + n) : e.jsonp !== !1 && (e.url += (ze.test(e.url) ? "&" : "?") + e.jsonp + "=" + n),
        e.converters["script json"] = function() {
            return r || pt.error(n + " was not called"),
            r[0]
        }
        ,
        e.dataTypes[0] = "json",
        s = t[n],
        t[n] = function() {
            r = arguments
        }
        ,
        o.always(function() {
            void 0 === s ? pt(t).removeProp(n) : t[n] = s,
            e[n] && (e.jsonpCallback = i.jsonpCallback,
            ci.push(n)),
            r && pt.isFunction(s) && s(r[0]),
            r = s = void 0
        }),
        "script") : void 0
    }),
    pt.parseHTML = function(t, e, i) {
        if (!t || "string" != typeof t)
            return null;
        "boolean" == typeof e && (i = e,
        e = !1),
        e = e || ot;
        var o = Dt.exec(t)
          , n = !i && [];
        return o ? [e.createElement(o[1])] : (o = f([t], e, n),
        n && n.length && pt(n).remove(),
        pt.merge([], o.childNodes))
    }
    ;
    var ui = pt.fn.load;
    pt.fn.load = function(t, e, i) {
        if ("string" != typeof t && ui)
            return ui.apply(this, arguments);
        var o, n, s, r = this, a = t.indexOf(" ");
        return a > -1 && (o = pt.trim(t.slice(a, t.length)),
        t = t.slice(0, a)),
        pt.isFunction(e) ? (i = e,
        e = void 0) : e && "object" == typeof e && (n = "POST"),
        r.length > 0 && pt.ajax({
            url: t,
            type: n || "GET",
            dataType: "html",
            data: e
        }).done(function(t) {
            s = arguments,
            r.html(o ? pt("<div>").append(pt.parseHTML(t)).find(o) : t)
        }).always(i && function(t, e) {
            r.each(function() {
                i.apply(this, s || [t.responseText, e, t])
            })
        }
        ),
        this
    }
    ,
    pt.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
        pt.fn[e] = function(t) {
            return this.on(e, t)
        }
    }),
    pt.expr.filters.animated = function(t) {
        return pt.grep(pt.timers, function(e) {
            return t === e.elem
        }).length
    }
    ,
    pt.offset = {
        setOffset: function(t, e, i) {
            var o, n, s, r, a, l, m, c = pt.css(t, "position"), h = pt(t), u = {};
            "static" === c && (t.style.position = "relative"),
            a = h.offset(),
            s = pt.css(t, "top"),
            l = pt.css(t, "left"),
            m = ("absolute" === c || "fixed" === c) && pt.inArray("auto", [s, l]) > -1,
            m ? (o = h.position(),
            r = o.top,
            n = o.left) : (r = parseFloat(s) || 0,
            n = parseFloat(l) || 0),
            pt.isFunction(e) && (e = e.call(t, i, pt.extend({}, a))),
            null != e.top && (u.top = e.top - a.top + r),
            null != e.left && (u.left = e.left - a.left + n),
            "using"in e ? e.using.call(t, u) : h.css(u)
        }
    },
    pt.fn.extend({
        offset: function(t) {
            if (arguments.length)
                return void 0 === t ? this : this.each(function(e) {
                    pt.offset.setOffset(this, t, e)
                });
            var e, i, o = {
                top: 0,
                left: 0
            }, n = this[0], s = n && n.ownerDocument;
            return s ? (e = s.documentElement,
            pt.contains(e, n) ? ("undefined" != typeof n.getBoundingClientRect && (o = n.getBoundingClientRect()),
            i = et(s),
            {
                top: o.top + (i.pageYOffset || e.scrollTop) - (e.clientTop || 0),
                left: o.left + (i.pageXOffset || e.scrollLeft) - (e.clientLeft || 0)
            }) : o) : void 0
        },
        position: function() {
            if (this[0]) {
                var t, e, i = {
                    top: 0,
                    left: 0
                }, o = this[0];
                return "fixed" === pt.css(o, "position") ? e = o.getBoundingClientRect() : (t = this.offsetParent(),
                e = this.offset(),
                pt.nodeName(t[0], "html") || (i = t.offset()),
                i.top += pt.css(t[0], "borderTopWidth", !0),
                i.left += pt.css(t[0], "borderLeftWidth", !0)),
                {
                    top: e.top - i.top - pt.css(o, "marginTop", !0),
                    left: e.left - i.left - pt.css(o, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var t = this.offsetParent; t && !pt.nodeName(t, "html") && "static" === pt.css(t, "position"); )
                    t = t.offsetParent;
                return t || pe
            })
        }
    }),
    pt.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, e) {
        var i = /Y/.test(e);
        pt.fn[t] = function(o) {
            return kt(this, function(t, o, n) {
                var s = et(t);
                return void 0 === n ? s ? e in s ? s[e] : s.document.documentElement[o] : t[o] : void (s ? s.scrollTo(i ? pt(s).scrollLeft() : n, i ? n : pt(s).scrollTop()) : t[o] = n)
            }, t, o, arguments.length, null)
        }
    }),
    pt.each(["top", "left"], function(t, e) {
        pt.cssHooks[e] = T(ht.pixelPosition, function(t, i) {
            return i ? (i = _e(t, e),
            he.test(i) ? pt(t).position()[e] + "px" : i) : void 0
        })
    }),
    pt.each({
        Height: "height",
        Width: "width"
    }, function(t, e) {
        pt.each({
            padding: "inner" + t,
            content: e,
            "": "outer" + t
        }, function(i, o) {
            pt.fn[o] = function(o, n) {
                var s = arguments.length && (i || "boolean" != typeof o)
                  , r = i || (o === !0 || n === !0 ? "margin" : "border");
                return kt(this, function(e, i, o) {
                    var n;
                    return pt.isWindow(e) ? e.document.documentElement["client" + t] : 9 === e.nodeType ? (n = e.documentElement,
                    Math.max(e.body["scroll" + t], n["scroll" + t], e.body["offset" + t], n["offset" + t], n["client" + t])) : void 0 === o ? pt.css(e, i, r) : pt.style(e, i, o, r)
                }, e, s ? o : void 0, s, null)
            }
        })
    }),
    pt.fn.extend({
        bind: function(t, e, i) {
            return this.on(t, null, e, i)
        },
        unbind: function(t, e) {
            return this.off(t, null, e)
        },
        delegate: function(t, e, i, o) {
            return this.on(e, t, i, o)
        },
        undelegate: function(t, e, i) {
            return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", i)
        }
    }),
    pt.fn.size = function() {
        return this.length
    }
    ,
    pt.fn.andSelf = pt.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return pt
    });
    var pi = t.jQuery
      , yi = t.$;
    return pt.noConflict = function(e) {
        return t.$ === pt && (t.$ = yi),
        e && t.jQuery === pt && (t.jQuery = pi),
        pt
    }
    ,
    e || (t.jQuery = t.$ = pt),
    pt
});
var Box2D = {};
!function(t, e) {
    function i() {}
    !(Object.prototype.defineProperty instanceof Function) && Object.prototype.__defineGetter__ instanceof Function && Object.prototype.__defineSetter__ instanceof Function && (Object.defineProperty = function(t, e, i) {
        i.get instanceof Function && t.__defineGetter__(e, i.get),
        i.set instanceof Function && t.__defineSetter__(e, i.set)
    }
    ),
    t.inherit = function(t, e) {
        var o = t;
        i.prototype = e.prototype,
        t.prototype = new i,
        t.prototype.constructor = o
    }
    ,
    t.generateCallback = function(t, e) {
        return function() {
            e.apply(t, arguments)
        }
    }
    ,
    t.NVector = function(t) {
        t === e && (t = 0);
        for (var i = new Array(t || 0), o = 0; t > o; ++o)
            i[o] = 0;
        return i
    }
    ,
    t.is = function(t, i) {
        return null === t ? !1 : i instanceof Function && t instanceof i ? !0 : !(t.constructor.__implements == e || !t.constructor.__implements[i])
    }
    ,
    t.parseUInt = function(t) {
        return Math.abs(parseInt(t))
    }
}(Box2D);
var Vector = Array
  , Vector_a2j_Number = Box2D.NVector;
"undefined" == typeof Box2D && (Box2D = {}),
"undefined" == typeof Box2D.Collision && (Box2D.Collision = {}),
"undefined" == typeof Box2D.Collision.Shapes && (Box2D.Collision.Shapes = {}),
"undefined" == typeof Box2D.Common && (Box2D.Common = {}),
"undefined" == typeof Box2D.Common.Math && (Box2D.Common.Math = {}),
"undefined" == typeof Box2D.Dynamics && (Box2D.Dynamics = {}),
"undefined" == typeof Box2D.Dynamics.Contacts && (Box2D.Dynamics.Contacts = {}),
"undefined" == typeof Box2D.Dynamics.Controllers && (Box2D.Dynamics.Controllers = {}),
"undefined" == typeof Box2D.Dynamics.Joints && (Box2D.Dynamics.Joints = {}),
function() {
    function t() {
        t.b2AABB.apply(this, arguments)
    }
    function e() {
        e.b2Bound.apply(this, arguments)
    }
    function i() {
        i.b2BoundValues.apply(this, arguments),
        this.constructor === i && this.b2BoundValues.apply(this, arguments)
    }
    function o() {
        o.b2Collision.apply(this, arguments)
    }
    function n() {
        n.b2ContactID.apply(this, arguments),
        this.constructor === n && this.b2ContactID.apply(this, arguments)
    }
    function s() {
        s.b2ContactPoint.apply(this, arguments)
    }
    function r() {
        r.b2Distance.apply(this, arguments)
    }
    function a() {
        a.b2DistanceInput.apply(this, arguments)
    }
    function l() {
        l.b2DistanceOutput.apply(this, arguments)
    }
    function m() {
        m.b2DistanceProxy.apply(this, arguments)
    }
    function c() {
        c.b2DynamicTree.apply(this, arguments),
        this.constructor === c && this.b2DynamicTree.apply(this, arguments)
    }
    function h() {
        h.b2DynamicTreeBroadPhase.apply(this, arguments)
    }
    function u() {
        u.b2DynamicTreeNode.apply(this, arguments)
    }
    function p() {
        p.b2DynamicTreePair.apply(this, arguments)
    }
    function y() {
        y.b2Manifold.apply(this, arguments),
        this.constructor === y && this.b2Manifold.apply(this, arguments)
    }
    function _() {
        _.b2ManifoldPoint.apply(this, arguments),
        this.constructor === _ && this.b2ManifoldPoint.apply(this, arguments)
    }
    function d() {
        d.b2Point.apply(this, arguments)
    }
    function f() {
        f.b2RayCastInput.apply(this, arguments),
        this.constructor === f && this.b2RayCastInput.apply(this, arguments)
    }
    function x() {
        x.b2RayCastOutput.apply(this, arguments)
    }
    function b() {
        b.b2Segment.apply(this, arguments)
    }
    function v() {
        v.b2SeparationFunction.apply(this, arguments)
    }
    function g() {
        g.b2Simplex.apply(this, arguments),
        this.constructor === g && this.b2Simplex.apply(this, arguments)
    }
    function D() {
        D.b2SimplexCache.apply(this, arguments)
    }
    function C() {
        C.b2SimplexVertex.apply(this, arguments)
    }
    function B() {
        B.b2TimeOfImpact.apply(this, arguments)
    }
    function w() {
        w.b2TOIInput.apply(this, arguments)
    }
    function A() {
        A.b2WorldManifold.apply(this, arguments),
        this.constructor === A && this.b2WorldManifold.apply(this, arguments)
    }
    function S() {
        S.ClipVertex.apply(this, arguments)
    }
    function M() {
        M.Features.apply(this, arguments)
    }
    function V() {
        V.b2CircleShape.apply(this, arguments),
        this.constructor === V && this.b2CircleShape.apply(this, arguments)
    }
    function I() {
        I.b2EdgeChainDef.apply(this, arguments),
        this.constructor === I && this.b2EdgeChainDef.apply(this, arguments)
    }
    function T() {
        T.b2EdgeShape.apply(this, arguments),
        this.constructor === T && this.b2EdgeShape.apply(this, arguments)
    }
    function L() {
        L.b2MassData.apply(this, arguments)
    }
    function G() {
        G.b2PolygonShape.apply(this, arguments),
        this.constructor === G && this.b2PolygonShape.apply(this, arguments)
    }
    function F() {
        F.b2Shape.apply(this, arguments),
        this.constructor === F && this.b2Shape.apply(this, arguments)
    }
    function P() {
        P.b2Color.apply(this, arguments),
        this.constructor === P && this.b2Color.apply(this, arguments)
    }
    function J() {
        J.b2Settings.apply(this, arguments)
    }
    function E() {
        E.b2Mat22.apply(this, arguments),
        this.constructor === E && this.b2Mat22.apply(this, arguments)
    }
    function R() {
        R.b2Mat33.apply(this, arguments),
        this.constructor === R && this.b2Mat33.apply(this, arguments)
    }
    function k() {
        k.b2Math.apply(this, arguments)
    }
    function N() {
        N.b2Sweep.apply(this, arguments)
    }
    function j() {
        j.b2Transform.apply(this, arguments),
        this.constructor === j && this.b2Transform.apply(this, arguments)
    }
    function z() {
        z.b2Vec2.apply(this, arguments),
        this.constructor === z && this.b2Vec2.apply(this, arguments)
    }
    function q() {
        q.b2Vec3.apply(this, arguments),
        this.constructor === q && this.b2Vec3.apply(this, arguments)
    }
    function O() {
        O.b2Body.apply(this, arguments),
        this.constructor === O && this.b2Body.apply(this, arguments)
    }
    function W() {
        W.b2BodyDef.apply(this, arguments),
        this.constructor === W && this.b2BodyDef.apply(this, arguments)
    }
    function U() {
        U.b2ContactFilter.apply(this, arguments)
    }
    function H() {
        H.b2ContactImpulse.apply(this, arguments)
    }
    function $() {
        $.b2ContactListener.apply(this, arguments)
    }
    function X() {
        X.b2ContactManager.apply(this, arguments),
        this.constructor === X && this.b2ContactManager.apply(this, arguments)
    }
    function K() {
        K.b2DebugDraw.apply(this, arguments),
        this.constructor === K && this.b2DebugDraw.apply(this, arguments)
    }
    function Z() {
        Z.b2DestructionListener.apply(this, arguments)
    }
    function Y() {
        Y.b2FilterData.apply(this, arguments)
    }
    function Q() {
        Q.b2Fixture.apply(this, arguments),
        this.constructor === Q && this.b2Fixture.apply(this, arguments)
    }
    function tt() {
        tt.b2FixtureDef.apply(this, arguments),
        this.constructor === tt && this.b2FixtureDef.apply(this, arguments)
    }
    function et() {
        et.b2Island.apply(this, arguments),
        this.constructor === et && this.b2Island.apply(this, arguments)
    }
    function it() {
        it.b2TimeStep.apply(this, arguments)
    }
    function ot() {
        ot.b2World.apply(this, arguments),
        this.constructor === ot && this.b2World.apply(this, arguments)
    }
    function nt() {
        nt.b2CircleContact.apply(this, arguments)
    }
    function st() {
        st.b2Contact.apply(this, arguments),
        this.constructor === st && this.b2Contact.apply(this, arguments)
    }
    function rt() {
        rt.b2ContactConstraint.apply(this, arguments),
        this.constructor === rt && this.b2ContactConstraint.apply(this, arguments)
    }
    function at() {
        at.b2ContactConstraintPoint.apply(this, arguments)
    }
    function lt() {
        lt.b2ContactEdge.apply(this, arguments)
    }
    function mt() {
        mt.b2ContactFactory.apply(this, arguments),
        this.constructor === mt && this.b2ContactFactory.apply(this, arguments)
    }
    function ct() {
        ct.b2ContactRegister.apply(this, arguments)
    }
    function ht() {
        ht.b2ContactResult.apply(this, arguments)
    }
    function ut() {
        ut.b2ContactSolver.apply(this, arguments),
        this.constructor === ut && this.b2ContactSolver.apply(this, arguments)
    }
    function pt() {
        pt.b2EdgeAndCircleContact.apply(this, arguments)
    }
    function yt() {
        yt.b2NullContact.apply(this, arguments),
        this.constructor === yt && this.b2NullContact.apply(this, arguments)
    }
    function _t() {
        _t.b2PolyAndCircleContact.apply(this, arguments)
    }
    function dt() {
        dt.b2PolyAndEdgeContact.apply(this, arguments)
    }
    function ft() {
        ft.b2PolygonContact.apply(this, arguments)
    }
    function xt() {
        xt.b2PositionSolverManifold.apply(this, arguments),
        this.constructor === xt && this.b2PositionSolverManifold.apply(this, arguments)
    }
    function bt() {
        bt.b2BuoyancyController.apply(this, arguments)
    }
    function vt() {
        vt.b2ConstantAccelController.apply(this, arguments)
    }
    function gt() {
        gt.b2ConstantForceController.apply(this, arguments)
    }
    function Dt() {
        Dt.b2Controller.apply(this, arguments)
    }
    function Ct() {
        Ct.b2ControllerEdge.apply(this, arguments)
    }
    function Bt() {
        Bt.b2GravityController.apply(this, arguments)
    }
    function wt() {
        wt.b2TensorDampingController.apply(this, arguments)
    }
    function At() {
        At.b2DistanceJoint.apply(this, arguments),
        this.constructor === At && this.b2DistanceJoint.apply(this, arguments)
    }
    function St() {
        St.b2DistanceJointDef.apply(this, arguments),
        this.constructor === St && this.b2DistanceJointDef.apply(this, arguments)
    }
    function Mt() {
        Mt.b2FrictionJoint.apply(this, arguments),
        this.constructor === Mt && this.b2FrictionJoint.apply(this, arguments)
    }
    function Vt() {
        Vt.b2FrictionJointDef.apply(this, arguments),
        this.constructor === Vt && this.b2FrictionJointDef.apply(this, arguments)
    }
    function It() {
        It.b2GearJoint.apply(this, arguments),
        this.constructor === It && this.b2GearJoint.apply(this, arguments)
    }
    function Tt() {
        Tt.b2GearJointDef.apply(this, arguments),
        this.constructor === Tt && this.b2GearJointDef.apply(this, arguments)
    }
    function Lt() {
        Lt.b2Jacobian.apply(this, arguments)
    }
    function Gt() {
        Gt.b2Joint.apply(this, arguments),
        this.constructor === Gt && this.b2Joint.apply(this, arguments)
    }
    function Ft() {
        Ft.b2JointDef.apply(this, arguments),
        this.constructor === Ft && this.b2JointDef.apply(this, arguments)
    }
    function Pt() {
        Pt.b2JointEdge.apply(this, arguments)
    }
    function Jt() {
        Jt.b2LineJoint.apply(this, arguments),
        this.constructor === Jt && this.b2LineJoint.apply(this, arguments)
    }
    function Et() {
        Et.b2LineJointDef.apply(this, arguments),
        this.constructor === Et && this.b2LineJointDef.apply(this, arguments)
    }
    function Rt() {
        Rt.b2MouseJoint.apply(this, arguments),
        this.constructor === Rt && this.b2MouseJoint.apply(this, arguments)
    }
    function kt() {
        kt.b2MouseJointDef.apply(this, arguments),
        this.constructor === kt && this.b2MouseJointDef.apply(this, arguments)
    }
    function Nt() {
        Nt.b2PrismaticJoint.apply(this, arguments),
        this.constructor === Nt && this.b2PrismaticJoint.apply(this, arguments)
    }
    function jt() {
        jt.b2PrismaticJointDef.apply(this, arguments),
        this.constructor === jt && this.b2PrismaticJointDef.apply(this, arguments)
    }
    function zt() {
        zt.b2PulleyJoint.apply(this, arguments),
        this.constructor === zt && this.b2PulleyJoint.apply(this, arguments)
    }
    function qt() {
        qt.b2PulleyJointDef.apply(this, arguments),
        this.constructor === qt && this.b2PulleyJointDef.apply(this, arguments)
    }
    function Ot() {
        Ot.b2RevoluteJoint.apply(this, arguments),
        this.constructor === Ot && this.b2RevoluteJoint.apply(this, arguments)
    }
    function Wt() {
        Wt.b2RevoluteJointDef.apply(this, arguments),
        this.constructor === Wt && this.b2RevoluteJointDef.apply(this, arguments)
    }
    function Ut() {
        Ut.b2WeldJoint.apply(this, arguments),
        this.constructor === Ut && this.b2WeldJoint.apply(this, arguments)
    }
    function Ht() {
        Ht.b2WeldJointDef.apply(this, arguments),
        this.constructor === Ht && this.b2WeldJointDef.apply(this, arguments)
    }
    Box2D.Collision.IBroadPhase = "Box2D.Collision.IBroadPhase",
    Box2D.Collision.b2AABB = t,
    Box2D.Collision.b2Bound = e,
    Box2D.Collision.b2BoundValues = i,
    Box2D.Collision.b2Collision = o,
    Box2D.Collision.b2ContactID = n,
    Box2D.Collision.b2ContactPoint = s,
    Box2D.Collision.b2Distance = r,
    Box2D.Collision.b2DistanceInput = a,
    Box2D.Collision.b2DistanceOutput = l,
    Box2D.Collision.b2DistanceProxy = m,
    Box2D.Collision.b2DynamicTree = c,
    Box2D.Collision.b2DynamicTreeBroadPhase = h,
    Box2D.Collision.b2DynamicTreeNode = u,
    Box2D.Collision.b2DynamicTreePair = p,
    Box2D.Collision.b2Manifold = y,
    Box2D.Collision.b2ManifoldPoint = _,
    Box2D.Collision.b2Point = d,
    Box2D.Collision.b2RayCastInput = f,
    Box2D.Collision.b2RayCastOutput = x,
    Box2D.Collision.b2Segment = b,
    Box2D.Collision.b2SeparationFunction = v,
    Box2D.Collision.b2Simplex = g,
    Box2D.Collision.b2SimplexCache = D,
    Box2D.Collision.b2SimplexVertex = C,
    Box2D.Collision.b2TimeOfImpact = B,
    Box2D.Collision.b2TOIInput = w,
    Box2D.Collision.b2WorldManifold = A,
    Box2D.Collision.ClipVertex = S,
    Box2D.Collision.Features = M,
    Box2D.Collision.Shapes.b2CircleShape = V,
    Box2D.Collision.Shapes.b2EdgeChainDef = I,
    Box2D.Collision.Shapes.b2EdgeShape = T,
    Box2D.Collision.Shapes.b2MassData = L,
    Box2D.Collision.Shapes.b2PolygonShape = G,
    Box2D.Collision.Shapes.b2Shape = F,
    Box2D.Common.b2internal = "Box2D.Common.b2internal",
    Box2D.Common.b2Color = P,
    Box2D.Common.b2Settings = J,
    Box2D.Common.Math.b2Mat22 = E,
    Box2D.Common.Math.b2Mat33 = R,
    Box2D.Common.Math.b2Math = k,
    Box2D.Common.Math.b2Sweep = N,
    Box2D.Common.Math.b2Transform = j,
    Box2D.Common.Math.b2Vec2 = z,
    Box2D.Common.Math.b2Vec3 = q,
    Box2D.Dynamics.b2Body = O,
    Box2D.Dynamics.b2BodyDef = W,
    Box2D.Dynamics.b2ContactFilter = U,
    Box2D.Dynamics.b2ContactImpulse = H,
    Box2D.Dynamics.b2ContactListener = $,
    Box2D.Dynamics.b2ContactManager = X,
    Box2D.Dynamics.b2DebugDraw = K,
    Box2D.Dynamics.b2DestructionListener = Z,
    Box2D.Dynamics.b2FilterData = Y,
    Box2D.Dynamics.b2Fixture = Q,
    Box2D.Dynamics.b2FixtureDef = tt,
    Box2D.Dynamics.b2Island = et,
    Box2D.Dynamics.b2TimeStep = it,
    Box2D.Dynamics.b2World = ot,
    Box2D.Dynamics.Contacts.b2CircleContact = nt,
    Box2D.Dynamics.Contacts.b2Contact = st,
    Box2D.Dynamics.Contacts.b2ContactConstraint = rt,
    Box2D.Dynamics.Contacts.b2ContactConstraintPoint = at,
    Box2D.Dynamics.Contacts.b2ContactEdge = lt,
    Box2D.Dynamics.Contacts.b2ContactFactory = mt,
    Box2D.Dynamics.Contacts.b2ContactRegister = ct,
    Box2D.Dynamics.Contacts.b2ContactResult = ht,
    Box2D.Dynamics.Contacts.b2ContactSolver = ut,
    Box2D.Dynamics.Contacts.b2EdgeAndCircleContact = pt,
    Box2D.Dynamics.Contacts.b2NullContact = yt,
    Box2D.Dynamics.Contacts.b2PolyAndCircleContact = _t,
    Box2D.Dynamics.Contacts.b2PolyAndEdgeContact = dt,
    Box2D.Dynamics.Contacts.b2PolygonContact = ft,
    Box2D.Dynamics.Contacts.b2PositionSolverManifold = xt,
    Box2D.Dynamics.Controllers.b2BuoyancyController = bt,
    Box2D.Dynamics.Controllers.b2ConstantAccelController = vt,
    Box2D.Dynamics.Controllers.b2ConstantForceController = gt,
    Box2D.Dynamics.Controllers.b2Controller = Dt,
    Box2D.Dynamics.Controllers.b2ControllerEdge = Ct,
    Box2D.Dynamics.Controllers.b2GravityController = Bt,
    Box2D.Dynamics.Controllers.b2TensorDampingController = wt,
    Box2D.Dynamics.Joints.b2DistanceJoint = At,
    Box2D.Dynamics.Joints.b2DistanceJointDef = St,
    Box2D.Dynamics.Joints.b2FrictionJoint = Mt,
    Box2D.Dynamics.Joints.b2FrictionJointDef = Vt,
    Box2D.Dynamics.Joints.b2GearJoint = It,
    Box2D.Dynamics.Joints.b2GearJointDef = Tt,
    Box2D.Dynamics.Joints.b2Jacobian = Lt,
    Box2D.Dynamics.Joints.b2Joint = Gt,
    Box2D.Dynamics.Joints.b2JointDef = Ft,
    Box2D.Dynamics.Joints.b2JointEdge = Pt,
    Box2D.Dynamics.Joints.b2LineJoint = Jt,
    Box2D.Dynamics.Joints.b2LineJointDef = Et,
    Box2D.Dynamics.Joints.b2MouseJoint = Rt,
    Box2D.Dynamics.Joints.b2MouseJointDef = kt,
    Box2D.Dynamics.Joints.b2PrismaticJoint = Nt,
    Box2D.Dynamics.Joints.b2PrismaticJointDef = jt,
    Box2D.Dynamics.Joints.b2PulleyJoint = zt,
    Box2D.Dynamics.Joints.b2PulleyJointDef = qt,
    Box2D.Dynamics.Joints.b2RevoluteJoint = Ot,
    Box2D.Dynamics.Joints.b2RevoluteJointDef = Wt,
    Box2D.Dynamics.Joints.b2WeldJoint = Ut,
    Box2D.Dynamics.Joints.b2WeldJointDef = Ht
}(),
Box2D.postDefs = [],
function() {
    var t = Box2D.Collision.Shapes.b2CircleShape
      , e = (Box2D.Collision.Shapes.b2EdgeChainDef,
    Box2D.Collision.Shapes.b2EdgeShape,
    Box2D.Collision.Shapes.b2MassData,
    Box2D.Collision.Shapes.b2PolygonShape)
      , i = Box2D.Collision.Shapes.b2Shape
      , o = (Box2D.Common.b2Color,
    Box2D.Common.b2internal,
    Box2D.Common.b2Settings)
      , n = (Box2D.Common.Math.b2Mat22,
    Box2D.Common.Math.b2Mat33,
    Box2D.Common.Math.b2Math)
      , s = Box2D.Common.Math.b2Sweep
      , r = Box2D.Common.Math.b2Transform
      , a = Box2D.Common.Math.b2Vec2
      , l = (Box2D.Common.Math.b2Vec3,
    Box2D.Collision.b2AABB)
      , m = Box2D.Collision.b2Bound
      , c = Box2D.Collision.b2BoundValues
      , h = Box2D.Collision.b2Collision
      , u = Box2D.Collision.b2ContactID
      , p = Box2D.Collision.b2ContactPoint
      , y = Box2D.Collision.b2Distance
      , _ = Box2D.Collision.b2DistanceInput
      , d = Box2D.Collision.b2DistanceOutput
      , f = Box2D.Collision.b2DistanceProxy
      , x = Box2D.Collision.b2DynamicTree
      , b = Box2D.Collision.b2DynamicTreeBroadPhase
      , v = Box2D.Collision.b2DynamicTreeNode
      , g = Box2D.Collision.b2DynamicTreePair
      , D = Box2D.Collision.b2Manifold
      , C = Box2D.Collision.b2ManifoldPoint
      , B = Box2D.Collision.b2Point
      , w = Box2D.Collision.b2RayCastInput
      , A = Box2D.Collision.b2RayCastOutput
      , S = Box2D.Collision.b2Segment
      , M = Box2D.Collision.b2SeparationFunction
      , V = Box2D.Collision.b2Simplex
      , I = Box2D.Collision.b2SimplexCache
      , T = Box2D.Collision.b2SimplexVertex
      , L = Box2D.Collision.b2TimeOfImpact
      , G = Box2D.Collision.b2TOIInput
      , F = Box2D.Collision.b2WorldManifold
      , P = Box2D.Collision.ClipVertex
      , J = Box2D.Collision.Features
      , E = Box2D.Collision.IBroadPhase;
    l.b2AABB = function() {
        this.lowerBound = new a,
        this.upperBound = new a
    }
    ,
    l.prototype.IsValid = function() {
        var t = this.upperBound.x - this.lowerBound.x
          , e = this.upperBound.y - this.lowerBound.y
          , i = t >= 0 && e >= 0;
        return i = i && this.lowerBound.IsValid() && this.upperBound.IsValid()
    }
    ,
    l.prototype.GetCenter = function() {
        return new a((this.lowerBound.x + this.upperBound.x) / 2,(this.lowerBound.y + this.upperBound.y) / 2)
    }
    ,
    l.prototype.GetExtents = function() {
        return new a((this.upperBound.x - this.lowerBound.x) / 2,(this.upperBound.y - this.lowerBound.y) / 2)
    }
    ,
    l.prototype.Contains = function(t) {
        var e = !0;
        return e = e && this.lowerBound.x <= t.lowerBound.x,
        e = e && this.lowerBound.y <= t.lowerBound.y,
        e = e && t.upperBound.x <= this.upperBound.x,
        e = e && t.upperBound.y <= this.upperBound.y
    }
    ,
    l.prototype.RayCast = function(t, e) {
        var i = -Number.MAX_VALUE
          , o = Number.MAX_VALUE
          , n = e.p1.x
          , s = e.p1.y
          , r = e.p2.x - e.p1.x
          , a = e.p2.y - e.p1.y
          , l = Math.abs(r)
          , m = Math.abs(a)
          , c = t.normal
          , h = 0
          , u = 0
          , p = 0
          , y = 0
          , _ = 0;
        if (l < Number.MIN_VALUE) {
            if (n < this.lowerBound.x || this.upperBound.x < n)
                return !1
        } else if (h = 1 / r,
        u = (this.lowerBound.x - n) * h,
        p = (this.upperBound.x - n) * h,
        _ = -1,
        u > p && (y = u,
        u = p,
        p = y,
        _ = 1),
        u > i && (c.x = _,
        c.y = 0,
        i = u),
        o = Math.min(o, p),
        i > o)
            return !1;
        if (m < Number.MIN_VALUE) {
            if (s < this.lowerBound.y || this.upperBound.y < s)
                return !1
        } else if (h = 1 / a,
        u = (this.lowerBound.y - s) * h,
        p = (this.upperBound.y - s) * h,
        _ = -1,
        u > p && (y = u,
        u = p,
        p = y,
        _ = 1),
        u > i && (c.y = _,
        c.x = 0,
        i = u),
        o = Math.min(o, p),
        i > o)
            return !1;
        return t.fraction = i,
        !0
    }
    ,
    l.prototype.TestOverlap = function(t) {
        var e = t.lowerBound.x - this.upperBound.x
          , i = t.lowerBound.y - this.upperBound.y
          , o = this.lowerBound.x - t.upperBound.x
          , n = this.lowerBound.y - t.upperBound.y;
        return e > 0 || i > 0 ? !1 : !(o > 0 || n > 0)
    }
    ,
    l.Combine = function(t, e) {
        var i = new l;
        return i.Combine(t, e),
        i
    }
    ,
    l.prototype.Combine = function(t, e) {
        this.lowerBound.x = Math.min(t.lowerBound.x, e.lowerBound.x),
        this.lowerBound.y = Math.min(t.lowerBound.y, e.lowerBound.y),
        this.upperBound.x = Math.max(t.upperBound.x, e.upperBound.x),
        this.upperBound.y = Math.max(t.upperBound.y, e.upperBound.y)
    }
    ,
    m.b2Bound = function() {}
    ,
    m.prototype.IsLower = function() {
        return 0 == (1 & this.value)
    }
    ,
    m.prototype.IsUpper = function() {
        return 1 == (1 & this.value)
    }
    ,
    m.prototype.Swap = function(t) {
        var e = this.value
          , i = this.proxy
          , o = this.stabbingCount;
        this.value = t.value,
        this.proxy = t.proxy,
        this.stabbingCount = t.stabbingCount,
        t.value = e,
        t.proxy = i,
        t.stabbingCount = o
    }
    ,
    c.b2BoundValues = function() {}
    ,
    c.prototype.b2BoundValues = function() {
        this.lowerValues = new Vector_a2j_Number,
        this.lowerValues[0] = 0,
        this.lowerValues[1] = 0,
        this.upperValues = new Vector_a2j_Number,
        this.upperValues[0] = 0,
        this.upperValues[1] = 0
    }
    ,
    h.b2Collision = function() {}
    ,
    h.ClipSegmentToLine = function(t, e, i, o) {
        void 0 === o && (o = 0);
        var n, s = 0;
        n = e[0];
        var r = n.v;
        n = e[1];
        var a = n.v
          , l = i.x * r.x + i.y * r.y - o
          , m = i.x * a.x + i.y * a.y - o;
        if (0 >= l && t[s++].Set(e[0]),
        0 >= m && t[s++].Set(e[1]),
        0 > l * m) {
            var c = l / (l - m);
            n = t[s];
            var h = n.v;
            h.x = r.x + c * (a.x - r.x),
            h.y = r.y + c * (a.y - r.y),
            n = t[s];
            var u;
            l > 0 ? (u = e[0],
            n.id = u.id) : (u = e[1],
            n.id = u.id),
            ++s
        }
        return s
    }
    ,
    h.EdgeSeparation = function(t, e, i, o, n) {
        void 0 === i && (i = 0);
        var s, r, a = (parseInt(t.m_vertexCount),
        t.m_vertices), l = t.m_normals, m = parseInt(o.m_vertexCount), c = o.m_vertices;
        s = e.R,
        r = l[i];
        var h = s.col1.x * r.x + s.col2.x * r.y
          , u = s.col1.y * r.x + s.col2.y * r.y;
        s = n.R;
        for (var p = s.col1.x * h + s.col1.y * u, y = s.col2.x * h + s.col2.y * u, _ = 0, d = Number.MAX_VALUE, f = 0; m > f; ++f) {
            r = c[f];
            var x = r.x * p + r.y * y;
            d > x && (d = x,
            _ = f)
        }
        r = a[i],
        s = e.R;
        var b = e.position.x + (s.col1.x * r.x + s.col2.x * r.y)
          , v = e.position.y + (s.col1.y * r.x + s.col2.y * r.y);
        r = c[_],
        s = n.R;
        var g = n.position.x + (s.col1.x * r.x + s.col2.x * r.y)
          , D = n.position.y + (s.col1.y * r.x + s.col2.y * r.y);
        g -= b,
        D -= v;
        var C = g * h + D * u;
        return C
    }
    ,
    h.FindMaxSeparation = function(t, e, i, o, n) {
        var s, r, a = parseInt(e.m_vertexCount), l = e.m_normals;
        r = n.R,
        s = o.m_centroid;
        var m = n.position.x + (r.col1.x * s.x + r.col2.x * s.y)
          , c = n.position.y + (r.col1.y * s.x + r.col2.y * s.y);
        r = i.R,
        s = e.m_centroid,
        m -= i.position.x + (r.col1.x * s.x + r.col2.x * s.y),
        c -= i.position.y + (r.col1.y * s.x + r.col2.y * s.y);
        for (var u = m * i.R.col1.x + c * i.R.col1.y, p = m * i.R.col2.x + c * i.R.col2.y, y = 0, _ = -Number.MAX_VALUE, d = 0; a > d; ++d) {
            s = l[d];
            var f = s.x * u + s.y * p;
            f > _ && (_ = f,
            y = d)
        }
        var x = h.EdgeSeparation(e, i, y, o, n)
          , b = parseInt(y - 1 >= 0 ? y - 1 : a - 1)
          , v = h.EdgeSeparation(e, i, b, o, n)
          , g = parseInt(a > y + 1 ? y + 1 : 0)
          , D = h.EdgeSeparation(e, i, g, o, n)
          , C = 0
          , B = 0
          , w = 0;
        if (v > x && v > D)
            w = -1,
            C = b,
            B = v;
        else {
            if (!(D > x))
                return t[0] = y,
                x;
            w = 1,
            C = g,
            B = D
        }
        for (; y = -1 == w ? C - 1 >= 0 ? C - 1 : a - 1 : a > C + 1 ? C + 1 : 0,
        x = h.EdgeSeparation(e, i, y, o, n),
        x > B; )
            C = y,
            B = x;
        return t[0] = C,
        B
    }
    ,
    h.FindIncidentEdge = function(t, e, i, o, n, s) {
        void 0 === o && (o = 0);
        var r, a, l = (parseInt(e.m_vertexCount),
        e.m_normals), m = parseInt(n.m_vertexCount), c = n.m_vertices, h = n.m_normals;
        r = i.R,
        a = l[o];
        var u = r.col1.x * a.x + r.col2.x * a.y
          , p = r.col1.y * a.x + r.col2.y * a.y;
        r = s.R;
        var y = r.col1.x * u + r.col1.y * p;
        p = r.col2.x * u + r.col2.y * p,
        u = y;
        for (var _ = 0, d = Number.MAX_VALUE, f = 0; m > f; ++f) {
            a = h[f];
            var x = u * a.x + p * a.y;
            d > x && (d = x,
            _ = f)
        }
        var b, v = parseInt(_), g = parseInt(m > v + 1 ? v + 1 : 0);
        b = t[0],
        a = c[v],
        r = s.R,
        b.v.x = s.position.x + (r.col1.x * a.x + r.col2.x * a.y),
        b.v.y = s.position.y + (r.col1.y * a.x + r.col2.y * a.y),
        b.id.features.referenceEdge = o,
        b.id.features.incidentEdge = v,
        b.id.features.incidentVertex = 0,
        b = t[1],
        a = c[g],
        r = s.R,
        b.v.x = s.position.x + (r.col1.x * a.x + r.col2.x * a.y),
        b.v.y = s.position.y + (r.col1.y * a.x + r.col2.y * a.y),
        b.id.features.referenceEdge = o,
        b.id.features.incidentEdge = g,
        b.id.features.incidentVertex = 1
    }
    ,
    h.MakeClipPointVector = function() {
        var t = new Vector(2);
        return t[0] = new P,
        t[1] = new P,
        t
    }
    ,
    h.CollidePolygons = function(t, e, i, n, s) {
        var r;
        t.m_pointCount = 0;
        var a = e.m_radius + n.m_radius
          , l = 0;
        h.s_edgeAO[0] = l;
        var m = h.FindMaxSeparation(h.s_edgeAO, e, i, n, s);
        if (l = h.s_edgeAO[0],
        !(m > a)) {
            var c = 0;
            h.s_edgeBO[0] = c;
            var u = h.FindMaxSeparation(h.s_edgeBO, n, s, e, i);
            if (c = h.s_edgeBO[0],
            !(u > a)) {
                var p, y, _, d, f, x = 0, b = 0, v = .98, g = .001;
                u > v * m + g ? (p = n,
                y = e,
                _ = s,
                d = i,
                x = c,
                t.m_type = D.e_faceB,
                b = 1) : (p = e,
                y = n,
                _ = i,
                d = s,
                x = l,
                t.m_type = D.e_faceA,
                b = 0);
                var C = h.s_incidentEdge;
                h.FindIncidentEdge(C, p, _, x, y, d);
                var B, w = parseInt(p.m_vertexCount), A = p.m_vertices, S = A[x];
                B = w > x + 1 ? A[parseInt(x + 1)] : A[0];
                var M = h.s_localTangent;
                M.Set(B.x - S.x, B.y - S.y),
                M.Normalize();
                var V = h.s_localNormal;
                V.x = M.y,
                V.y = -M.x;
                var I = h.s_planePoint;
                I.Set(.5 * (S.x + B.x), .5 * (S.y + B.y));
                var T = h.s_tangent;
                f = _.R,
                T.x = f.col1.x * M.x + f.col2.x * M.y,
                T.y = f.col1.y * M.x + f.col2.y * M.y;
                var L = h.s_tangent2;
                L.x = -T.x,
                L.y = -T.y;
                var G = h.s_normal;
                G.x = T.y,
                G.y = -T.x;
                var F = h.s_v11
                  , P = h.s_v12;
                F.x = _.position.x + (f.col1.x * S.x + f.col2.x * S.y),
                F.y = _.position.y + (f.col1.y * S.x + f.col2.y * S.y),
                P.x = _.position.x + (f.col1.x * B.x + f.col2.x * B.y),
                P.y = _.position.y + (f.col1.y * B.x + f.col2.y * B.y);
                var J = G.x * F.x + G.y * F.y
                  , E = -T.x * F.x - T.y * F.y + a
                  , R = T.x * P.x + T.y * P.y + a
                  , k = h.s_clipPoints1
                  , N = h.s_clipPoints2
                  , j = 0;
                if (j = h.ClipSegmentToLine(k, C, L, E),
                !(2 > j || (j = h.ClipSegmentToLine(N, k, T, R),
                2 > j))) {
                    t.m_localPlaneNormal.SetV(V),
                    t.m_localPoint.SetV(I);
                    for (var z = 0, q = 0; q < o.b2_maxManifoldPoints; ++q) {
                        r = N[q];
                        var O = G.x * r.v.x + G.y * r.v.y - J;
                        if (a >= O) {
                            var W = t.m_points[z];
                            f = d.R;
                            var U = r.v.x - d.position.x
                              , H = r.v.y - d.position.y;
                            W.m_localPoint.x = U * f.col1.x + H * f.col1.y,
                            W.m_localPoint.y = U * f.col2.x + H * f.col2.y,
                            W.m_id.Set(r.id),
                            W.m_id.features.flip = b,
                            ++z
                        }
                    }
                    t.m_pointCount = z
                }
            }
        }
    }
    ,
    h.CollideCircles = function(t, e, i, o, n) {
        t.m_pointCount = 0;
        var s, r;
        s = i.R,
        r = e.m_p;
        var a = i.position.x + (s.col1.x * r.x + s.col2.x * r.y)
          , l = i.position.y + (s.col1.y * r.x + s.col2.y * r.y);
        s = n.R,
        r = o.m_p;
        var m = n.position.x + (s.col1.x * r.x + s.col2.x * r.y)
          , c = n.position.y + (s.col1.y * r.x + s.col2.y * r.y)
          , h = m - a
          , u = c - l
          , p = h * h + u * u
          , y = e.m_radius + o.m_radius;
        p > y * y || (t.m_type = D.e_circles,
        t.m_localPoint.SetV(e.m_p),
        t.m_localPlaneNormal.SetZero(),
        t.m_pointCount = 1,
        t.m_points[0].m_localPoint.SetV(o.m_p),
        t.m_points[0].m_id.key = 0)
    }
    ,
    h.CollidePolygonAndCircle = function(t, e, i, o, n) {
        t.m_pointCount = 0;
        var s, r, a = 0, l = 0;
        r = n.R,
        s = o.m_p;
        var m = n.position.x + (r.col1.x * s.x + r.col2.x * s.y)
          , c = n.position.y + (r.col1.y * s.x + r.col2.y * s.y);
        a = m - i.position.x,
        l = c - i.position.y,
        r = i.R;
        for (var h = a * r.col1.x + l * r.col1.y, u = a * r.col2.x + l * r.col2.y, p = 0, y = -Number.MAX_VALUE, _ = e.m_radius + o.m_radius, d = parseInt(e.m_vertexCount), f = e.m_vertices, x = e.m_normals, b = 0; d > b; ++b) {
            s = f[b],
            a = h - s.x,
            l = u - s.y,
            s = x[b];
            var v = s.x * a + s.y * l;
            if (v > _)
                return;
            v > y && (y = v,
            p = b)
        }
        var g = parseInt(p)
          , C = parseInt(d > g + 1 ? g + 1 : 0)
          , B = f[g]
          , w = f[C];
        if (y < Number.MIN_VALUE)
            return t.m_pointCount = 1,
            t.m_type = D.e_faceA,
            t.m_localPlaneNormal.SetV(x[p]),
            t.m_localPoint.x = .5 * (B.x + w.x),
            t.m_localPoint.y = .5 * (B.y + w.y),
            t.m_points[0].m_localPoint.SetV(o.m_p),
            void (t.m_points[0].m_id.key = 0);
        var A = (h - B.x) * (w.x - B.x) + (u - B.y) * (w.y - B.y)
          , S = (h - w.x) * (B.x - w.x) + (u - w.y) * (B.y - w.y);
        if (0 >= A) {
            if ((h - B.x) * (h - B.x) + (u - B.y) * (u - B.y) > _ * _)
                return;
            t.m_pointCount = 1,
            t.m_type = D.e_faceA,
            t.m_localPlaneNormal.x = h - B.x,
            t.m_localPlaneNormal.y = u - B.y,
            t.m_localPlaneNormal.Normalize(),
            t.m_localPoint.SetV(B),
            t.m_points[0].m_localPoint.SetV(o.m_p),
            t.m_points[0].m_id.key = 0
        } else if (0 >= S) {
            if ((h - w.x) * (h - w.x) + (u - w.y) * (u - w.y) > _ * _)
                return;
            t.m_pointCount = 1,
            t.m_type = D.e_faceA,
            t.m_localPlaneNormal.x = h - w.x,
            t.m_localPlaneNormal.y = u - w.y,
            t.m_localPlaneNormal.Normalize(),
            t.m_localPoint.SetV(w),
            t.m_points[0].m_localPoint.SetV(o.m_p),
            t.m_points[0].m_id.key = 0
        } else {
            var M = .5 * (B.x + w.x)
              , V = .5 * (B.y + w.y);
            if (y = (h - M) * x[g].x + (u - V) * x[g].y,
            y > _)
                return;
            t.m_pointCount = 1,
            t.m_type = D.e_faceA,
            t.m_localPlaneNormal.x = x[g].x,
            t.m_localPlaneNormal.y = x[g].y,
            t.m_localPlaneNormal.Normalize(),
            t.m_localPoint.Set(M, V),
            t.m_points[0].m_localPoint.SetV(o.m_p),
            t.m_points[0].m_id.key = 0
        }
    }
    ,
    h.TestOverlap = function(t, e) {
        var i = e.lowerBound
          , o = t.upperBound
          , n = i.x - o.x
          , s = i.y - o.y;
        i = t.lowerBound,
        o = e.upperBound;
        var r = i.x - o.x
          , a = i.y - o.y;
        return n > 0 || s > 0 ? !1 : !(r > 0 || a > 0)
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Collision.b2Collision.s_incidentEdge = h.MakeClipPointVector(),
        Box2D.Collision.b2Collision.s_clipPoints1 = h.MakeClipPointVector(),
        Box2D.Collision.b2Collision.s_clipPoints2 = h.MakeClipPointVector(),
        Box2D.Collision.b2Collision.s_edgeAO = new Vector_a2j_Number(1),
        Box2D.Collision.b2Collision.s_edgeBO = new Vector_a2j_Number(1),
        Box2D.Collision.b2Collision.s_localTangent = new a,
        Box2D.Collision.b2Collision.s_localNormal = new a,
        Box2D.Collision.b2Collision.s_planePoint = new a,
        Box2D.Collision.b2Collision.s_normal = new a,
        Box2D.Collision.b2Collision.s_tangent = new a,
        Box2D.Collision.b2Collision.s_tangent2 = new a,
        Box2D.Collision.b2Collision.s_v11 = new a,
        Box2D.Collision.b2Collision.s_v12 = new a,
        Box2D.Collision.b2Collision.b2CollidePolyTempVec = new a,
        Box2D.Collision.b2Collision.b2_nullFeature = 255
    }),
    u.b2ContactID = function() {
        this.features = new J
    }
    ,
    u.prototype.b2ContactID = function() {
        this.features._m_id = this
    }
    ,
    u.prototype.Set = function(t) {
        this.key = t._key
    }
    ,
    u.prototype.Copy = function() {
        var t = new u;
        return t.key = this.key,
        t
    }
    ,
    Object.defineProperty(u.prototype, "key", {
        enumerable: !1,
        configurable: !0,
        get: function() {
            return this._key
        }
    }),
    Object.defineProperty(u.prototype, "key", {
        enumerable: !1,
        configurable: !0,
        set: function(t) {
            void 0 === t && (t = 0),
            this._key = t,
            this.features._referenceEdge = 255 & this._key,
            this.features._incidentEdge = (65280 & this._key) >> 8 & 255,
            this.features._incidentVertex = (16711680 & this._key) >> 16 & 255,
            this.features._flip = (4278190080 & this._key) >> 24 & 255
        }
    }),
    p.b2ContactPoint = function() {
        this.position = new a,
        this.velocity = new a,
        this.normal = new a,
        this.id = new u
    }
    ,
    y.b2Distance = function() {}
    ,
    y.Distance = function(t, e, i) {
        ++y.b2_gjkCalls;
        var s = i.proxyA
          , r = i.proxyB
          , l = i.transformA
          , m = i.transformB
          , c = y.s_simplex;
        c.ReadCache(e, s, l, r, m);
        for (var h, u = c.m_vertices, p = 20, _ = y.s_saveA, d = y.s_saveB, f = 0, x = c.GetClosestPoint(), b = x.LengthSquared(), v = b, g = 0, D = 0; p > D; ) {
            for (f = c.m_count,
            g = 0; f > g; g++)
                _[g] = u[g].indexA,
                d[g] = u[g].indexB;
            switch (c.m_count) {
            case 1:
                break;
            case 2:
                c.Solve2();
                break;
            case 3:
                c.Solve3();
                break;
            default:
                o.b2Assert(!1)
            }
            if (3 == c.m_count)
                break;
            h = c.GetClosestPoint(),
            v = h.LengthSquared(),
            b = v;
            var C = c.GetSearchDirection();
            if (C.LengthSquared() < Number.MIN_VALUE * Number.MIN_VALUE)
                break;
            var B = u[c.m_count];
            B.indexA = s.GetSupport(n.MulTMV(l.R, C.GetNegative())),
            B.wA = n.MulX(l, s.GetVertex(B.indexA)),
            B.indexB = r.GetSupport(n.MulTMV(m.R, C)),
            B.wB = n.MulX(m, r.GetVertex(B.indexB)),
            B.w = n.SubtractVV(B.wB, B.wA),
            ++D,
            ++y.b2_gjkIters;
            var w = !1;
            for (g = 0; f > g; g++)
                if (B.indexA == _[g] && B.indexB == d[g]) {
                    w = !0;
                    break
                }
            if (w)
                break;
            ++c.m_count
        }
        if (y.b2_gjkMaxIters = n.Max(y.b2_gjkMaxIters, D),
        c.GetWitnessPoints(t.pointA, t.pointB),
        t.distance = n.SubtractVV(t.pointA, t.pointB).Length(),
        t.iterations = D,
        c.WriteCache(e),
        i.useRadii) {
            var A = s.m_radius
              , S = r.m_radius;
            if (t.distance > A + S && t.distance > Number.MIN_VALUE) {
                t.distance -= A + S;
                var M = n.SubtractVV(t.pointB, t.pointA);
                M.Normalize(),
                t.pointA.x += A * M.x,
                t.pointA.y += A * M.y,
                t.pointB.x -= S * M.x,
                t.pointB.y -= S * M.y
            } else
                h = new a,
                h.x = .5 * (t.pointA.x + t.pointB.x),
                h.y = .5 * (t.pointA.y + t.pointB.y),
                t.pointA.x = t.pointB.x = h.x,
                t.pointA.y = t.pointB.y = h.y,
                t.distance = 0
        }
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Collision.b2Distance.s_simplex = new V,
        Box2D.Collision.b2Distance.s_saveA = new Vector_a2j_Number(3),
        Box2D.Collision.b2Distance.s_saveB = new Vector_a2j_Number(3)
    }),
    _.b2DistanceInput = function() {}
    ,
    d.b2DistanceOutput = function() {
        this.pointA = new a,
        this.pointB = new a
    }
    ,
    f.b2DistanceProxy = function() {}
    ,
    f.prototype.Set = function(n) {
        switch (n.GetType()) {
        case i.e_circleShape:
            var s = n instanceof t ? n : null;
            this.m_vertices = new Vector(1,!0),
            this.m_vertices[0] = s.m_p,
            this.m_count = 1,
            this.m_radius = s.m_radius;
            break;
        case i.e_polygonShape:
            var r = n instanceof e ? n : null;
            this.m_vertices = r.m_vertices,
            this.m_count = r.m_vertexCount,
            this.m_radius = r.m_radius;
            break;
        default:
            o.b2Assert(!1)
        }
    }
    ,
    f.prototype.GetSupport = function(t) {
        for (var e = 0, i = this.m_vertices[0].x * t.x + this.m_vertices[0].y * t.y, o = 1; o < this.m_count; ++o) {
            var n = this.m_vertices[o].x * t.x + this.m_vertices[o].y * t.y;
            n > i && (e = o,
            i = n)
        }
        return e
    }
    ,
    f.prototype.GetSupportVertex = function(t) {
        for (var e = 0, i = this.m_vertices[0].x * t.x + this.m_vertices[0].y * t.y, o = 1; o < this.m_count; ++o) {
            var n = this.m_vertices[o].x * t.x + this.m_vertices[o].y * t.y;
            n > i && (e = o,
            i = n)
        }
        return this.m_vertices[e]
    }
    ,
    f.prototype.GetVertexCount = function() {
        return this.m_count
    }
    ,
    f.prototype.GetVertex = function(t) {
        return void 0 === t && (t = 0),
        o.b2Assert(t >= 0 && t < this.m_count),
        this.m_vertices[t]
    }
    ,
    x.b2DynamicTree = function() {}
    ,
    x.prototype.b2DynamicTree = function() {
        this.m_root = null,
        this.m_freeList = null,
        this.m_path = 0,
        this.m_insertionCount = 0
    }
    ,
    x.prototype.CreateProxy = function(t, e) {
        var i = this.AllocateNode()
          , n = o.b2_aabbExtension
          , s = o.b2_aabbExtension;
        return i.aabb.lowerBound.x = t.lowerBound.x - n,
        i.aabb.lowerBound.y = t.lowerBound.y - s,
        i.aabb.upperBound.x = t.upperBound.x + n,
        i.aabb.upperBound.y = t.upperBound.y + s,
        i.userData = e,
        this.InsertLeaf(i),
        i
    }
    ,
    x.prototype.DestroyProxy = function(t) {
        this.RemoveLeaf(t),
        this.FreeNode(t)
    }
    ,
    x.prototype.MoveProxy = function(t, e, i) {
        if (o.b2Assert(t.IsLeaf()),
        t.aabb.Contains(e))
            return !1;
        this.RemoveLeaf(t);
        var n = o.b2_aabbExtension + o.b2_aabbMultiplier * (i.x > 0 ? i.x : -i.x)
          , s = o.b2_aabbExtension + o.b2_aabbMultiplier * (i.y > 0 ? i.y : -i.y);
        return t.aabb.lowerBound.x = e.lowerBound.x - n,
        t.aabb.lowerBound.y = e.lowerBound.y - s,
        t.aabb.upperBound.x = e.upperBound.x + n,
        t.aabb.upperBound.y = e.upperBound.y + s,
        this.InsertLeaf(t),
        !0
    }
    ,
    x.prototype.Rebalance = function(t) {
        if (void 0 === t && (t = 0),
        null != this.m_root)
            for (var e = 0; t > e; e++) {
                for (var i = this.m_root, o = 0; 0 == i.IsLeaf(); )
                    i = this.m_path >> o & 1 ? i.child2 : i.child1,
                    o = o + 1 & 31;
                ++this.m_path,
                this.RemoveLeaf(i),
                this.InsertLeaf(i)
            }
    }
    ,
    x.prototype.GetFatAABB = function(t) {
        return t.aabb
    }
    ,
    x.prototype.GetUserData = function(t) {
        return t.userData
    }
    ,
    x.prototype.Query = function(t, e) {
        if (null != this.m_root) {
            var i = new Vector
              , o = 0;
            for (i[o++] = this.m_root; o > 0; ) {
                var n = i[--o];
                if (n.aabb.TestOverlap(e))
                    if (n.IsLeaf()) {
                        var s = t(n);
                        if (!s)
                            return
                    } else
                        i[o++] = n.child1,
                        i[o++] = n.child2
            }
        }
    }
    ,
    x.prototype.RayCast = function(t, e) {
        if (null != this.m_root) {
            var i = e.p1
              , o = e.p2
              , s = n.SubtractVV(i, o);
            s.Normalize();
            var r = n.CrossFV(1, s)
              , a = n.AbsV(r)
              , m = e.maxFraction
              , c = new l
              , h = 0
              , u = 0;
            h = i.x + m * (o.x - i.x),
            u = i.y + m * (o.y - i.y),
            c.lowerBound.x = Math.min(i.x, h),
            c.lowerBound.y = Math.min(i.y, u),
            c.upperBound.x = Math.max(i.x, h),
            c.upperBound.y = Math.max(i.y, u);
            var p = new Vector
              , y = 0;
            for (p[y++] = this.m_root; y > 0; ) {
                var _ = p[--y];
                if (0 != _.aabb.TestOverlap(c)) {
                    var d = _.aabb.GetCenter()
                      , f = _.aabb.GetExtents()
                      , x = Math.abs(r.x * (i.x - d.x) + r.y * (i.y - d.y)) - a.x * f.x - a.y * f.y;
                    if (!(x > 0))
                        if (_.IsLeaf()) {
                            var b = new w;
                            if (b.p1 = e.p1,
                            b.p2 = e.p2,
                            b.maxFraction = e.maxFraction,
                            m = t(b, _),
                            0 == m)
                                return;
                            m > 0 && (h = i.x + m * (o.x - i.x),
                            u = i.y + m * (o.y - i.y),
                            c.lowerBound.x = Math.min(i.x, h),
                            c.lowerBound.y = Math.min(i.y, u),
                            c.upperBound.x = Math.max(i.x, h),
                            c.upperBound.y = Math.max(i.y, u))
                        } else
                            p[y++] = _.child1,
                            p[y++] = _.child2
                }
            }
        }
    }
    ,
    x.prototype.AllocateNode = function() {
        if (this.m_freeList) {
            var t = this.m_freeList;
            return this.m_freeList = t.parent,
            t.parent = null,
            t.child1 = null,
            t.child2 = null,
            t
        }
        return new v
    }
    ,
    x.prototype.FreeNode = function(t) {
        t.parent = this.m_freeList,
        this.m_freeList = t
    }
    ,
    x.prototype.InsertLeaf = function(t) {
        if (++this.m_insertionCount,
        null == this.m_root)
            return this.m_root = t,
            void (this.m_root.parent = null);
        var e = t.aabb.GetCenter()
          , i = this.m_root;
        if (0 == i.IsLeaf())
            do {
                var o = i.child1
                  , n = i.child2
                  , s = Math.abs((o.aabb.lowerBound.x + o.aabb.upperBound.x) / 2 - e.x) + Math.abs((o.aabb.lowerBound.y + o.aabb.upperBound.y) / 2 - e.y)
                  , r = Math.abs((n.aabb.lowerBound.x + n.aabb.upperBound.x) / 2 - e.x) + Math.abs((n.aabb.lowerBound.y + n.aabb.upperBound.y) / 2 - e.y);
                i = r > s ? o : n
            } while (0 == i.IsLeaf());var a = i.parent
          , l = this.AllocateNode();
        if (l.parent = a,
        l.userData = null,
        l.aabb.Combine(t.aabb, i.aabb),
        a) {
            i.parent.child1 == i ? a.child1 = l : a.child2 = l,
            l.child1 = i,
            l.child2 = t,
            i.parent = l,
            t.parent = l;
            do {
                if (a.aabb.Contains(l.aabb))
                    break;
                a.aabb.Combine(a.child1.aabb, a.child2.aabb),
                l = a,
                a = a.parent
            } while (a)
        } else
            l.child1 = i,
            l.child2 = t,
            i.parent = l,
            t.parent = l,
            this.m_root = l
    }
    ,
    x.prototype.RemoveLeaf = function(t) {
        if (t == this.m_root)
            return void (this.m_root = null);
        var e, i = t.parent, o = i.parent;
        if (e = i.child1 == t ? i.child2 : i.child1,
        o)
            for (o.child1 == i ? o.child1 = e : o.child2 = e,
            e.parent = o,
            this.FreeNode(i); o; ) {
                var n = o.aabb;
                if (o.aabb = l.Combine(o.child1.aabb, o.child2.aabb),
                n.Contains(o.aabb))
                    break;
                o = o.parent
            }
        else
            this.m_root = e,
            e.parent = null,
            this.FreeNode(i)
    }
    ,
    b.b2DynamicTreeBroadPhase = function() {
        this.m_tree = new x,
        this.m_moveBuffer = new Vector,
        this.m_pairBuffer = new Vector,
        this.m_pairCount = 0
    }
    ,
    b.prototype.CreateProxy = function(t, e) {
        var i = this.m_tree.CreateProxy(t, e);
        return ++this.m_proxyCount,
        this.BufferMove(i),
        i
    }
    ,
    b.prototype.DestroyProxy = function(t) {
        this.UnBufferMove(t),
        --this.m_proxyCount,
        this.m_tree.DestroyProxy(t)
    }
    ,
    b.prototype.MoveProxy = function(t, e, i) {
        var o = this.m_tree.MoveProxy(t, e, i);
        o && this.BufferMove(t)
    }
    ,
    b.prototype.TestOverlap = function(t, e) {
        var i = this.m_tree.GetFatAABB(t)
          , o = this.m_tree.GetFatAABB(e);
        return i.TestOverlap(o)
    }
    ,
    b.prototype.GetUserData = function(t) {
        return this.m_tree.GetUserData(t)
    }
    ,
    b.prototype.GetFatAABB = function(t) {
        return this.m_tree.GetFatAABB(t)
    }
    ,
    b.prototype.GetProxyCount = function() {
        return this.m_proxyCount
    }
    ,
    b.prototype.UpdatePairs = function(t) {
        function e(t) {
            if (t == o)
                return !0;
            i.m_pairCount == i.m_pairBuffer.length && (i.m_pairBuffer[i.m_pairCount] = new g);
            var e = i.m_pairBuffer[i.m_pairCount];
            return e.proxyA = o > t ? t : o,
            e.proxyB = t >= o ? t : o,
            ++i.m_pairCount,
            !0
        }
        var i = this;
        i.m_pairCount = 0;
        var o, n = 0;
        for (n = 0; n < i.m_moveBuffer.length; ++n) {
            o = i.m_moveBuffer[n];
            var s = i.m_tree.GetFatAABB(o);
            i.m_tree.Query(e, s)
        }
        i.m_moveBuffer.length = 0;
        for (var n = 0; n < i.m_pairCount; ) {
            var r = i.m_pairBuffer[n]
              , a = i.m_tree.GetUserData(r.proxyA)
              , l = i.m_tree.GetUserData(r.proxyB);
            for (t(a, l),
            ++n; n < i.m_pairCount; ) {
                var m = i.m_pairBuffer[n];
                if (m.proxyA != r.proxyA || m.proxyB != r.proxyB)
                    break;
                ++n
            }
        }
    }
    ,
    b.prototype.Query = function(t, e) {
        this.m_tree.Query(t, e)
    }
    ,
    b.prototype.RayCast = function(t, e) {
        this.m_tree.RayCast(t, e)
    }
    ,
    b.prototype.Validate = function() {}
    ,
    b.prototype.Rebalance = function(t) {
        void 0 === t && (t = 0),
        this.m_tree.Rebalance(t)
    }
    ,
    b.prototype.BufferMove = function(t) {
        this.m_moveBuffer[this.m_moveBuffer.length] = t
    }
    ,
    b.prototype.UnBufferMove = function(t) {
        var e = parseInt(this.m_moveBuffer.indexOf(t));
        this.m_moveBuffer.splice(e, 1)
    }
    ,
    b.prototype.ComparePairs = function() {
        return 0
    }
    ,
    b.__implements = {},
    b.__implements[E] = !0,
    v.b2DynamicTreeNode = function() {
        this.aabb = new l
    }
    ,
    v.prototype.IsLeaf = function() {
        return null == this.child1
    }
    ,
    g.b2DynamicTreePair = function() {}
    ,
    D.b2Manifold = function() {
        this.m_pointCount = 0
    }
    ,
    D.prototype.b2Manifold = function() {
        this.m_points = new Vector(o.b2_maxManifoldPoints);
        for (var t = 0; t < o.b2_maxManifoldPoints; t++)
            this.m_points[t] = new C;
        this.m_localPlaneNormal = new a,
        this.m_localPoint = new a
    }
    ,
    D.prototype.Reset = function() {
        for (var t = 0; t < o.b2_maxManifoldPoints; t++)
            (this.m_points[t]instanceof C ? this.m_points[t] : null).Reset();
        this.m_localPlaneNormal.SetZero(),
        this.m_localPoint.SetZero(),
        this.m_type = 0,
        this.m_pointCount = 0
    }
    ,
    D.prototype.Set = function(t) {
        this.m_pointCount = t.m_pointCount;
        for (var e = 0; e < o.b2_maxManifoldPoints; e++)
            (this.m_points[e]instanceof C ? this.m_points[e] : null).Set(t.m_points[e]);
        this.m_localPlaneNormal.SetV(t.m_localPlaneNormal),
        this.m_localPoint.SetV(t.m_localPoint),
        this.m_type = t.m_type
    }
    ,
    D.prototype.Copy = function() {
        var t = new D;
        return t.Set(this),
        t
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Collision.b2Manifold.e_circles = 1,
        Box2D.Collision.b2Manifold.e_faceA = 2,
        Box2D.Collision.b2Manifold.e_faceB = 4
    }),
    C.b2ManifoldPoint = function() {
        this.m_localPoint = new a,
        this.m_id = new u
    }
    ,
    C.prototype.b2ManifoldPoint = function() {
        this.Reset()
    }
    ,
    C.prototype.Reset = function() {
        this.m_localPoint.SetZero(),
        this.m_normalImpulse = 0,
        this.m_tangentImpulse = 0,
        this.m_id.key = 0
    }
    ,
    C.prototype.Set = function(t) {
        this.m_localPoint.SetV(t.m_localPoint),
        this.m_normalImpulse = t.m_normalImpulse,
        this.m_tangentImpulse = t.m_tangentImpulse,
        this.m_id.Set(t.m_id)
    }
    ,
    B.b2Point = function() {
        this.p = new a
    }
    ,
    B.prototype.Support = function(t, e, i) {
        return void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        this.p
    }
    ,
    B.prototype.GetFirstVertex = function() {
        return this.p
    }
    ,
    w.b2RayCastInput = function() {
        this.p1 = new a,
        this.p2 = new a
    }
    ,
    w.prototype.b2RayCastInput = function(t, e, i) {
        void 0 === t && (t = null),
        void 0 === e && (e = null),
        void 0 === i && (i = 1),
        t && this.p1.SetV(t),
        e && this.p2.SetV(e),
        this.maxFraction = i
    }
    ,
    A.b2RayCastOutput = function() {
        this.normal = new a
    }
    ,
    S.b2Segment = function() {
        this.p1 = new a,
        this.p2 = new a
    }
    ,
    S.prototype.TestSegment = function(t, e, i, o) {
        void 0 === o && (o = 0);
        var n = i.p1
          , s = i.p2.x - n.x
          , r = i.p2.y - n.y
          , a = this.p2.x - this.p1.x
          , l = this.p2.y - this.p1.y
          , m = l
          , c = -a
          , h = 100 * Number.MIN_VALUE
          , u = -(s * m + r * c);
        if (u > h) {
            var p = n.x - this.p1.x
              , y = n.y - this.p1.y
              , _ = p * m + y * c;
            if (_ >= 0 && o * u >= _) {
                var d = -s * y + r * p;
                if (d >= -h * u && u * (1 + h) >= d) {
                    _ /= u;
                    var f = Math.sqrt(m * m + c * c);
                    return m /= f,
                    c /= f,
                    t[0] = _,
                    e.Set(m, c),
                    !0
                }
            }
        }
        return !1
    }
    ,
    S.prototype.Extend = function(t) {
        this.ExtendForward(t),
        this.ExtendBackward(t)
    }
    ,
    S.prototype.ExtendForward = function(t) {
        var e = this.p2.x - this.p1.x
          , i = this.p2.y - this.p1.y
          , o = Math.min(e > 0 ? (t.upperBound.x - this.p1.x) / e : 0 > e ? (t.lowerBound.x - this.p1.x) / e : Number.POSITIVE_INFINITY, i > 0 ? (t.upperBound.y - this.p1.y) / i : 0 > i ? (t.lowerBound.y - this.p1.y) / i : Number.POSITIVE_INFINITY);
        this.p2.x = this.p1.x + e * o,
        this.p2.y = this.p1.y + i * o
    }
    ,
    S.prototype.ExtendBackward = function(t) {
        var e = -this.p2.x + this.p1.x
          , i = -this.p2.y + this.p1.y
          , o = Math.min(e > 0 ? (t.upperBound.x - this.p2.x) / e : 0 > e ? (t.lowerBound.x - this.p2.x) / e : Number.POSITIVE_INFINITY, i > 0 ? (t.upperBound.y - this.p2.y) / i : 0 > i ? (t.lowerBound.y - this.p2.y) / i : Number.POSITIVE_INFINITY);
        this.p1.x = this.p2.x + e * o,
        this.p1.y = this.p2.y + i * o
    }
    ,
    M.b2SeparationFunction = function() {
        this.m_localPoint = new a,
        this.m_axis = new a
    }
    ,
    M.prototype.Initialize = function(t, e, i, s, r) {
        this.m_proxyA = e,
        this.m_proxyB = s;
        var l = parseInt(t.count);
        o.b2Assert(l > 0 && 3 > l);
        var m, c, h, u, p, y, _, d, f = 0, x = 0, b = 0, v = 0, g = 0, D = 0, C = 0, B = 0;
        if (1 == l)
            this.m_type = M.e_points,
            m = this.m_proxyA.GetVertex(t.indexA[0]),
            u = this.m_proxyB.GetVertex(t.indexB[0]),
            d = m,
            _ = i.R,
            f = i.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            x = i.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            d = u,
            _ = r.R,
            b = r.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            v = r.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            this.m_axis.x = b - f,
            this.m_axis.y = v - x,
            this.m_axis.Normalize();
        else if (t.indexB[0] == t.indexB[1])
            this.m_type = M.e_faceA,
            c = this.m_proxyA.GetVertex(t.indexA[0]),
            h = this.m_proxyA.GetVertex(t.indexA[1]),
            u = this.m_proxyB.GetVertex(t.indexB[0]),
            this.m_localPoint.x = .5 * (c.x + h.x),
            this.m_localPoint.y = .5 * (c.y + h.y),
            this.m_axis = n.CrossVF(n.SubtractVV(h, c), 1),
            this.m_axis.Normalize(),
            d = this.m_axis,
            _ = i.R,
            g = _.col1.x * d.x + _.col2.x * d.y,
            D = _.col1.y * d.x + _.col2.y * d.y,
            d = this.m_localPoint,
            _ = i.R,
            f = i.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            x = i.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            d = u,
            _ = r.R,
            b = r.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            v = r.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            C = (b - f) * g + (v - x) * D,
            0 > C && this.m_axis.NegativeSelf();
        else if (t.indexA[0] == t.indexA[0])
            this.m_type = M.e_faceB,
            p = this.m_proxyB.GetVertex(t.indexB[0]),
            y = this.m_proxyB.GetVertex(t.indexB[1]),
            m = this.m_proxyA.GetVertex(t.indexA[0]),
            this.m_localPoint.x = .5 * (p.x + y.x),
            this.m_localPoint.y = .5 * (p.y + y.y),
            this.m_axis = n.CrossVF(n.SubtractVV(y, p), 1),
            this.m_axis.Normalize(),
            d = this.m_axis,
            _ = r.R,
            g = _.col1.x * d.x + _.col2.x * d.y,
            D = _.col1.y * d.x + _.col2.y * d.y,
            d = this.m_localPoint,
            _ = r.R,
            b = r.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            v = r.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            d = m,
            _ = i.R,
            f = i.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            x = i.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            C = (f - b) * g + (x - v) * D,
            0 > C && this.m_axis.NegativeSelf();
        else {
            c = this.m_proxyA.GetVertex(t.indexA[0]),
            h = this.m_proxyA.GetVertex(t.indexA[1]),
            p = this.m_proxyB.GetVertex(t.indexB[0]),
            y = this.m_proxyB.GetVertex(t.indexB[1]);
            var w = (n.MulX(i, m),
            n.MulMV(i.R, n.SubtractVV(h, c)))
              , A = (n.MulX(r, u),
            n.MulMV(r.R, n.SubtractVV(y, p)))
              , S = w.x * w.x + w.y * w.y
              , V = A.x * A.x + A.y * A.y
              , I = n.SubtractVV(A, w)
              , T = w.x * I.x + w.y * I.y
              , L = A.x * I.x + A.y * I.y
              , G = w.x * A.x + w.y * A.y
              , F = S * V - G * G;
            C = 0,
            0 != F && (C = n.Clamp((G * L - T * V) / F, 0, 1));
            var P = (G * C + L) / V;
            0 > P && (P = 0,
            C = n.Clamp((G - T) / S, 0, 1)),
            m = new a,
            m.x = c.x + C * (h.x - c.x),
            m.y = c.y + C * (h.y - c.y),
            u = new a,
            u.x = p.x + C * (y.x - p.x),
            u.y = p.y + C * (y.y - p.y),
            0 == C || 1 == C ? (this.m_type = M.e_faceB,
            this.m_axis = n.CrossVF(n.SubtractVV(y, p), 1),
            this.m_axis.Normalize(),
            this.m_localPoint = u,
            d = this.m_axis,
            _ = r.R,
            g = _.col1.x * d.x + _.col2.x * d.y,
            D = _.col1.y * d.x + _.col2.y * d.y,
            d = this.m_localPoint,
            _ = r.R,
            b = r.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            v = r.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            d = m,
            _ = i.R,
            f = i.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            x = i.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            B = (f - b) * g + (x - v) * D,
            0 > C && this.m_axis.NegativeSelf()) : (this.m_type = M.e_faceA,
            this.m_axis = n.CrossVF(n.SubtractVV(h, c), 1),
            this.m_localPoint = m,
            d = this.m_axis,
            _ = i.R,
            g = _.col1.x * d.x + _.col2.x * d.y,
            D = _.col1.y * d.x + _.col2.y * d.y,
            d = this.m_localPoint,
            _ = i.R,
            f = i.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            x = i.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            d = u,
            _ = r.R,
            b = r.position.x + (_.col1.x * d.x + _.col2.x * d.y),
            v = r.position.y + (_.col1.y * d.x + _.col2.y * d.y),
            B = (b - f) * g + (v - x) * D,
            0 > C && this.m_axis.NegativeSelf())
        }
    }
    ,
    M.prototype.Evaluate = function(t, e) {
        var i, s, r, a, l, m, c, h = 0;
        switch (this.m_type) {
        case M.e_points:
            return i = n.MulTMV(t.R, this.m_axis),
            s = n.MulTMV(e.R, this.m_axis.GetNegative()),
            r = this.m_proxyA.GetSupportVertex(i),
            a = this.m_proxyB.GetSupportVertex(s),
            l = n.MulX(t, r),
            m = n.MulX(e, a),
            h = (m.x - l.x) * this.m_axis.x + (m.y - l.y) * this.m_axis.y;
        case M.e_faceA:
            return c = n.MulMV(t.R, this.m_axis),
            l = n.MulX(t, this.m_localPoint),
            s = n.MulTMV(e.R, c.GetNegative()),
            a = this.m_proxyB.GetSupportVertex(s),
            m = n.MulX(e, a),
            h = (m.x - l.x) * c.x + (m.y - l.y) * c.y;
        case M.e_faceB:
            return c = n.MulMV(e.R, this.m_axis),
            m = n.MulX(e, this.m_localPoint),
            i = n.MulTMV(t.R, c.GetNegative()),
            r = this.m_proxyA.GetSupportVertex(i),
            l = n.MulX(t, r),
            h = (l.x - m.x) * c.x + (l.y - m.y) * c.y;
        default:
            return o.b2Assert(!1),
            0
        }
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Collision.b2SeparationFunction.e_points = 1,
        Box2D.Collision.b2SeparationFunction.e_faceA = 2,
        Box2D.Collision.b2SeparationFunction.e_faceB = 4
    }),
    V.b2Simplex = function() {
        this.m_v1 = new T,
        this.m_v2 = new T,
        this.m_v3 = new T,
        this.m_vertices = new Vector(3)
    }
    ,
    V.prototype.b2Simplex = function() {
        this.m_vertices[0] = this.m_v1,
        this.m_vertices[1] = this.m_v2,
        this.m_vertices[2] = this.m_v3
    }
    ,
    V.prototype.ReadCache = function(t, e, i, s, r) {
        o.b2Assert(0 <= t.count && t.count <= 3);
        var a, l;
        this.m_count = t.count;
        for (var m = this.m_vertices, c = 0; c < this.m_count; c++) {
            var h = m[c];
            h.indexA = t.indexA[c],
            h.indexB = t.indexB[c],
            a = e.GetVertex(h.indexA),
            l = s.GetVertex(h.indexB),
            h.wA = n.MulX(i, a),
            h.wB = n.MulX(r, l),
            h.w = n.SubtractVV(h.wB, h.wA),
            h.a = 0
        }
        if (this.m_count > 1) {
            var u = t.metric
              , p = this.GetMetric();
            (.5 * u > p || p > 2 * u || p < Number.MIN_VALUE) && (this.m_count = 0)
        }
        0 == this.m_count && (h = m[0],
        h.indexA = 0,
        h.indexB = 0,
        a = e.GetVertex(0),
        l = s.GetVertex(0),
        h.wA = n.MulX(i, a),
        h.wB = n.MulX(r, l),
        h.w = n.SubtractVV(h.wB, h.wA),
        this.m_count = 1)
    }
    ,
    V.prototype.WriteCache = function(t) {
        t.metric = this.GetMetric(),
        t.count = Box2D.parseUInt(this.m_count);
        for (var e = this.m_vertices, i = 0; i < this.m_count; i++)
            t.indexA[i] = Box2D.parseUInt(e[i].indexA),
            t.indexB[i] = Box2D.parseUInt(e[i].indexB)
    }
    ,
    V.prototype.GetSearchDirection = function() {
        switch (this.m_count) {
        case 1:
            return this.m_v1.w.GetNegative();
        case 2:
            var t = n.SubtractVV(this.m_v2.w, this.m_v1.w)
              , e = n.CrossVV(t, this.m_v1.w.GetNegative());
            return e > 0 ? n.CrossFV(1, t) : n.CrossVF(t, 1);
        default:
            return o.b2Assert(!1),
            new a
        }
    }
    ,
    V.prototype.GetClosestPoint = function() {
        switch (this.m_count) {
        case 0:
            return o.b2Assert(!1),
            new a;
        case 1:
            return this.m_v1.w;
        case 2:
            return new a(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x,this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
        default:
            return o.b2Assert(!1),
            new a
        }
    }
    ,
    V.prototype.GetWitnessPoints = function(t, e) {
        switch (this.m_count) {
        case 0:
            o.b2Assert(!1);
            break;
        case 1:
            t.SetV(this.m_v1.wA),
            e.SetV(this.m_v1.wB);
            break;
        case 2:
            t.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x,
            t.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y,
            e.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x,
            e.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
            break;
        case 3:
            e.x = t.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x,
            e.y = t.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
            break;
        default:
            o.b2Assert(!1)
        }
    }
    ,
    V.prototype.GetMetric = function() {
        switch (this.m_count) {
        case 0:
            return o.b2Assert(!1),
            0;
        case 1:
            return 0;
        case 2:
            return n.SubtractVV(this.m_v1.w, this.m_v2.w).Length();
        case 3:
            return n.CrossVV(n.SubtractVV(this.m_v2.w, this.m_v1.w), n.SubtractVV(this.m_v3.w, this.m_v1.w));
        default:
            return o.b2Assert(!1),
            0
        }
    }
    ,
    V.prototype.Solve2 = function() {
        var t = this.m_v1.w
          , e = this.m_v2.w
          , i = n.SubtractVV(e, t)
          , o = -(t.x * i.x + t.y * i.y);
        if (0 >= o)
            return this.m_v1.a = 1,
            void (this.m_count = 1);
        var s = e.x * i.x + e.y * i.y;
        if (0 >= s)
            return this.m_v2.a = 1,
            this.m_count = 1,
            void this.m_v1.Set(this.m_v2);
        var r = 1 / (s + o);
        this.m_v1.a = s * r,
        this.m_v2.a = o * r,
        this.m_count = 2
    }
    ,
    V.prototype.Solve3 = function() {
        var t = this.m_v1.w
          , e = this.m_v2.w
          , i = this.m_v3.w
          , o = n.SubtractVV(e, t)
          , s = n.Dot(t, o)
          , r = n.Dot(e, o)
          , a = r
          , l = -s
          , m = n.SubtractVV(i, t)
          , c = n.Dot(t, m)
          , h = n.Dot(i, m)
          , u = h
          , p = -c
          , y = n.SubtractVV(i, e)
          , _ = n.Dot(e, y)
          , d = n.Dot(i, y)
          , f = d
          , x = -_
          , b = n.CrossVV(o, m)
          , v = b * n.CrossVV(e, i)
          , g = b * n.CrossVV(i, t)
          , D = b * n.CrossVV(t, e);
        if (0 >= l && 0 >= p)
            return this.m_v1.a = 1,
            void (this.m_count = 1);
        if (a > 0 && l > 0 && 0 >= D) {
            var C = 1 / (a + l);
            return this.m_v1.a = a * C,
            this.m_v2.a = l * C,
            void (this.m_count = 2)
        }
        if (u > 0 && p > 0 && 0 >= g) {
            var B = 1 / (u + p);
            return this.m_v1.a = u * B,
            this.m_v3.a = p * B,
            this.m_count = 2,
            void this.m_v2.Set(this.m_v3)
        }
        if (0 >= a && 0 >= x)
            return this.m_v2.a = 1,
            this.m_count = 1,
            void this.m_v1.Set(this.m_v2);
        if (0 >= u && 0 >= f)
            return this.m_v3.a = 1,
            this.m_count = 1,
            void this.m_v1.Set(this.m_v3);
        if (f > 0 && x > 0 && 0 >= v) {
            var w = 1 / (f + x);
            return this.m_v2.a = f * w,
            this.m_v3.a = x * w,
            this.m_count = 2,
            void this.m_v1.Set(this.m_v3)
        }
        var A = 1 / (v + g + D);
        this.m_v1.a = v * A,
        this.m_v2.a = g * A,
        this.m_v3.a = D * A,
        this.m_count = 3
    }
    ,
    I.b2SimplexCache = function() {
        this.indexA = new Vector_a2j_Number(3),
        this.indexB = new Vector_a2j_Number(3)
    }
    ,
    T.b2SimplexVertex = function() {}
    ,
    T.prototype.Set = function(t) {
        this.wA.SetV(t.wA),
        this.wB.SetV(t.wB),
        this.w.SetV(t.w),
        this.a = t.a,
        this.indexA = t.indexA,
        this.indexB = t.indexB
    }
    ,
    L.b2TimeOfImpact = function() {}
    ,
    L.TimeOfImpact = function(t) {
        ++L.b2_toiCalls;
        var e = t.proxyA
          , i = t.proxyB
          , s = t.sweepA
          , r = t.sweepB;
        o.b2Assert(s.t0 == r.t0),
        o.b2Assert(1 - s.t0 > Number.MIN_VALUE);
        var a = e.m_radius + i.m_radius
          , l = t.tolerance
          , m = 0
          , c = 1e3
          , h = 0
          , u = 0;
        for (L.s_cache.count = 0,
        L.s_distanceInput.useRadii = !1; ; ) {
            if (s.GetTransform(L.s_xfA, m),
            r.GetTransform(L.s_xfB, m),
            L.s_distanceInput.proxyA = e,
            L.s_distanceInput.proxyB = i,
            L.s_distanceInput.transformA = L.s_xfA,
            L.s_distanceInput.transformB = L.s_xfB,
            y.Distance(L.s_distanceOutput, L.s_cache, L.s_distanceInput),
            L.s_distanceOutput.distance <= 0) {
                m = 1;
                break
            }
            L.s_fcn.Initialize(L.s_cache, e, L.s_xfA, i, L.s_xfB);
            var p = L.s_fcn.Evaluate(L.s_xfA, L.s_xfB);
            if (0 >= p) {
                m = 1;
                break
            }
            if (0 == h && (u = p > a ? n.Max(a - l, .75 * a) : n.Max(p - l, .02 * a)),
            .5 * l > p - u) {
                if (0 == h) {
                    m = 1;
                    break
                }
                break
            }
            var _ = m
              , d = m
              , f = 1
              , x = p;
            s.GetTransform(L.s_xfA, f),
            r.GetTransform(L.s_xfB, f);
            var b = L.s_fcn.Evaluate(L.s_xfA, L.s_xfB);
            if (b >= u) {
                m = 1;
                break
            }
            for (var v = 0; ; ) {
                var g = 0;
                g = 1 & v ? d + (u - x) * (f - d) / (b - x) : .5 * (d + f),
                s.GetTransform(L.s_xfA, g),
                r.GetTransform(L.s_xfB, g);
                var D = L.s_fcn.Evaluate(L.s_xfA, L.s_xfB);
                if (n.Abs(D - u) < .025 * l) {
                    _ = g;
                    break
                }
                if (D > u ? (d = g,
                x = D) : (f = g,
                b = D),
                ++v,
                ++L.b2_toiRootIters,
                50 == v)
                    break
            }
            if (L.b2_toiMaxRootIters = n.Max(L.b2_toiMaxRootIters, v),
            _ < (1 + 100 * Number.MIN_VALUE) * m)
                break;
            if (m = _,
            h++,
            ++L.b2_toiIters,
            h == c)
                break
        }
        return L.b2_toiMaxIters = n.Max(L.b2_toiMaxIters, h),
        m
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Collision.b2TimeOfImpact.b2_toiCalls = 0,
        Box2D.Collision.b2TimeOfImpact.b2_toiIters = 0,
        Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters = 0,
        Box2D.Collision.b2TimeOfImpact.b2_toiRootIters = 0,
        Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters = 0,
        Box2D.Collision.b2TimeOfImpact.s_cache = new I,
        Box2D.Collision.b2TimeOfImpact.s_distanceInput = new _,
        Box2D.Collision.b2TimeOfImpact.s_xfA = new r,
        Box2D.Collision.b2TimeOfImpact.s_xfB = new r,
        Box2D.Collision.b2TimeOfImpact.s_fcn = new M,
        Box2D.Collision.b2TimeOfImpact.s_distanceOutput = new d
    }),
    G.b2TOIInput = function() {
        this.proxyA = new f,
        this.proxyB = new f,
        this.sweepA = new s,
        this.sweepB = new s
    }
    ,
    F.b2WorldManifold = function() {
        this.m_normal = new a
    }
    ,
    F.prototype.b2WorldManifold = function() {
        this.m_points = new Vector(o.b2_maxManifoldPoints);
        for (var t = 0; t < o.b2_maxManifoldPoints; t++)
            this.m_points[t] = new a
    }
    ,
    F.prototype.Initialize = function(t, e, i, o, n) {
        if (void 0 === i && (i = 0),
        void 0 === n && (n = 0),
        0 != t.m_pointCount) {
            var s, r, a = 0, l = 0, m = 0, c = 0, h = 0, u = 0, p = 0;
            switch (t.m_type) {
            case D.e_circles:
                r = e.R,
                s = t.m_localPoint;
                var y = e.position.x + r.col1.x * s.x + r.col2.x * s.y
                  , _ = e.position.y + r.col1.y * s.x + r.col2.y * s.y;
                r = o.R,
                s = t.m_points[0].m_localPoint;
                var d = o.position.x + r.col1.x * s.x + r.col2.x * s.y
                  , f = o.position.y + r.col1.y * s.x + r.col2.y * s.y
                  , x = d - y
                  , b = f - _
                  , v = x * x + b * b;
                if (v > Number.MIN_VALUE * Number.MIN_VALUE) {
                    var g = Math.sqrt(v);
                    this.m_normal.x = x / g,
                    this.m_normal.y = b / g
                } else
                    this.m_normal.x = 1,
                    this.m_normal.y = 0;
                var C = y + i * this.m_normal.x
                  , B = _ + i * this.m_normal.y
                  , w = d - n * this.m_normal.x
                  , A = f - n * this.m_normal.y;
                this.m_points[0].x = .5 * (C + w),
                this.m_points[0].y = .5 * (B + A);
                break;
            case D.e_faceA:
                for (r = e.R,
                s = t.m_localPlaneNormal,
                l = r.col1.x * s.x + r.col2.x * s.y,
                m = r.col1.y * s.x + r.col2.y * s.y,
                r = e.R,
                s = t.m_localPoint,
                c = e.position.x + r.col1.x * s.x + r.col2.x * s.y,
                h = e.position.y + r.col1.y * s.x + r.col2.y * s.y,
                this.m_normal.x = l,
                this.m_normal.y = m,
                a = 0; a < t.m_pointCount; a++)
                    r = o.R,
                    s = t.m_points[a].m_localPoint,
                    u = o.position.x + r.col1.x * s.x + r.col2.x * s.y,
                    p = o.position.y + r.col1.y * s.x + r.col2.y * s.y,
                    this.m_points[a].x = u + .5 * (i - (u - c) * l - (p - h) * m - n) * l,
                    this.m_points[a].y = p + .5 * (i - (u - c) * l - (p - h) * m - n) * m;
                break;
            case D.e_faceB:
                for (r = o.R,
                s = t.m_localPlaneNormal,
                l = r.col1.x * s.x + r.col2.x * s.y,
                m = r.col1.y * s.x + r.col2.y * s.y,
                r = o.R,
                s = t.m_localPoint,
                c = o.position.x + r.col1.x * s.x + r.col2.x * s.y,
                h = o.position.y + r.col1.y * s.x + r.col2.y * s.y,
                this.m_normal.x = -l,
                this.m_normal.y = -m,
                a = 0; a < t.m_pointCount; a++)
                    r = e.R,
                    s = t.m_points[a].m_localPoint,
                    u = e.position.x + r.col1.x * s.x + r.col2.x * s.y,
                    p = e.position.y + r.col1.y * s.x + r.col2.y * s.y,
                    this.m_points[a].x = u + .5 * (n - (u - c) * l - (p - h) * m - i) * l,
                    this.m_points[a].y = p + .5 * (n - (u - c) * l - (p - h) * m - i) * m
            }
        }
    }
    ,
    P.ClipVertex = function() {
        this.v = new a,
        this.id = new u
    }
    ,
    P.prototype.Set = function(t) {
        this.v.SetV(t.v),
        this.id.Set(t.id)
    }
    ,
    J.Features = function() {}
    ,
    Object.defineProperty(J.prototype, "referenceEdge", {
        enumerable: !1,
        configurable: !0,
        get: function() {
            return this._referenceEdge
        }
    }),
    Object.defineProperty(J.prototype, "referenceEdge", {
        enumerable: !1,
        configurable: !0,
        set: function(t) {
            void 0 === t && (t = 0),
            this._referenceEdge = t,
            this._m_id._key = 4294967040 & this._m_id._key | 255 & this._referenceEdge
        }
    }),
    Object.defineProperty(J.prototype, "incidentEdge", {
        enumerable: !1,
        configurable: !0,
        get: function() {
            return this._incidentEdge
        }
    }),
    Object.defineProperty(J.prototype, "incidentEdge", {
        enumerable: !1,
        configurable: !0,
        set: function(t) {
            void 0 === t && (t = 0),
            this._incidentEdge = t,
            this._m_id._key = 4294902015 & this._m_id._key | this._incidentEdge << 8 & 65280
        }
    }),
    Object.defineProperty(J.prototype, "incidentVertex", {
        enumerable: !1,
        configurable: !0,
        get: function() {
            return this._incidentVertex
        }
    }),
    Object.defineProperty(J.prototype, "incidentVertex", {
        enumerable: !1,
        configurable: !0,
        set: function(t) {
            void 0 === t && (t = 0),
            this._incidentVertex = t,
            this._m_id._key = 4278255615 & this._m_id._key | this._incidentVertex << 16 & 16711680
        }
    }),
    Object.defineProperty(J.prototype, "flip", {
        enumerable: !1,
        configurable: !0,
        get: function() {
            return this._flip
        }
    }),
    Object.defineProperty(J.prototype, "flip", {
        enumerable: !1,
        configurable: !0,
        set: function(t) {
            void 0 === t && (t = 0),
            this._flip = t,
            this._m_id._key = 16777215 & this._m_id._key | this._flip << 24 & 4278190080
        }
    })
}(),
function() {
    var t = (Box2D.Common.b2Color,
    Box2D.Common.b2internal,
    Box2D.Common.b2Settings)
      , e = Box2D.Collision.Shapes.b2CircleShape
      , i = Box2D.Collision.Shapes.b2EdgeChainDef
      , o = Box2D.Collision.Shapes.b2EdgeShape
      , n = Box2D.Collision.Shapes.b2MassData
      , s = Box2D.Collision.Shapes.b2PolygonShape
      , r = Box2D.Collision.Shapes.b2Shape
      , a = Box2D.Common.Math.b2Mat22
      , l = (Box2D.Common.Math.b2Mat33,
    Box2D.Common.Math.b2Math)
      , m = (Box2D.Common.Math.b2Sweep,
    Box2D.Common.Math.b2Transform)
      , c = Box2D.Common.Math.b2Vec2
      , h = (Box2D.Common.Math.b2Vec3,
    Box2D.Dynamics.b2Body,
    Box2D.Dynamics.b2BodyDef,
    Box2D.Dynamics.b2ContactFilter,
    Box2D.Dynamics.b2ContactImpulse,
    Box2D.Dynamics.b2ContactListener,
    Box2D.Dynamics.b2ContactManager,
    Box2D.Dynamics.b2DebugDraw,
    Box2D.Dynamics.b2DestructionListener,
    Box2D.Dynamics.b2FilterData,
    Box2D.Dynamics.b2Fixture,
    Box2D.Dynamics.b2FixtureDef,
    Box2D.Dynamics.b2Island,
    Box2D.Dynamics.b2TimeStep,
    Box2D.Dynamics.b2World,
    Box2D.Collision.b2AABB,
    Box2D.Collision.b2Bound,
    Box2D.Collision.b2BoundValues,
    Box2D.Collision.b2Collision,
    Box2D.Collision.b2ContactID,
    Box2D.Collision.b2ContactPoint,
    Box2D.Collision.b2Distance)
      , u = Box2D.Collision.b2DistanceInput
      , p = Box2D.Collision.b2DistanceOutput
      , y = Box2D.Collision.b2DistanceProxy
      , _ = (Box2D.Collision.b2DynamicTree,
    Box2D.Collision.b2DynamicTreeBroadPhase,
    Box2D.Collision.b2DynamicTreeNode,
    Box2D.Collision.b2DynamicTreePair,
    Box2D.Collision.b2Manifold,
    Box2D.Collision.b2ManifoldPoint,
    Box2D.Collision.b2Point,
    Box2D.Collision.b2RayCastInput,
    Box2D.Collision.b2RayCastOutput,
    Box2D.Collision.b2Segment,
    Box2D.Collision.b2SeparationFunction,
    Box2D.Collision.b2Simplex,
    Box2D.Collision.b2SimplexCache);
    Box2D.Collision.b2SimplexVertex,
    Box2D.Collision.b2TimeOfImpact,
    Box2D.Collision.b2TOIInput,
    Box2D.Collision.b2WorldManifold,
    Box2D.Collision.ClipVertex,
    Box2D.Collision.Features,
    Box2D.Collision.IBroadPhase,
    Box2D.inherit(e, Box2D.Collision.Shapes.b2Shape),
    e.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype,
    e.b2CircleShape = function() {
        Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments),
        this.m_p = new c
    }
    ,
    e.prototype.Copy = function() {
        var t = new e;
        return t.Set(this),
        t
    }
    ,
    e.prototype.Set = function(t) {
        if (this.__super.Set.call(this, t),
        Box2D.is(t, e)) {
            var i = t instanceof e ? t : null;
            this.m_p.SetV(i.m_p)
        }
    }
    ,
    e.prototype.TestPoint = function(t, e) {
        var i = t.R
          , o = t.position.x + (i.col1.x * this.m_p.x + i.col2.x * this.m_p.y)
          , n = t.position.y + (i.col1.y * this.m_p.x + i.col2.y * this.m_p.y);
        return o = e.x - o,
        n = e.y - n,
        o * o + n * n <= this.m_radius * this.m_radius
    }
    ,
    e.prototype.RayCast = function(t, e, i) {
        var o = i.R
          , n = i.position.x + (o.col1.x * this.m_p.x + o.col2.x * this.m_p.y)
          , s = i.position.y + (o.col1.y * this.m_p.x + o.col2.y * this.m_p.y)
          , r = e.p1.x - n
          , a = e.p1.y - s
          , l = r * r + a * a - this.m_radius * this.m_radius
          , m = e.p2.x - e.p1.x
          , c = e.p2.y - e.p1.y
          , h = r * m + a * c
          , u = m * m + c * c
          , p = h * h - u * l;
        if (0 > p || u < Number.MIN_VALUE)
            return !1;
        var y = -(h + Math.sqrt(p));
        return y >= 0 && y <= e.maxFraction * u ? (y /= u,
        t.fraction = y,
        t.normal.x = r + y * m,
        t.normal.y = a + y * c,
        t.normal.Normalize(),
        !0) : !1
    }
    ,
    e.prototype.ComputeAABB = function(t, e) {
        var i = e.R
          , o = e.position.x + (i.col1.x * this.m_p.x + i.col2.x * this.m_p.y)
          , n = e.position.y + (i.col1.y * this.m_p.x + i.col2.y * this.m_p.y);
        t.lowerBound.Set(o - this.m_radius, n - this.m_radius),
        t.upperBound.Set(o + this.m_radius, n + this.m_radius)
    }
    ,
    e.prototype.ComputeMass = function(e, i) {
        void 0 === i && (i = 0),
        e.mass = i * t.b2_pi * this.m_radius * this.m_radius,
        e.center.SetV(this.m_p),
        e.I = e.mass * (.5 * this.m_radius * this.m_radius + (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y))
    }
    ,
    e.prototype.ComputeSubmergedArea = function(t, e, i, o) {
        void 0 === e && (e = 0);
        var n = l.MulX(i, this.m_p)
          , s = -(l.Dot(t, n) - e);
        if (s < -this.m_radius + Number.MIN_VALUE)
            return 0;
        if (s > this.m_radius)
            return o.SetV(n),
            Math.PI * this.m_radius * this.m_radius;
        var r = this.m_radius * this.m_radius
          , a = s * s
          , m = r * (Math.asin(s / this.m_radius) + Math.PI / 2) + s * Math.sqrt(r - a)
          , c = -2 / 3 * Math.pow(r - a, 1.5) / m;
        return o.x = n.x + t.x * c,
        o.y = n.y + t.y * c,
        m
    }
    ,
    e.prototype.GetLocalPosition = function() {
        return this.m_p
    }
    ,
    e.prototype.SetLocalPosition = function(t) {
        this.m_p.SetV(t)
    }
    ,
    e.prototype.GetRadius = function() {
        return this.m_radius
    }
    ,
    e.prototype.SetRadius = function(t) {
        void 0 === t && (t = 0),
        this.m_radius = t
    }
    ,
    e.prototype.b2CircleShape = function(t) {
        void 0 === t && (t = 0),
        this.__super.b2Shape.call(this),
        this.m_type = r.e_circleShape,
        this.m_radius = t
    }
    ,
    i.b2EdgeChainDef = function() {}
    ,
    i.prototype.b2EdgeChainDef = function() {
        this.vertexCount = 0,
        this.isALoop = !0,
        this.vertices = []
    }
    ,
    Box2D.inherit(o, Box2D.Collision.Shapes.b2Shape),
    o.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype,
    o.b2EdgeShape = function() {
        Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments),
        this.s_supportVec = new c,
        this.m_v1 = new c,
        this.m_v2 = new c,
        this.m_coreV1 = new c,
        this.m_coreV2 = new c,
        this.m_normal = new c,
        this.m_direction = new c,
        this.m_cornerDir1 = new c,
        this.m_cornerDir2 = new c
    }
    ,
    o.prototype.TestPoint = function() {
        return !1
    }
    ,
    o.prototype.RayCast = function(t, e, i) {
        var o, n = e.p2.x - e.p1.x, s = e.p2.y - e.p1.y;
        o = i.R;
        var r = i.position.x + (o.col1.x * this.m_v1.x + o.col2.x * this.m_v1.y)
          , a = i.position.y + (o.col1.y * this.m_v1.x + o.col2.y * this.m_v1.y)
          , l = i.position.y + (o.col1.y * this.m_v2.x + o.col2.y * this.m_v2.y) - a
          , m = -(i.position.x + (o.col1.x * this.m_v2.x + o.col2.x * this.m_v2.y) - r)
          , c = 100 * Number.MIN_VALUE
          , h = -(n * l + s * m);
        if (h > c) {
            var u = e.p1.x - r
              , p = e.p1.y - a
              , y = u * l + p * m;
            if (y >= 0 && y <= e.maxFraction * h) {
                var _ = -n * p + s * u;
                if (_ >= -c * h && h * (1 + c) >= _) {
                    y /= h,
                    t.fraction = y;
                    var d = Math.sqrt(l * l + m * m);
                    return t.normal.x = l / d,
                    t.normal.y = m / d,
                    !0
                }
            }
        }
        return !1
    }
    ,
    o.prototype.ComputeAABB = function(t, e) {
        var i = e.R
          , o = e.position.x + (i.col1.x * this.m_v1.x + i.col2.x * this.m_v1.y)
          , n = e.position.y + (i.col1.y * this.m_v1.x + i.col2.y * this.m_v1.y)
          , s = e.position.x + (i.col1.x * this.m_v2.x + i.col2.x * this.m_v2.y)
          , r = e.position.y + (i.col1.y * this.m_v2.x + i.col2.y * this.m_v2.y);
        s > o ? (t.lowerBound.x = o,
        t.upperBound.x = s) : (t.lowerBound.x = s,
        t.upperBound.x = o),
        r > n ? (t.lowerBound.y = n,
        t.upperBound.y = r) : (t.lowerBound.y = r,
        t.upperBound.y = n)
    }
    ,
    o.prototype.ComputeMass = function(t, e) {
        void 0 === e && (e = 0),
        t.mass = 0,
        t.center.SetV(this.m_v1),
        t.I = 0
    }
    ,
    o.prototype.ComputeSubmergedArea = function(t, e, i, o) {
        void 0 === e && (e = 0);
        var n = new c(t.x * e,t.y * e)
          , s = l.MulX(i, this.m_v1)
          , r = l.MulX(i, this.m_v2)
          , a = l.Dot(t, s) - e
          , m = l.Dot(t, r) - e;
        if (a > 0) {
            if (m > 0)
                return 0;
            s.x = -m / (a - m) * s.x + a / (a - m) * r.x,
            s.y = -m / (a - m) * s.y + a / (a - m) * r.y
        } else
            m > 0 && (r.x = -m / (a - m) * s.x + a / (a - m) * r.x,
            r.y = -m / (a - m) * s.y + a / (a - m) * r.y);
        return o.x = (n.x + s.x + r.x) / 3,
        o.y = (n.y + s.y + r.y) / 3,
        .5 * ((s.x - n.x) * (r.y - n.y) - (s.y - n.y) * (r.x - n.x))
    }
    ,
    o.prototype.GetLength = function() {
        return this.m_length
    }
    ,
    o.prototype.GetVertex1 = function() {
        return this.m_v1
    }
    ,
    o.prototype.GetVertex2 = function() {
        return this.m_v2
    }
    ,
    o.prototype.GetCoreVertex1 = function() {
        return this.m_coreV1
    }
    ,
    o.prototype.GetCoreVertex2 = function() {
        return this.m_coreV2
    }
    ,
    o.prototype.GetNormalVector = function() {
        return this.m_normal
    }
    ,
    o.prototype.GetDirectionVector = function() {
        return this.m_direction
    }
    ,
    o.prototype.GetCorner1Vector = function() {
        return this.m_cornerDir1
    }
    ,
    o.prototype.GetCorner2Vector = function() {
        return this.m_cornerDir2
    }
    ,
    o.prototype.Corner1IsConvex = function() {
        return this.m_cornerConvex1
    }
    ,
    o.prototype.Corner2IsConvex = function() {
        return this.m_cornerConvex2
    }
    ,
    o.prototype.GetFirstVertex = function(t) {
        var e = t.R;
        return new c(t.position.x + (e.col1.x * this.m_coreV1.x + e.col2.x * this.m_coreV1.y),t.position.y + (e.col1.y * this.m_coreV1.x + e.col2.y * this.m_coreV1.y))
    }
    ,
    o.prototype.GetNextEdge = function() {
        return this.m_nextEdge
    }
    ,
    o.prototype.GetPrevEdge = function() {
        return this.m_prevEdge
    }
    ,
    o.prototype.Support = function(t, e, i) {
        void 0 === e && (e = 0),
        void 0 === i && (i = 0);
        var o = t.R
          , n = t.position.x + (o.col1.x * this.m_coreV1.x + o.col2.x * this.m_coreV1.y)
          , s = t.position.y + (o.col1.y * this.m_coreV1.x + o.col2.y * this.m_coreV1.y)
          , r = t.position.x + (o.col1.x * this.m_coreV2.x + o.col2.x * this.m_coreV2.y)
          , a = t.position.y + (o.col1.y * this.m_coreV2.x + o.col2.y * this.m_coreV2.y);
        return n * e + s * i > r * e + a * i ? (this.s_supportVec.x = n,
        this.s_supportVec.y = s) : (this.s_supportVec.x = r,
        this.s_supportVec.y = a),
        this.s_supportVec
    }
    ,
    o.prototype.b2EdgeShape = function(e, i) {
        this.__super.b2Shape.call(this),
        this.m_type = r.e_edgeShape,
        this.m_prevEdge = null,
        this.m_nextEdge = null,
        this.m_v1 = e,
        this.m_v2 = i,
        this.m_direction.Set(this.m_v2.x - this.m_v1.x, this.m_v2.y - this.m_v1.y),
        this.m_length = this.m_direction.Normalize(),
        this.m_normal.Set(this.m_direction.y, -this.m_direction.x),
        this.m_coreV1.Set(-t.b2_toiSlop * (this.m_normal.x - this.m_direction.x) + this.m_v1.x, -t.b2_toiSlop * (this.m_normal.y - this.m_direction.y) + this.m_v1.y),
        this.m_coreV2.Set(-t.b2_toiSlop * (this.m_normal.x + this.m_direction.x) + this.m_v2.x, -t.b2_toiSlop * (this.m_normal.y + this.m_direction.y) + this.m_v2.y),
        this.m_cornerDir1 = this.m_normal,
        this.m_cornerDir2.Set(-this.m_normal.x, -this.m_normal.y)
    }
    ,
    o.prototype.SetPrevEdge = function(t, e, i, o) {
        this.m_prevEdge = t,
        this.m_coreV1 = e,
        this.m_cornerDir1 = i,
        this.m_cornerConvex1 = o
    }
    ,
    o.prototype.SetNextEdge = function(t, e, i, o) {
        this.m_nextEdge = t,
        this.m_coreV2 = e,
        this.m_cornerDir2 = i,
        this.m_cornerConvex2 = o
    }
    ,
    n.b2MassData = function() {
        this.mass = 0,
        this.center = new c(0,0),
        this.I = 0
    }
    ,
    Box2D.inherit(s, Box2D.Collision.Shapes.b2Shape),
    s.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype,
    s.b2PolygonShape = function() {
        Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments)
    }
    ,
    s.prototype.Copy = function() {
        var t = new s;
        return t.Set(this),
        t
    }
    ,
    s.prototype.Set = function(t) {
        if (this.__super.Set.call(this, t),
        Box2D.is(t, s)) {
            var e = t instanceof s ? t : null;
            this.m_centroid.SetV(e.m_centroid),
            this.m_vertexCount = e.m_vertexCount,
            this.Reserve(this.m_vertexCount);
            for (var i = 0; i < this.m_vertexCount; i++)
                this.m_vertices[i].SetV(e.m_vertices[i]),
                this.m_normals[i].SetV(e.m_normals[i])
        }
    }
    ,
    s.prototype.SetAsArray = function(t, e) {
        void 0 === e && (e = 0);
        var i, o = new Vector, n = 0;
        for (n = 0; n < t.length; ++n)
            i = t[n],
            o.push(i);
        this.SetAsVector(o, e)
    }
    ,
    s.AsArray = function(t, e) {
        void 0 === e && (e = 0);
        var i = new s;
        return i.SetAsArray(t, e),
        i
    }
    ,
    s.prototype.SetAsVector = function(e, i) {
        void 0 === i && (i = 0),
        0 == i && (i = e.length),
        t.b2Assert(i >= 2),
        this.m_vertexCount = i,
        this.Reserve(i);
        var o = 0;
        for (o = 0; o < this.m_vertexCount; o++)
            this.m_vertices[o].SetV(e[o]);
        for (o = 0; o < this.m_vertexCount; ++o) {
            var n = parseInt(o)
              , r = parseInt(o + 1 < this.m_vertexCount ? o + 1 : 0)
              , a = l.SubtractVV(this.m_vertices[r], this.m_vertices[n]);
            t.b2Assert(a.LengthSquared() > Number.MIN_VALUE),
            this.m_normals[o].SetV(l.CrossVF(a, 1)),
            this.m_normals[o].Normalize()
        }
        this.m_centroid = s.ComputeCentroid(this.m_vertices, this.m_vertexCount)
    }
    ,
    s.AsVector = function(t, e) {
        void 0 === e && (e = 0);
        var i = new s;
        return i.SetAsVector(t, e),
        i
    }
    ,
    s.prototype.SetAsBox = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        this.m_vertexCount = 4,
        this.Reserve(4),
        this.m_vertices[0].Set(-t, -e),
        this.m_vertices[1].Set(t, -e),
        this.m_vertices[2].Set(t, e),
        this.m_vertices[3].Set(-t, e),
        this.m_normals[0].Set(0, -1),
        this.m_normals[1].Set(1, 0),
        this.m_normals[2].Set(0, 1),
        this.m_normals[3].Set(-1, 0),
        this.m_centroid.SetZero()
    }
    ,
    s.AsBox = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0);
        var i = new s;
        return i.SetAsBox(t, e),
        i
    }
    ,
    s.prototype.SetAsOrientedBox = function(t, e, i, o) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = null),
        void 0 === o && (o = 0),
        this.m_vertexCount = 4,
        this.Reserve(4),
        this.m_vertices[0].Set(-t, -e),
        this.m_vertices[1].Set(t, -e),
        this.m_vertices[2].Set(t, e),
        this.m_vertices[3].Set(-t, e),
        this.m_normals[0].Set(0, -1),
        this.m_normals[1].Set(1, 0),
        this.m_normals[2].Set(0, 1),
        this.m_normals[3].Set(-1, 0),
        this.m_centroid = i;
        var n = new m;
        n.position = i,
        n.R.Set(o);
        for (var s = 0; s < this.m_vertexCount; ++s)
            this.m_vertices[s] = l.MulX(n, this.m_vertices[s]),
            this.m_normals[s] = l.MulMV(n.R, this.m_normals[s])
    }
    ,
    s.AsOrientedBox = function(t, e, i, o) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = null),
        void 0 === o && (o = 0);
        var n = new s;
        return n.SetAsOrientedBox(t, e, i, o),
        n
    }
    ,
    s.prototype.SetAsEdge = function(t, e) {
        this.m_vertexCount = 2,
        this.Reserve(2),
        this.m_vertices[0].SetV(t),
        this.m_vertices[1].SetV(e),
        this.m_centroid.x = .5 * (t.x + e.x),
        this.m_centroid.y = .5 * (t.y + e.y),
        this.m_normals[0] = l.CrossVF(l.SubtractVV(e, t), 1),
        this.m_normals[0].Normalize(),
        this.m_normals[1].x = -this.m_normals[0].x,
        this.m_normals[1].y = -this.m_normals[0].y
    }
    ,
    s.AsEdge = function(t, e) {
        var i = new s;
        return i.SetAsEdge(t, e),
        i
    }
    ,
    s.prototype.TestPoint = function(t, e) {
        for (var i, o = t.R, n = e.x - t.position.x, s = e.y - t.position.y, r = n * o.col1.x + s * o.col1.y, a = n * o.col2.x + s * o.col2.y, l = 0; l < this.m_vertexCount; ++l) {
            i = this.m_vertices[l],
            n = r - i.x,
            s = a - i.y,
            i = this.m_normals[l];
            var m = i.x * n + i.y * s;
            if (m > 0)
                return !1
        }
        return !0
    }
    ,
    s.prototype.RayCast = function(t, e, i) {
        var o, n, s = 0, r = e.maxFraction, a = 0, l = 0;
        a = e.p1.x - i.position.x,
        l = e.p1.y - i.position.y,
        o = i.R;
        var m = a * o.col1.x + l * o.col1.y
          , c = a * o.col2.x + l * o.col2.y;
        a = e.p2.x - i.position.x,
        l = e.p2.y - i.position.y,
        o = i.R;
        for (var h = a * o.col1.x + l * o.col1.y, u = a * o.col2.x + l * o.col2.y, p = h - m, y = u - c, _ = parseInt(-1), d = 0; d < this.m_vertexCount; ++d) {
            n = this.m_vertices[d],
            a = n.x - m,
            l = n.y - c,
            n = this.m_normals[d];
            var f = n.x * a + n.y * l
              , x = n.x * p + n.y * y;
            if (0 == x) {
                if (0 > f)
                    return !1
            } else
                0 > x && s * x > f ? (s = f / x,
                _ = d) : x > 0 && r * x > f && (r = f / x);
            if (r < s - Number.MIN_VALUE)
                return !1
        }
        return _ >= 0 ? (t.fraction = s,
        o = i.R,
        n = this.m_normals[_],
        t.normal.x = o.col1.x * n.x + o.col2.x * n.y,
        t.normal.y = o.col1.y * n.x + o.col2.y * n.y,
        !0) : !1
    }
    ,
    s.prototype.ComputeAABB = function(t, e) {
        for (var i = e.R, o = this.m_vertices[0], n = e.position.x + (i.col1.x * o.x + i.col2.x * o.y), s = e.position.y + (i.col1.y * o.x + i.col2.y * o.y), r = n, a = s, l = 1; l < this.m_vertexCount; ++l) {
            o = this.m_vertices[l];
            var m = e.position.x + (i.col1.x * o.x + i.col2.x * o.y)
              , c = e.position.y + (i.col1.y * o.x + i.col2.y * o.y);
            n = m > n ? n : m,
            s = c > s ? s : c,
            r = r > m ? r : m,
            a = a > c ? a : c
        }
        t.lowerBound.x = n - this.m_radius,
        t.lowerBound.y = s - this.m_radius,
        t.upperBound.x = r + this.m_radius,
        t.upperBound.y = a + this.m_radius
    }
    ,
    s.prototype.ComputeMass = function(t, e) {
        if (void 0 === e && (e = 0),
        2 == this.m_vertexCount)
            return t.center.x = .5 * (this.m_vertices[0].x + this.m_vertices[1].x),
            t.center.y = .5 * (this.m_vertices[0].y + this.m_vertices[1].y),
            t.mass = 0,
            void (t.I = 0);
        for (var i = 0, o = 0, n = 0, s = 0, r = 0, a = 0, l = 1 / 3, m = 0; m < this.m_vertexCount; ++m) {
            var c = this.m_vertices[m]
              , h = m + 1 < this.m_vertexCount ? this.m_vertices[parseInt(m + 1)] : this.m_vertices[0]
              , u = c.x - r
              , p = c.y - a
              , y = h.x - r
              , _ = h.y - a
              , d = u * _ - p * y
              , f = .5 * d;
            n += f,
            i += f * l * (r + c.x + h.x),
            o += f * l * (a + c.y + h.y);
            var x = r
              , b = a
              , v = u
              , g = p
              , D = y
              , C = _
              , B = l * (.25 * (v * v + D * v + D * D) + (x * v + x * D)) + .5 * x * x
              , w = l * (.25 * (g * g + C * g + C * C) + (b * g + b * C)) + .5 * b * b;
            s += d * (B + w)
        }
        t.mass = e * n,
        i *= 1 / n,
        o *= 1 / n,
        t.center.Set(i, o),
        t.I = e * s
    }
    ,
    s.prototype.ComputeSubmergedArea = function(t, e, i, o) {
        void 0 === e && (e = 0);
        var s = l.MulTMV(i.R, t)
          , r = e - l.Dot(t, i.position)
          , a = new Vector_a2j_Number
          , m = 0
          , h = parseInt(-1)
          , u = parseInt(-1)
          , p = !1
          , y = 0;
        for (y = 0; y < this.m_vertexCount; ++y) {
            a[y] = l.Dot(s, this.m_vertices[y]) - r;
            var _ = a[y] < -Number.MIN_VALUE;
            y > 0 && (_ ? p || (h = y - 1,
            m++) : p && (u = y - 1,
            m++)),
            p = _
        }
        switch (m) {
        case 0:
            if (p) {
                var d = new n;
                return this.ComputeMass(d, 1),
                o.SetV(l.MulX(i, d.center)),
                d.mass
            }
            return 0;
        case 1:
            -1 == h ? h = this.m_vertexCount - 1 : u = this.m_vertexCount - 1
        }
        var f, x = parseInt((h + 1) % this.m_vertexCount), b = parseInt((u + 1) % this.m_vertexCount), v = (0 - a[h]) / (a[x] - a[h]), g = (0 - a[u]) / (a[b] - a[u]), D = new c(this.m_vertices[h].x * (1 - v) + this.m_vertices[x].x * v,this.m_vertices[h].y * (1 - v) + this.m_vertices[x].y * v), C = new c(this.m_vertices[u].x * (1 - g) + this.m_vertices[b].x * g,this.m_vertices[u].y * (1 - g) + this.m_vertices[b].y * g), B = 0, w = new c, A = this.m_vertices[x];
        for (y = x; y != b; ) {
            y = (y + 1) % this.m_vertexCount,
            f = y == b ? C : this.m_vertices[y];
            var S = .5 * ((A.x - D.x) * (f.y - D.y) - (A.y - D.y) * (f.x - D.x));
            B += S,
            w.x += S * (D.x + A.x + f.x) / 3,
            w.y += S * (D.y + A.y + f.y) / 3,
            A = f
        }
        return w.Multiply(1 / B),
        o.SetV(l.MulX(i, w)),
        B
    }
    ,
    s.prototype.GetVertexCount = function() {
        return this.m_vertexCount
    }
    ,
    s.prototype.GetVertices = function() {
        return this.m_vertices
    }
    ,
    s.prototype.GetNormals = function() {
        return this.m_normals
    }
    ,
    s.prototype.GetSupport = function(t) {
        for (var e = 0, i = this.m_vertices[0].x * t.x + this.m_vertices[0].y * t.y, o = 1; o < this.m_vertexCount; ++o) {
            var n = this.m_vertices[o].x * t.x + this.m_vertices[o].y * t.y;
            n > i && (e = o,
            i = n)
        }
        return e
    }
    ,
    s.prototype.GetSupportVertex = function(t) {
        for (var e = 0, i = this.m_vertices[0].x * t.x + this.m_vertices[0].y * t.y, o = 1; o < this.m_vertexCount; ++o) {
            var n = this.m_vertices[o].x * t.x + this.m_vertices[o].y * t.y;
            n > i && (e = o,
            i = n)
        }
        return this.m_vertices[e]
    }
    ,
    s.prototype.Validate = function() {
        return !1
    }
    ,
    s.prototype.b2PolygonShape = function() {
        this.__super.b2Shape.call(this),
        this.m_type = r.e_polygonShape,
        this.m_centroid = new c,
        this.m_vertices = new Vector,
        this.m_normals = new Vector
    }
    ,
    s.prototype.Reserve = function(t) {
        void 0 === t && (t = 0);
        for (var e = parseInt(this.m_vertices.length); t > e; e++)
            this.m_vertices[e] = new c,
            this.m_normals[e] = new c
    }
    ,
    s.ComputeCentroid = function(t, e) {
        void 0 === e && (e = 0);
        for (var i = new c, o = 0, n = 0, s = 0, r = 1 / 3, a = 0; e > a; ++a) {
            var l = t[a]
              , m = e > a + 1 ? t[parseInt(a + 1)] : t[0]
              , h = l.x - n
              , u = l.y - s
              , p = m.x - n
              , y = m.y - s
              , _ = h * y - u * p
              , d = .5 * _;
            o += d,
            i.x += d * r * (n + l.x + m.x),
            i.y += d * r * (s + l.y + m.y)
        }
        return i.x *= 1 / o,
        i.y *= 1 / o,
        i
    }
    ,
    s.ComputeOBB = function(t, e, i) {
        void 0 === i && (i = 0);
        var o = 0
          , n = new Vector(i + 1);
        for (o = 0; i > o; ++o)
            n[o] = e[o];
        n[i] = n[0];
        var s = Number.MAX_VALUE;
        for (o = 1; i >= o; ++o) {
            var r = n[parseInt(o - 1)]
              , a = n[o].x - r.x
              , l = n[o].y - r.y
              , m = Math.sqrt(a * a + l * l);
            a /= m,
            l /= m;
            for (var c = -l, h = a, u = Number.MAX_VALUE, p = Number.MAX_VALUE, y = -Number.MAX_VALUE, _ = -Number.MAX_VALUE, d = 0; i > d; ++d) {
                var f = n[d].x - r.x
                  , x = n[d].y - r.y
                  , b = a * f + l * x
                  , v = c * f + h * x;
                u > b && (u = b),
                p > v && (p = v),
                b > y && (y = b),
                v > _ && (_ = v)
            }
            var g = (y - u) * (_ - p);
            if (.95 * s > g) {
                s = g,
                t.R.col1.x = a,
                t.R.col1.y = l,
                t.R.col2.x = c,
                t.R.col2.y = h;
                var D = .5 * (u + y)
                  , C = .5 * (p + _)
                  , B = t.R;
                t.center.x = r.x + (B.col1.x * D + B.col2.x * C),
                t.center.y = r.y + (B.col1.y * D + B.col2.y * C),
                t.extents.x = .5 * (y - u),
                t.extents.y = .5 * (_ - p)
            }
        }
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Collision.Shapes.b2PolygonShape.s_mat = new a
    }),
    r.b2Shape = function() {}
    ,
    r.prototype.Copy = function() {
        return null
    }
    ,
    r.prototype.Set = function(t) {
        this.m_radius = t.m_radius
    }
    ,
    r.prototype.GetType = function() {
        return this.m_type
    }
    ,
    r.prototype.TestPoint = function() {
        return !1
    }
    ,
    r.prototype.RayCast = function() {
        return !1
    }
    ,
    r.prototype.ComputeAABB = function() {}
    ,
    r.prototype.ComputeMass = function(t, e) {
        void 0 === e && (e = 0)
    }
    ,
    r.prototype.ComputeSubmergedArea = function(t, e) {
        return void 0 === e && (e = 0),
        0
    }
    ,
    r.TestOverlap = function(t, e, i, o) {
        var n = new u;
        n.proxyA = new y,
        n.proxyA.Set(t),
        n.proxyB = new y,
        n.proxyB.Set(i),
        n.transformA = e,
        n.transformB = o,
        n.useRadii = !0;
        var s = new _;
        s.count = 0;
        var r = new p;
        return h.Distance(r, s, n),
        r.distance < 10 * Number.MIN_VALUE
    }
    ,
    r.prototype.b2Shape = function() {
        this.m_type = r.e_unknownShape,
        this.m_radius = t.b2_linearSlop
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Collision.Shapes.b2Shape.e_unknownShape = parseInt(-1),
        Box2D.Collision.Shapes.b2Shape.e_circleShape = 0,
        Box2D.Collision.Shapes.b2Shape.e_polygonShape = 1,
        Box2D.Collision.Shapes.b2Shape.e_edgeShape = 2,
        Box2D.Collision.Shapes.b2Shape.e_shapeTypeCount = 3,
        Box2D.Collision.Shapes.b2Shape.e_hitCollide = 1,
        Box2D.Collision.Shapes.b2Shape.e_missCollide = 0,
        Box2D.Collision.Shapes.b2Shape.e_startsInsideCollide = parseInt(-1)
    })
}(),
function() {
    var t = Box2D.Common.b2Color
      , e = (Box2D.Common.b2internal,
    Box2D.Common.b2Settings)
      , i = (Box2D.Common.Math.b2Mat22,
    Box2D.Common.Math.b2Mat33,
    Box2D.Common.Math.b2Math);
    Box2D.Common.Math.b2Sweep,
    Box2D.Common.Math.b2Transform,
    Box2D.Common.Math.b2Vec2,
    Box2D.Common.Math.b2Vec3,
    t.b2Color = function() {
        this._r = 0,
        this._g = 0,
        this._b = 0
    }
    ,
    t.prototype.b2Color = function(t, e, o) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === o && (o = 0),
        this._r = Box2D.parseUInt(255 * i.Clamp(t, 0, 1)),
        this._g = Box2D.parseUInt(255 * i.Clamp(e, 0, 1)),
        this._b = Box2D.parseUInt(255 * i.Clamp(o, 0, 1))
    }
    ,
    t.prototype.Set = function(t, e, o) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === o && (o = 0),
        this._r = Box2D.parseUInt(255 * i.Clamp(t, 0, 1)),
        this._g = Box2D.parseUInt(255 * i.Clamp(e, 0, 1)),
        this._b = Box2D.parseUInt(255 * i.Clamp(o, 0, 1))
    }
    ,
    Object.defineProperty(t.prototype, "r", {
        enumerable: !1,
        configurable: !0,
        set: function(t) {
            void 0 === t && (t = 0),
            this._r = Box2D.parseUInt(255 * i.Clamp(t, 0, 1))
        }
    }),
    Object.defineProperty(t.prototype, "g", {
        enumerable: !1,
        configurable: !0,
        set: function(t) {
            void 0 === t && (t = 0),
            this._g = Box2D.parseUInt(255 * i.Clamp(t, 0, 1))
        }
    }),
    Object.defineProperty(t.prototype, "b", {
        enumerable: !1,
        configurable: !0,
        set: function(t) {
            void 0 === t && (t = 0),
            this._b = Box2D.parseUInt(255 * i.Clamp(t, 0, 1))
        }
    }),
    Object.defineProperty(t.prototype, "color", {
        enumerable: !1,
        configurable: !0,
        get: function() {
            return this._r << 16 | this._g << 8 | this._b
        }
    }),
    e.b2Settings = function() {}
    ,
    e.b2MixFriction = function(t, e) {
        return void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        Math.sqrt(t * e)
    }
    ,
    e.b2MixRestitution = function(t, e) {
        return void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        t > e ? t : e
    }
    ,
    e.b2Assert = function(t) {
        if (!t)
            throw "Assertion Failed"
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Common.b2Settings.VERSION = "2.1alpha",
        Box2D.Common.b2Settings.USHRT_MAX = 65535,
        Box2D.Common.b2Settings.b2_pi = Math.PI,
        Box2D.Common.b2Settings.b2_maxManifoldPoints = 2,
        Box2D.Common.b2Settings.b2_aabbExtension = .1,
        Box2D.Common.b2Settings.b2_aabbMultiplier = 2,
        Box2D.Common.b2Settings.b2_polygonRadius = 2 * e.b2_linearSlop,
        Box2D.Common.b2Settings.b2_linearSlop = .005,
        Box2D.Common.b2Settings.b2_angularSlop = 2 / 180 * e.b2_pi,
        Box2D.Common.b2Settings.b2_toiSlop = 8 * e.b2_linearSlop,
        Box2D.Common.b2Settings.b2_maxTOIContactsPerIsland = 32,
        Box2D.Common.b2Settings.b2_maxTOIJointsPerIsland = 32,
        Box2D.Common.b2Settings.b2_velocityThreshold = 1,
        Box2D.Common.b2Settings.b2_maxLinearCorrection = .2,
        Box2D.Common.b2Settings.b2_maxAngularCorrection = 8 / 180 * e.b2_pi,
        Box2D.Common.b2Settings.b2_maxTranslation = 2,
        Box2D.Common.b2Settings.b2_maxTranslationSquared = e.b2_maxTranslation * e.b2_maxTranslation,
        Box2D.Common.b2Settings.b2_maxRotation = .5 * e.b2_pi,
        Box2D.Common.b2Settings.b2_maxRotationSquared = e.b2_maxRotation * e.b2_maxRotation,
        Box2D.Common.b2Settings.b2_contactBaumgarte = .2,
        Box2D.Common.b2Settings.b2_timeToSleep = .5,
        Box2D.Common.b2Settings.b2_linearSleepTolerance = .01,
        Box2D.Common.b2Settings.b2_angularSleepTolerance = 2 / 180 * e.b2_pi
    })
}(),
function() {
    var t = (Box2D.Collision.b2AABB,
    Box2D.Common.b2Color,
    Box2D.Common.b2internal,
    Box2D.Common.b2Settings,
    Box2D.Common.Math.b2Mat22)
      , e = Box2D.Common.Math.b2Mat33
      , i = Box2D.Common.Math.b2Math
      , o = Box2D.Common.Math.b2Sweep
      , n = Box2D.Common.Math.b2Transform
      , s = Box2D.Common.Math.b2Vec2
      , r = Box2D.Common.Math.b2Vec3;
    t.b2Mat22 = function() {
        this.col1 = new s,
        this.col2 = new s
    }
    ,
    t.prototype.b2Mat22 = function() {
        this.SetIdentity()
    }
    ,
    t.FromAngle = function(e) {
        void 0 === e && (e = 0);
        var i = new t;
        return i.Set(e),
        i
    }
    ,
    t.FromVV = function(e, i) {
        var o = new t;
        return o.SetVV(e, i),
        o
    }
    ,
    t.prototype.Set = function(t) {
        void 0 === t && (t = 0);
        var e = Math.cos(t)
          , i = Math.sin(t);
        this.col1.x = e,
        this.col2.x = -i,
        this.col1.y = i,
        this.col2.y = e
    }
    ,
    t.prototype.SetVV = function(t, e) {
        this.col1.SetV(t),
        this.col2.SetV(e)
    }
    ,
    t.prototype.Copy = function() {
        var e = new t;
        return e.SetM(this),
        e
    }
    ,
    t.prototype.SetM = function(t) {
        this.col1.SetV(t.col1),
        this.col2.SetV(t.col2)
    }
    ,
    t.prototype.AddM = function(t) {
        this.col1.x += t.col1.x,
        this.col1.y += t.col1.y,
        this.col2.x += t.col2.x,
        this.col2.y += t.col2.y
    }
    ,
    t.prototype.SetIdentity = function() {
        this.col1.x = 1,
        this.col2.x = 0,
        this.col1.y = 0,
        this.col2.y = 1
    }
    ,
    t.prototype.SetZero = function() {
        this.col1.x = 0,
        this.col2.x = 0,
        this.col1.y = 0,
        this.col2.y = 0
    }
    ,
    t.prototype.GetAngle = function() {
        return Math.atan2(this.col1.y, this.col1.x)
    }
    ,
    t.prototype.GetInverse = function(t) {
        var e = this.col1.x
          , i = this.col2.x
          , o = this.col1.y
          , n = this.col2.y
          , s = e * n - i * o;
        return 0 != s && (s = 1 / s),
        t.col1.x = s * n,
        t.col2.x = -s * i,
        t.col1.y = -s * o,
        t.col2.y = s * e,
        t
    }
    ,
    t.prototype.Solve = function(t, e, i) {
        void 0 === e && (e = 0),
        void 0 === i && (i = 0);
        var o = this.col1.x
          , n = this.col2.x
          , s = this.col1.y
          , r = this.col2.y
          , a = o * r - n * s;
        return 0 != a && (a = 1 / a),
        t.x = a * (r * e - n * i),
        t.y = a * (o * i - s * e),
        t
    }
    ,
    t.prototype.Abs = function() {
        this.col1.Abs(),
        this.col2.Abs()
    }
    ,
    e.b2Mat33 = function() {
        this.col1 = new r,
        this.col2 = new r,
        this.col3 = new r
    }
    ,
    e.prototype.b2Mat33 = function(t, e, i) {
        void 0 === t && (t = null),
        void 0 === e && (e = null),
        void 0 === i && (i = null),
        t || e || i ? (this.col1.SetV(t),
        this.col2.SetV(e),
        this.col3.SetV(i)) : (this.col1.SetZero(),
        this.col2.SetZero(),
        this.col3.SetZero())
    }
    ,
    e.prototype.SetVVV = function(t, e, i) {
        this.col1.SetV(t),
        this.col2.SetV(e),
        this.col3.SetV(i)
    }
    ,
    e.prototype.Copy = function() {
        return new e(this.col1,this.col2,this.col3)
    }
    ,
    e.prototype.SetM = function(t) {
        this.col1.SetV(t.col1),
        this.col2.SetV(t.col2),
        this.col3.SetV(t.col3)
    }
    ,
    e.prototype.AddM = function(t) {
        this.col1.x += t.col1.x,
        this.col1.y += t.col1.y,
        this.col1.z += t.col1.z,
        this.col2.x += t.col2.x,
        this.col2.y += t.col2.y,
        this.col2.z += t.col2.z,
        this.col3.x += t.col3.x,
        this.col3.y += t.col3.y,
        this.col3.z += t.col3.z
    }
    ,
    e.prototype.SetIdentity = function() {
        this.col1.x = 1,
        this.col2.x = 0,
        this.col3.x = 0,
        this.col1.y = 0,
        this.col2.y = 1,
        this.col3.y = 0,
        this.col1.z = 0,
        this.col2.z = 0,
        this.col3.z = 1
    }
    ,
    e.prototype.SetZero = function() {
        this.col1.x = 0,
        this.col2.x = 0,
        this.col3.x = 0,
        this.col1.y = 0,
        this.col2.y = 0,
        this.col3.y = 0,
        this.col1.z = 0,
        this.col2.z = 0,
        this.col3.z = 0
    }
    ,
    e.prototype.Solve22 = function(t, e, i) {
        void 0 === e && (e = 0),
        void 0 === i && (i = 0);
        var o = this.col1.x
          , n = this.col2.x
          , s = this.col1.y
          , r = this.col2.y
          , a = o * r - n * s;
        return 0 != a && (a = 1 / a),
        t.x = a * (r * e - n * i),
        t.y = a * (o * i - s * e),
        t
    }
    ,
    e.prototype.Solve33 = function(t, e, i, o) {
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        void 0 === o && (o = 0);
        var n = this.col1.x
          , s = this.col1.y
          , r = this.col1.z
          , a = this.col2.x
          , l = this.col2.y
          , m = this.col2.z
          , c = this.col3.x
          , h = this.col3.y
          , u = this.col3.z
          , p = n * (l * u - m * h) + s * (m * c - a * u) + r * (a * h - l * c);
        return 0 != p && (p = 1 / p),
        t.x = p * (e * (l * u - m * h) + i * (m * c - a * u) + o * (a * h - l * c)),
        t.y = p * (n * (i * u - o * h) + s * (o * c - e * u) + r * (e * h - i * c)),
        t.z = p * (n * (l * o - m * i) + s * (m * e - a * o) + r * (a * i - l * e)),
        t
    }
    ,
    i.b2Math = function() {}
    ,
    i.IsValid = function(t) {
        return void 0 === t && (t = 0),
        isFinite(t)
    }
    ,
    i.Dot = function(t, e) {
        return t.x * e.x + t.y * e.y
    }
    ,
    i.CrossVV = function(t, e) {
        return t.x * e.y - t.y * e.x
    }
    ,
    i.CrossVF = function(t, e) {
        void 0 === e && (e = 0);
        var i = new s(e * t.y,-e * t.x);
        return i
    }
    ,
    i.CrossFV = function(t, e) {
        void 0 === t && (t = 0);
        var i = new s(-t * e.y,t * e.x);
        return i
    }
    ,
    i.MulMV = function(t, e) {
        var i = new s(t.col1.x * e.x + t.col2.x * e.y,t.col1.y * e.x + t.col2.y * e.y);
        return i
    }
    ,
    i.MulTMV = function(t, e) {
        var o = new s(i.Dot(e, t.col1),i.Dot(e, t.col2));
        return o
    }
    ,
    i.MulX = function(t, e) {
        var o = i.MulMV(t.R, e);
        return o.x += t.position.x,
        o.y += t.position.y,
        o
    }
    ,
    i.MulXT = function(t, e) {
        var o = i.SubtractVV(e, t.position)
          , n = o.x * t.R.col1.x + o.y * t.R.col1.y;
        return o.y = o.x * t.R.col2.x + o.y * t.R.col2.y,
        o.x = n,
        o
    }
    ,
    i.AddVV = function(t, e) {
        var i = new s(t.x + e.x,t.y + e.y);
        return i
    }
    ,
    i.SubtractVV = function(t, e) {
        var i = new s(t.x - e.x,t.y - e.y);
        return i
    }
    ,
    i.Distance = function(t, e) {
        var i = t.x - e.x
          , o = t.y - e.y;
        return Math.sqrt(i * i + o * o)
    }
    ,
    i.DistanceSquared = function(t, e) {
        var i = t.x - e.x
          , o = t.y - e.y;
        return i * i + o * o
    }
    ,
    i.MulFV = function(t, e) {
        void 0 === t && (t = 0);
        var i = new s(t * e.x,t * e.y);
        return i
    }
    ,
    i.AddMM = function(e, o) {
        var n = t.FromVV(i.AddVV(e.col1, o.col1), i.AddVV(e.col2, o.col2));
        return n
    }
    ,
    i.MulMM = function(e, o) {
        var n = t.FromVV(i.MulMV(e, o.col1), i.MulMV(e, o.col2));
        return n
    }
    ,
    i.MulTMM = function(e, o) {
        var n = new s(i.Dot(e.col1, o.col1),i.Dot(e.col2, o.col1))
          , r = new s(i.Dot(e.col1, o.col2),i.Dot(e.col2, o.col2))
          , a = t.FromVV(n, r);
        return a
    }
    ,
    i.Abs = function(t) {
        return void 0 === t && (t = 0),
        t > 0 ? t : -t
    }
    ,
    i.AbsV = function(t) {
        var e = new s(i.Abs(t.x),i.Abs(t.y));
        return e
    }
    ,
    i.AbsM = function(e) {
        var o = t.FromVV(i.AbsV(e.col1), i.AbsV(e.col2));
        return o
    }
    ,
    i.Min = function(t, e) {
        return void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        e > t ? t : e
    }
    ,
    i.MinV = function(t, e) {
        var o = new s(i.Min(t.x, e.x),i.Min(t.y, e.y));
        return o
    }
    ,
    i.Max = function(t, e) {
        return void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        t > e ? t : e
    }
    ,
    i.MaxV = function(t, e) {
        var o = new s(i.Max(t.x, e.x),i.Max(t.y, e.y));
        return o
    }
    ,
    i.Clamp = function(t, e, i) {
        return void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        e > t ? e : t > i ? i : t
    }
    ,
    i.ClampV = function(t, e, o) {
        return i.MaxV(e, i.MinV(t, o))
    }
    ,
    i.Swap = function(t, e) {
        var i = t[0];
        t[0] = e[0],
        e[0] = i
    }
    ,
    i.Random = function() {
        return 2 * Math.random() - 1
    }
    ,
    i.RandomRange = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0);
        var i = Math.random();
        return i = (e - t) * i + t
    }
    ,
    i.NextPowerOfTwo = function(t) {
        return void 0 === t && (t = 0),
        t |= t >> 1 & 2147483647,
        t |= t >> 2 & 1073741823,
        t |= t >> 4 & 268435455,
        t |= t >> 8 & 16777215,
        t |= t >> 16 & 65535,
        t + 1
    }
    ,
    i.IsPowerOfTwo = function(t) {
        void 0 === t && (t = 0);
        var e = t > 0 && 0 == (t & t - 1);
        return e
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Common.Math.b2Math.b2Vec2_zero = new s(0,0),
        Box2D.Common.Math.b2Math.b2Mat22_identity = t.FromVV(new s(1,0), new s(0,1)),
        Box2D.Common.Math.b2Math.b2Transform_identity = new n(i.b2Vec2_zero,i.b2Mat22_identity)
    }),
    o.b2Sweep = function() {
        this.localCenter = new s,
        this.c0 = new s,
        this.c = new s
    }
    ,
    o.prototype.Set = function(t) {
        this.localCenter.SetV(t.localCenter),
        this.c0.SetV(t.c0),
        this.c.SetV(t.c),
        this.a0 = t.a0,
        this.a = t.a,
        this.t0 = t.t0
    }
    ,
    o.prototype.Copy = function() {
        var t = new o;
        return t.localCenter.SetV(this.localCenter),
        t.c0.SetV(this.c0),
        t.c.SetV(this.c),
        t.a0 = this.a0,
        t.a = this.a,
        t.t0 = this.t0,
        t
    }
    ,
    o.prototype.GetTransform = function(t, e) {
        void 0 === e && (e = 0),
        t.position.x = (1 - e) * this.c0.x + e * this.c.x,
        t.position.y = (1 - e) * this.c0.y + e * this.c.y;
        var i = (1 - e) * this.a0 + e * this.a;
        t.R.Set(i);
        var o = t.R;
        t.position.x -= o.col1.x * this.localCenter.x + o.col2.x * this.localCenter.y,
        t.position.y -= o.col1.y * this.localCenter.x + o.col2.y * this.localCenter.y
    }
    ,
    o.prototype.Advance = function(t) {
        if (void 0 === t && (t = 0),
        this.t0 < t && 1 - this.t0 > Number.MIN_VALUE) {
            var e = (t - this.t0) / (1 - this.t0);
            this.c0.x = (1 - e) * this.c0.x + e * this.c.x,
            this.c0.y = (1 - e) * this.c0.y + e * this.c.y,
            this.a0 = (1 - e) * this.a0 + e * this.a,
            this.t0 = t
        }
    }
    ,
    n.b2Transform = function() {
        this.position = new s,
        this.R = new t
    }
    ,
    n.prototype.b2Transform = function(t, e) {
        void 0 === t && (t = null),
        void 0 === e && (e = null),
        t && (this.position.SetV(t),
        this.R.SetM(e));
    }
    ,
    n.prototype.Initialize = function(t, e) {
        this.position.SetV(t),
        this.R.SetM(e)
    }
    ,
    n.prototype.SetIdentity = function() {
        this.position.SetZero(),
        this.R.SetIdentity()
    }
    ,
    n.prototype.Set = function(t) {
        this.position.SetV(t.position),
        this.R.SetM(t.R)
    }
    ,
    n.prototype.GetAngle = function() {
        return Math.atan2(this.R.col1.y, this.R.col1.x)
    }
    ,
    s.b2Vec2 = function() {}
    ,
    s.prototype.b2Vec2 = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        this.x = t,
        this.y = e
    }
    ,
    s.prototype.SetZero = function() {
        this.x = 0,
        this.y = 0
    }
    ,
    s.prototype.Set = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        this.x = t,
        this.y = e
    }
    ,
    s.prototype.SetV = function(t) {
        this.x = t.x,
        this.y = t.y
    }
    ,
    s.prototype.GetNegative = function() {
        return new s(-this.x,-this.y)
    }
    ,
    s.prototype.NegativeSelf = function() {
        this.x = -this.x,
        this.y = -this.y
    }
    ,
    s.Make = function(t, e) {
        return void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        new s(t,e)
    }
    ,
    s.prototype.Copy = function() {
        return new s(this.x,this.y)
    }
    ,
    s.prototype.Add = function(t) {
        this.x += t.x,
        this.y += t.y
    }
    ,
    s.prototype.Subtract = function(t) {
        this.x -= t.x,
        this.y -= t.y
    }
    ,
    s.prototype.Multiply = function(t) {
        void 0 === t && (t = 0),
        this.x *= t,
        this.y *= t
    }
    ,
    s.prototype.MulM = function(t) {
        var e = this.x;
        this.x = t.col1.x * e + t.col2.x * this.y,
        this.y = t.col1.y * e + t.col2.y * this.y
    }
    ,
    s.prototype.MulTM = function(t) {
        var e = i.Dot(this, t.col1);
        this.y = i.Dot(this, t.col2),
        this.x = e
    }
    ,
    s.prototype.CrossVF = function(t) {
        void 0 === t && (t = 0);
        var e = this.x;
        this.x = t * this.y,
        this.y = -t * e
    }
    ,
    s.prototype.CrossFV = function(t) {
        void 0 === t && (t = 0);
        var e = this.x;
        this.x = -t * this.y,
        this.y = t * e
    }
    ,
    s.prototype.MinV = function(t) {
        this.x = this.x < t.x ? this.x : t.x,
        this.y = this.y < t.y ? this.y : t.y
    }
    ,
    s.prototype.MaxV = function(t) {
        this.x = this.x > t.x ? this.x : t.x,
        this.y = this.y > t.y ? this.y : t.y
    }
    ,
    s.prototype.Abs = function() {
        this.x < 0 && (this.x = -this.x),
        this.y < 0 && (this.y = -this.y)
    }
    ,
    s.prototype.Length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    ,
    s.prototype.LengthSquared = function() {
        return this.x * this.x + this.y * this.y
    }
    ,
    s.prototype.Normalize = function() {
        var t = Math.sqrt(this.x * this.x + this.y * this.y);
        if (t < Number.MIN_VALUE)
            return 0;
        var e = 1 / t;
        return this.x *= e,
        this.y *= e,
        t
    }
    ,
    s.prototype.IsValid = function() {
        return i.IsValid(this.x) && i.IsValid(this.y)
    }
    ,
    r.b2Vec3 = function() {}
    ,
    r.prototype.b2Vec3 = function(t, e, i) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        this.x = t,
        this.y = e,
        this.z = i
    }
    ,
    r.prototype.SetZero = function() {
        this.x = this.y = this.z = 0
    }
    ,
    r.prototype.Set = function(t, e, i) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        this.x = t,
        this.y = e,
        this.z = i
    }
    ,
    r.prototype.SetV = function(t) {
        this.x = t.x,
        this.y = t.y,
        this.z = t.z
    }
    ,
    r.prototype.GetNegative = function() {
        return new r(-this.x,-this.y,-this.z)
    }
    ,
    r.prototype.NegativeSelf = function() {
        this.x = -this.x,
        this.y = -this.y,
        this.z = -this.z
    }
    ,
    r.prototype.Copy = function() {
        return new r(this.x,this.y,this.z)
    }
    ,
    r.prototype.Add = function(t) {
        this.x += t.x,
        this.y += t.y,
        this.z += t.z
    }
    ,
    r.prototype.Subtract = function(t) {
        this.x -= t.x,
        this.y -= t.y,
        this.z -= t.z
    }
    ,
    r.prototype.Multiply = function(t) {
        void 0 === t && (t = 0),
        this.x *= t,
        this.y *= t,
        this.z *= t
    }
}(),
function() {
    var t = (Box2D.Dynamics.Controllers.b2ControllerEdge,
    Box2D.Common.Math.b2Mat22,
    Box2D.Common.Math.b2Mat33,
    Box2D.Common.Math.b2Math)
      , e = Box2D.Common.Math.b2Sweep
      , i = Box2D.Common.Math.b2Transform
      , o = Box2D.Common.Math.b2Vec2
      , n = (Box2D.Common.Math.b2Vec3,
    Box2D.Common.b2Color)
      , s = (Box2D.Common.b2internal,
    Box2D.Common.b2Settings)
      , r = Box2D.Collision.b2AABB
      , a = (Box2D.Collision.b2Bound,
    Box2D.Collision.b2BoundValues,
    Box2D.Collision.b2Collision,
    Box2D.Collision.b2ContactID,
    Box2D.Collision.b2ContactPoint)
      , l = (Box2D.Collision.b2Distance,
    Box2D.Collision.b2DistanceInput,
    Box2D.Collision.b2DistanceOutput,
    Box2D.Collision.b2DistanceProxy,
    Box2D.Collision.b2DynamicTree,
    Box2D.Collision.b2DynamicTreeBroadPhase)
      , m = (Box2D.Collision.b2DynamicTreeNode,
    Box2D.Collision.b2DynamicTreePair,
    Box2D.Collision.b2Manifold,
    Box2D.Collision.b2ManifoldPoint,
    Box2D.Collision.b2Point,
    Box2D.Collision.b2RayCastInput)
      , c = Box2D.Collision.b2RayCastOutput
      , h = (Box2D.Collision.b2Segment,
    Box2D.Collision.b2SeparationFunction,
    Box2D.Collision.b2Simplex,
    Box2D.Collision.b2SimplexCache,
    Box2D.Collision.b2SimplexVertex,
    Box2D.Collision.b2TimeOfImpact,
    Box2D.Collision.b2TOIInput,
    Box2D.Collision.b2WorldManifold,
    Box2D.Collision.ClipVertex,
    Box2D.Collision.Features,
    Box2D.Collision.IBroadPhase,
    Box2D.Collision.Shapes.b2CircleShape)
      , u = (Box2D.Collision.Shapes.b2EdgeChainDef,
    Box2D.Collision.Shapes.b2EdgeShape)
      , p = Box2D.Collision.Shapes.b2MassData
      , y = Box2D.Collision.Shapes.b2PolygonShape
      , _ = Box2D.Collision.Shapes.b2Shape
      , d = Box2D.Dynamics.b2Body
      , f = Box2D.Dynamics.b2BodyDef
      , x = Box2D.Dynamics.b2ContactFilter
      , b = Box2D.Dynamics.b2ContactImpulse
      , v = Box2D.Dynamics.b2ContactListener
      , g = Box2D.Dynamics.b2ContactManager
      , D = Box2D.Dynamics.b2DebugDraw
      , C = Box2D.Dynamics.b2DestructionListener
      , B = Box2D.Dynamics.b2FilterData
      , w = Box2D.Dynamics.b2Fixture
      , A = Box2D.Dynamics.b2FixtureDef
      , S = Box2D.Dynamics.b2Island
      , M = Box2D.Dynamics.b2TimeStep
      , V = Box2D.Dynamics.b2World
      , I = (Box2D.Dynamics.Contacts.b2CircleContact,
    Box2D.Dynamics.Contacts.b2Contact)
      , T = (Box2D.Dynamics.Contacts.b2ContactConstraint,
    Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
    Box2D.Dynamics.Contacts.b2ContactEdge,
    Box2D.Dynamics.Contacts.b2ContactFactory)
      , L = (Box2D.Dynamics.Contacts.b2ContactRegister,
    Box2D.Dynamics.Contacts.b2ContactResult,
    Box2D.Dynamics.Contacts.b2ContactSolver)
      , G = (Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
    Box2D.Dynamics.Contacts.b2NullContact,
    Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
    Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
    Box2D.Dynamics.Contacts.b2PolygonContact,
    Box2D.Dynamics.Contacts.b2PositionSolverManifold,
    Box2D.Dynamics.Controllers.b2Controller,
    Box2D.Dynamics.Joints.b2DistanceJoint,
    Box2D.Dynamics.Joints.b2DistanceJointDef,
    Box2D.Dynamics.Joints.b2FrictionJoint,
    Box2D.Dynamics.Joints.b2FrictionJointDef,
    Box2D.Dynamics.Joints.b2GearJoint,
    Box2D.Dynamics.Joints.b2GearJointDef,
    Box2D.Dynamics.Joints.b2Jacobian,
    Box2D.Dynamics.Joints.b2Joint)
      , F = (Box2D.Dynamics.Joints.b2JointDef,
    Box2D.Dynamics.Joints.b2JointEdge,
    Box2D.Dynamics.Joints.b2LineJoint,
    Box2D.Dynamics.Joints.b2LineJointDef,
    Box2D.Dynamics.Joints.b2MouseJoint,
    Box2D.Dynamics.Joints.b2MouseJointDef,
    Box2D.Dynamics.Joints.b2PrismaticJoint,
    Box2D.Dynamics.Joints.b2PrismaticJointDef,
    Box2D.Dynamics.Joints.b2PulleyJoint);
    Box2D.Dynamics.Joints.b2PulleyJointDef,
    Box2D.Dynamics.Joints.b2RevoluteJoint,
    Box2D.Dynamics.Joints.b2RevoluteJointDef,
    Box2D.Dynamics.Joints.b2WeldJoint,
    Box2D.Dynamics.Joints.b2WeldJointDef,
    d.b2Body = function() {
        this.m_xf = new i,
        this.m_sweep = new e,
        this.m_linearVelocity = new o,
        this.m_force = new o
    }
    ,
    d.prototype.connectEdges = function(e, i, o) {
        void 0 === o && (o = 0);
        var n = Math.atan2(i.GetDirectionVector().y, i.GetDirectionVector().x)
          , r = Math.tan(.5 * (n - o))
          , a = t.MulFV(r, i.GetDirectionVector());
        a = t.SubtractVV(a, i.GetNormalVector()),
        a = t.MulFV(s.b2_toiSlop, a),
        a = t.AddVV(a, i.GetVertex1());
        var l = t.AddVV(e.GetDirectionVector(), i.GetDirectionVector());
        l.Normalize();
        var m = t.Dot(e.GetDirectionVector(), i.GetNormalVector()) > 0;
        return e.SetNextEdge(i, a, l, m),
        i.SetPrevEdge(e, a, l, m),
        n
    }
    ,
    d.prototype.CreateFixture = function(t) {
        if (1 == this.m_world.IsLocked())
            return null;
        var e = new w;
        if (e.Create(this, this.m_xf, t),
        this.m_flags & d.e_activeFlag) {
            var i = this.m_world.m_contactManager.m_broadPhase;
            e.CreateProxy(i, this.m_xf)
        }
        return e.m_next = this.m_fixtureList,
        this.m_fixtureList = e,
        ++this.m_fixtureCount,
        e.m_body = this,
        e.m_density > 0 && this.ResetMassData(),
        this.m_world.m_flags |= V.e_newFixture,
        e
    }
    ,
    d.prototype.CreateFixture2 = function(t, e) {
        void 0 === e && (e = 0);
        var i = new A;
        return i.shape = t,
        i.density = e,
        this.CreateFixture(i)
    }
    ,
    d.prototype.DestroyFixture = function(t) {
        if (1 != this.m_world.IsLocked()) {
            for (var e = this.m_fixtureList, i = null, o = !1; null != e; ) {
                if (e == t) {
                    i ? i.m_next = t.m_next : this.m_fixtureList = t.m_next,
                    o = !0;
                    break
                }
                i = e,
                e = e.m_next
            }
            for (var n = this.m_contactList; n; ) {
                var s = n.contact;
                n = n.next;
                var r = s.GetFixtureA()
                  , a = s.GetFixtureB();
                t != r && t != a || this.m_world.m_contactManager.Destroy(s)
            }
            if (this.m_flags & d.e_activeFlag) {
                var l = this.m_world.m_contactManager.m_broadPhase;
                t.DestroyProxy(l)
            }
            t.Destroy(),
            t.m_body = null,
            t.m_next = null,
            --this.m_fixtureCount,
            this.ResetMassData()
        }
    }
    ,
    d.prototype.SetPositionAndAngle = function(t, e) {
        void 0 === e && (e = 0);
        var i;
        if (1 != this.m_world.IsLocked()) {
            this.m_xf.R.Set(e),
            this.m_xf.position.SetV(t);
            var o = this.m_xf.R
              , n = this.m_sweep.localCenter;
            this.m_sweep.c.x = o.col1.x * n.x + o.col2.x * n.y,
            this.m_sweep.c.y = o.col1.y * n.x + o.col2.y * n.y,
            this.m_sweep.c.x += this.m_xf.position.x,
            this.m_sweep.c.y += this.m_xf.position.y,
            this.m_sweep.c0.SetV(this.m_sweep.c),
            this.m_sweep.a0 = this.m_sweep.a = e;
            var s = this.m_world.m_contactManager.m_broadPhase;
            for (i = this.m_fixtureList; i; i = i.m_next)
                i.Synchronize(s, this.m_xf, this.m_xf);
            this.m_world.m_contactManager.FindNewContacts()
        }
    }
    ,
    d.prototype.SetTransform = function(t) {
        this.SetPositionAndAngle(t.position, t.GetAngle())
    }
    ,
    d.prototype.GetTransform = function() {
        return this.m_xf
    }
    ,
    d.prototype.GetPosition = function() {
        return this.m_xf.position
    }
    ,
    d.prototype.SetPosition = function(t) {
        this.SetPositionAndAngle(t, this.GetAngle())
    }
    ,
    d.prototype.GetAngle = function() {
        return this.m_sweep.a
    }
    ,
    d.prototype.SetAngle = function(t) {
        void 0 === t && (t = 0),
        this.SetPositionAndAngle(this.GetPosition(), t)
    }
    ,
    d.prototype.GetWorldCenter = function() {
        return this.m_sweep.c
    }
    ,
    d.prototype.GetLocalCenter = function() {
        return this.m_sweep.localCenter
    }
    ,
    d.prototype.SetLinearVelocity = function(t) {
        this.m_type != d.b2_staticBody && this.m_linearVelocity.SetV(t)
    }
    ,
    d.prototype.GetLinearVelocity = function() {
        return this.m_linearVelocity
    }
    ,
    d.prototype.SetAngularVelocity = function(t) {
        void 0 === t && (t = 0),
        this.m_type != d.b2_staticBody && (this.m_angularVelocity = t)
    }
    ,
    d.prototype.GetAngularVelocity = function() {
        return this.m_angularVelocity
    }
    ,
    d.prototype.GetDefinition = function() {
        var t = new f;
        return t.type = this.GetType(),
        t.allowSleep = (this.m_flags & d.e_allowSleepFlag) == d.e_allowSleepFlag,
        t.angle = this.GetAngle(),
        t.angularDamping = this.m_angularDamping,
        t.angularVelocity = this.m_angularVelocity,
        t.fixedRotation = (this.m_flags & d.e_fixedRotationFlag) == d.e_fixedRotationFlag,
        t.bullet = (this.m_flags & d.e_bulletFlag) == d.e_bulletFlag,
        t.awake = (this.m_flags & d.e_awakeFlag) == d.e_awakeFlag,
        t.linearDamping = this.m_linearDamping,
        t.linearVelocity.SetV(this.GetLinearVelocity()),
        t.position = this.GetPosition(),
        t.userData = this.GetUserData(),
        t
    }
    ,
    d.prototype.ApplyForce = function(t, e) {
        this.m_type == d.b2_dynamicBody && (0 == this.IsAwake() && this.SetAwake(!0),
        this.m_force.x += t.x,
        this.m_force.y += t.y,
        this.m_torque += (e.x - this.m_sweep.c.x) * t.y - (e.y - this.m_sweep.c.y) * t.x)
    }
    ,
    d.prototype.ApplyTorque = function(t) {
        void 0 === t && (t = 0),
        this.m_type == d.b2_dynamicBody && (0 == this.IsAwake() && this.SetAwake(!0),
        this.m_torque += t)
    }
    ,
    d.prototype.ApplyImpulse = function(t, e) {
        this.m_type == d.b2_dynamicBody && (0 == this.IsAwake() && this.SetAwake(!0),
        this.m_linearVelocity.x += this.m_invMass * t.x,
        this.m_linearVelocity.y += this.m_invMass * t.y,
        this.m_angularVelocity += this.m_invI * ((e.x - this.m_sweep.c.x) * t.y - (e.y - this.m_sweep.c.y) * t.x))
    }
    ,
    d.prototype.Split = function(e) {
        for (var i, o = this.GetLinearVelocity().Copy(), n = this.GetAngularVelocity(), s = this.GetWorldCenter(), r = this, a = this.m_world.CreateBody(this.GetDefinition()), l = r.m_fixtureList; l; )
            if (e(l)) {
                var m = l.m_next;
                i ? i.m_next = m : r.m_fixtureList = m,
                r.m_fixtureCount--,
                l.m_next = a.m_fixtureList,
                a.m_fixtureList = l,
                a.m_fixtureCount++,
                l.m_body = a,
                l = m
            } else
                i = l,
                l = l.m_next;
        r.ResetMassData(),
        a.ResetMassData();
        var c = r.GetWorldCenter()
          , h = a.GetWorldCenter()
          , u = t.AddVV(o, t.CrossFV(n, t.SubtractVV(c, s)))
          , p = t.AddVV(o, t.CrossFV(n, t.SubtractVV(h, s)));
        return r.SetLinearVelocity(u),
        a.SetLinearVelocity(p),
        r.SetAngularVelocity(n),
        a.SetAngularVelocity(n),
        r.SynchronizeFixtures(),
        a.SynchronizeFixtures(),
        a
    }
    ,
    d.prototype.Merge = function(t) {
        var e;
        for (e = t.m_fixtureList; e; ) {
            var i = e.m_next;
            t.m_fixtureCount--,
            e.m_next = this.m_fixtureList,
            this.m_fixtureList = e,
            this.m_fixtureCount++,
            e.m_body = n,
            e = i
        }
        o.m_fixtureCount = 0;
        var o = this
          , n = t;
        o.GetWorldCenter(),
        n.GetWorldCenter(),
        o.GetLinearVelocity().Copy(),
        n.GetLinearVelocity().Copy(),
        o.GetAngularVelocity(),
        n.GetAngularVelocity(),
        o.ResetMassData(),
        this.SynchronizeFixtures()
    }
    ,
    d.prototype.GetMass = function() {
        return this.m_mass
    }
    ,
    d.prototype.GetInertia = function() {
        return this.m_I
    }
    ,
    d.prototype.GetMassData = function(t) {
        t.mass = this.m_mass,
        t.I = this.m_I,
        t.center.SetV(this.m_sweep.localCenter)
    }
    ,
    d.prototype.SetMassData = function(e) {
        if (s.b2Assert(0 == this.m_world.IsLocked()),
        1 != this.m_world.IsLocked() && this.m_type == d.b2_dynamicBody) {
            this.m_invMass = 0,
            this.m_I = 0,
            this.m_invI = 0,
            this.m_mass = e.mass,
            this.m_mass <= 0 && (this.m_mass = 1),
            this.m_invMass = 1 / this.m_mass,
            e.I > 0 && 0 == (this.m_flags & d.e_fixedRotationFlag) && (this.m_I = e.I - this.m_mass * (e.center.x * e.center.x + e.center.y * e.center.y),
            this.m_invI = 1 / this.m_I);
            var i = this.m_sweep.c.Copy();
            this.m_sweep.localCenter.SetV(e.center),
            this.m_sweep.c0.SetV(t.MulX(this.m_xf, this.m_sweep.localCenter)),
            this.m_sweep.c.SetV(this.m_sweep.c0),
            this.m_linearVelocity.x += this.m_angularVelocity * -(this.m_sweep.c.y - i.y),
            this.m_linearVelocity.y += this.m_angularVelocity * +(this.m_sweep.c.x - i.x)
        }
    }
    ,
    d.prototype.ResetMassData = function() {
        if (this.m_mass = 0,
        this.m_invMass = 0,
        this.m_I = 0,
        this.m_invI = 0,
        this.m_sweep.localCenter.SetZero(),
        this.m_type != d.b2_staticBody && this.m_type != d.b2_kinematicBody) {
            for (var e = o.Make(0, 0), i = this.m_fixtureList; i; i = i.m_next)
                if (0 != i.m_density) {
                    var n = i.GetMassData();
                    this.m_mass += n.mass,
                    e.x += n.center.x * n.mass,
                    e.y += n.center.y * n.mass,
                    this.m_I += n.I
                }
            this.m_mass > 0 ? (this.m_invMass = 1 / this.m_mass,
            e.x *= this.m_invMass,
            e.y *= this.m_invMass) : (this.m_mass = 1,
            this.m_invMass = 1),
            this.m_I > 0 && 0 == (this.m_flags & d.e_fixedRotationFlag) ? (this.m_I -= this.m_mass * (e.x * e.x + e.y * e.y),
            this.m_I *= this.m_inertiaScale,
            s.b2Assert(this.m_I > 0),
            this.m_invI = 1 / this.m_I) : (this.m_I = 0,
            this.m_invI = 0);
            var r = this.m_sweep.c.Copy();
            this.m_sweep.localCenter.SetV(e),
            this.m_sweep.c0.SetV(t.MulX(this.m_xf, this.m_sweep.localCenter)),
            this.m_sweep.c.SetV(this.m_sweep.c0),
            this.m_linearVelocity.x += this.m_angularVelocity * -(this.m_sweep.c.y - r.y),
            this.m_linearVelocity.y += this.m_angularVelocity * +(this.m_sweep.c.x - r.x)
        }
    }
    ,
    d.prototype.GetWorldPoint = function(t) {
        var e = this.m_xf.R
          , i = new o(e.col1.x * t.x + e.col2.x * t.y,e.col1.y * t.x + e.col2.y * t.y);
        return i.x += this.m_xf.position.x,
        i.y += this.m_xf.position.y,
        i
    }
    ,
    d.prototype.GetWorldVector = function(e) {
        return t.MulMV(this.m_xf.R, e)
    }
    ,
    d.prototype.GetLocalPoint = function(e) {
        return t.MulXT(this.m_xf, e)
    }
    ,
    d.prototype.GetLocalVector = function(e) {
        return t.MulTMV(this.m_xf.R, e)
    }
    ,
    d.prototype.GetLinearVelocityFromWorldPoint = function(t) {
        return new o(this.m_linearVelocity.x - this.m_angularVelocity * (t.y - this.m_sweep.c.y),this.m_linearVelocity.y + this.m_angularVelocity * (t.x - this.m_sweep.c.x))
    }
    ,
    d.prototype.GetLinearVelocityFromLocalPoint = function(t) {
        var e = this.m_xf.R
          , i = new o(e.col1.x * t.x + e.col2.x * t.y,e.col1.y * t.x + e.col2.y * t.y);
        return i.x += this.m_xf.position.x,
        i.y += this.m_xf.position.y,
        new o(this.m_linearVelocity.x - this.m_angularVelocity * (i.y - this.m_sweep.c.y),this.m_linearVelocity.y + this.m_angularVelocity * (i.x - this.m_sweep.c.x))
    }
    ,
    d.prototype.GetLinearDamping = function() {
        return this.m_linearDamping
    }
    ,
    d.prototype.SetLinearDamping = function(t) {
        void 0 === t && (t = 0),
        this.m_linearDamping = t
    }
    ,
    d.prototype.GetAngularDamping = function() {
        return this.m_angularDamping
    }
    ,
    d.prototype.SetAngularDamping = function(t) {
        void 0 === t && (t = 0),
        this.m_angularDamping = t
    }
    ,
    d.prototype.SetType = function(t) {
        if (void 0 === t && (t = 0),
        this.m_type != t) {
            this.m_type = t,
            this.ResetMassData(),
            this.m_type == d.b2_staticBody && (this.m_linearVelocity.SetZero(),
            this.m_angularVelocity = 0),
            this.SetAwake(!0),
            this.m_force.SetZero(),
            this.m_torque = 0;
            for (var e = this.m_contactList; e; e = e.next)
                e.contact.FlagForFiltering()
        }
    }
    ,
    d.prototype.GetType = function() {
        return this.m_type
    }
    ,
    d.prototype.SetBullet = function(t) {
        t ? this.m_flags |= d.e_bulletFlag : this.m_flags &= ~d.e_bulletFlag
    }
    ,
    d.prototype.IsBullet = function() {
        return (this.m_flags & d.e_bulletFlag) == d.e_bulletFlag
    }
    ,
    d.prototype.SetSleepingAllowed = function(t) {
        t ? this.m_flags |= d.e_allowSleepFlag : (this.m_flags &= ~d.e_allowSleepFlag,
        this.SetAwake(!0))
    }
    ,
    d.prototype.SetAwake = function(t) {
        t ? (this.m_flags |= d.e_awakeFlag,
        this.m_sleepTime = 0) : (this.m_flags &= ~d.e_awakeFlag,
        this.m_sleepTime = 0,
        this.m_linearVelocity.SetZero(),
        this.m_angularVelocity = 0,
        this.m_force.SetZero(),
        this.m_torque = 0)
    }
    ,
    d.prototype.IsAwake = function() {
        return (this.m_flags & d.e_awakeFlag) == d.e_awakeFlag
    }
    ,
    d.prototype.SetFixedRotation = function(t) {
        t ? this.m_flags |= d.e_fixedRotationFlag : this.m_flags &= ~d.e_fixedRotationFlag,
        this.ResetMassData()
    }
    ,
    d.prototype.IsFixedRotation = function() {
        return (this.m_flags & d.e_fixedRotationFlag) == d.e_fixedRotationFlag
    }
    ,
    d.prototype.SetActive = function(t) {
        if (t != this.IsActive()) {
            var e, i;
            if (t)
                for (this.m_flags |= d.e_activeFlag,
                e = this.m_world.m_contactManager.m_broadPhase,
                i = this.m_fixtureList; i; i = i.m_next)
                    i.CreateProxy(e, this.m_xf);
            else {
                for (this.m_flags &= ~d.e_activeFlag,
                e = this.m_world.m_contactManager.m_broadPhase,
                i = this.m_fixtureList; i; i = i.m_next)
                    i.DestroyProxy(e);
                for (var o = this.m_contactList; o; ) {
                    var n = o;
                    o = o.next,
                    this.m_world.m_contactManager.Destroy(n.contact)
                }
                this.m_contactList = null
            }
        }
    }
    ,
    d.prototype.IsActive = function() {
        return (this.m_flags & d.e_activeFlag) == d.e_activeFlag
    }
    ,
    d.prototype.IsSleepingAllowed = function() {
        return (this.m_flags & d.e_allowSleepFlag) == d.e_allowSleepFlag
    }
    ,
    d.prototype.GetFixtureList = function() {
        return this.m_fixtureList
    }
    ,
    d.prototype.GetJointList = function() {
        return this.m_jointList
    }
    ,
    d.prototype.GetControllerList = function() {
        return this.m_controllerList
    }
    ,
    d.prototype.GetContactList = function() {
        return this.m_contactList
    }
    ,
    d.prototype.GetNext = function() {
        return this.m_next
    }
    ,
    d.prototype.GetUserData = function() {
        return this.m_userData
    }
    ,
    d.prototype.SetUserData = function(t) {
        this.m_userData = t
    }
    ,
    d.prototype.GetWorld = function() {
        return this.m_world
    }
    ,
    d.prototype.b2Body = function(t, e) {
        this.m_flags = 0,
        t.bullet && (this.m_flags |= d.e_bulletFlag),
        t.fixedRotation && (this.m_flags |= d.e_fixedRotationFlag),
        t.allowSleep && (this.m_flags |= d.e_allowSleepFlag),
        t.awake && (this.m_flags |= d.e_awakeFlag),
        t.active && (this.m_flags |= d.e_activeFlag),
        this.m_world = e,
        this.m_xf.position.SetV(t.position),
        this.m_xf.R.Set(t.angle),
        this.m_sweep.localCenter.SetZero(),
        this.m_sweep.t0 = 1,
        this.m_sweep.a0 = this.m_sweep.a = t.angle;
        var i = this.m_xf.R
          , o = this.m_sweep.localCenter;
        this.m_sweep.c.x = i.col1.x * o.x + i.col2.x * o.y,
        this.m_sweep.c.y = i.col1.y * o.x + i.col2.y * o.y,
        this.m_sweep.c.x += this.m_xf.position.x,
        this.m_sweep.c.y += this.m_xf.position.y,
        this.m_sweep.c0.SetV(this.m_sweep.c),
        this.m_jointList = null,
        this.m_controllerList = null,
        this.m_contactList = null,
        this.m_controllerCount = 0,
        this.m_prev = null,
        this.m_next = null,
        this.m_linearVelocity.SetV(t.linearVelocity),
        this.m_angularVelocity = t.angularVelocity,
        this.m_linearDamping = t.linearDamping,
        this.m_angularDamping = t.angularDamping,
        this.m_force.Set(0, 0),
        this.m_torque = 0,
        this.m_sleepTime = 0,
        this.m_type = t.type,
        this.m_type == d.b2_dynamicBody ? (this.m_mass = 1,
        this.m_invMass = 1) : (this.m_mass = 0,
        this.m_invMass = 0),
        this.m_I = 0,
        this.m_invI = 0,
        this.m_inertiaScale = t.inertiaScale,
        this.m_userData = t.userData,
        this.m_fixtureList = null,
        this.m_fixtureCount = 0
    }
    ,
    d.prototype.SynchronizeFixtures = function() {
        var t = d.s_xf1;
        t.R.Set(this.m_sweep.a0);
        var e = t.R
          , i = this.m_sweep.localCenter;
        t.position.x = this.m_sweep.c0.x - (e.col1.x * i.x + e.col2.x * i.y),
        t.position.y = this.m_sweep.c0.y - (e.col1.y * i.x + e.col2.y * i.y);
        var o, n = this.m_world.m_contactManager.m_broadPhase;
        for (o = this.m_fixtureList; o; o = o.m_next)
            o.Synchronize(n, t, this.m_xf)
    }
    ,
    d.prototype.SynchronizeTransform = function() {
        this.m_xf.R.Set(this.m_sweep.a);
        var t = this.m_xf.R
          , e = this.m_sweep.localCenter;
        this.m_xf.position.x = this.m_sweep.c.x - (t.col1.x * e.x + t.col2.x * e.y),
        this.m_xf.position.y = this.m_sweep.c.y - (t.col1.y * e.x + t.col2.y * e.y)
    }
    ,
    d.prototype.ShouldCollide = function(t) {
        if (this.m_type != d.b2_dynamicBody && t.m_type != d.b2_dynamicBody)
            return !1;
        for (var e = this.m_jointList; e; e = e.next)
            if (e.other == t && 0 == e.joint.m_collideConnected)
                return !1;
        return !0
    }
    ,
    d.prototype.Advance = function(t) {
        void 0 === t && (t = 0),
        this.m_sweep.Advance(t),
        this.m_sweep.c.SetV(this.m_sweep.c0),
        this.m_sweep.a = this.m_sweep.a0,
        this.SynchronizeTransform()
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.b2Body.s_xf1 = new i,
        Box2D.Dynamics.b2Body.e_islandFlag = 1,
        Box2D.Dynamics.b2Body.e_awakeFlag = 2,
        Box2D.Dynamics.b2Body.e_allowSleepFlag = 4,
        Box2D.Dynamics.b2Body.e_bulletFlag = 8,
        Box2D.Dynamics.b2Body.e_fixedRotationFlag = 16,
        Box2D.Dynamics.b2Body.e_activeFlag = 32,
        Box2D.Dynamics.b2Body.b2_staticBody = 0,
        Box2D.Dynamics.b2Body.b2_kinematicBody = 1,
        Box2D.Dynamics.b2Body.b2_dynamicBody = 2
    }),
    f.b2BodyDef = function() {
        this.position = new o,
        this.linearVelocity = new o
    }
    ,
    f.prototype.b2BodyDef = function() {
        this.userData = null,
        this.position.Set(0, 0),
        this.angle = 0,
        this.linearVelocity.Set(0, 0),
        this.angularVelocity = 0,
        this.linearDamping = 0,
        this.angularDamping = 0,
        this.allowSleep = !0,
        this.awake = !0,
        this.fixedRotation = !1,
        this.bullet = !1,
        this.type = d.b2_staticBody,
        this.active = !0,
        this.inertiaScale = 1
    }
    ,
    x.b2ContactFilter = function() {}
    ,
    x.prototype.ShouldCollide = function(t, e) {
        var i = t.GetFilterData()
          , o = e.GetFilterData();
        if (i.groupIndex == o.groupIndex && 0 != i.groupIndex)
            return i.groupIndex > 0;
        var n = 0 != (i.maskBits & o.categoryBits) && 0 != (i.categoryBits & o.maskBits);
        return n
    }
    ,
    x.prototype.RayCollide = function(t, e) {
        return t ? this.ShouldCollide(t instanceof w ? t : null, e) : !0
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.b2ContactFilter.b2_defaultFilter = new x
    }),
    b.b2ContactImpulse = function() {
        this.normalImpulses = new Vector_a2j_Number(s.b2_maxManifoldPoints),
        this.tangentImpulses = new Vector_a2j_Number(s.b2_maxManifoldPoints)
    }
    ,
    v.b2ContactListener = function() {}
    ,
    v.prototype.BeginContact = function() {}
    ,
    v.prototype.EndContact = function() {}
    ,
    v.prototype.PreSolve = function() {}
    ,
    v.prototype.PostSolve = function() {}
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.b2ContactListener.b2_defaultListener = new v
    }),
    g.b2ContactManager = function() {}
    ,
    g.prototype.b2ContactManager = function() {
        this.m_world = null,
        this.m_contactCount = 0,
        this.m_contactFilter = x.b2_defaultFilter,
        this.m_contactListener = v.b2_defaultListener,
        this.m_contactFactory = new T(this.m_allocator),
        this.m_broadPhase = new l
    }
    ,
    g.prototype.AddPair = function(t, e) {
        var i = t instanceof w ? t : null
          , o = e instanceof w ? e : null
          , n = i.GetBody()
          , s = o.GetBody();
        if (n != s) {
            for (var r = s.GetContactList(); r; ) {
                if (r.other == n) {
                    var a = r.contact.GetFixtureA()
                      , l = r.contact.GetFixtureB();
                    if (a == i && l == o)
                        return;
                    if (a == o && l == i)
                        return
                }
                r = r.next
            }
            if (0 != s.ShouldCollide(n) && 0 != this.m_contactFilter.ShouldCollide(i, o)) {
                var m = this.m_contactFactory.Create(i, o);
                i = m.GetFixtureA(),
                o = m.GetFixtureB(),
                n = i.m_body,
                s = o.m_body,
                m.m_prev = null,
                m.m_next = this.m_world.m_contactList,
                null != this.m_world.m_contactList && (this.m_world.m_contactList.m_prev = m),
                this.m_world.m_contactList = m,
                m.m_nodeA.contact = m,
                m.m_nodeA.other = s,
                m.m_nodeA.prev = null,
                m.m_nodeA.next = n.m_contactList,
                null != n.m_contactList && (n.m_contactList.prev = m.m_nodeA),
                n.m_contactList = m.m_nodeA,
                m.m_nodeB.contact = m,
                m.m_nodeB.other = n,
                m.m_nodeB.prev = null,
                m.m_nodeB.next = s.m_contactList,
                null != s.m_contactList && (s.m_contactList.prev = m.m_nodeB),
                s.m_contactList = m.m_nodeB,
                ++this.m_world.m_contactCount
            }
        }
    }
    ,
    g.prototype.FindNewContacts = function() {
        this.m_broadPhase.UpdatePairs(Box2D.generateCallback(this, this.AddPair))
    }
    ,
    g.prototype.Destroy = function(t) {
        var e = t.GetFixtureA()
          , i = t.GetFixtureB()
          , o = e.GetBody()
          , n = i.GetBody();
        t.IsTouching() && this.m_contactListener.EndContact(t),
        t.m_prev && (t.m_prev.m_next = t.m_next),
        t.m_next && (t.m_next.m_prev = t.m_prev),
        t == this.m_world.m_contactList && (this.m_world.m_contactList = t.m_next),
        t.m_nodeA.prev && (t.m_nodeA.prev.next = t.m_nodeA.next),
        t.m_nodeA.next && (t.m_nodeA.next.prev = t.m_nodeA.prev),
        t.m_nodeA == o.m_contactList && (o.m_contactList = t.m_nodeA.next),
        t.m_nodeB.prev && (t.m_nodeB.prev.next = t.m_nodeB.next),
        t.m_nodeB.next && (t.m_nodeB.next.prev = t.m_nodeB.prev),
        t.m_nodeB == n.m_contactList && (n.m_contactList = t.m_nodeB.next),
        this.m_contactFactory.Destroy(t),
        --this.m_contactCount
    }
    ,
    g.prototype.Collide = function() {
        for (var t = this.m_world.m_contactList; t; ) {
            var e = t.GetFixtureA()
              , i = t.GetFixtureB()
              , o = e.GetBody()
              , n = i.GetBody();
            if (0 != o.IsAwake() || 0 != n.IsAwake()) {
                if (t.m_flags & I.e_filterFlag) {
                    if (0 == n.ShouldCollide(o)) {
                        var s = t;
                        t = s.GetNext(),
                        this.Destroy(s);
                        continue
                    }
                    if (0 == this.m_contactFilter.ShouldCollide(e, i)) {
                        s = t,
                        t = s.GetNext(),
                        this.Destroy(s);
                        continue
                    }
                    t.m_flags &= ~I.e_filterFlag
                }
                var r = e.m_proxy
                  , a = i.m_proxy
                  , l = this.m_broadPhase.TestOverlap(r, a);
                0 != l ? (t.Update(this.m_contactListener),
                t = t.GetNext()) : (s = t,
                t = s.GetNext(),
                this.Destroy(s))
            } else
                t = t.GetNext()
        }
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.b2ContactManager.s_evalCP = new a
    }),
    D.b2DebugDraw = function() {}
    ,
    D.prototype.b2DebugDraw = function() {}
    ,
    D.prototype.SetFlags = function(t) {
        void 0 === t && (t = 0)
    }
    ,
    D.prototype.GetFlags = function() {}
    ,
    D.prototype.AppendFlags = function(t) {
        void 0 === t && (t = 0)
    }
    ,
    D.prototype.ClearFlags = function(t) {
        void 0 === t && (t = 0)
    }
    ,
    D.prototype.SetSprite = function() {}
    ,
    D.prototype.GetSprite = function() {}
    ,
    D.prototype.SetDrawScale = function(t) {
        void 0 === t && (t = 0)
    }
    ,
    D.prototype.GetDrawScale = function() {}
    ,
    D.prototype.SetLineThickness = function(t) {
        void 0 === t && (t = 0)
    }
    ,
    D.prototype.GetLineThickness = function() {}
    ,
    D.prototype.SetAlpha = function(t) {
        void 0 === t && (t = 0)
    }
    ,
    D.prototype.GetAlpha = function() {}
    ,
    D.prototype.SetFillAlpha = function(t) {
        void 0 === t && (t = 0)
    }
    ,
    D.prototype.GetFillAlpha = function() {}
    ,
    D.prototype.SetXFormScale = function(t) {
        void 0 === t && (t = 0)
    }
    ,
    D.prototype.GetXFormScale = function() {}
    ,
    D.prototype.DrawPolygon = function(t, e) {
        void 0 === e && (e = 0)
    }
    ,
    D.prototype.DrawSolidPolygon = function(t, e) {
        void 0 === e && (e = 0)
    }
    ,
    D.prototype.DrawCircle = function(t, e) {
        void 0 === e && (e = 0)
    }
    ,
    D.prototype.DrawSolidCircle = function(t, e) {
        void 0 === e && (e = 0)
    }
    ,
    D.prototype.DrawSegment = function() {}
    ,
    D.prototype.DrawTransform = function() {}
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.b2DebugDraw.e_shapeBit = 1,
        Box2D.Dynamics.b2DebugDraw.e_jointBit = 2,
        Box2D.Dynamics.b2DebugDraw.e_aabbBit = 4,
        Box2D.Dynamics.b2DebugDraw.e_pairBit = 8,
        Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit = 16,
        Box2D.Dynamics.b2DebugDraw.e_controllerBit = 32
    }),
    C.b2DestructionListener = function() {}
    ,
    C.prototype.SayGoodbyeJoint = function() {}
    ,
    C.prototype.SayGoodbyeFixture = function() {}
    ,
    B.b2FilterData = function() {
        this.categoryBits = 1,
        this.maskBits = 65535,
        this.groupIndex = 0
    }
    ,
    B.prototype.Copy = function() {
        var t = new B;
        return t.categoryBits = this.categoryBits,
        t.maskBits = this.maskBits,
        t.groupIndex = this.groupIndex,
        t
    }
    ,
    w.b2Fixture = function() {
        this.m_filter = new B
    }
    ,
    w.prototype.GetType = function() {
        return this.m_shape.GetType()
    }
    ,
    w.prototype.GetShape = function() {
        return this.m_shape
    }
    ,
    w.prototype.SetSensor = function(t) {
        if (this.m_isSensor != t && (this.m_isSensor = t,
        null != this.m_body))
            for (var e = this.m_body.GetContactList(); e; ) {
                var i = e.contact
                  , o = i.GetFixtureA()
                  , n = i.GetFixtureB();
                o != this && n != this || i.SetSensor(o.IsSensor() || n.IsSensor()),
                e = e.next
            }
    }
    ,
    w.prototype.IsSensor = function() {
        return this.m_isSensor
    }
    ,
    w.prototype.SetFilterData = function(t) {
        if (this.m_filter = t.Copy(),
        !this.m_body)
            for (var e = this.m_body.GetContactList(); e; ) {
                var i = e.contact
                  , o = i.GetFixtureA()
                  , n = i.GetFixtureB();
                o != this && n != this || i.FlagForFiltering(),
                e = e.next
            }
    }
    ,
    w.prototype.GetFilterData = function() {
        return this.m_filter.Copy()
    }
    ,
    w.prototype.GetBody = function() {
        return this.m_body
    }
    ,
    w.prototype.GetNext = function() {
        return this.m_next
    }
    ,
    w.prototype.GetUserData = function() {
        return this.m_userData
    }
    ,
    w.prototype.SetUserData = function(t) {
        this.m_userData = t
    }
    ,
    w.prototype.TestPoint = function(t) {
        return this.m_shape.TestPoint(this.m_body.GetTransform(), t)
    }
    ,
    w.prototype.RayCast = function(t, e) {
        return this.m_shape.RayCast(t, e, this.m_body.GetTransform())
    }
    ,
    w.prototype.GetMassData = function(t) {
        return void 0 === t && (t = null),
        null == t && (t = new p),
        this.m_shape.ComputeMass(t, this.m_density),
        t
    }
    ,
    w.prototype.SetDensity = function(t) {
        void 0 === t && (t = 0),
        this.m_density = t
    }
    ,
    w.prototype.GetDensity = function() {
        return this.m_density
    }
    ,
    w.prototype.GetFriction = function() {
        return this.m_friction
    }
    ,
    w.prototype.SetFriction = function(t) {
        void 0 === t && (t = 0),
        this.m_friction = t
    }
    ,
    w.prototype.GetRestitution = function() {
        return this.m_restitution
    }
    ,
    w.prototype.SetRestitution = function(t) {
        void 0 === t && (t = 0),
        this.m_restitution = t
    }
    ,
    w.prototype.GetAABB = function() {
        return this.m_aabb
    }
    ,
    w.prototype.b2Fixture = function() {
        this.m_aabb = new r,
        this.m_userData = null,
        this.m_body = null,
        this.m_next = null,
        this.m_shape = null,
        this.m_density = 0,
        this.m_friction = 0,
        this.m_restitution = 0
    }
    ,
    w.prototype.Create = function(t, e, i) {
        this.m_userData = i.userData,
        this.m_friction = i.friction,
        this.m_restitution = i.restitution,
        this.m_body = t,
        this.m_next = null,
        this.m_filter = i.filter.Copy(),
        this.m_isSensor = i.isSensor,
        this.m_shape = i.shape.Copy(),
        this.m_density = i.density
    }
    ,
    w.prototype.Destroy = function() {
        this.m_shape = null
    }
    ,
    w.prototype.CreateProxy = function(t, e) {
        this.m_shape.ComputeAABB(this.m_aabb, e),
        this.m_proxy = t.CreateProxy(this.m_aabb, this)
    }
    ,
    w.prototype.DestroyProxy = function(t) {
        null != this.m_proxy && (t.DestroyProxy(this.m_proxy),
        this.m_proxy = null)
    }
    ,
    w.prototype.Synchronize = function(e, i, o) {
        if (this.m_proxy) {
            var n = new r
              , s = new r;
            this.m_shape.ComputeAABB(n, i),
            this.m_shape.ComputeAABB(s, o),
            this.m_aabb.Combine(n, s);
            var a = t.SubtractVV(o.position, i.position);
            e.MoveProxy(this.m_proxy, this.m_aabb, a)
        }
    }
    ,
    A.b2FixtureDef = function() {
        this.filter = new B
    }
    ,
    A.prototype.b2FixtureDef = function() {
        this.shape = null,
        this.userData = null,
        this.friction = .2,
        this.restitution = 0,
        this.density = 0,
        this.filter.categoryBits = 1,
        this.filter.maskBits = 65535,
        this.filter.groupIndex = 0,
        this.isSensor = !1
    }
    ,
    S.b2Island = function() {}
    ,
    S.prototype.b2Island = function() {
        this.m_bodies = new Vector,
        this.m_contacts = new Vector,
        this.m_joints = new Vector
    }
    ,
    S.prototype.Initialize = function(t, e, i, o, n, s) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0);
        var r = 0;
        for (this.m_bodyCapacity = t,
        this.m_contactCapacity = e,
        this.m_jointCapacity = i,
        this.m_bodyCount = 0,
        this.m_contactCount = 0,
        this.m_jointCount = 0,
        this.m_allocator = o,
        this.m_listener = n,
        this.m_contactSolver = s,
        r = this.m_bodies.length; t > r; r++)
            this.m_bodies[r] = null;
        for (r = this.m_contacts.length; e > r; r++)
            this.m_contacts[r] = null;
        for (r = this.m_joints.length; i > r; r++)
            this.m_joints[r] = null
    }
    ,
    S.prototype.Clear = function() {
        this.m_bodyCount = 0,
        this.m_contactCount = 0,
        this.m_jointCount = 0
    }
    ,
    S.prototype.Solve = function(e, i, o) {
        var n, r, a = 0, l = 0;
        for (a = 0; a < this.m_bodyCount; ++a)
            n = this.m_bodies[a],
            n.GetType() == d.b2_dynamicBody && (n.m_linearVelocity.x += e.dt * (i.x + n.m_invMass * n.m_force.x),
            n.m_linearVelocity.y += e.dt * (i.y + n.m_invMass * n.m_force.y),
            n.m_angularVelocity += e.dt * n.m_invI * n.m_torque,
            n.m_linearVelocity.Multiply(t.Clamp(1 - e.dt * n.m_linearDamping, 0, 1)),
            n.m_angularVelocity *= t.Clamp(1 - e.dt * n.m_angularDamping, 0, 1));
        this.m_contactSolver.Initialize(e, this.m_contacts, this.m_contactCount, this.m_allocator);
        var m = this.m_contactSolver;
        for (m.InitVelocityConstraints(e),
        a = 0; a < this.m_jointCount; ++a)
            r = this.m_joints[a],
            r.InitVelocityConstraints(e);
        for (a = 0; a < e.velocityIterations; ++a) {
            for (l = 0; l < this.m_jointCount; ++l)
                r = this.m_joints[l],
                r.SolveVelocityConstraints(e);
            m.SolveVelocityConstraints()
        }
        for (a = 0; a < this.m_jointCount; ++a)
            r = this.m_joints[a],
            r.FinalizeVelocityConstraints();
        for (m.FinalizeVelocityConstraints(),
        a = 0; a < this.m_bodyCount; ++a)
            if (n = this.m_bodies[a],
            n.GetType() != d.b2_staticBody) {
                var c = e.dt * n.m_linearVelocity.x
                  , h = e.dt * n.m_linearVelocity.y;
                c * c + h * h > s.b2_maxTranslationSquared && (n.m_linearVelocity.Normalize(),
                n.m_linearVelocity.x *= s.b2_maxTranslation * e.inv_dt,
                n.m_linearVelocity.y *= s.b2_maxTranslation * e.inv_dt);
                var u = e.dt * n.m_angularVelocity;
                u * u > s.b2_maxRotationSquared && (n.m_angularVelocity < 0 ? n.m_angularVelocity = -s.b2_maxRotation * e.inv_dt : n.m_angularVelocity = s.b2_maxRotation * e.inv_dt),
                n.m_sweep.c0.SetV(n.m_sweep.c),
                n.m_sweep.a0 = n.m_sweep.a,
                n.m_sweep.c.x += e.dt * n.m_linearVelocity.x,
                n.m_sweep.c.y += e.dt * n.m_linearVelocity.y,
                n.m_sweep.a += e.dt * n.m_angularVelocity,
                n.SynchronizeTransform()
            }
        for (a = 0; a < e.positionIterations; ++a) {
            var p = m.SolvePositionConstraints(s.b2_contactBaumgarte)
              , y = !0;
            for (l = 0; l < this.m_jointCount; ++l) {
                r = this.m_joints[l];
                var _ = r.SolvePositionConstraints(s.b2_contactBaumgarte);
                y = y && _
            }
            if (p && y)
                break
        }
        if (this.Report(m.m_constraints),
        o) {
            var f = Number.MAX_VALUE
              , x = s.b2_linearSleepTolerance * s.b2_linearSleepTolerance
              , b = s.b2_angularSleepTolerance * s.b2_angularSleepTolerance;
            for (a = 0; a < this.m_bodyCount; ++a)
                n = this.m_bodies[a],
                n.GetType() != d.b2_staticBody && (0 == (n.m_flags & d.e_allowSleepFlag) && (n.m_sleepTime = 0,
                f = 0),
                0 == (n.m_flags & d.e_allowSleepFlag) || n.m_angularVelocity * n.m_angularVelocity > b || t.Dot(n.m_linearVelocity, n.m_linearVelocity) > x ? (n.m_sleepTime = 0,
                f = 0) : (n.m_sleepTime += e.dt,
                f = t.Min(f, n.m_sleepTime)));
            if (f >= s.b2_timeToSleep)
                for (a = 0; a < this.m_bodyCount; ++a)
                    n = this.m_bodies[a],
                    n.SetAwake(!1)
        }
    }
    ,
    S.prototype.SolveTOI = function(t) {
        var e = 0
          , i = 0;
        this.m_contactSolver.Initialize(t, this.m_contacts, this.m_contactCount, this.m_allocator);
        var o = this.m_contactSolver;
        for (e = 0; e < this.m_jointCount; ++e)
            this.m_joints[e].InitVelocityConstraints(t);
        for (e = 0; e < t.velocityIterations; ++e)
            for (o.SolveVelocityConstraints(),
            i = 0; i < this.m_jointCount; ++i)
                this.m_joints[i].SolveVelocityConstraints(t);
        for (e = 0; e < this.m_bodyCount; ++e) {
            var n = this.m_bodies[e];
            if (n.GetType() != d.b2_staticBody) {
                var r = t.dt * n.m_linearVelocity.x
                  , a = t.dt * n.m_linearVelocity.y;
                r * r + a * a > s.b2_maxTranslationSquared && (n.m_linearVelocity.Normalize(),
                n.m_linearVelocity.x *= s.b2_maxTranslation * t.inv_dt,
                n.m_linearVelocity.y *= s.b2_maxTranslation * t.inv_dt);
                var l = t.dt * n.m_angularVelocity;
                l * l > s.b2_maxRotationSquared && (n.m_angularVelocity < 0 ? n.m_angularVelocity = -s.b2_maxRotation * t.inv_dt : n.m_angularVelocity = s.b2_maxRotation * t.inv_dt),
                n.m_sweep.c0.SetV(n.m_sweep.c),
                n.m_sweep.a0 = n.m_sweep.a,
                n.m_sweep.c.x += t.dt * n.m_linearVelocity.x,
                n.m_sweep.c.y += t.dt * n.m_linearVelocity.y,
                n.m_sweep.a += t.dt * n.m_angularVelocity,
                n.SynchronizeTransform()
            }
        }
        var m = .75;
        for (e = 0; e < t.positionIterations; ++e) {
            var c = o.SolvePositionConstraints(m)
              , h = !0;
            for (i = 0; i < this.m_jointCount; ++i) {
                var u = this.m_joints[i].SolvePositionConstraints(s.b2_contactBaumgarte);
                h = h && u
            }
            if (c && h)
                break
        }
        this.Report(o.m_constraints)
    }
    ,
    S.prototype.Report = function(t) {
        if (null != this.m_listener)
            for (var e = 0; e < this.m_contactCount; ++e) {
                for (var i = this.m_contacts[e], o = t[e], n = 0; n < o.pointCount; ++n)
                    S.s_impulse.normalImpulses[n] = o.points[n].normalImpulse,
                    S.s_impulse.tangentImpulses[n] = o.points[n].tangentImpulse;
                this.m_listener.PostSolve(i, S.s_impulse)
            }
    }
    ,
    S.prototype.AddBody = function(t) {
        t.m_islandIndex = this.m_bodyCount,
        this.m_bodies[this.m_bodyCount++] = t
    }
    ,
    S.prototype.AddContact = function(t) {
        this.m_contacts[this.m_contactCount++] = t
    }
    ,
    S.prototype.AddJoint = function(t) {
        this.m_joints[this.m_jointCount++] = t
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.b2Island.s_impulse = new b
    }),
    M.b2TimeStep = function() {}
    ,
    M.prototype.Set = function(t) {
        this.dt = t.dt,
        this.inv_dt = t.inv_dt,
        this.positionIterations = t.positionIterations,
        this.velocityIterations = t.velocityIterations,
        this.warmStarting = t.warmStarting
    }
    ,
    V.b2World = function() {
        this.s_stack = new Vector,
        this.m_contactManager = new g,
        this.m_contactSolver = new L,
        this.m_island = new S
    }
    ,
    V.prototype.b2World = function(t, e) {
        this.m_destructionListener = null,
        this.m_debugDraw = null,
        this.m_bodyList = null,
        this.m_contactList = null,
        this.m_jointList = null,
        this.m_controllerList = null,
        this.m_bodyCount = 0,
        this.m_contactCount = 0,
        this.m_jointCount = 0,
        this.m_controllerCount = 0,
        V.m_warmStarting = !0,
        V.m_continuousPhysics = !0,
        this.m_allowSleep = e,
        this.m_gravity = t,
        this.m_inv_dt0 = 0,
        this.m_contactManager.m_world = this;
        var i = new f;
        this.m_groundBody = this.CreateBody(i)
    }
    ,
    V.prototype.SetDestructionListener = function(t) {
        this.m_destructionListener = t
    }
    ,
    V.prototype.SetContactFilter = function(t) {
        this.m_contactManager.m_contactFilter = t
    }
    ,
    V.prototype.SetContactListener = function(t) {
        this.m_contactManager.m_contactListener = t
    }
    ,
    V.prototype.SetDebugDraw = function(t) {
        this.m_debugDraw = t
    }
    ,
    V.prototype.SetBroadPhase = function(t) {
        var e = this.m_contactManager.m_broadPhase;
        this.m_contactManager.m_broadPhase = t;
        for (var i = this.m_bodyList; i; i = i.m_next)
            for (var o = i.m_fixtureList; o; o = o.m_next)
                o.m_proxy = t.CreateProxy(e.GetFatAABB(o.m_proxy), o)
    }
    ,
    V.prototype.Validate = function() {
        this.m_contactManager.m_broadPhase.Validate()
    }
    ,
    V.prototype.GetProxyCount = function() {
        return this.m_contactManager.m_broadPhase.GetProxyCount()
    }
    ,
    V.prototype.CreateBody = function(t) {
        if (1 == this.IsLocked())
            return null;
        var e = new d(t,this);
        return e.m_prev = null,
        e.m_next = this.m_bodyList,
        this.m_bodyList && (this.m_bodyList.m_prev = e),
        this.m_bodyList = e,
        ++this.m_bodyCount,
        e
    }
    ,
    V.prototype.DestroyBody = function(t) {
        if (1 != this.IsLocked()) {
            for (var e = t.m_jointList; e; ) {
                var i = e;
                e = e.next,
                this.m_destructionListener && this.m_destructionListener.SayGoodbyeJoint(i.joint),
                this.DestroyJoint(i.joint)
            }
            for (var o = t.m_controllerList; o; ) {
                var n = o;
                o = o.nextController,
                n.controller.RemoveBody(t)
            }
            for (var s = t.m_contactList; s; ) {
                var r = s;
                s = s.next,
                this.m_contactManager.Destroy(r.contact)
            }
            t.m_contactList = null;
            for (var a = t.m_fixtureList; a; ) {
                var l = a;
                a = a.m_next,
                this.m_destructionListener && this.m_destructionListener.SayGoodbyeFixture(l),
                l.DestroyProxy(this.m_contactManager.m_broadPhase),
                l.Destroy()
            }
            t.m_fixtureList = null,
            t.m_fixtureCount = 0,
            t.m_prev && (t.m_prev.m_next = t.m_next),
            t.m_next && (t.m_next.m_prev = t.m_prev),
            t == this.m_bodyList && (this.m_bodyList = t.m_next),
            --this.m_bodyCount
        }
    }
    ,
    V.prototype.CreateJoint = function(t) {
        var e = G.Create(t, null);
        e.m_prev = null,
        e.m_next = this.m_jointList,
        this.m_jointList && (this.m_jointList.m_prev = e),
        this.m_jointList = e,
        ++this.m_jointCount,
        e.m_edgeA.joint = e,
        e.m_edgeA.other = e.m_bodyB,
        e.m_edgeA.prev = null,
        e.m_edgeA.next = e.m_bodyA.m_jointList,
        e.m_bodyA.m_jointList && (e.m_bodyA.m_jointList.prev = e.m_edgeA),
        e.m_bodyA.m_jointList = e.m_edgeA,
        e.m_edgeB.joint = e,
        e.m_edgeB.other = e.m_bodyA,
        e.m_edgeB.prev = null,
        e.m_edgeB.next = e.m_bodyB.m_jointList,
        e.m_bodyB.m_jointList && (e.m_bodyB.m_jointList.prev = e.m_edgeB),
        e.m_bodyB.m_jointList = e.m_edgeB;
        var i = t.bodyA
          , o = t.bodyB;
        if (0 == t.collideConnected)
            for (var n = o.GetContactList(); n; )
                n.other == i && n.contact.FlagForFiltering(),
                n = n.next;
        return e
    }
    ,
    V.prototype.DestroyJoint = function(t) {
        var e = t.m_collideConnected;
        t.m_prev && (t.m_prev.m_next = t.m_next),
        t.m_next && (t.m_next.m_prev = t.m_prev),
        t == this.m_jointList && (this.m_jointList = t.m_next);
        var i = t.m_bodyA
          , o = t.m_bodyB;
        if (i.SetAwake(!0),
        o.SetAwake(!0),
        t.m_edgeA.prev && (t.m_edgeA.prev.next = t.m_edgeA.next),
        t.m_edgeA.next && (t.m_edgeA.next.prev = t.m_edgeA.prev),
        t.m_edgeA == i.m_jointList && (i.m_jointList = t.m_edgeA.next),
        t.m_edgeA.prev = null,
        t.m_edgeA.next = null,
        t.m_edgeB.prev && (t.m_edgeB.prev.next = t.m_edgeB.next),
        t.m_edgeB.next && (t.m_edgeB.next.prev = t.m_edgeB.prev),
        t.m_edgeB == o.m_jointList && (o.m_jointList = t.m_edgeB.next),
        t.m_edgeB.prev = null,
        t.m_edgeB.next = null,
        G.Destroy(t, null),
        --this.m_jointCount,
        0 == e)
            for (var n = o.GetContactList(); n; )
                n.other == i && n.contact.FlagForFiltering(),
                n = n.next
    }
    ,
    V.prototype.AddController = function(t) {
        return t.m_next = this.m_controllerList,
        t.m_prev = null,
        this.m_controllerList = t,
        t.m_world = this,
        this.m_controllerCount++,
        t
    }
    ,
    V.prototype.RemoveController = function(t) {
        t.m_prev && (t.m_prev.m_next = t.m_next),
        t.m_next && (t.m_next.m_prev = t.m_prev),
        this.m_controllerList == t && (this.m_controllerList = t.m_next),
        this.m_controllerCount--
    }
    ,
    V.prototype.CreateController = function(t) {
        if (t.m_world != this)
            throw new Error("Controller can only be a member of one world");
        return t.m_next = this.m_controllerList,
        t.m_prev = null,
        this.m_controllerList && (this.m_controllerList.m_prev = t),
        this.m_controllerList = t,
        ++this.m_controllerCount,
        t.m_world = this,
        t
    }
    ,
    V.prototype.DestroyController = function(t) {
        t.Clear(),
        t.m_next && (t.m_next.m_prev = t.m_prev),
        t.m_prev && (t.m_prev.m_next = t.m_next),
        t == this.m_controllerList && (this.m_controllerList = t.m_next),
        --this.m_controllerCount
    }
    ,
    V.prototype.SetWarmStarting = function(t) {
        V.m_warmStarting = t
    }
    ,
    V.prototype.SetContinuousPhysics = function(t) {
        V.m_continuousPhysics = t
    }
    ,
    V.prototype.GetBodyCount = function() {
        return this.m_bodyCount
    }
    ,
    V.prototype.GetJointCount = function() {
        return this.m_jointCount
    }
    ,
    V.prototype.GetContactCount = function() {
        return this.m_contactCount
    }
    ,
    V.prototype.SetGravity = function(t) {
        this.m_gravity = t
    }
    ,
    V.prototype.GetGravity = function() {
        return this.m_gravity
    }
    ,
    V.prototype.GetGroundBody = function() {
        return this.m_groundBody
    }
    ,
    V.prototype.Step = function(t, e, i) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        this.m_flags & V.e_newFixture && (this.m_contactManager.FindNewContacts(),
        this.m_flags &= ~V.e_newFixture),
        this.m_flags |= V.e_locked;
        var o = V.s_timestep2;
        o.dt = t,
        o.velocityIterations = e,
        o.positionIterations = i,
        t > 0 ? o.inv_dt = 1 / t : o.inv_dt = 0,
        o.dtRatio = this.m_inv_dt0 * t,
        o.warmStarting = V.m_warmStarting,
        this.m_contactManager.Collide(),
        o.dt > 0 && this.Solve(o),
        V.m_continuousPhysics && o.dt > 0 && this.SolveTOI(o),
        o.dt > 0 && (this.m_inv_dt0 = o.inv_dt),
        this.m_flags &= ~V.e_locked
    }
    ,
    V.prototype.ClearForces = function() {
        for (var t = this.m_bodyList; t; t = t.m_next)
            t.m_force.SetZero(),
            t.m_torque = 0
    }
    ,
    V.prototype.DrawDebugData = function() {
        if (null != this.m_debugDraw) {
            this.m_debugDraw.m_sprite.graphics.clear();
            var t, e, i, s, a, l, m = this.m_debugDraw.GetFlags(), c = (new o,
            new o,
            new o,
            new r,
            new r,
            [new o, new o, new o, new o]), h = new n(0,0,0);
            if (m & D.e_shapeBit)
                for (t = this.m_bodyList; t; t = t.m_next)
                    for (l = t.m_xf,
                    e = t.GetFixtureList(); e; e = e.m_next)
                        i = e.GetShape(),
                        0 == t.IsActive() ? (h.Set(.5, .5, .3),
                        this.DrawShape(i, l, h)) : t.GetType() == d.b2_staticBody ? (h.Set(.5, .9, .5),
                        this.DrawShape(i, l, h)) : t.GetType() == d.b2_kinematicBody ? (h.Set(.5, .5, .9),
                        this.DrawShape(i, l, h)) : 0 == t.IsAwake() ? (h.Set(.6, .6, .6),
                        this.DrawShape(i, l, h)) : (h.Set(.9, .7, .7),
                        this.DrawShape(i, l, h));
            if (m & D.e_jointBit)
                for (s = this.m_jointList; s; s = s.m_next)
                    this.DrawJoint(s);
            if (m & D.e_controllerBit)
                for (var u = this.m_controllerList; u; u = u.m_next)
                    u.Draw(this.m_debugDraw);
            if (m & D.e_pairBit) {
                h.Set(.3, .9, .9);
                for (var p = this.m_contactManager.m_contactList; p; p = p.GetNext()) {
                    var y = p.GetFixtureA()
                      , _ = p.GetFixtureB()
                      , f = y.GetAABB().GetCenter()
                      , x = _.GetAABB().GetCenter();
                    this.m_debugDraw.DrawSegment(f, x, h)
                }
            }
            if (m & D.e_aabbBit)
                for (a = this.m_contactManager.m_broadPhase,
                c = [new o, new o, new o, new o],
                t = this.m_bodyList; t; t = t.GetNext())
                    if (0 != t.IsActive())
                        for (e = t.GetFixtureList(); e; e = e.GetNext()) {
                            var b = a.GetFatAABB(e.m_proxy);
                            c[0].Set(b.lowerBound.x, b.lowerBound.y),
                            c[1].Set(b.upperBound.x, b.lowerBound.y),
                            c[2].Set(b.upperBound.x, b.upperBound.y),
                            c[3].Set(b.lowerBound.x, b.upperBound.y),
                            this.m_debugDraw.DrawPolygon(c, 4, h)
                        }
            if (m & D.e_centerOfMassBit)
                for (t = this.m_bodyList; t; t = t.m_next)
                    l = V.s_xf,
                    l.R = t.m_xf.R,
                    l.position = t.GetWorldCenter(),
                    this.m_debugDraw.DrawTransform(l)
        }
    }
    ,
    V.prototype.QueryAABB = function(t, e) {
        function i(e) {
            return t(n.GetUserData(e))
        }
        var o = this
          , n = o.m_contactManager.m_broadPhase;
        n.Query(i, e)
    }
    ,
    V.prototype.QueryShape = function(t, e, o) {
        function n(i) {
            var n = a.GetUserData(i)instanceof w ? a.GetUserData(i) : null;
            return _.TestOverlap(e, o, n.GetShape(), n.GetBody().GetTransform()) ? t(n) : !0
        }
        var s = this;
        void 0 === o && (o = null),
        null == o && (o = new i,
        o.SetIdentity());
        var a = s.m_contactManager.m_broadPhase
          , l = new r;
        e.ComputeAABB(l, o),
        a.Query(n, l)
    }
    ,
    V.prototype.QueryPoint = function(t, e) {
        function i(i) {
            var o = n.GetUserData(i)instanceof w ? n.GetUserData(i) : null;
            return o.TestPoint(e) ? t(o) : !0
        }
        var o = this
          , n = o.m_contactManager.m_broadPhase
          , a = new r;
        a.lowerBound.Set(e.x - s.b2_linearSlop, e.y - s.b2_linearSlop),
        a.upperBound.Set(e.x + s.b2_linearSlop, e.y + s.b2_linearSlop),
        n.Query(i, a)
    }
    ,
    V.prototype.RayCast = function(t, e, i) {
        function n(n, s) {
            var l = r.GetUserData(s)
              , m = l instanceof w ? l : null
              , c = m.RayCast(a, n);
            if (c) {
                var h = a.fraction
                  , u = new o((1 - h) * e.x + h * i.x,(1 - h) * e.y + h * i.y);
                return t(m, u, a.normal, h)
            }
            return n.maxFraction
        }
        var s = this
          , r = s.m_contactManager.m_broadPhase
          , a = new c
          , l = new m(e,i);
        r.RayCast(n, l)
    }
    ,
    V.prototype.RayCastOne = function(t, e) {
        function i(t, e, i, n) {
            return void 0 === n && (n = 0),
            o = t,
            n
        }
        var o, n = this;
        return n.RayCast(i, t, e),
        o
    }
    ,
    V.prototype.RayCastAll = function(t, e) {
        function i(t, e, i, o) {
            return void 0 === o && (o = 0),
            n[n.length] = t,
            1
        }
        var o = this
          , n = new Vector;
        return o.RayCast(i, t, e),
        n
    }
    ,
    V.prototype.GetBodyList = function() {
        return this.m_bodyList
    }
    ,
    V.prototype.GetJointList = function() {
        return this.m_jointList
    }
    ,
    V.prototype.GetContactList = function() {
        return this.m_contactList
    }
    ,
    V.prototype.IsLocked = function() {
        return (this.m_flags & V.e_locked) > 0
    }
    ,
    V.prototype.Solve = function(t) {
        for (var e, i = this.m_controllerList; i; i = i.m_next)
            i.Step(t);
        var o = this.m_island;
        for (o.Initialize(this.m_bodyCount, this.m_contactCount, this.m_jointCount, null, this.m_contactManager.m_contactListener, this.m_contactSolver),
        e = this.m_bodyList; e; e = e.m_next)
            e.m_flags &= ~d.e_islandFlag;
        for (var n = this.m_contactList; n; n = n.m_next)
            n.m_flags &= ~I.e_islandFlag;
        for (var s = this.m_jointList; s; s = s.m_next)
            s.m_islandFlag = !1;
        for (var r = (parseInt(this.m_bodyCount),
        this.s_stack), a = this.m_bodyList; a; a = a.m_next)
            if (!(a.m_flags & d.e_islandFlag) && 0 != a.IsAwake() && 0 != a.IsActive() && a.GetType() != d.b2_staticBody) {
                o.Clear();
                var l = 0;
                for (r[l++] = a,
                a.m_flags |= d.e_islandFlag; l > 0; )
                    if (e = r[--l],
                    o.AddBody(e),
                    0 == e.IsAwake() && e.SetAwake(!0),
                    e.GetType() != d.b2_staticBody) {
                        for (var m, c = e.m_contactList; c; c = c.next)
                            c.contact.m_flags & I.e_islandFlag || 1 != c.contact.IsSensor() && 0 != c.contact.IsEnabled() && 0 != c.contact.IsTouching() && (o.AddContact(c.contact),
                            c.contact.m_flags |= I.e_islandFlag,
                            m = c.other,
                            m.m_flags & d.e_islandFlag || (r[l++] = m,
                            m.m_flags |= d.e_islandFlag));
                        for (var h = e.m_jointList; h; h = h.next)
                            1 != h.joint.m_islandFlag && (m = h.other,
                            0 != m.IsActive() && (o.AddJoint(h.joint),
                            h.joint.m_islandFlag = !0,
                            m.m_flags & d.e_islandFlag || (r[l++] = m,
                            m.m_flags |= d.e_islandFlag)))
                    }
                o.Solve(t, this.m_gravity, this.m_allowSleep);
                for (var u = 0; u < o.m_bodyCount; ++u)
                    e = o.m_bodies[u],
                    e.GetType() == d.b2_staticBody && (e.m_flags &= ~d.e_islandFlag)
            }
        for (u = 0; u < r.length && r[u]; ++u)
            r[u] = null;
        for (e = this.m_bodyList; e; e = e.m_next)
            0 != e.IsAwake() && 0 != e.IsActive() && e.GetType() != d.b2_staticBody && e.SynchronizeFixtures();
        this.m_contactManager.FindNewContacts()
    }
    ,
    V.prototype.SolveTOI = function(t) {
        var e, i, o, n, r, a, l, m = this.m_island;
        m.Initialize(this.m_bodyCount, s.b2_maxTOIContactsPerIsland, s.b2_maxTOIJointsPerIsland, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
        var c = V.s_queue;
        for (e = this.m_bodyList; e; e = e.m_next)
            e.m_flags &= ~d.e_islandFlag,
            e.m_sweep.t0 = 0;
        var h;
        for (h = this.m_contactList; h; h = h.m_next)
            h.m_flags &= ~(I.e_toiFlag | I.e_islandFlag);
        for (l = this.m_jointList; l; l = l.m_next)
            l.m_islandFlag = !1;
        for (; ; ) {
            var u = null
              , p = 1;
            for (h = this.m_contactList; h; h = h.m_next)
                if (1 != h.IsSensor() && 0 != h.IsEnabled() && 0 != h.IsContinuous()) {
                    var y = 1;
                    if (h.m_flags & I.e_toiFlag)
                        y = h.m_toi;
                    else {
                        if (i = h.m_fixtureA,
                        o = h.m_fixtureB,
                        n = i.m_body,
                        r = o.m_body,
                        !(n.GetType() == d.b2_dynamicBody && 0 != n.IsAwake() || r.GetType() == d.b2_dynamicBody && 0 != r.IsAwake()))
                            continue;
                        var _ = n.m_sweep.t0;
                        n.m_sweep.t0 < r.m_sweep.t0 ? (_ = r.m_sweep.t0,
                        n.m_sweep.Advance(_)) : r.m_sweep.t0 < n.m_sweep.t0 && (_ = n.m_sweep.t0,
                        r.m_sweep.Advance(_)),
                        y = h.ComputeTOI(n.m_sweep, r.m_sweep),
                        s.b2Assert(y >= 0 && 1 >= y),
                        y > 0 && 1 > y && (y = (1 - y) * _ + y,
                        y > 1 && (y = 1)),
                        h.m_toi = y,
                        h.m_flags |= I.e_toiFlag
                    }
                    Number.MIN_VALUE < y && p > y && (u = h,
                    p = y)
                }
            if (null == u || 1 - 100 * Number.MIN_VALUE < p)
                break;
            if (i = u.m_fixtureA,
            o = u.m_fixtureB,
            n = i.m_body,
            r = o.m_body,
            V.s_backupA.Set(n.m_sweep),
            V.s_backupB.Set(r.m_sweep),
            n.Advance(p),
            r.Advance(p),
            u.Update(this.m_contactManager.m_contactListener),
            u.m_flags &= ~I.e_toiFlag,
            1 != u.IsSensor() && 0 != u.IsEnabled()) {
                if (0 != u.IsTouching()) {
                    var f = n;
                    f.GetType() != d.b2_dynamicBody && (f = r),
                    m.Clear();
                    var x = 0
                      , b = 0;
                    for (c[x + b++] = f,
                    f.m_flags |= d.e_islandFlag; b > 0; )
                        if (e = c[x++],
                        --b,
                        m.AddBody(e),
                        0 == e.IsAwake() && e.SetAwake(!0),
                        e.GetType() == d.b2_dynamicBody) {
                            for (a = e.m_contactList; a && m.m_contactCount != m.m_contactCapacity; a = a.next)
                                if (!(a.contact.m_flags & I.e_islandFlag) && 1 != a.contact.IsSensor() && 0 != a.contact.IsEnabled() && 0 != a.contact.IsTouching()) {
                                    m.AddContact(a.contact),
                                    a.contact.m_flags |= I.e_islandFlag;
                                    var v = a.other;
                                    v.m_flags & d.e_islandFlag || (v.GetType() != d.b2_staticBody && (v.Advance(p),
                                    v.SetAwake(!0)),
                                    c[x + b] = v,
                                    ++b,
                                    v.m_flags |= d.e_islandFlag)
                                }
                            for (var g = e.m_jointList; g; g = g.next)
                                m.m_jointCount != m.m_jointCapacity && 1 != g.joint.m_islandFlag && (v = g.other,
                                0 != v.IsActive() && (m.AddJoint(g.joint),
                                g.joint.m_islandFlag = !0,
                                v.m_flags & d.e_islandFlag || (v.GetType() != d.b2_staticBody && (v.Advance(p),
                                v.SetAwake(!0)),
                                c[x + b] = v,
                                ++b,
                                v.m_flags |= d.e_islandFlag)))
                        }
                    var D = V.s_timestep;
                    D.warmStarting = !1,
                    D.dt = (1 - p) * t.dt,
                    D.inv_dt = 1 / D.dt,
                    D.dtRatio = 0,
                    D.velocityIterations = t.velocityIterations,
                    D.positionIterations = t.positionIterations,
                    m.SolveTOI(D);
                    var C = 0;
                    for (C = 0; C < m.m_bodyCount; ++C)
                        if (e = m.m_bodies[C],
                        e.m_flags &= ~d.e_islandFlag,
                        0 != e.IsAwake() && e.GetType() == d.b2_dynamicBody)
                            for (e.SynchronizeFixtures(),
                            a = e.m_contactList; a; a = a.next)
                                a.contact.m_flags &= ~I.e_toiFlag;
                    for (C = 0; C < m.m_contactCount; ++C)
                        h = m.m_contacts[C],
                        h.m_flags &= ~(I.e_toiFlag | I.e_islandFlag);
                    for (C = 0; C < m.m_jointCount; ++C)
                        l = m.m_joints[C],
                        l.m_islandFlag = !1;
                    this.m_contactManager.FindNewContacts()
                }
            } else
                n.m_sweep.Set(V.s_backupA),
                r.m_sweep.Set(V.s_backupB),
                n.SynchronizeTransform(),
                r.SynchronizeTransform()
        }
    }
    ,
    V.prototype.DrawJoint = function(t) {
        var e = t.GetBodyA()
          , i = t.GetBodyB()
          , o = e.m_xf
          , n = i.m_xf
          , s = o.position
          , r = n.position
          , a = t.GetAnchorA()
          , l = t.GetAnchorB()
          , m = V.s_jointColor;
        switch (t.m_type) {
        case G.e_distanceJoint:
            this.m_debugDraw.DrawSegment(a, l, m);
            break;
        case G.e_pulleyJoint:
            var c = t instanceof F ? t : null
              , h = c.GetGroundAnchorA()
              , u = c.GetGroundAnchorB();
            this.m_debugDraw.DrawSegment(h, a, m),
            this.m_debugDraw.DrawSegment(u, l, m),
            this.m_debugDraw.DrawSegment(h, u, m);
            break;
        case G.e_mouseJoint:
            this.m_debugDraw.DrawSegment(a, l, m);
            break;
        default:
            e != this.m_groundBody && this.m_debugDraw.DrawSegment(s, a, m),
            this.m_debugDraw.DrawSegment(a, l, m),
            i != this.m_groundBody && this.m_debugDraw.DrawSegment(r, l, m)
        }
    }
    ,
    V.prototype.DrawShape = function(e, i, o) {
        switch (e.m_type) {
        case _.e_circleShape:
            var n = e instanceof h ? e : null
              , s = t.MulX(i, n.m_p)
              , r = n.m_radius
              , a = i.R.col1;
            this.m_debugDraw.DrawSolidCircle(s, r, a, o);
            break;
        case _.e_polygonShape:
            var l = 0
              , m = e instanceof y ? e : null
              , c = parseInt(m.GetVertexCount())
              , p = m.GetVertices()
              , d = new Vector(c);
            for (l = 0; c > l; ++l)
                d[l] = t.MulX(i, p[l]);
            this.m_debugDraw.DrawSolidPolygon(d, c, o);
            break;
        case _.e_edgeShape:
            var f = e instanceof u ? e : null;
            this.m_debugDraw.DrawSegment(t.MulX(i, f.GetVertex1()), t.MulX(i, f.GetVertex2()), o)
        }
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.b2World.s_timestep2 = new M,
        Box2D.Dynamics.b2World.s_xf = new i,
        Box2D.Dynamics.b2World.s_backupA = new e,
        Box2D.Dynamics.b2World.s_backupB = new e,
        Box2D.Dynamics.b2World.s_timestep = new M,
        Box2D.Dynamics.b2World.s_queue = new Vector,
        Box2D.Dynamics.b2World.s_jointColor = new n(.5,.8,.8),
        Box2D.Dynamics.b2World.e_newFixture = 1,
        Box2D.Dynamics.b2World.e_locked = 2
    })
}(),
function() {
    var t = Box2D.Collision.Shapes.b2CircleShape
      , e = (Box2D.Collision.Shapes.b2EdgeChainDef,
    Box2D.Collision.Shapes.b2EdgeShape)
      , i = (Box2D.Collision.Shapes.b2MassData,
    Box2D.Collision.Shapes.b2PolygonShape)
      , o = Box2D.Collision.Shapes.b2Shape
      , n = Box2D.Dynamics.Contacts.b2CircleContact
      , s = Box2D.Dynamics.Contacts.b2Contact
      , r = Box2D.Dynamics.Contacts.b2ContactConstraint
      , a = Box2D.Dynamics.Contacts.b2ContactConstraintPoint
      , l = Box2D.Dynamics.Contacts.b2ContactEdge
      , m = Box2D.Dynamics.Contacts.b2ContactFactory
      , c = Box2D.Dynamics.Contacts.b2ContactRegister
      , h = Box2D.Dynamics.Contacts.b2ContactResult
      , u = Box2D.Dynamics.Contacts.b2ContactSolver
      , p = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact
      , y = Box2D.Dynamics.Contacts.b2NullContact
      , _ = Box2D.Dynamics.Contacts.b2PolyAndCircleContact
      , d = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact
      , f = Box2D.Dynamics.Contacts.b2PolygonContact
      , x = Box2D.Dynamics.Contacts.b2PositionSolverManifold
      , b = Box2D.Dynamics.b2Body
      , v = (Box2D.Dynamics.b2BodyDef,
    Box2D.Dynamics.b2ContactFilter,
    Box2D.Dynamics.b2ContactImpulse,
    Box2D.Dynamics.b2ContactListener,
    Box2D.Dynamics.b2ContactManager,
    Box2D.Dynamics.b2DebugDraw,
    Box2D.Dynamics.b2DestructionListener,
    Box2D.Dynamics.b2FilterData,
    Box2D.Dynamics.b2Fixture,
    Box2D.Dynamics.b2FixtureDef,
    Box2D.Dynamics.b2Island,
    Box2D.Dynamics.b2TimeStep)
      , g = (Box2D.Dynamics.b2World,
    Box2D.Common.b2Color,
    Box2D.Common.b2internal,
    Box2D.Common.b2Settings)
      , D = Box2D.Common.Math.b2Mat22
      , C = (Box2D.Common.Math.b2Mat33,
    Box2D.Common.Math.b2Math)
      , B = (Box2D.Common.Math.b2Sweep,
    Box2D.Common.Math.b2Transform,
    Box2D.Common.Math.b2Vec2)
      , w = (Box2D.Common.Math.b2Vec3,
    Box2D.Collision.b2AABB,
    Box2D.Collision.b2Bound,
    Box2D.Collision.b2BoundValues,
    Box2D.Collision.b2Collision)
      , A = Box2D.Collision.b2ContactID
      , S = (Box2D.Collision.b2ContactPoint,
    Box2D.Collision.b2Distance,
    Box2D.Collision.b2DistanceInput,
    Box2D.Collision.b2DistanceOutput,
    Box2D.Collision.b2DistanceProxy,
    Box2D.Collision.b2DynamicTree,
    Box2D.Collision.b2DynamicTreeBroadPhase,
    Box2D.Collision.b2DynamicTreeNode,
    Box2D.Collision.b2DynamicTreePair,
    Box2D.Collision.b2Manifold)
      , M = (Box2D.Collision.b2ManifoldPoint,
    Box2D.Collision.b2Point,
    Box2D.Collision.b2RayCastInput,
    Box2D.Collision.b2RayCastOutput,
    Box2D.Collision.b2Segment,
    Box2D.Collision.b2SeparationFunction,
    Box2D.Collision.b2Simplex,
    Box2D.Collision.b2SimplexCache,
    Box2D.Collision.b2SimplexVertex,
    Box2D.Collision.b2TimeOfImpact)
      , V = Box2D.Collision.b2TOIInput
      , I = Box2D.Collision.b2WorldManifold;
    Box2D.Collision.ClipVertex,
    Box2D.Collision.Features,
    Box2D.Collision.IBroadPhase,
    Box2D.inherit(n, Box2D.Dynamics.Contacts.b2Contact),
    n.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype,
    n.b2CircleContact = function() {
        Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments)
    }
    ,
    n.Create = function() {
        return new n
    }
    ,
    n.Destroy = function() {}
    ,
    n.prototype.Reset = function(t, e) {
        this.__super.Reset.call(this, t, e)
    }
    ,
    n.prototype.Evaluate = function() {
        var e = this.m_fixtureA.GetBody()
          , i = this.m_fixtureB.GetBody();
        w.CollideCircles(this.m_manifold, this.m_fixtureA.GetShape()instanceof t ? this.m_fixtureA.GetShape() : null, e.m_xf, this.m_fixtureB.GetShape()instanceof t ? this.m_fixtureB.GetShape() : null, i.m_xf)
    }
    ,
    s.b2Contact = function() {
        this.m_nodeA = new l,
        this.m_nodeB = new l,
        this.m_manifold = new S,
        this.m_oldManifold = new S
    }
    ,
    s.prototype.GetManifold = function() {
        return this.m_manifold
    }
    ,
    s.prototype.GetWorldManifold = function(t) {
        var e = this.m_fixtureA.GetBody()
          , i = this.m_fixtureB.GetBody()
          , o = this.m_fixtureA.GetShape()
          , n = this.m_fixtureB.GetShape();
        t.Initialize(this.m_manifold, e.GetTransform(), o.m_radius, i.GetTransform(), n.m_radius)
    }
    ,
    s.prototype.IsTouching = function() {
        return (this.m_flags & s.e_touchingFlag) == s.e_touchingFlag
    }
    ,
    s.prototype.IsContinuous = function() {
        return (this.m_flags & s.e_continuousFlag) == s.e_continuousFlag
    }
    ,
    s.prototype.SetSensor = function(t) {
        t ? this.m_flags |= s.e_sensorFlag : this.m_flags &= ~s.e_sensorFlag
    }
    ,
    s.prototype.IsSensor = function() {
        return (this.m_flags & s.e_sensorFlag) == s.e_sensorFlag
    }
    ,
    s.prototype.SetEnabled = function(t) {
        t ? this.m_flags |= s.e_enabledFlag : this.m_flags &= ~s.e_enabledFlag
    }
    ,
    s.prototype.IsEnabled = function() {
        return (this.m_flags & s.e_enabledFlag) == s.e_enabledFlag
    }
    ,
    s.prototype.GetNext = function() {
        return this.m_next
    }
    ,
    s.prototype.GetFixtureA = function() {
        return this.m_fixtureA
    }
    ,
    s.prototype.GetFixtureB = function() {
        return this.m_fixtureB
    }
    ,
    s.prototype.FlagForFiltering = function() {
        this.m_flags |= s.e_filterFlag
    }
    ,
    s.prototype.b2Contact = function() {}
    ,
    s.prototype.Reset = function(t, e) {
        if (void 0 === t && (t = null),
        void 0 === e && (e = null),
        this.m_flags = s.e_enabledFlag,
        !t || !e)
            return this.m_fixtureA = null,
            void (this.m_fixtureB = null);
        (t.IsSensor() || e.IsSensor()) && (this.m_flags |= s.e_sensorFlag);
        var i = t.GetBody()
          , o = e.GetBody();
        (i.GetType() != b.b2_dynamicBody || i.IsBullet() || o.GetType() != b.b2_dynamicBody || o.IsBullet()) && (this.m_flags |= s.e_continuousFlag),
        this.m_fixtureA = t,
        this.m_fixtureB = e,
        this.m_manifold.m_pointCount = 0,
        this.m_prev = null,
        this.m_next = null,
        this.m_nodeA.contact = null,
        this.m_nodeA.prev = null,
        this.m_nodeA.next = null,
        this.m_nodeA.other = null,
        this.m_nodeB.contact = null,
        this.m_nodeB.prev = null,
        this.m_nodeB.next = null,
        this.m_nodeB.other = null
    }
    ,
    s.prototype.Update = function(t) {
        var e = this.m_oldManifold;
        this.m_oldManifold = this.m_manifold,
        this.m_manifold = e,
        this.m_flags |= s.e_enabledFlag;
        var i = !1
          , n = (this.m_flags & s.e_touchingFlag) == s.e_touchingFlag
          , r = this.m_fixtureA.m_body
          , a = this.m_fixtureB.m_body
          , l = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
        if (this.m_flags & s.e_sensorFlag) {
            if (l) {
                var m = this.m_fixtureA.GetShape()
                  , c = this.m_fixtureB.GetShape()
                  , h = r.GetTransform()
                  , u = a.GetTransform();
                i = o.TestOverlap(m, h, c, u)
            }
            this.m_manifold.m_pointCount = 0
        } else {
            if (r.GetType() != b.b2_dynamicBody || r.IsBullet() || a.GetType() != b.b2_dynamicBody || a.IsBullet() ? this.m_flags |= s.e_continuousFlag : this.m_flags &= ~s.e_continuousFlag,
            l) {
                this.Evaluate(),
                i = this.m_manifold.m_pointCount > 0;
                for (var p = 0; p < this.m_manifold.m_pointCount; ++p) {
                    var y = this.m_manifold.m_points[p];
                    y.m_normalImpulse = 0,
                    y.m_tangentImpulse = 0;
                    for (var _ = y.m_id, d = 0; d < this.m_oldManifold.m_pointCount; ++d) {
                        var f = this.m_oldManifold.m_points[d];
                        if (f.m_id.key == _.key) {
                            y.m_normalImpulse = f.m_normalImpulse,
                            y.m_tangentImpulse = f.m_tangentImpulse;
                            break
                        }
                    }
                }
            } else
                this.m_manifold.m_pointCount = 0;
            i != n && (r.SetAwake(!0),
            a.SetAwake(!0))
        }
        i ? this.m_flags |= s.e_touchingFlag : this.m_flags &= ~s.e_touchingFlag,
        0 == n && 1 == i && t.BeginContact(this),
        1 == n && 0 == i && t.EndContact(this),
        0 == (this.m_flags & s.e_sensorFlag) && t.PreSolve(this, this.m_oldManifold)
    }
    ,
    s.prototype.Evaluate = function() {}
    ,
    s.prototype.ComputeTOI = function(t, e) {
        return s.s_input.proxyA.Set(this.m_fixtureA.GetShape()),
        s.s_input.proxyB.Set(this.m_fixtureB.GetShape()),
        s.s_input.sweepA = t,
        s.s_input.sweepB = e,
        s.s_input.tolerance = g.b2_linearSlop,
        M.TimeOfImpact(s.s_input)
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.Contacts.b2Contact.e_sensorFlag = 1,
        Box2D.Dynamics.Contacts.b2Contact.e_continuousFlag = 2,
        Box2D.Dynamics.Contacts.b2Contact.e_islandFlag = 4,
        Box2D.Dynamics.Contacts.b2Contact.e_toiFlag = 8,
        Box2D.Dynamics.Contacts.b2Contact.e_touchingFlag = 16,
        Box2D.Dynamics.Contacts.b2Contact.e_enabledFlag = 32,
        Box2D.Dynamics.Contacts.b2Contact.e_filterFlag = 64,
        Box2D.Dynamics.Contacts.b2Contact.s_input = new V
    }),
    r.b2ContactConstraint = function() {
        this.localPlaneNormal = new B,
        this.localPoint = new B,
        this.normal = new B,
        this.normalMass = new D,
        this.K = new D
    }
    ,
    r.prototype.b2ContactConstraint = function() {
        this.points = new Vector(g.b2_maxManifoldPoints);
        for (var t = 0; t < g.b2_maxManifoldPoints; t++)
            this.points[t] = new a
    }
    ,
    a.b2ContactConstraintPoint = function() {
        this.localPoint = new B,
        this.rA = new B,
        this.rB = new B
    }
    ,
    l.b2ContactEdge = function() {}
    ,
    m.b2ContactFactory = function() {}
    ,
    m.prototype.b2ContactFactory = function(t) {
        this.m_allocator = t,
        this.InitializeRegisters()
    }
    ,
    m.prototype.AddType = function(t, e, i, o) {
        void 0 === i && (i = 0),
        void 0 === o && (o = 0),
        this.m_registers[i][o].createFcn = t,
        this.m_registers[i][o].destroyFcn = e,
        this.m_registers[i][o].primary = !0,
        i != o && (this.m_registers[o][i].createFcn = t,
        this.m_registers[o][i].destroyFcn = e,
        this.m_registers[o][i].primary = !1)
    }
    ,
    m.prototype.InitializeRegisters = function() {
        this.m_registers = new Vector(o.e_shapeTypeCount);
        for (var t = 0; t < o.e_shapeTypeCount; t++) {
            this.m_registers[t] = new Vector(o.e_shapeTypeCount);
            for (var e = 0; e < o.e_shapeTypeCount; e++)
                this.m_registers[t][e] = new c
        }
        this.AddType(n.Create, n.Destroy, o.e_circleShape, o.e_circleShape),
        this.AddType(_.Create, _.Destroy, o.e_polygonShape, o.e_circleShape),
        this.AddType(f.Create, f.Destroy, o.e_polygonShape, o.e_polygonShape),
        this.AddType(p.Create, p.Destroy, o.e_edgeShape, o.e_circleShape),
        this.AddType(d.Create, d.Destroy, o.e_polygonShape, o.e_edgeShape)
    }
    ,
    m.prototype.Create = function(t, e) {
        var i, o = parseInt(t.GetType()), n = parseInt(e.GetType()), s = this.m_registers[o][n];
        if (s.pool)
            return i = s.pool,
            s.pool = i.m_next,
            s.poolCount--,
            i.Reset(t, e),
            i;
        var r = s.createFcn;
        return null != r ? s.primary ? (i = r(this.m_allocator),
        i.Reset(t, e),
        i) : (i = r(this.m_allocator),
        i.Reset(e, t),
        i) : null
    }
    ,
    m.prototype.Destroy = function(t) {
        t.m_manifold.m_pointCount > 0 && (t.m_fixtureA.m_body.SetAwake(!0),
        t.m_fixtureB.m_body.SetAwake(!0));
        var e = parseInt(t.m_fixtureA.GetType())
          , i = parseInt(t.m_fixtureB.GetType())
          , o = this.m_registers[e][i];
        o.poolCount++,
        t.m_next = o.pool,
        o.pool = t;
        var n = o.destroyFcn;
        n(t, this.m_allocator)
    }
    ,
    c.b2ContactRegister = function() {}
    ,
    h.b2ContactResult = function() {
        this.position = new B,
        this.normal = new B,
        this.id = new A
    }
    ,
    u.b2ContactSolver = function() {
        this.m_step = new v,
        this.m_constraints = new Vector
    }
    ,
    u.prototype.b2ContactSolver = function() {}
    ,
    u.prototype.Initialize = function(t, e, i, o) {
        void 0 === i && (i = 0);
        var n;
        this.m_step.Set(t),
        this.m_allocator = o;
        var s = 0;
        for (this.m_constraintCount = i; this.m_constraints.length < this.m_constraintCount; )
            this.m_constraints[this.m_constraints.length] = new r;
        for (s = 0; i > s; ++s) {
            n = e[s];
            var a = n.m_fixtureA
              , l = n.m_fixtureB
              , m = a.m_shape
              , c = l.m_shape
              , h = m.m_radius
              , p = c.m_radius
              , y = a.m_body
              , _ = l.m_body
              , d = n.GetManifold()
              , f = g.b2MixFriction(a.GetFriction(), l.GetFriction())
              , x = g.b2MixRestitution(a.GetRestitution(), l.GetRestitution())
              , b = y.m_linearVelocity.x
              , v = y.m_linearVelocity.y
              , D = _.m_linearVelocity.x
              , C = _.m_linearVelocity.y
              , B = y.m_angularVelocity
              , w = _.m_angularVelocity;
            g.b2Assert(d.m_pointCount > 0),
            u.s_worldManifold.Initialize(d, y.m_xf, h, _.m_xf, p);
            var A = u.s_worldManifold.m_normal.x
              , S = u.s_worldManifold.m_normal.y
              , M = this.m_constraints[s];
            M.bodyA = y,
            M.bodyB = _,
            M.manifold = d,
            M.normal.x = A,
            M.normal.y = S,
            M.pointCount = d.m_pointCount,
            M.friction = f,
            M.restitution = x,
            M.localPlaneNormal.x = d.m_localPlaneNormal.x,
            M.localPlaneNormal.y = d.m_localPlaneNormal.y,
            M.localPoint.x = d.m_localPoint.x,
            M.localPoint.y = d.m_localPoint.y,
            M.radius = h + p,
            M.type = d.m_type;
            for (var V = 0; V < M.pointCount; ++V) {
                var I = d.m_points[V]
                  , T = M.points[V];
                T.normalImpulse = I.m_normalImpulse,
                T.tangentImpulse = I.m_tangentImpulse,
                T.localPoint.SetV(I.m_localPoint);
                var L = T.rA.x = u.s_worldManifold.m_points[V].x - y.m_sweep.c.x
                  , G = T.rA.y = u.s_worldManifold.m_points[V].y - y.m_sweep.c.y
                  , F = T.rB.x = u.s_worldManifold.m_points[V].x - _.m_sweep.c.x
                  , P = T.rB.y = u.s_worldManifold.m_points[V].y - _.m_sweep.c.y
                  , J = L * S - G * A
                  , E = F * S - P * A;
                J *= J,
                E *= E;
                var R = y.m_invMass + _.m_invMass + y.m_invI * J + _.m_invI * E;
                T.normalMass = 1 / R;
                var k = y.m_mass * y.m_invMass + _.m_mass * _.m_invMass;
                k += y.m_mass * y.m_invI * J + _.m_mass * _.m_invI * E,
                T.equalizedMass = 1 / k;
                var N = S
                  , j = -A
                  , z = L * j - G * N
                  , q = F * j - P * N;
                z *= z,
                q *= q;
                var O = y.m_invMass + _.m_invMass + y.m_invI * z + _.m_invI * q;
                T.tangentMass = 1 / O,
                T.velocityBias = 0;
                var W = D + -w * P - b - -B * G
                  , U = C + w * F - v - B * L
                  , H = M.normal.x * W + M.normal.y * U;
                H < -g.b2_velocityThreshold && (T.velocityBias += -M.restitution * H)
            }
            if (2 == M.pointCount) {
                var $ = M.points[0]
                  , X = M.points[1]
                  , K = y.m_invMass
                  , Z = y.m_invI
                  , Y = _.m_invMass
                  , Q = _.m_invI
                  , tt = $.rA.x * S - $.rA.y * A
                  , et = $.rB.x * S - $.rB.y * A
                  , it = X.rA.x * S - X.rA.y * A
                  , ot = X.rB.x * S - X.rB.y * A
                  , nt = K + Y + Z * tt * tt + Q * et * et
                  , st = K + Y + Z * it * it + Q * ot * ot
                  , rt = K + Y + Z * tt * it + Q * et * ot
                  , at = 100;
                at * (nt * st - rt * rt) > nt * nt ? (M.K.col1.Set(nt, rt),
                M.K.col2.Set(rt, st),
                M.K.GetInverse(M.normalMass)) : M.pointCount = 1
            }
        }
    }
    ,
    u.prototype.InitVelocityConstraints = function(t) {
        for (var e = 0; e < this.m_constraintCount; ++e) {
            var i = this.m_constraints[e]
              , o = i.bodyA
              , n = i.bodyB
              , s = o.m_invMass
              , r = o.m_invI
              , a = n.m_invMass
              , l = n.m_invI
              , m = i.normal.x
              , c = i.normal.y
              , h = c
              , u = -m
              , p = 0
              , y = 0;
            if (t.warmStarting)
                for (y = i.pointCount,
                p = 0; y > p; ++p) {
                    var _ = i.points[p];
                    _.normalImpulse *= t.dtRatio,
                    _.tangentImpulse *= t.dtRatio;
                    var d = _.normalImpulse * m + _.tangentImpulse * h
                      , f = _.normalImpulse * c + _.tangentImpulse * u;
                    o.m_angularVelocity -= r * (_.rA.x * f - _.rA.y * d),
                    o.m_linearVelocity.x -= s * d,
                    o.m_linearVelocity.y -= s * f,
                    n.m_angularVelocity += l * (_.rB.x * f - _.rB.y * d),
                    n.m_linearVelocity.x += a * d,
                    n.m_linearVelocity.y += a * f
                }
            else
                for (y = i.pointCount,
                p = 0; y > p; ++p) {
                    var x = i.points[p];
                    x.normalImpulse = 0,
                    x.tangentImpulse = 0
                }
        }
    }
    ,
    u.prototype.SolveVelocityConstraints = function() {
        for (var t, e, i = 0, o = 0, n = 0, s = 0, r = 0, a = 0, l = 0, m = 0, c = 0, h = 0, u = 0, p = 0, y = 0, _ = 0, d = 0, f = 0, x = 0; x < this.m_constraintCount; ++x) {
            var b = this.m_constraints[x]
              , v = b.bodyA
              , g = b.bodyB
              , D = v.m_angularVelocity
              , B = g.m_angularVelocity
              , w = v.m_linearVelocity
              , A = g.m_linearVelocity
              , S = v.m_invMass
              , M = v.m_invI
              , V = g.m_invMass
              , I = g.m_invI
              , T = b.normal.x
              , L = b.normal.y
              , G = L
              , F = -T
              , P = b.friction;
            for (i = 0; i < b.pointCount; i++)
                t = b.points[i],
                o = A.x - B * t.rB.y - w.x + D * t.rA.y,
                n = A.y + B * t.rB.x - w.y - D * t.rA.x,
                r = o * G + n * F,
                a = t.tangentMass * -r,
                l = P * t.normalImpulse,
                m = C.Clamp(t.tangentImpulse + a, -l, l),
                a = m - t.tangentImpulse,
                c = a * G,
                h = a * F,
                w.x -= S * c,
                w.y -= S * h,
                D -= M * (t.rA.x * h - t.rA.y * c),
                A.x += V * c,
                A.y += V * h,
                B += I * (t.rB.x * h - t.rB.y * c),
                t.tangentImpulse = m;
            if (parseInt(b.pointCount),
            1 == b.pointCount)
                t = b.points[0],
                o = A.x + -B * t.rB.y - w.x - -D * t.rA.y,
                n = A.y + B * t.rB.x - w.y - D * t.rA.x,
                s = o * T + n * L,
                a = -t.normalMass * (s - t.velocityBias),
                m = t.normalImpulse + a,
                m = m > 0 ? m : 0,
                a = m - t.normalImpulse,
                c = a * T,
                h = a * L,
                w.x -= S * c,
                w.y -= S * h,
                D -= M * (t.rA.x * h - t.rA.y * c),
                A.x += V * c,
                A.y += V * h,
                B += I * (t.rB.x * h - t.rB.y * c),
                t.normalImpulse = m;
            else {
                var J = b.points[0]
                  , E = b.points[1]
                  , R = J.normalImpulse
                  , k = E.normalImpulse
                  , N = A.x - B * J.rB.y - w.x + D * J.rA.y
                  , j = A.y + B * J.rB.x - w.y - D * J.rA.x
                  , z = A.x - B * E.rB.y - w.x + D * E.rA.y
                  , q = A.y + B * E.rB.x - w.y - D * E.rA.x
                  , O = N * T + j * L
                  , W = z * T + q * L
                  , U = O - J.velocityBias
                  , H = W - E.velocityBias;
                for (e = b.K,
                U -= e.col1.x * R + e.col2.x * k,
                H -= e.col1.y * R + e.col2.y * k; ; ) {
                    e = b.normalMass;
                    var $ = -(e.col1.x * U + e.col2.x * H)
                      , X = -(e.col1.y * U + e.col2.y * H);
                    if ($ >= 0 && X >= 0) {
                        u = $ - R,
                        p = X - k,
                        y = u * T,
                        _ = u * L,
                        d = p * T,
                        f = p * L,
                        w.x -= S * (y + d),
                        w.y -= S * (_ + f),
                        D -= M * (J.rA.x * _ - J.rA.y * y + E.rA.x * f - E.rA.y * d),
                        A.x += V * (y + d),
                        A.y += V * (_ + f),
                        B += I * (J.rB.x * _ - J.rB.y * y + E.rB.x * f - E.rB.y * d),
                        J.normalImpulse = $,
                        E.normalImpulse = X;
                        break
                    }
                    if ($ = -J.normalMass * U,
                    X = 0,
                    O = 0,
                    W = b.K.col1.y * $ + H,
                    $ >= 0 && W >= 0) {
                        u = $ - R,
                        p = X - k,
                        y = u * T,
                        _ = u * L,
                        d = p * T,
                        f = p * L,
                        w.x -= S * (y + d),
                        w.y -= S * (_ + f),
                        D -= M * (J.rA.x * _ - J.rA.y * y + E.rA.x * f - E.rA.y * d),
                        A.x += V * (y + d),
                        A.y += V * (_ + f),
                        B += I * (J.rB.x * _ - J.rB.y * y + E.rB.x * f - E.rB.y * d),
                        J.normalImpulse = $,
                        E.normalImpulse = X;
                        break
                    }
                    if ($ = 0,
                    X = -E.normalMass * H,
                    O = b.K.col2.x * X + U,
                    W = 0,
                    X >= 0 && O >= 0) {
                        u = $ - R,
                        p = X - k,
                        y = u * T,
                        _ = u * L,
                        d = p * T,
                        f = p * L,
                        w.x -= S * (y + d),
                        w.y -= S * (_ + f),
                        D -= M * (J.rA.x * _ - J.rA.y * y + E.rA.x * f - E.rA.y * d),
                        A.x += V * (y + d),
                        A.y += V * (_ + f),
                        B += I * (J.rB.x * _ - J.rB.y * y + E.rB.x * f - E.rB.y * d),
                        J.normalImpulse = $,
                        E.normalImpulse = X;
                        break
                    }
                    if ($ = 0,
                    X = 0,
                    O = U,
                    W = H,
                    O >= 0 && W >= 0) {
                        u = $ - R,
                        p = X - k,
                        y = u * T,
                        _ = u * L,
                        d = p * T,
                        f = p * L,
                        w.x -= S * (y + d),
                        w.y -= S * (_ + f),
                        D -= M * (J.rA.x * _ - J.rA.y * y + E.rA.x * f - E.rA.y * d),
                        A.x += V * (y + d),
                        A.y += V * (_ + f),
                        B += I * (J.rB.x * _ - J.rB.y * y + E.rB.x * f - E.rB.y * d),
                        J.normalImpulse = $,
                        E.normalImpulse = X;
                        break
                    }
                    break
                }
            }
            v.m_angularVelocity = D,
            g.m_angularVelocity = B
        }
    }
    ,
    u.prototype.FinalizeVelocityConstraints = function() {
        for (var t = 0; t < this.m_constraintCount; ++t)
            for (var e = this.m_constraints[t], i = e.manifold, o = 0; o < e.pointCount; ++o) {
                var n = i.m_points[o]
                  , s = e.points[o];
                n.m_normalImpulse = s.normalImpulse,
                n.m_tangentImpulse = s.tangentImpulse
            }
    }
    ,
    u.prototype.SolvePositionConstraints = function(t) {
        void 0 === t && (t = 0);
        for (var e = 0, i = 0; i < this.m_constraintCount; i++) {
            var o = this.m_constraints[i]
              , n = o.bodyA
              , s = o.bodyB
              , r = n.m_mass * n.m_invMass
              , a = n.m_mass * n.m_invI
              , l = s.m_mass * s.m_invMass
              , m = s.m_mass * s.m_invI;
            u.s_psm.Initialize(o);
            for (var c = u.s_psm.m_normal, h = 0; h < o.pointCount; h++) {
                var p = o.points[h]
                  , y = u.s_psm.m_points[h]
                  , _ = u.s_psm.m_separations[h]
                  , d = y.x - n.m_sweep.c.x
                  , f = y.y - n.m_sweep.c.y
                  , x = y.x - s.m_sweep.c.x
                  , b = y.y - s.m_sweep.c.y;
                e = _ > e ? e : _;
                var v = C.Clamp(t * (_ + g.b2_linearSlop), -g.b2_maxLinearCorrection, 0)
                  , D = -p.equalizedMass * v
                  , B = D * c.x
                  , w = D * c.y;
                n.m_sweep.c.x -= r * B,
                n.m_sweep.c.y -= r * w,
                n.m_sweep.a -= a * (d * w - f * B),
                n.SynchronizeTransform(),
                s.m_sweep.c.x += l * B,
                s.m_sweep.c.y += l * w,
                s.m_sweep.a += m * (x * w - b * B),
                s.SynchronizeTransform()
            }
        }
        return e > -1.5 * g.b2_linearSlop
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold = new I,
        Box2D.Dynamics.Contacts.b2ContactSolver.s_psm = new x
    }),
    Box2D.inherit(p, Box2D.Dynamics.Contacts.b2Contact),
    p.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype,
    p.b2EdgeAndCircleContact = function() {
        Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments)
    }
    ,
    p.Create = function() {
        return new p
    }
    ,
    p.Destroy = function() {}
    ,
    p.prototype.Reset = function(t, e) {
        this.__super.Reset.call(this, t, e)
    }
    ,
    p.prototype.Evaluate = function() {
        var i = this.m_fixtureA.GetBody()
          , o = this.m_fixtureB.GetBody();
        this.b2CollideEdgeAndCircle(this.m_manifold, this.m_fixtureA.GetShape()instanceof e ? this.m_fixtureA.GetShape() : null, i.m_xf, this.m_fixtureB.GetShape()instanceof t ? this.m_fixtureB.GetShape() : null, o.m_xf)
    }
    ,
    p.prototype.b2CollideEdgeAndCircle = function() {}
    ,
    Box2D.inherit(y, Box2D.Dynamics.Contacts.b2Contact),
    y.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype,
    y.b2NullContact = function() {
        Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments)
    }
    ,
    y.prototype.b2NullContact = function() {
        this.__super.b2Contact.call(this)
    }
    ,
    y.prototype.Evaluate = function() {}
    ,
    Box2D.inherit(_, Box2D.Dynamics.Contacts.b2Contact),
    _.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype,
    _.b2PolyAndCircleContact = function() {
        Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments)
    }
    ,
    _.Create = function() {
        return new _
    }
    ,
    _.Destroy = function() {}
    ,
    _.prototype.Reset = function(t, e) {
        this.__super.Reset.call(this, t, e),
        g.b2Assert(t.GetType() == o.e_polygonShape),
        g.b2Assert(e.GetType() == o.e_circleShape)
    }
    ,
    _.prototype.Evaluate = function() {
        var e = this.m_fixtureA.m_body
          , o = this.m_fixtureB.m_body;
        w.CollidePolygonAndCircle(this.m_manifold, this.m_fixtureA.GetShape()instanceof i ? this.m_fixtureA.GetShape() : null, e.m_xf, this.m_fixtureB.GetShape()instanceof t ? this.m_fixtureB.GetShape() : null, o.m_xf)
    }
    ,
    Box2D.inherit(d, Box2D.Dynamics.Contacts.b2Contact),
    d.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype,
    d.b2PolyAndEdgeContact = function() {
        Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments)
    }
    ,
    d.Create = function() {
        return new d
    }
    ,
    d.Destroy = function() {}
    ,
    d.prototype.Reset = function(t, e) {
        this.__super.Reset.call(this, t, e),
        g.b2Assert(t.GetType() == o.e_polygonShape),
        g.b2Assert(e.GetType() == o.e_edgeShape)
    }
    ,
    d.prototype.Evaluate = function() {
        var t = this.m_fixtureA.GetBody()
          , o = this.m_fixtureB.GetBody();
        this.b2CollidePolyAndEdge(this.m_manifold, this.m_fixtureA.GetShape()instanceof i ? this.m_fixtureA.GetShape() : null, t.m_xf, this.m_fixtureB.GetShape()instanceof e ? this.m_fixtureB.GetShape() : null, o.m_xf)
    }
    ,
    d.prototype.b2CollidePolyAndEdge = function() {}
    ,
    Box2D.inherit(f, Box2D.Dynamics.Contacts.b2Contact),
    f.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype,
    f.b2PolygonContact = function() {
        Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments)
    }
    ,
    f.Create = function() {
        return new f
    }
    ,
    f.Destroy = function() {}
    ,
    f.prototype.Reset = function(t, e) {
        this.__super.Reset.call(this, t, e)
    }
    ,
    f.prototype.Evaluate = function() {
        var t = this.m_fixtureA.GetBody()
          , e = this.m_fixtureB.GetBody();
        w.CollidePolygons(this.m_manifold, this.m_fixtureA.GetShape()instanceof i ? this.m_fixtureA.GetShape() : null, t.m_xf, this.m_fixtureB.GetShape()instanceof i ? this.m_fixtureB.GetShape() : null, e.m_xf)
    }
    ,
    x.b2PositionSolverManifold = function() {}
    ,
    x.prototype.b2PositionSolverManifold = function() {
        this.m_normal = new B,
        this.m_separations = new Vector_a2j_Number(g.b2_maxManifoldPoints),
        this.m_points = new Vector(g.b2_maxManifoldPoints);
        for (var t = 0; t < g.b2_maxManifoldPoints; t++)
            this.m_points[t] = new B
    }
    ,
    x.prototype.Initialize = function(t) {
        g.b2Assert(t.pointCount > 0);
        var e, i, o = 0, n = 0, s = 0, r = 0, a = 0;
        switch (t.type) {
        case S.e_circles:
            e = t.bodyA.m_xf.R,
            i = t.localPoint;
            var l = t.bodyA.m_xf.position.x + (e.col1.x * i.x + e.col2.x * i.y)
              , m = t.bodyA.m_xf.position.y + (e.col1.y * i.x + e.col2.y * i.y);
            e = t.bodyB.m_xf.R,
            i = t.points[0].localPoint;
            var c = t.bodyB.m_xf.position.x + (e.col1.x * i.x + e.col2.x * i.y)
              , h = t.bodyB.m_xf.position.y + (e.col1.y * i.x + e.col2.y * i.y)
              , u = c - l
              , p = h - m
              , y = u * u + p * p;
            if (y > Number.MIN_VALUE * Number.MIN_VALUE) {
                var _ = Math.sqrt(y);
                this.m_normal.x = u / _,
                this.m_normal.y = p / _
            } else
                this.m_normal.x = 1,
                this.m_normal.y = 0;
            this.m_points[0].x = .5 * (l + c),
            this.m_points[0].y = .5 * (m + h),
            this.m_separations[0] = u * this.m_normal.x + p * this.m_normal.y - t.radius;
            break;
        case S.e_faceA:
            for (e = t.bodyA.m_xf.R,
            i = t.localPlaneNormal,
            this.m_normal.x = e.col1.x * i.x + e.col2.x * i.y,
            this.m_normal.y = e.col1.y * i.x + e.col2.y * i.y,
            e = t.bodyA.m_xf.R,
            i = t.localPoint,
            r = t.bodyA.m_xf.position.x + (e.col1.x * i.x + e.col2.x * i.y),
            a = t.bodyA.m_xf.position.y + (e.col1.y * i.x + e.col2.y * i.y),
            e = t.bodyB.m_xf.R,
            o = 0; o < t.pointCount; ++o)
                i = t.points[o].localPoint,
                n = t.bodyB.m_xf.position.x + (e.col1.x * i.x + e.col2.x * i.y),
                s = t.bodyB.m_xf.position.y + (e.col1.y * i.x + e.col2.y * i.y),
                this.m_separations[o] = (n - r) * this.m_normal.x + (s - a) * this.m_normal.y - t.radius,
                this.m_points[o].x = n,
                this.m_points[o].y = s;
            break;
        case S.e_faceB:
            for (e = t.bodyB.m_xf.R,
            i = t.localPlaneNormal,
            this.m_normal.x = e.col1.x * i.x + e.col2.x * i.y,
            this.m_normal.y = e.col1.y * i.x + e.col2.y * i.y,
            e = t.bodyB.m_xf.R,
            i = t.localPoint,
            r = t.bodyB.m_xf.position.x + (e.col1.x * i.x + e.col2.x * i.y),
            a = t.bodyB.m_xf.position.y + (e.col1.y * i.x + e.col2.y * i.y),
            e = t.bodyA.m_xf.R,
            o = 0; o < t.pointCount; ++o)
                i = t.points[o].localPoint,
                n = t.bodyA.m_xf.position.x + (e.col1.x * i.x + e.col2.x * i.y),
                s = t.bodyA.m_xf.position.y + (e.col1.y * i.x + e.col2.y * i.y),
                this.m_separations[o] = (n - r) * this.m_normal.x + (s - a) * this.m_normal.y - t.radius,
                this.m_points[o].Set(n, s);
            this.m_normal.x *= -1,
            this.m_normal.y *= -1
        }
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointA = new B,
        Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointB = new B
    })
}(),
function() {
    var t = (Box2D.Dynamics.b2Body,
    Box2D.Dynamics.b2BodyDef,
    Box2D.Dynamics.b2ContactFilter,
    Box2D.Dynamics.b2ContactImpulse,
    Box2D.Dynamics.b2ContactListener,
    Box2D.Dynamics.b2ContactManager,
    Box2D.Dynamics.b2DebugDraw,
    Box2D.Dynamics.b2DestructionListener,
    Box2D.Dynamics.b2FilterData,
    Box2D.Dynamics.b2Fixture,
    Box2D.Dynamics.b2FixtureDef,
    Box2D.Dynamics.b2Island,
    Box2D.Dynamics.b2TimeStep,
    Box2D.Dynamics.b2World,
    Box2D.Common.Math.b2Mat22)
      , e = (Box2D.Common.Math.b2Mat33,
    Box2D.Common.Math.b2Math)
      , i = (Box2D.Common.Math.b2Sweep,
    Box2D.Common.Math.b2Transform,
    Box2D.Common.Math.b2Vec2)
      , o = (Box2D.Common.Math.b2Vec3,
    Box2D.Common.b2Color)
      , n = (Box2D.Common.b2internal,
    Box2D.Common.b2Settings,
    Box2D.Collision.Shapes.b2CircleShape,
    Box2D.Collision.Shapes.b2EdgeChainDef,
    Box2D.Collision.Shapes.b2EdgeShape,
    Box2D.Collision.Shapes.b2MassData,
    Box2D.Collision.Shapes.b2PolygonShape,
    Box2D.Collision.Shapes.b2Shape,
    Box2D.Dynamics.Controllers.b2BuoyancyController)
      , s = Box2D.Dynamics.Controllers.b2ConstantAccelController
      , r = Box2D.Dynamics.Controllers.b2ConstantForceController
      , a = Box2D.Dynamics.Controllers.b2Controller
      , l = Box2D.Dynamics.Controllers.b2ControllerEdge
      , m = Box2D.Dynamics.Controllers.b2GravityController
      , c = Box2D.Dynamics.Controllers.b2TensorDampingController;
    Box2D.inherit(n, Box2D.Dynamics.Controllers.b2Controller),
    n.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype,
    n.b2BuoyancyController = function() {
        Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments),
        this.normal = new i(0,-1),
        this.offset = 0,
        this.density = 0,
        this.velocity = new i(0,0),
        this.linearDrag = 2,
        this.angularDrag = 1,
        this.useDensity = !1,
        this.useWorldGravity = !0,
        this.gravity = null
    }
    ,
    n.prototype.Step = function() {
        if (this.m_bodyList) {
            this.useWorldGravity && (this.gravity = this.GetWorld().GetGravity().Copy());
            for (var t = this.m_bodyList; t; t = t.nextBody) {
                var e = t.body;
                if (0 != e.IsAwake()) {
                    for (var o = new i, n = new i, s = 0, r = 0, a = e.GetFixtureList(); a; a = a.GetNext()) {
                        var l = new i
                          , m = a.GetShape().ComputeSubmergedArea(this.normal, this.offset, e.GetTransform(), l);
                        s += m,
                        o.x += m * l.x,
                        o.y += m * l.y;
                        var c = 0;
                        this.useDensity,
                        c = 1,
                        r += m * c,
                        n.x += m * l.x * c,
                        n.y += m * l.y * c
                    }
                    if (o.x /= s,
                    o.y /= s,
                    n.x /= r,
                    n.y /= r,
                    !(s < Number.MIN_VALUE)) {
                        var h = this.gravity.GetNegative();
                        h.Multiply(this.density * s),
                        e.ApplyForce(h, n);
                        var u = e.GetLinearVelocityFromWorldPoint(o);
                        u.Subtract(this.velocity),
                        u.Multiply(-this.linearDrag * s),
                        e.ApplyForce(u, o),
                        e.ApplyTorque(-e.GetInertia() / e.GetMass() * s * e.GetAngularVelocity() * this.angularDrag)
                    }
                }
            }
        }
    }
    ,
    n.prototype.Draw = function(t) {
        var e = 1e3
          , n = new i
          , s = new i;
        n.x = this.normal.x * this.offset + this.normal.y * e,
        n.y = this.normal.y * this.offset - this.normal.x * e,
        s.x = this.normal.x * this.offset - this.normal.y * e,
        s.y = this.normal.y * this.offset + this.normal.x * e;
        var r = new o(0,0,1);
        t.DrawSegment(n, s, r)
    }
    ,
    Box2D.inherit(s, Box2D.Dynamics.Controllers.b2Controller),
    s.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype,
    s.b2ConstantAccelController = function() {
        Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments),
        this.A = new i(0,0)
    }
    ,
    s.prototype.Step = function(t) {
        for (var e = new i(this.A.x * t.dt,this.A.y * t.dt), o = this.m_bodyList; o; o = o.nextBody) {
            var n = o.body;
            n.IsAwake() && n.SetLinearVelocity(new i(n.GetLinearVelocity().x + e.x,n.GetLinearVelocity().y + e.y))
        }
    }
    ,
    Box2D.inherit(r, Box2D.Dynamics.Controllers.b2Controller),
    r.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype,
    r.b2ConstantForceController = function() {
        Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments),
        this.F = new i(0,0)
    }
    ,
    r.prototype.Step = function() {
        for (var t = this.m_bodyList; t; t = t.nextBody) {
            var e = t.body;
            e.IsAwake() && e.ApplyForce(this.F, e.GetWorldCenter())
        }
    }
    ,
    a.b2Controller = function() {}
    ,
    a.prototype.Step = function() {}
    ,
    a.prototype.Draw = function() {}
    ,
    a.prototype.AddBody = function(t) {
        var e = new l;
        e.controller = this,
        e.body = t,
        e.nextBody = this.m_bodyList,
        e.prevBody = null,
        this.m_bodyList = e,
        e.nextBody && (e.nextBody.prevBody = e),
        this.m_bodyCount++,
        e.nextController = t.m_controllerList,
        e.prevController = null,
        t.m_controllerList = e,
        e.nextController && (e.nextController.prevController = e),
        t.m_controllerCount++
    }
    ,
    a.prototype.RemoveBody = function(t) {
        for (var e = t.m_controllerList; e && e.controller != this; )
            e = e.nextController;
        e.prevBody && (e.prevBody.nextBody = e.nextBody),
        e.nextBody && (e.nextBody.prevBody = e.prevBody),
        e.nextController && (e.nextController.prevController = e.prevController),
        e.prevController && (e.prevController.nextController = e.nextController),
        this.m_bodyList == e && (this.m_bodyList = e.nextBody),
        t.m_controllerList == e && (t.m_controllerList = e.nextController),
        t.m_controllerCount--,
        this.m_bodyCount--
    }
    ,
    a.prototype.Clear = function() {
        for (; this.m_bodyList; )
            this.RemoveBody(this.m_bodyList.body)
    }
    ,
    a.prototype.GetNext = function() {
        return this.m_next
    }
    ,
    a.prototype.GetWorld = function() {
        return this.m_world
    }
    ,
    a.prototype.GetBodyList = function() {
        return this.m_bodyList
    }
    ,
    l.b2ControllerEdge = function() {}
    ,
    Box2D.inherit(m, Box2D.Dynamics.Controllers.b2Controller),
    m.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype,
    m.b2GravityController = function() {
        Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments),
        this.G = 1,
        this.invSqr = !0
    }
    ,
    m.prototype.Step = function() {
        var t = null
          , e = null
          , o = null
          , n = 0
          , s = null
          , r = null
          , a = null
          , l = 0
          , m = 0
          , c = 0
          , h = null;
        if (this.invSqr)
            for (t = this.m_bodyList; t; t = t.nextBody)
                for (e = t.body,
                o = e.GetWorldCenter(),
                n = e.GetMass(),
                s = this.m_bodyList; s != t; s = s.nextBody)
                    r = s.body,
                    a = r.GetWorldCenter(),
                    l = a.x - o.x,
                    m = a.y - o.y,
                    c = l * l + m * m,
                    c < Number.MIN_VALUE || (h = new i(l,m),
                    h.Multiply(this.G / c / Math.sqrt(c) * n * r.GetMass()),
                    e.IsAwake() && e.ApplyForce(h, o),
                    h.Multiply(-1),
                    r.IsAwake() && r.ApplyForce(h, a));
        else
            for (t = this.m_bodyList; t; t = t.nextBody)
                for (e = t.body,
                o = e.GetWorldCenter(),
                n = e.GetMass(),
                s = this.m_bodyList; s != t; s = s.nextBody)
                    r = s.body,
                    a = r.GetWorldCenter(),
                    l = a.x - o.x,
                    m = a.y - o.y,
                    c = l * l + m * m,
                    c < Number.MIN_VALUE || (h = new i(l,m),
                    h.Multiply(this.G / c * n * r.GetMass()),
                    e.IsAwake() && e.ApplyForce(h, o),
                    h.Multiply(-1),
                    r.IsAwake() && r.ApplyForce(h, a))
    }
    ,
    Box2D.inherit(c, Box2D.Dynamics.Controllers.b2Controller),
    c.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype,
    c.b2TensorDampingController = function() {
        Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments),
        this.T = new t,
        this.maxTimestep = 0
    }
    ,
    c.prototype.SetAxisAligned = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        this.T.col1.x = -t,
        this.T.col1.y = 0,
        this.T.col2.x = 0,
        this.T.col2.y = -e,
        t > 0 || e > 0 ? this.maxTimestep = 1 / Math.max(t, e) : this.maxTimestep = 0
    }
    ,
    c.prototype.Step = function(t) {
        var o = t.dt;
        if (!(o <= Number.MIN_VALUE)) {
            o > this.maxTimestep && this.maxTimestep > 0 && (o = this.maxTimestep);
            for (var n = this.m_bodyList; n; n = n.nextBody) {
                var s = n.body;
                if (s.IsAwake()) {
                    var r = s.GetWorldVector(e.MulMV(this.T, s.GetLocalVector(s.GetLinearVelocity())));
                    s.SetLinearVelocity(new i(s.GetLinearVelocity().x + r.x * o,s.GetLinearVelocity().y + r.y * o))
                }
            }
        }
    }
}(),
function() {
    var t = (Box2D.Common.b2Color,
    Box2D.Common.b2internal,
    Box2D.Common.b2Settings)
      , e = Box2D.Common.Math.b2Mat22
      , i = Box2D.Common.Math.b2Mat33
      , o = Box2D.Common.Math.b2Math
      , n = (Box2D.Common.Math.b2Sweep,
    Box2D.Common.Math.b2Transform,
    Box2D.Common.Math.b2Vec2)
      , s = Box2D.Common.Math.b2Vec3
      , r = Box2D.Dynamics.Joints.b2DistanceJoint
      , a = Box2D.Dynamics.Joints.b2DistanceJointDef
      , l = Box2D.Dynamics.Joints.b2FrictionJoint
      , m = Box2D.Dynamics.Joints.b2FrictionJointDef
      , c = Box2D.Dynamics.Joints.b2GearJoint
      , h = Box2D.Dynamics.Joints.b2GearJointDef
      , u = Box2D.Dynamics.Joints.b2Jacobian
      , p = Box2D.Dynamics.Joints.b2Joint
      , y = Box2D.Dynamics.Joints.b2JointDef
      , _ = Box2D.Dynamics.Joints.b2JointEdge
      , d = Box2D.Dynamics.Joints.b2LineJoint
      , f = Box2D.Dynamics.Joints.b2LineJointDef
      , x = Box2D.Dynamics.Joints.b2MouseJoint
      , b = Box2D.Dynamics.Joints.b2MouseJointDef
      , v = Box2D.Dynamics.Joints.b2PrismaticJoint
      , g = Box2D.Dynamics.Joints.b2PrismaticJointDef
      , D = Box2D.Dynamics.Joints.b2PulleyJoint
      , C = Box2D.Dynamics.Joints.b2PulleyJointDef
      , B = Box2D.Dynamics.Joints.b2RevoluteJoint
      , w = Box2D.Dynamics.Joints.b2RevoluteJointDef
      , A = Box2D.Dynamics.Joints.b2WeldJoint
      , S = Box2D.Dynamics.Joints.b2WeldJointDef;
    Box2D.Dynamics.b2Body,
    Box2D.Dynamics.b2BodyDef,
    Box2D.Dynamics.b2ContactFilter,
    Box2D.Dynamics.b2ContactImpulse,
    Box2D.Dynamics.b2ContactListener,
    Box2D.Dynamics.b2ContactManager,
    Box2D.Dynamics.b2DebugDraw,
    Box2D.Dynamics.b2DestructionListener,
    Box2D.Dynamics.b2FilterData,
    Box2D.Dynamics.b2Fixture,
    Box2D.Dynamics.b2FixtureDef,
    Box2D.Dynamics.b2Island,
    Box2D.Dynamics.b2TimeStep,
    Box2D.Dynamics.b2World,
    Box2D.inherit(r, Box2D.Dynamics.Joints.b2Joint),
    r.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype,
    r.b2DistanceJoint = function() {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments),
        this.m_localAnchor1 = new n,
        this.m_localAnchor2 = new n,
        this.m_u = new n
    }
    ,
    r.prototype.GetAnchorA = function() {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1)
    }
    ,
    r.prototype.GetAnchorB = function() {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2)
    }
    ,
    r.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        new n(t * this.m_impulse * this.m_u.x,t * this.m_impulse * this.m_u.y)
    }
    ,
    r.prototype.GetReactionTorque = function(t) {
        return void 0 === t && (t = 0),
        0
    }
    ,
    r.prototype.GetLength = function() {
        return this.m_length
    }
    ,
    r.prototype.SetLength = function(t) {
        void 0 === t && (t = 0),
        this.m_length = t
    }
    ,
    r.prototype.GetFrequency = function() {
        return this.m_frequencyHz
    }
    ,
    r.prototype.SetFrequency = function(t) {
        void 0 === t && (t = 0),
        this.m_frequencyHz = t
    }
    ,
    r.prototype.GetDampingRatio = function() {
        return this.m_dampingRatio
    }
    ,
    r.prototype.SetDampingRatio = function(t) {
        void 0 === t && (t = 0),
        this.m_dampingRatio = t
    }
    ,
    r.prototype.b2DistanceJoint = function(t) {
        this.__super.b2Joint.call(this, t),
        this.m_localAnchor1.SetV(t.localAnchorA),
        this.m_localAnchor2.SetV(t.localAnchorB),
        this.m_length = t.length,
        this.m_frequencyHz = t.frequencyHz,
        this.m_dampingRatio = t.dampingRatio,
        this.m_impulse = 0,
        this.m_gamma = 0,
        this.m_bias = 0
    }
    ,
    r.prototype.InitVelocityConstraints = function(e) {
        var i, o = 0, n = this.m_bodyA, s = this.m_bodyB;
        i = n.m_xf.R;
        var r = this.m_localAnchor1.x - n.m_sweep.localCenter.x
          , a = this.m_localAnchor1.y - n.m_sweep.localCenter.y;
        o = i.col1.x * r + i.col2.x * a,
        a = i.col1.y * r + i.col2.y * a,
        r = o,
        i = s.m_xf.R;
        var l = this.m_localAnchor2.x - s.m_sweep.localCenter.x
          , m = this.m_localAnchor2.y - s.m_sweep.localCenter.y;
        o = i.col1.x * l + i.col2.x * m,
        m = i.col1.y * l + i.col2.y * m,
        l = o,
        this.m_u.x = s.m_sweep.c.x + l - n.m_sweep.c.x - r,
        this.m_u.y = s.m_sweep.c.y + m - n.m_sweep.c.y - a;
        var c = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
        c > t.b2_linearSlop ? this.m_u.Multiply(1 / c) : this.m_u.SetZero();
        var h = r * this.m_u.y - a * this.m_u.x
          , u = l * this.m_u.y - m * this.m_u.x
          , p = n.m_invMass + n.m_invI * h * h + s.m_invMass + s.m_invI * u * u;
        if (this.m_mass = 0 != p ? 1 / p : 0,
        this.m_frequencyHz > 0) {
            var y = c - this.m_length
              , _ = 2 * Math.PI * this.m_frequencyHz
              , d = 2 * this.m_mass * this.m_dampingRatio * _
              , f = this.m_mass * _ * _;
            this.m_gamma = e.dt * (d + e.dt * f),
            this.m_gamma = 0 != this.m_gamma ? 1 / this.m_gamma : 0,
            this.m_bias = y * e.dt * f * this.m_gamma,
            this.m_mass = p + this.m_gamma,
            this.m_mass = 0 != this.m_mass ? 1 / this.m_mass : 0
        }
        if (e.warmStarting) {
            this.m_impulse *= e.dtRatio;
            var x = this.m_impulse * this.m_u.x
              , b = this.m_impulse * this.m_u.y;
            n.m_linearVelocity.x -= n.m_invMass * x,
            n.m_linearVelocity.y -= n.m_invMass * b,
            n.m_angularVelocity -= n.m_invI * (r * b - a * x),
            s.m_linearVelocity.x += s.m_invMass * x,
            s.m_linearVelocity.y += s.m_invMass * b,
            s.m_angularVelocity += s.m_invI * (l * b - m * x)
        } else
            this.m_impulse = 0
    }
    ,
    r.prototype.SolveVelocityConstraints = function() {
        var t, e = this.m_bodyA, i = this.m_bodyB;
        t = e.m_xf.R;
        var o = this.m_localAnchor1.x - e.m_sweep.localCenter.x
          , n = this.m_localAnchor1.y - e.m_sweep.localCenter.y
          , s = t.col1.x * o + t.col2.x * n;
        n = t.col1.y * o + t.col2.y * n,
        o = s,
        t = i.m_xf.R;
        var r = this.m_localAnchor2.x - i.m_sweep.localCenter.x
          , a = this.m_localAnchor2.y - i.m_sweep.localCenter.y;
        s = t.col1.x * r + t.col2.x * a,
        a = t.col1.y * r + t.col2.y * a,
        r = s;
        var l = e.m_linearVelocity.x + -e.m_angularVelocity * n
          , m = e.m_linearVelocity.y + e.m_angularVelocity * o
          , c = i.m_linearVelocity.x + -i.m_angularVelocity * a
          , h = i.m_linearVelocity.y + i.m_angularVelocity * r
          , u = this.m_u.x * (c - l) + this.m_u.y * (h - m)
          , p = -this.m_mass * (u + this.m_bias + this.m_gamma * this.m_impulse);
        this.m_impulse += p;
        var y = p * this.m_u.x
          , _ = p * this.m_u.y;
        e.m_linearVelocity.x -= e.m_invMass * y,
        e.m_linearVelocity.y -= e.m_invMass * _,
        e.m_angularVelocity -= e.m_invI * (o * _ - n * y),
        i.m_linearVelocity.x += i.m_invMass * y,
        i.m_linearVelocity.y += i.m_invMass * _,
        i.m_angularVelocity += i.m_invI * (r * _ - a * y)
    }
    ,
    r.prototype.SolvePositionConstraints = function(e) {
        void 0 === e && (e = 0);
        var i;
        if (this.m_frequencyHz > 0)
            return !0;
        var n = this.m_bodyA
          , s = this.m_bodyB;
        i = n.m_xf.R;
        var r = this.m_localAnchor1.x - n.m_sweep.localCenter.x
          , a = this.m_localAnchor1.y - n.m_sweep.localCenter.y
          , l = i.col1.x * r + i.col2.x * a;
        a = i.col1.y * r + i.col2.y * a,
        r = l,
        i = s.m_xf.R;
        var m = this.m_localAnchor2.x - s.m_sweep.localCenter.x
          , c = this.m_localAnchor2.y - s.m_sweep.localCenter.y;
        l = i.col1.x * m + i.col2.x * c,
        c = i.col1.y * m + i.col2.y * c,
        m = l;
        var h = s.m_sweep.c.x + m - n.m_sweep.c.x - r
          , u = s.m_sweep.c.y + c - n.m_sweep.c.y - a
          , p = Math.sqrt(h * h + u * u);
        h /= p,
        u /= p;
        var y = p - this.m_length;
        y = o.Clamp(y, -t.b2_maxLinearCorrection, t.b2_maxLinearCorrection);
        var _ = -this.m_mass * y;
        this.m_u.Set(h, u);
        var d = _ * this.m_u.x
          , f = _ * this.m_u.y;
        return n.m_sweep.c.x -= n.m_invMass * d,
        n.m_sweep.c.y -= n.m_invMass * f,
        n.m_sweep.a -= n.m_invI * (r * f - a * d),
        s.m_sweep.c.x += s.m_invMass * d,
        s.m_sweep.c.y += s.m_invMass * f,
        s.m_sweep.a += s.m_invI * (m * f - c * d),
        n.SynchronizeTransform(),
        s.SynchronizeTransform(),
        o.Abs(y) < t.b2_linearSlop
    }
    ,
    Box2D.inherit(a, Box2D.Dynamics.Joints.b2JointDef),
    a.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype,
    a.b2DistanceJointDef = function() {
        Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments),
        this.localAnchorA = new n,
        this.localAnchorB = new n
    }
    ,
    a.prototype.b2DistanceJointDef = function() {
        this.__super.b2JointDef.call(this),
        this.type = p.e_distanceJoint,
        this.length = 1,
        this.frequencyHz = 0,
        this.dampingRatio = 0
    }
    ,
    a.prototype.Initialize = function(t, e, i, o) {
        this.bodyA = t,
        this.bodyB = e,
        this.localAnchorA.SetV(this.bodyA.GetLocalPoint(i)),
        this.localAnchorB.SetV(this.bodyB.GetLocalPoint(o));
        var n = o.x - i.x
          , s = o.y - i.y;
        this.length = Math.sqrt(n * n + s * s),
        this.frequencyHz = 0,
        this.dampingRatio = 0
    }
    ,
    Box2D.inherit(l, Box2D.Dynamics.Joints.b2Joint),
    l.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype,
    l.b2FrictionJoint = function() {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments),
        this.m_localAnchorA = new n,
        this.m_localAnchorB = new n,
        this.m_linearMass = new e,
        this.m_linearImpulse = new n
    }
    ,
    l.prototype.GetAnchorA = function() {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA)
    }
    ,
    l.prototype.GetAnchorB = function() {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB)
    }
    ,
    l.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        new n(t * this.m_linearImpulse.x,t * this.m_linearImpulse.y)
    }
    ,
    l.prototype.GetReactionTorque = function(t) {
        return void 0 === t && (t = 0),
        t * this.m_angularImpulse
    }
    ,
    l.prototype.SetMaxForce = function(t) {
        void 0 === t && (t = 0),
        this.m_maxForce = t
    }
    ,
    l.prototype.GetMaxForce = function() {
        return this.m_maxForce
    }
    ,
    l.prototype.SetMaxTorque = function(t) {
        void 0 === t && (t = 0),
        this.m_maxTorque = t
    }
    ,
    l.prototype.GetMaxTorque = function() {
        return this.m_maxTorque
    }
    ,
    l.prototype.b2FrictionJoint = function(t) {
        this.__super.b2Joint.call(this, t),
        this.m_localAnchorA.SetV(t.localAnchorA),
        this.m_localAnchorB.SetV(t.localAnchorB),
        this.m_linearMass.SetZero(),
        this.m_angularMass = 0,
        this.m_linearImpulse.SetZero(),
        this.m_angularImpulse = 0,
        this.m_maxForce = t.maxForce,
        this.m_maxTorque = t.maxTorque
    }
    ,
    l.prototype.InitVelocityConstraints = function(t) {
        var i, o = 0, n = this.m_bodyA, s = this.m_bodyB;
        i = n.m_xf.R;
        var r = this.m_localAnchorA.x - n.m_sweep.localCenter.x
          , a = this.m_localAnchorA.y - n.m_sweep.localCenter.y;
        o = i.col1.x * r + i.col2.x * a,
        a = i.col1.y * r + i.col2.y * a,
        r = o,
        i = s.m_xf.R;
        var l = this.m_localAnchorB.x - s.m_sweep.localCenter.x
          , m = this.m_localAnchorB.y - s.m_sweep.localCenter.y;
        o = i.col1.x * l + i.col2.x * m,
        m = i.col1.y * l + i.col2.y * m,
        l = o;
        var c = n.m_invMass
          , h = s.m_invMass
          , u = n.m_invI
          , p = s.m_invI
          , y = new e;
        if (y.col1.x = c + h,
        y.col2.x = 0,
        y.col1.y = 0,
        y.col2.y = c + h,
        y.col1.x += u * a * a,
        y.col2.x += -u * r * a,
        y.col1.y += -u * r * a,
        y.col2.y += u * r * r,
        y.col1.x += p * m * m,
        y.col2.x += -p * l * m,
        y.col1.y += -p * l * m,
        y.col2.y += p * l * l,
        y.GetInverse(this.m_linearMass),
        this.m_angularMass = u + p,
        this.m_angularMass > 0 && (this.m_angularMass = 1 / this.m_angularMass),
        t.warmStarting) {
            this.m_linearImpulse.x *= t.dtRatio,
            this.m_linearImpulse.y *= t.dtRatio,
            this.m_angularImpulse *= t.dtRatio;
            var _ = this.m_linearImpulse;
            n.m_linearVelocity.x -= c * _.x,
            n.m_linearVelocity.y -= c * _.y,
            n.m_angularVelocity -= u * (r * _.y - a * _.x + this.m_angularImpulse),
            s.m_linearVelocity.x += h * _.x,
            s.m_linearVelocity.y += h * _.y,
            s.m_angularVelocity += p * (l * _.y - m * _.x + this.m_angularImpulse)
        } else
            this.m_linearImpulse.SetZero(),
            this.m_angularImpulse = 0
    }
    ,
    l.prototype.SolveVelocityConstraints = function(t) {
        var e, i = 0, s = this.m_bodyA, r = this.m_bodyB, a = s.m_linearVelocity, l = s.m_angularVelocity, m = r.m_linearVelocity, c = r.m_angularVelocity, h = s.m_invMass, u = r.m_invMass, p = s.m_invI, y = r.m_invI;
        e = s.m_xf.R;
        var _ = this.m_localAnchorA.x - s.m_sweep.localCenter.x
          , d = this.m_localAnchorA.y - s.m_sweep.localCenter.y;
        i = e.col1.x * _ + e.col2.x * d,
        d = e.col1.y * _ + e.col2.y * d,
        _ = i,
        e = r.m_xf.R;
        var f = this.m_localAnchorB.x - r.m_sweep.localCenter.x
          , x = this.m_localAnchorB.y - r.m_sweep.localCenter.y;
        i = e.col1.x * f + e.col2.x * x,
        x = e.col1.y * f + e.col2.y * x,
        f = i;
        var b = 0
          , v = c - l
          , g = -this.m_angularMass * v
          , D = this.m_angularImpulse;
        b = t.dt * this.m_maxTorque,
        this.m_angularImpulse = o.Clamp(this.m_angularImpulse + g, -b, b),
        g = this.m_angularImpulse - D,
        l -= p * g,
        c += y * g;
        var C = m.x - c * x - a.x + l * d
          , B = m.y + c * f - a.y - l * _
          , w = o.MulMV(this.m_linearMass, new n(-C,-B))
          , A = this.m_linearImpulse.Copy();
        this.m_linearImpulse.Add(w),
        b = t.dt * this.m_maxForce,
        this.m_linearImpulse.LengthSquared() > b * b && (this.m_linearImpulse.Normalize(),
        this.m_linearImpulse.Multiply(b)),
        w = o.SubtractVV(this.m_linearImpulse, A),
        a.x -= h * w.x,
        a.y -= h * w.y,
        l -= p * (_ * w.y - d * w.x),
        m.x += u * w.x,
        m.y += u * w.y,
        c += y * (f * w.y - x * w.x),
        s.m_angularVelocity = l,
        r.m_angularVelocity = c
    }
    ,
    l.prototype.SolvePositionConstraints = function(t) {
        return void 0 === t && (t = 0),
        !0
    }
    ,
    Box2D.inherit(m, Box2D.Dynamics.Joints.b2JointDef),
    m.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype,
    m.b2FrictionJointDef = function() {
        Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments),
        this.localAnchorA = new n,
        this.localAnchorB = new n
    }
    ,
    m.prototype.b2FrictionJointDef = function() {
        this.__super.b2JointDef.call(this),
        this.type = p.e_frictionJoint,
        this.maxForce = 0,
        this.maxTorque = 0
    }
    ,
    m.prototype.Initialize = function(t, e, i) {
        this.bodyA = t,
        this.bodyB = e,
        this.localAnchorA.SetV(this.bodyA.GetLocalPoint(i)),
        this.localAnchorB.SetV(this.bodyB.GetLocalPoint(i))
    }
    ,
    Box2D.inherit(c, Box2D.Dynamics.Joints.b2Joint),
    c.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype,
    c.b2GearJoint = function() {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments),
        this.m_groundAnchor1 = new n,
        this.m_groundAnchor2 = new n,
        this.m_localAnchor1 = new n,
        this.m_localAnchor2 = new n,
        this.m_J = new u
    }
    ,
    c.prototype.GetAnchorA = function() {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1)
    }
    ,
    c.prototype.GetAnchorB = function() {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2)
    }
    ,
    c.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        new n(t * this.m_impulse * this.m_J.linearB.x,t * this.m_impulse * this.m_J.linearB.y)
    }
    ,
    c.prototype.GetReactionTorque = function(t) {
        void 0 === t && (t = 0);
        var e = this.m_bodyB.m_xf.R
          , i = this.m_localAnchor1.x - this.m_bodyB.m_sweep.localCenter.x
          , o = this.m_localAnchor1.y - this.m_bodyB.m_sweep.localCenter.y
          , n = e.col1.x * i + e.col2.x * o;
        o = e.col1.y * i + e.col2.y * o,
        i = n;
        var s = this.m_impulse * this.m_J.linearB.x
          , r = this.m_impulse * this.m_J.linearB.y;
        return t * (this.m_impulse * this.m_J.angularB - i * r + o * s)
    }
    ,
    c.prototype.GetRatio = function() {
        return this.m_ratio
    }
    ,
    c.prototype.SetRatio = function(t) {
        void 0 === t && (t = 0),
        this.m_ratio = t
    }
    ,
    c.prototype.b2GearJoint = function(t) {
        this.__super.b2Joint.call(this, t);
        var e = parseInt(t.joint1.m_type)
          , i = parseInt(t.joint2.m_type);
        this.m_revolute1 = null,
        this.m_prismatic1 = null,
        this.m_revolute2 = null,
        this.m_prismatic2 = null;
        var o = 0
          , n = 0;
        this.m_ground1 = t.joint1.GetBodyA(),
        this.m_bodyA = t.joint1.GetBodyB(),
        e == p.e_revoluteJoint ? (this.m_revolute1 = t.joint1 instanceof B ? t.joint1 : null,
        this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1),
        this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2),
        o = this.m_revolute1.GetJointAngle()) : (this.m_prismatic1 = t.joint1 instanceof v ? t.joint1 : null,
        this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1),
        this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2),
        o = this.m_prismatic1.GetJointTranslation()),
        this.m_ground2 = t.joint2.GetBodyA(),
        this.m_bodyB = t.joint2.GetBodyB(),
        i == p.e_revoluteJoint ? (this.m_revolute2 = t.joint2 instanceof B ? t.joint2 : null,
        this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1),
        this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2),
        n = this.m_revolute2.GetJointAngle()) : (this.m_prismatic2 = t.joint2 instanceof v ? t.joint2 : null,
        this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1),
        this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2),
        n = this.m_prismatic2.GetJointTranslation()),
        this.m_ratio = t.ratio,
        this.m_constant = o + this.m_ratio * n,
        this.m_impulse = 0
    }
    ,
    c.prototype.InitVelocityConstraints = function(t) {
        var e, i, o = this.m_ground1, n = this.m_ground2, s = this.m_bodyA, r = this.m_bodyB, a = 0, l = 0, m = 0, c = 0, h = 0, u = 0, p = 0;
        this.m_J.SetZero(),
        this.m_revolute1 ? (this.m_J.angularA = -1,
        p += s.m_invI) : (e = o.m_xf.R,
        i = this.m_prismatic1.m_localXAxis1,
        a = e.col1.x * i.x + e.col2.x * i.y,
        l = e.col1.y * i.x + e.col2.y * i.y,
        e = s.m_xf.R,
        m = this.m_localAnchor1.x - s.m_sweep.localCenter.x,
        c = this.m_localAnchor1.y - s.m_sweep.localCenter.y,
        u = e.col1.x * m + e.col2.x * c,
        c = e.col1.y * m + e.col2.y * c,
        m = u,
        h = m * l - c * a,
        this.m_J.linearA.Set(-a, -l),
        this.m_J.angularA = -h,
        p += s.m_invMass + s.m_invI * h * h),
        this.m_revolute2 ? (this.m_J.angularB = -this.m_ratio,
        p += this.m_ratio * this.m_ratio * r.m_invI) : (e = n.m_xf.R,
        i = this.m_prismatic2.m_localXAxis1,
        a = e.col1.x * i.x + e.col2.x * i.y,
        l = e.col1.y * i.x + e.col2.y * i.y,
        e = r.m_xf.R,
        m = this.m_localAnchor2.x - r.m_sweep.localCenter.x,
        c = this.m_localAnchor2.y - r.m_sweep.localCenter.y,
        u = e.col1.x * m + e.col2.x * c,
        c = e.col1.y * m + e.col2.y * c,
        m = u,
        h = m * l - c * a,
        this.m_J.linearB.Set(-this.m_ratio * a, -this.m_ratio * l),
        this.m_J.angularB = -this.m_ratio * h,
        p += this.m_ratio * this.m_ratio * (r.m_invMass + r.m_invI * h * h)),
        this.m_mass = p > 0 ? 1 / p : 0,
        t.warmStarting ? (s.m_linearVelocity.x += s.m_invMass * this.m_impulse * this.m_J.linearA.x,
        s.m_linearVelocity.y += s.m_invMass * this.m_impulse * this.m_J.linearA.y,
        s.m_angularVelocity += s.m_invI * this.m_impulse * this.m_J.angularA,
        r.m_linearVelocity.x += r.m_invMass * this.m_impulse * this.m_J.linearB.x,
        r.m_linearVelocity.y += r.m_invMass * this.m_impulse * this.m_J.linearB.y,
        r.m_angularVelocity += r.m_invI * this.m_impulse * this.m_J.angularB) : this.m_impulse = 0
    }
    ,
    c.prototype.SolveVelocityConstraints = function() {
        var t = this.m_bodyA
          , e = this.m_bodyB
          , i = this.m_J.Compute(t.m_linearVelocity, t.m_angularVelocity, e.m_linearVelocity, e.m_angularVelocity)
          , o = -this.m_mass * i;
        this.m_impulse += o,
        t.m_linearVelocity.x += t.m_invMass * o * this.m_J.linearA.x,
        t.m_linearVelocity.y += t.m_invMass * o * this.m_J.linearA.y,
        t.m_angularVelocity += t.m_invI * o * this.m_J.angularA,
        e.m_linearVelocity.x += e.m_invMass * o * this.m_J.linearB.x,
        e.m_linearVelocity.y += e.m_invMass * o * this.m_J.linearB.y,
        e.m_angularVelocity += e.m_invI * o * this.m_J.angularB
    }
    ,
    c.prototype.SolvePositionConstraints = function(e) {
        void 0 === e && (e = 0);
        var i = 0
          , o = this.m_bodyA
          , n = this.m_bodyB
          , s = 0
          , r = 0;
        s = this.m_revolute1 ? this.m_revolute1.GetJointAngle() : this.m_prismatic1.GetJointTranslation(),
        r = this.m_revolute2 ? this.m_revolute2.GetJointAngle() : this.m_prismatic2.GetJointTranslation();
        var a = this.m_constant - (s + this.m_ratio * r)
          , l = -this.m_mass * a;
        return o.m_sweep.c.x += o.m_invMass * l * this.m_J.linearA.x,
        o.m_sweep.c.y += o.m_invMass * l * this.m_J.linearA.y,
        o.m_sweep.a += o.m_invI * l * this.m_J.angularA,
        n.m_sweep.c.x += n.m_invMass * l * this.m_J.linearB.x,
        n.m_sweep.c.y += n.m_invMass * l * this.m_J.linearB.y,
        n.m_sweep.a += n.m_invI * l * this.m_J.angularB,
        o.SynchronizeTransform(),
        n.SynchronizeTransform(),
        i < t.b2_linearSlop
    }
    ,
    Box2D.inherit(h, Box2D.Dynamics.Joints.b2JointDef),
    h.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype,
    h.b2GearJointDef = function() {
        Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments)
    }
    ,
    h.prototype.b2GearJointDef = function() {
        this.__super.b2JointDef.call(this),
        this.type = p.e_gearJoint,
        this.joint1 = null,
        this.joint2 = null,
        this.ratio = 1
    }
    ,
    u.b2Jacobian = function() {
        this.linearA = new n,
        this.linearB = new n
    }
    ,
    u.prototype.SetZero = function() {
        this.linearA.SetZero(),
        this.angularA = 0,
        this.linearB.SetZero(),
        this.angularB = 0
    }
    ,
    u.prototype.Set = function(t, e, i, o) {
        void 0 === e && (e = 0),
        void 0 === o && (o = 0),
        this.linearA.SetV(t),
        this.angularA = e,
        this.linearB.SetV(i),
        this.angularB = o
    }
    ,
    u.prototype.Compute = function(t, e, i, o) {
        return void 0 === e && (e = 0),
        void 0 === o && (o = 0),
        this.linearA.x * t.x + this.linearA.y * t.y + this.angularA * e + (this.linearB.x * i.x + this.linearB.y * i.y) + this.angularB * o
    }
    ,
    p.b2Joint = function() {
        this.m_edgeA = new _,
        this.m_edgeB = new _,
        this.m_localCenterA = new n,
        this.m_localCenterB = new n
    }
    ,
    p.prototype.GetType = function() {
        return this.m_type
    }
    ,
    p.prototype.GetAnchorA = function() {
        return null
    }
    ,
    p.prototype.GetAnchorB = function() {
        return null
    }
    ,
    p.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        null
    }
    ,
    p.prototype.GetReactionTorque = function(t) {
        return void 0 === t && (t = 0),
        0
    }
    ,
    p.prototype.GetBodyA = function() {
        return this.m_bodyA
    }
    ,
    p.prototype.GetBodyB = function() {
        return this.m_bodyB
    }
    ,
    p.prototype.GetNext = function() {
        return this.m_next
    }
    ,
    p.prototype.GetUserData = function() {
        return this.m_userData
    }
    ,
    p.prototype.SetUserData = function(t) {
        this.m_userData = t
    }
    ,
    p.prototype.IsActive = function() {
        return this.m_bodyA.IsActive() && this.m_bodyB.IsActive()
    }
    ,
    p.Create = function(t) {
        var e = null;
        switch (t.type) {
        case p.e_distanceJoint:
            e = new r(t instanceof a ? t : null);
            break;
        case p.e_mouseJoint:
            e = new x(t instanceof b ? t : null);
            break;
        case p.e_prismaticJoint:
            e = new v(t instanceof g ? t : null);
            break;
        case p.e_revoluteJoint:
            e = new B(t instanceof w ? t : null);
            break;
        case p.e_pulleyJoint:
            e = new D(t instanceof C ? t : null);
            break;
        case p.e_gearJoint:
            e = new c(t instanceof h ? t : null);
            break;
        case p.e_lineJoint:
            e = new d(t instanceof f ? t : null);
            break;
        case p.e_weldJoint:
            e = new A(t instanceof S ? t : null);
            break;
        case p.e_frictionJoint:
            e = new l(t instanceof m ? t : null)
        }
        return e
    }
    ,
    p.Destroy = function() {}
    ,
    p.prototype.b2Joint = function(e) {
        t.b2Assert(e.bodyA != e.bodyB),
        this.m_type = e.type,
        this.m_prev = null,
        this.m_next = null,
        this.m_bodyA = e.bodyA,
        this.m_bodyB = e.bodyB,
        this.m_collideConnected = e.collideConnected,
        this.m_islandFlag = !1,
        this.m_userData = e.userData
    }
    ,
    p.prototype.InitVelocityConstraints = function() {}
    ,
    p.prototype.SolveVelocityConstraints = function() {}
    ,
    p.prototype.FinalizeVelocityConstraints = function() {}
    ,
    p.prototype.SolvePositionConstraints = function(t) {
        return void 0 === t && (t = 0),
        !1
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.Joints.b2Joint.e_unknownJoint = 0,
        Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint = 1,
        Box2D.Dynamics.Joints.b2Joint.e_prismaticJoint = 2,
        Box2D.Dynamics.Joints.b2Joint.e_distanceJoint = 3,
        Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint = 4,
        Box2D.Dynamics.Joints.b2Joint.e_mouseJoint = 5,
        Box2D.Dynamics.Joints.b2Joint.e_gearJoint = 6,
        Box2D.Dynamics.Joints.b2Joint.e_lineJoint = 7,
        Box2D.Dynamics.Joints.b2Joint.e_weldJoint = 8,
        Box2D.Dynamics.Joints.b2Joint.e_frictionJoint = 9,
        Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit = 0,
        Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit = 1,
        Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit = 2,
        Box2D.Dynamics.Joints.b2Joint.e_equalLimits = 3
    }),
    y.b2JointDef = function() {}
    ,
    y.prototype.b2JointDef = function() {
        this.type = p.e_unknownJoint,
        this.userData = null,
        this.bodyA = null,
        this.bodyB = null,
        this.collideConnected = !1
    }
    ,
    _.b2JointEdge = function() {}
    ,
    Box2D.inherit(d, Box2D.Dynamics.Joints.b2Joint),
    d.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype,
    d.b2LineJoint = function() {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments),
        this.m_localAnchor1 = new n,
        this.m_localAnchor2 = new n,
        this.m_localXAxis1 = new n,
        this.m_localYAxis1 = new n,
        this.m_axis = new n,
        this.m_perp = new n,
        this.m_K = new e,
        this.m_impulse = new n
    }
    ,
    d.prototype.GetAnchorA = function() {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1)
    }
    ,
    d.prototype.GetAnchorB = function() {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2)
    }
    ,
    d.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        new n(t * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x),t * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y))
    }
    ,
    d.prototype.GetReactionTorque = function(t) {
        return void 0 === t && (t = 0),
        t * this.m_impulse.y
    }
    ,
    d.prototype.GetJointTranslation = function() {
        var t = this.m_bodyA
          , e = this.m_bodyB
          , i = t.GetWorldPoint(this.m_localAnchor1)
          , o = e.GetWorldPoint(this.m_localAnchor2)
          , n = o.x - i.x
          , s = o.y - i.y
          , r = t.GetWorldVector(this.m_localXAxis1)
          , a = r.x * n + r.y * s;
        return a
    }
    ,
    d.prototype.GetJointSpeed = function() {
        var t, e = this.m_bodyA, i = this.m_bodyB;
        t = e.m_xf.R;
        var o = this.m_localAnchor1.x - e.m_sweep.localCenter.x
          , n = this.m_localAnchor1.y - e.m_sweep.localCenter.y
          , s = t.col1.x * o + t.col2.x * n;
        n = t.col1.y * o + t.col2.y * n,
        o = s,
        t = i.m_xf.R;
        var r = this.m_localAnchor2.x - i.m_sweep.localCenter.x
          , a = this.m_localAnchor2.y - i.m_sweep.localCenter.y;
        s = t.col1.x * r + t.col2.x * a,
        a = t.col1.y * r + t.col2.y * a,
        r = s;
        var l = e.m_sweep.c.x + o
          , m = e.m_sweep.c.y + n
          , c = i.m_sweep.c.x + r
          , h = i.m_sweep.c.y + a
          , u = c - l
          , p = h - m
          , y = e.GetWorldVector(this.m_localXAxis1)
          , _ = e.m_linearVelocity
          , d = i.m_linearVelocity
          , f = e.m_angularVelocity
          , x = i.m_angularVelocity
          , b = u * (-f * y.y) + p * (f * y.x) + (y.x * (d.x + -x * a - _.x - -f * n) + y.y * (d.y + x * r - _.y - f * o));
        return b
    }
    ,
    d.prototype.IsLimitEnabled = function() {
        return this.m_enableLimit
    }
    ,
    d.prototype.EnableLimit = function(t) {
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_enableLimit = t
    }
    ,
    d.prototype.GetLowerLimit = function() {
        return this.m_lowerTranslation
    }
    ,
    d.prototype.GetUpperLimit = function() {
        return this.m_upperTranslation
    }
    ,
    d.prototype.SetLimits = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_lowerTranslation = t,
        this.m_upperTranslation = e
    }
    ,
    d.prototype.IsMotorEnabled = function() {
        return this.m_enableMotor
    }
    ,
    d.prototype.EnableMotor = function(t) {
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_enableMotor = t
    }
    ,
    d.prototype.SetMotorSpeed = function(t) {
        void 0 === t && (t = 0),
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_motorSpeed = t
    }
    ,
    d.prototype.GetMotorSpeed = function() {
        return this.m_motorSpeed
    }
    ,
    d.prototype.SetMaxMotorForce = function(t) {
        void 0 === t && (t = 0),
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_maxMotorForce = t
    }
    ,
    d.prototype.GetMaxMotorForce = function() {
        return this.m_maxMotorForce
    }
    ,
    d.prototype.GetMotorForce = function() {
        return this.m_motorImpulse
    }
    ,
    d.prototype.b2LineJoint = function(t) {
        this.__super.b2Joint.call(this, t),
        this.m_localAnchor1.SetV(t.localAnchorA),
        this.m_localAnchor2.SetV(t.localAnchorB),
        this.m_localXAxis1.SetV(t.localAxisA),
        this.m_localYAxis1.x = -this.m_localXAxis1.y,
        this.m_localYAxis1.y = this.m_localXAxis1.x,
        this.m_impulse.SetZero(),
        this.m_motorMass = 0,
        this.m_motorImpulse = 0,
        this.m_lowerTranslation = t.lowerTranslation,
        this.m_upperTranslation = t.upperTranslation,
        this.m_maxMotorForce = t.maxMotorForce,
        this.m_motorSpeed = t.motorSpeed,
        this.m_enableLimit = t.enableLimit,
        this.m_enableMotor = t.enableMotor,
        this.m_limitState = p.e_inactiveLimit,
        this.m_axis.SetZero(),
        this.m_perp.SetZero()
    }
    ,
    d.prototype.InitVelocityConstraints = function(e) {
        var i, n = this.m_bodyA, s = this.m_bodyB, r = 0;
        this.m_localCenterA.SetV(n.GetLocalCenter()),
        this.m_localCenterB.SetV(s.GetLocalCenter());
        var a = n.GetTransform();
        s.GetTransform(),
        i = n.m_xf.R;
        var l = this.m_localAnchor1.x - this.m_localCenterA.x
          , m = this.m_localAnchor1.y - this.m_localCenterA.y;
        r = i.col1.x * l + i.col2.x * m,
        m = i.col1.y * l + i.col2.y * m,
        l = r,
        i = s.m_xf.R;
        var c = this.m_localAnchor2.x - this.m_localCenterB.x
          , h = this.m_localAnchor2.y - this.m_localCenterB.y;
        r = i.col1.x * c + i.col2.x * h,
        h = i.col1.y * c + i.col2.y * h,
        c = r;
        var u = s.m_sweep.c.x + c - n.m_sweep.c.x - l
          , y = s.m_sweep.c.y + h - n.m_sweep.c.y - m;
        this.m_invMassA = n.m_invMass,
        this.m_invMassB = s.m_invMass,
        this.m_invIA = n.m_invI,
        this.m_invIB = s.m_invI,
        this.m_axis.SetV(o.MulMV(a.R, this.m_localXAxis1)),
        this.m_a1 = (u + l) * this.m_axis.y - (y + m) * this.m_axis.x,
        this.m_a2 = c * this.m_axis.y - h * this.m_axis.x,
        this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2,
        this.m_motorMass = this.m_motorMass > Number.MIN_VALUE ? 1 / this.m_motorMass : 0,
        this.m_perp.SetV(o.MulMV(a.R, this.m_localYAxis1)),
        this.m_s1 = (u + l) * this.m_perp.y - (y + m) * this.m_perp.x,
        this.m_s2 = c * this.m_perp.y - h * this.m_perp.x;
        var _ = this.m_invMassA
          , d = this.m_invMassB
          , f = this.m_invIA
          , x = this.m_invIB;
        if (this.m_K.col1.x = _ + d + f * this.m_s1 * this.m_s1 + x * this.m_s2 * this.m_s2,
        this.m_K.col1.y = f * this.m_s1 * this.m_a1 + x * this.m_s2 * this.m_a2,
        this.m_K.col2.x = this.m_K.col1.y,
        this.m_K.col2.y = _ + d + f * this.m_a1 * this.m_a1 + x * this.m_a2 * this.m_a2,
        this.m_enableLimit) {
            var b = this.m_axis.x * u + this.m_axis.y * y;
            o.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * t.b2_linearSlop ? this.m_limitState = p.e_equalLimits : b <= this.m_lowerTranslation ? this.m_limitState != p.e_atLowerLimit && (this.m_limitState = p.e_atLowerLimit,
            this.m_impulse.y = 0) : b >= this.m_upperTranslation ? this.m_limitState != p.e_atUpperLimit && (this.m_limitState = p.e_atUpperLimit,
            this.m_impulse.y = 0) : (this.m_limitState = p.e_inactiveLimit,
            this.m_impulse.y = 0)
        } else
            this.m_limitState = p.e_inactiveLimit;
        if (0 == this.m_enableMotor && (this.m_motorImpulse = 0),
        e.warmStarting) {
            this.m_impulse.x *= e.dtRatio,
            this.m_impulse.y *= e.dtRatio,
            this.m_motorImpulse *= e.dtRatio;
            var v = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x
              , g = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y
              , D = this.m_impulse.x * this.m_s1 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a1
              , C = this.m_impulse.x * this.m_s2 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a2;
            n.m_linearVelocity.x -= this.m_invMassA * v,
            n.m_linearVelocity.y -= this.m_invMassA * g,
            n.m_angularVelocity -= this.m_invIA * D,
            s.m_linearVelocity.x += this.m_invMassB * v,
            s.m_linearVelocity.y += this.m_invMassB * g,
            s.m_angularVelocity += this.m_invIB * C
        } else
            this.m_impulse.SetZero(),
            this.m_motorImpulse = 0
    }
    ,
    d.prototype.SolveVelocityConstraints = function(t) {
        var e = this.m_bodyA
          , i = this.m_bodyB
          , s = e.m_linearVelocity
          , r = e.m_angularVelocity
          , a = i.m_linearVelocity
          , l = i.m_angularVelocity
          , m = 0
          , c = 0
          , h = 0
          , u = 0;
        if (this.m_enableMotor && this.m_limitState != p.e_equalLimits) {
            var y = this.m_axis.x * (a.x - s.x) + this.m_axis.y * (a.y - s.y) + this.m_a2 * l - this.m_a1 * r
              , _ = this.m_motorMass * (this.m_motorSpeed - y)
              , d = this.m_motorImpulse
              , f = t.dt * this.m_maxMotorForce;
            this.m_motorImpulse = o.Clamp(this.m_motorImpulse + _, -f, f),
            _ = this.m_motorImpulse - d,
            m = _ * this.m_axis.x,
            c = _ * this.m_axis.y,
            h = _ * this.m_a1,
            u = _ * this.m_a2,
            s.x -= this.m_invMassA * m,
            s.y -= this.m_invMassA * c,
            r -= this.m_invIA * h,
            a.x += this.m_invMassB * m,
            a.y += this.m_invMassB * c,
            l += this.m_invIB * u
        }
        var x = this.m_perp.x * (a.x - s.x) + this.m_perp.y * (a.y - s.y) + this.m_s2 * l - this.m_s1 * r;
        if (this.m_enableLimit && this.m_limitState != p.e_inactiveLimit) {
            var b = this.m_axis.x * (a.x - s.x) + this.m_axis.y * (a.y - s.y) + this.m_a2 * l - this.m_a1 * r
              , v = this.m_impulse.Copy()
              , g = this.m_K.Solve(new n, -x, -b);
            this.m_impulse.Add(g),
            this.m_limitState == p.e_atLowerLimit ? this.m_impulse.y = o.Max(this.m_impulse.y, 0) : this.m_limitState == p.e_atUpperLimit && (this.m_impulse.y = o.Min(this.m_impulse.y, 0));
            var D = -x - (this.m_impulse.y - v.y) * this.m_K.col2.x
              , C = 0;
            C = 0 != this.m_K.col1.x ? D / this.m_K.col1.x + v.x : v.x,
            this.m_impulse.x = C,
            g.x = this.m_impulse.x - v.x,
            g.y = this.m_impulse.y - v.y,
            m = g.x * this.m_perp.x + g.y * this.m_axis.x,
            c = g.x * this.m_perp.y + g.y * this.m_axis.y,
            h = g.x * this.m_s1 + g.y * this.m_a1,
            u = g.x * this.m_s2 + g.y * this.m_a2,
            s.x -= this.m_invMassA * m,
            s.y -= this.m_invMassA * c,
            r -= this.m_invIA * h,
            a.x += this.m_invMassB * m,
            a.y += this.m_invMassB * c,
            l += this.m_invIB * u
        } else {
            var B = 0;
            B = 0 != this.m_K.col1.x ? -x / this.m_K.col1.x : 0,
            this.m_impulse.x += B,
            m = B * this.m_perp.x,
            c = B * this.m_perp.y,
            h = B * this.m_s1,
            u = B * this.m_s2,
            s.x -= this.m_invMassA * m,
            s.y -= this.m_invMassA * c,
            r -= this.m_invIA * h,
            a.x += this.m_invMassB * m,
            a.y += this.m_invMassB * c,
            l += this.m_invIB * u
        }
        e.m_linearVelocity.SetV(s),
        e.m_angularVelocity = r,
        i.m_linearVelocity.SetV(a),
        i.m_angularVelocity = l
    }
    ,
    d.prototype.SolvePositionConstraints = function(i) {
        void 0 === i && (i = 0);
        var s, r = this.m_bodyA, a = this.m_bodyB, l = r.m_sweep.c, m = r.m_sweep.a, c = a.m_sweep.c, h = a.m_sweep.a, u = 0, p = 0, y = 0, _ = 0, d = 0, f = 0, x = 0, b = !1, v = 0, g = e.FromAngle(m), D = e.FromAngle(h);
        s = g;
        var C = this.m_localAnchor1.x - this.m_localCenterA.x
          , B = this.m_localAnchor1.y - this.m_localCenterA.y;
        u = s.col1.x * C + s.col2.x * B,
        B = s.col1.y * C + s.col2.y * B,
        C = u,
        s = D;
        var w = this.m_localAnchor2.x - this.m_localCenterB.x
          , A = this.m_localAnchor2.y - this.m_localCenterB.y;
        u = s.col1.x * w + s.col2.x * A,
        A = s.col1.y * w + s.col2.y * A,
        w = u;
        var S = c.x + w - l.x - C
          , M = c.y + A - l.y - B;
        if (this.m_enableLimit) {
            this.m_axis = o.MulMV(g, this.m_localXAxis1),
            this.m_a1 = (S + C) * this.m_axis.y - (M + B) * this.m_axis.x,
            this.m_a2 = w * this.m_axis.y - A * this.m_axis.x;
            var V = this.m_axis.x * S + this.m_axis.y * M;
            o.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * t.b2_linearSlop ? (v = o.Clamp(V, -t.b2_maxLinearCorrection, t.b2_maxLinearCorrection),
            f = o.Abs(V),
            b = !0) : V <= this.m_lowerTranslation ? (v = o.Clamp(V - this.m_lowerTranslation + t.b2_linearSlop, -t.b2_maxLinearCorrection, 0),
            f = this.m_lowerTranslation - V,
            b = !0) : V >= this.m_upperTranslation && (v = o.Clamp(V - this.m_upperTranslation + t.b2_linearSlop, 0, t.b2_maxLinearCorrection),
            f = V - this.m_upperTranslation,
            b = !0)
        }
        this.m_perp = o.MulMV(g, this.m_localYAxis1),
        this.m_s1 = (S + C) * this.m_perp.y - (M + B) * this.m_perp.x,
        this.m_s2 = w * this.m_perp.y - A * this.m_perp.x;
        var I = new n
          , T = this.m_perp.x * S + this.m_perp.y * M;
        if (f = o.Max(f, o.Abs(T)),
        x = 0,
        b)
            p = this.m_invMassA,
            y = this.m_invMassB,
            _ = this.m_invIA,
            d = this.m_invIB,
            this.m_K.col1.x = p + y + _ * this.m_s1 * this.m_s1 + d * this.m_s2 * this.m_s2,
            this.m_K.col1.y = _ * this.m_s1 * this.m_a1 + d * this.m_s2 * this.m_a2,
            this.m_K.col2.x = this.m_K.col1.y,
            this.m_K.col2.y = p + y + _ * this.m_a1 * this.m_a1 + d * this.m_a2 * this.m_a2,
            this.m_K.Solve(I, -T, -v);
        else {
            p = this.m_invMassA,
            y = this.m_invMassB,
            _ = this.m_invIA,
            d = this.m_invIB;
            var L = p + y + _ * this.m_s1 * this.m_s1 + d * this.m_s2 * this.m_s2
              , G = 0;
            G = 0 != L ? -T / L : 0,
            I.x = G,
            I.y = 0
        }
        var F = I.x * this.m_perp.x + I.y * this.m_axis.x
          , P = I.x * this.m_perp.y + I.y * this.m_axis.y
          , J = I.x * this.m_s1 + I.y * this.m_a1
          , E = I.x * this.m_s2 + I.y * this.m_a2;
        return l.x -= this.m_invMassA * F,
        l.y -= this.m_invMassA * P,
        m -= this.m_invIA * J,
        c.x += this.m_invMassB * F,
        c.y += this.m_invMassB * P,
        h += this.m_invIB * E,
        r.m_sweep.a = m,
        a.m_sweep.a = h,
        r.SynchronizeTransform(),
        a.SynchronizeTransform(),
        f <= t.b2_linearSlop && x <= t.b2_angularSlop
    }
    ,
    Box2D.inherit(f, Box2D.Dynamics.Joints.b2JointDef),
    f.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype,
    f.b2LineJointDef = function() {
        Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments),
        this.localAnchorA = new n,
        this.localAnchorB = new n,
        this.localAxisA = new n
    }
    ,
    f.prototype.b2LineJointDef = function() {
        this.__super.b2JointDef.call(this),
        this.type = p.e_lineJoint,
        this.localAxisA.Set(1, 0),
        this.enableLimit = !1,
        this.lowerTranslation = 0,
        this.upperTranslation = 0,
        this.enableMotor = !1,
        this.maxMotorForce = 0,
        this.motorSpeed = 0
    }
    ,
    f.prototype.Initialize = function(t, e, i, o) {
        this.bodyA = t,
        this.bodyB = e,
        this.localAnchorA = this.bodyA.GetLocalPoint(i),
        this.localAnchorB = this.bodyB.GetLocalPoint(i),
        this.localAxisA = this.bodyA.GetLocalVector(o)
    }
    ,
    Box2D.inherit(x, Box2D.Dynamics.Joints.b2Joint),
    x.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype,
    x.b2MouseJoint = function() {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments),
        this.K = new e,
        this.K1 = new e,
        this.K2 = new e,
        this.m_localAnchor = new n,
        this.m_target = new n,
        this.m_impulse = new n,
        this.m_mass = new e,
        this.m_C = new n
    }
    ,
    x.prototype.GetAnchorA = function() {
        return this.m_target
    }
    ,
    x.prototype.GetAnchorB = function() {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor)
    }
    ,
    x.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        new n(t * this.m_impulse.x,t * this.m_impulse.y)
    }
    ,
    x.prototype.GetReactionTorque = function(t) {
        return void 0 === t && (t = 0),
        0
    }
    ,
    x.prototype.GetTarget = function() {
        return this.m_target
    }
    ,
    x.prototype.SetTarget = function(t) {
        0 == this.m_bodyB.IsAwake() && this.m_bodyB.SetAwake(!0),
        this.m_target = t
    }
    ,
    x.prototype.GetMaxForce = function() {
        return this.m_maxForce
    }
    ,
    x.prototype.SetMaxForce = function(t) {
        void 0 === t && (t = 0),
        this.m_maxForce = t
    }
    ,
    x.prototype.GetFrequency = function() {
        return this.m_frequencyHz
    }
    ,
    x.prototype.SetFrequency = function(t) {
        void 0 === t && (t = 0),
        this.m_frequencyHz = t
    }
    ,
    x.prototype.GetDampingRatio = function() {
        return this.m_dampingRatio
    }
    ,
    x.prototype.SetDampingRatio = function(t) {
        void 0 === t && (t = 0),
        this.m_dampingRatio = t
    }
    ,
    x.prototype.b2MouseJoint = function(t) {
        this.__super.b2Joint.call(this, t),
        this.m_target.SetV(t.target);
        var e = this.m_target.x - this.m_bodyB.m_xf.position.x
          , i = this.m_target.y - this.m_bodyB.m_xf.position.y
          , o = this.m_bodyB.m_xf.R;
        this.m_localAnchor.x = e * o.col1.x + i * o.col1.y,
        this.m_localAnchor.y = e * o.col2.x + i * o.col2.y,
        this.m_maxForce = t.maxForce,
        this.m_impulse.SetZero(),
        this.m_frequencyHz = t.frequencyHz,
        this.m_dampingRatio = t.dampingRatio,
        this.m_beta = 0,
        this.m_gamma = 0
    }
    ,
    x.prototype.InitVelocityConstraints = function(t) {
        var e = this.m_bodyB
          , i = e.GetMass()
          , o = 2 * Math.PI * this.m_frequencyHz
          , n = 2 * i * this.m_dampingRatio * o
          , s = i * o * o;
        this.m_gamma = t.dt * (n + t.dt * s),
        this.m_gamma = 0 != this.m_gamma ? 1 / this.m_gamma : 0,
        this.m_beta = t.dt * s * this.m_gamma;
        var r;
        r = e.m_xf.R;
        var a = this.m_localAnchor.x - e.m_sweep.localCenter.x
          , l = this.m_localAnchor.y - e.m_sweep.localCenter.y
          , m = r.col1.x * a + r.col2.x * l;
        l = r.col1.y * a + r.col2.y * l,
        a = m;
        var c = e.m_invMass
          , h = e.m_invI;
        this.K1.col1.x = c,
        this.K1.col2.x = 0,
        this.K1.col1.y = 0,
        this.K1.col2.y = c,
        this.K2.col1.x = h * l * l,
        this.K2.col2.x = -h * a * l,
        this.K2.col1.y = -h * a * l,
        this.K2.col2.y = h * a * a,
        this.K.SetM(this.K1),
        this.K.AddM(this.K2),
        this.K.col1.x += this.m_gamma,
        this.K.col2.y += this.m_gamma,
        this.K.GetInverse(this.m_mass),
        this.m_C.x = e.m_sweep.c.x + a - this.m_target.x,
        this.m_C.y = e.m_sweep.c.y + l - this.m_target.y,
        e.m_angularVelocity *= .98,
        this.m_impulse.x *= t.dtRatio,
        this.m_impulse.y *= t.dtRatio,
        e.m_linearVelocity.x += c * this.m_impulse.x,
        e.m_linearVelocity.y += c * this.m_impulse.y,
        e.m_angularVelocity += h * (a * this.m_impulse.y - l * this.m_impulse.x)
    }
    ,
    x.prototype.SolveVelocityConstraints = function(t) {
        var e, i = this.m_bodyB, o = 0, n = 0;
        e = i.m_xf.R;
        var s = this.m_localAnchor.x - i.m_sweep.localCenter.x
          , r = this.m_localAnchor.y - i.m_sweep.localCenter.y;
        o = e.col1.x * s + e.col2.x * r,
        r = e.col1.y * s + e.col2.y * r,
        s = o;
        var a = i.m_linearVelocity.x + -i.m_angularVelocity * r
          , l = i.m_linearVelocity.y + i.m_angularVelocity * s;
        e = this.m_mass,
        o = a + this.m_beta * this.m_C.x + this.m_gamma * this.m_impulse.x,
        n = l + this.m_beta * this.m_C.y + this.m_gamma * this.m_impulse.y;
        var m = -(e.col1.x * o + e.col2.x * n)
          , c = -(e.col1.y * o + e.col2.y * n)
          , h = this.m_impulse.x
          , u = this.m_impulse.y;
        this.m_impulse.x += m,
        this.m_impulse.y += c;
        var p = t.dt * this.m_maxForce;
        this.m_impulse.LengthSquared() > p * p && this.m_impulse.Multiply(p / this.m_impulse.Length()),
        m = this.m_impulse.x - h,
        c = this.m_impulse.y - u,
        i.m_linearVelocity.x += i.m_invMass * m,
        i.m_linearVelocity.y += i.m_invMass * c,
        i.m_angularVelocity += i.m_invI * (s * c - r * m)
    }
    ,
    x.prototype.SolvePositionConstraints = function(t) {
        return void 0 === t && (t = 0),
        !0
    }
    ,
    Box2D.inherit(b, Box2D.Dynamics.Joints.b2JointDef),
    b.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype,
    b.b2MouseJointDef = function() {
        Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments),
        this.target = new n
    }
    ,
    b.prototype.b2MouseJointDef = function() {
        this.__super.b2JointDef.call(this),
        this.type = p.e_mouseJoint,
        this.maxForce = 0,
        this.frequencyHz = 5,
        this.dampingRatio = .7
    }
    ,
    Box2D.inherit(v, Box2D.Dynamics.Joints.b2Joint),
    v.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype,
    v.b2PrismaticJoint = function() {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments),
        this.m_localAnchor1 = new n,
        this.m_localAnchor2 = new n,
        this.m_localXAxis1 = new n,
        this.m_localYAxis1 = new n,
        this.m_axis = new n,
        this.m_perp = new n,
        this.m_K = new i,
        this.m_impulse = new s
    }
    ,
    v.prototype.GetAnchorA = function() {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1)
    }
    ,
    v.prototype.GetAnchorB = function() {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2)
    }
    ,
    v.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        new n(t * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x),t * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y))
    }
    ,
    v.prototype.GetReactionTorque = function(t) {
        return void 0 === t && (t = 0),
        t * this.m_impulse.y
    }
    ,
    v.prototype.GetJointTranslation = function() {
        var t = this.m_bodyA
          , e = this.m_bodyB
          , i = t.GetWorldPoint(this.m_localAnchor1)
          , o = e.GetWorldPoint(this.m_localAnchor2)
          , n = o.x - i.x
          , s = o.y - i.y
          , r = t.GetWorldVector(this.m_localXAxis1)
          , a = r.x * n + r.y * s;
        return a
    }
    ,
    v.prototype.GetJointSpeed = function() {
        var t, e = this.m_bodyA, i = this.m_bodyB;
        t = e.m_xf.R;
        var o = this.m_localAnchor1.x - e.m_sweep.localCenter.x
          , n = this.m_localAnchor1.y - e.m_sweep.localCenter.y
          , s = t.col1.x * o + t.col2.x * n;
        n = t.col1.y * o + t.col2.y * n,
        o = s,
        t = i.m_xf.R;
        var r = this.m_localAnchor2.x - i.m_sweep.localCenter.x
          , a = this.m_localAnchor2.y - i.m_sweep.localCenter.y;
        s = t.col1.x * r + t.col2.x * a,
        a = t.col1.y * r + t.col2.y * a,
        r = s;
        var l = e.m_sweep.c.x + o
          , m = e.m_sweep.c.y + n
          , c = i.m_sweep.c.x + r
          , h = i.m_sweep.c.y + a
          , u = c - l
          , p = h - m
          , y = e.GetWorldVector(this.m_localXAxis1)
          , _ = e.m_linearVelocity
          , d = i.m_linearVelocity
          , f = e.m_angularVelocity
          , x = i.m_angularVelocity
          , b = u * (-f * y.y) + p * (f * y.x) + (y.x * (d.x + -x * a - _.x - -f * n) + y.y * (d.y + x * r - _.y - f * o));
        return b
    }
    ,
    v.prototype.IsLimitEnabled = function() {
        return this.m_enableLimit
    }
    ,
    v.prototype.EnableLimit = function(t) {
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_enableLimit = t
    }
    ,
    v.prototype.GetLowerLimit = function() {
        return this.m_lowerTranslation
    }
    ,
    v.prototype.GetUpperLimit = function() {
        return this.m_upperTranslation
    }
    ,
    v.prototype.SetLimits = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_lowerTranslation = t,
        this.m_upperTranslation = e
    }
    ,
    v.prototype.IsMotorEnabled = function() {
        return this.m_enableMotor
    }
    ,
    v.prototype.EnableMotor = function(t) {
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_enableMotor = t
    }
    ,
    v.prototype.SetMotorSpeed = function(t) {
        void 0 === t && (t = 0),
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_motorSpeed = t
    }
    ,
    v.prototype.GetMotorSpeed = function() {
        return this.m_motorSpeed
    }
    ,
    v.prototype.SetMaxMotorForce = function(t) {
        void 0 === t && (t = 0),
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_maxMotorForce = t
    }
    ,
    v.prototype.GetMotorForce = function() {
        return this.m_motorImpulse
    }
    ,
    v.prototype.b2PrismaticJoint = function(t) {
        this.__super.b2Joint.call(this, t),
        this.m_localAnchor1.SetV(t.localAnchorA),
        this.m_localAnchor2.SetV(t.localAnchorB),
        this.m_localXAxis1.SetV(t.localAxisA),
        this.m_localYAxis1.x = -this.m_localXAxis1.y,
        this.m_localYAxis1.y = this.m_localXAxis1.x,
        this.m_refAngle = t.referenceAngle,
        this.m_impulse.SetZero(),
        this.m_motorMass = 0,
        this.m_motorImpulse = 0,
        this.m_lowerTranslation = t.lowerTranslation,
        this.m_upperTranslation = t.upperTranslation,
        this.m_maxMotorForce = t.maxMotorForce,
        this.m_motorSpeed = t.motorSpeed,
        this.m_enableLimit = t.enableLimit,
        this.m_enableMotor = t.enableMotor,
        this.m_limitState = p.e_inactiveLimit,
        this.m_axis.SetZero(),
        this.m_perp.SetZero()
    }
    ,
    v.prototype.InitVelocityConstraints = function(e) {
        var i, n = this.m_bodyA, s = this.m_bodyB, r = 0;
        this.m_localCenterA.SetV(n.GetLocalCenter()),
        this.m_localCenterB.SetV(s.GetLocalCenter());
        var a = n.GetTransform();
        s.GetTransform(),
        i = n.m_xf.R;
        var l = this.m_localAnchor1.x - this.m_localCenterA.x
          , m = this.m_localAnchor1.y - this.m_localCenterA.y;
        r = i.col1.x * l + i.col2.x * m,
        m = i.col1.y * l + i.col2.y * m,
        l = r,
        i = s.m_xf.R;
        var c = this.m_localAnchor2.x - this.m_localCenterB.x
          , h = this.m_localAnchor2.y - this.m_localCenterB.y;
        r = i.col1.x * c + i.col2.x * h,
        h = i.col1.y * c + i.col2.y * h,
        c = r;
        var u = s.m_sweep.c.x + c - n.m_sweep.c.x - l
          , y = s.m_sweep.c.y + h - n.m_sweep.c.y - m;
        this.m_invMassA = n.m_invMass,
        this.m_invMassB = s.m_invMass,
        this.m_invIA = n.m_invI,
        this.m_invIB = s.m_invI,
        this.m_axis.SetV(o.MulMV(a.R, this.m_localXAxis1)),
        this.m_a1 = (u + l) * this.m_axis.y - (y + m) * this.m_axis.x,
        this.m_a2 = c * this.m_axis.y - h * this.m_axis.x,
        this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2,
        this.m_motorMass > Number.MIN_VALUE && (this.m_motorMass = 1 / this.m_motorMass),
        this.m_perp.SetV(o.MulMV(a.R, this.m_localYAxis1)),
        this.m_s1 = (u + l) * this.m_perp.y - (y + m) * this.m_perp.x,
        this.m_s2 = c * this.m_perp.y - h * this.m_perp.x;
        var _ = this.m_invMassA
          , d = this.m_invMassB
          , f = this.m_invIA
          , x = this.m_invIB;
        if (this.m_K.col1.x = _ + d + f * this.m_s1 * this.m_s1 + x * this.m_s2 * this.m_s2,
        this.m_K.col1.y = f * this.m_s1 + x * this.m_s2,
        this.m_K.col1.z = f * this.m_s1 * this.m_a1 + x * this.m_s2 * this.m_a2,
        this.m_K.col2.x = this.m_K.col1.y,
        this.m_K.col2.y = f + x,
        this.m_K.col2.z = f * this.m_a1 + x * this.m_a2,
        this.m_K.col3.x = this.m_K.col1.z,
        this.m_K.col3.y = this.m_K.col2.z,
        this.m_K.col3.z = _ + d + f * this.m_a1 * this.m_a1 + x * this.m_a2 * this.m_a2,
        this.m_enableLimit) {
            var b = this.m_axis.x * u + this.m_axis.y * y;
            o.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * t.b2_linearSlop ? this.m_limitState = p.e_equalLimits : b <= this.m_lowerTranslation ? this.m_limitState != p.e_atLowerLimit && (this.m_limitState = p.e_atLowerLimit,
            this.m_impulse.z = 0) : b >= this.m_upperTranslation ? this.m_limitState != p.e_atUpperLimit && (this.m_limitState = p.e_atUpperLimit,
            this.m_impulse.z = 0) : (this.m_limitState = p.e_inactiveLimit,
            this.m_impulse.z = 0)
        } else
            this.m_limitState = p.e_inactiveLimit;
        if (0 == this.m_enableMotor && (this.m_motorImpulse = 0),
        e.warmStarting) {
            this.m_impulse.x *= e.dtRatio,
            this.m_impulse.y *= e.dtRatio,
            this.m_motorImpulse *= e.dtRatio;
            var v = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x
              , g = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y
              , D = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1
              , C = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
            n.m_linearVelocity.x -= this.m_invMassA * v,
            n.m_linearVelocity.y -= this.m_invMassA * g,
            n.m_angularVelocity -= this.m_invIA * D,
            s.m_linearVelocity.x += this.m_invMassB * v,
            s.m_linearVelocity.y += this.m_invMassB * g,
            s.m_angularVelocity += this.m_invIB * C
        } else
            this.m_impulse.SetZero(),
            this.m_motorImpulse = 0
    }
    ,
    v.prototype.SolveVelocityConstraints = function(t) {
        var e = this.m_bodyA
          , i = this.m_bodyB
          , r = e.m_linearVelocity
          , a = e.m_angularVelocity
          , l = i.m_linearVelocity
          , m = i.m_angularVelocity
          , c = 0
          , h = 0
          , u = 0
          , y = 0;
        if (this.m_enableMotor && this.m_limitState != p.e_equalLimits) {
            var _ = this.m_axis.x * (l.x - r.x) + this.m_axis.y * (l.y - r.y) + this.m_a2 * m - this.m_a1 * a
              , d = this.m_motorMass * (this.m_motorSpeed - _)
              , f = this.m_motorImpulse
              , x = t.dt * this.m_maxMotorForce;
            this.m_motorImpulse = o.Clamp(this.m_motorImpulse + d, -x, x),
            d = this.m_motorImpulse - f,
            c = d * this.m_axis.x,
            h = d * this.m_axis.y,
            u = d * this.m_a1,
            y = d * this.m_a2,
            r.x -= this.m_invMassA * c,
            r.y -= this.m_invMassA * h,
            a -= this.m_invIA * u,
            l.x += this.m_invMassB * c,
            l.y += this.m_invMassB * h,
            m += this.m_invIB * y
        }
        var b = this.m_perp.x * (l.x - r.x) + this.m_perp.y * (l.y - r.y) + this.m_s2 * m - this.m_s1 * a
          , v = m - a;
        if (this.m_enableLimit && this.m_limitState != p.e_inactiveLimit) {
            var g = this.m_axis.x * (l.x - r.x) + this.m_axis.y * (l.y - r.y) + this.m_a2 * m - this.m_a1 * a
              , D = this.m_impulse.Copy()
              , C = this.m_K.Solve33(new s, -b, -v, -g);
            this.m_impulse.Add(C),
            this.m_limitState == p.e_atLowerLimit ? this.m_impulse.z = o.Max(this.m_impulse.z, 0) : this.m_limitState == p.e_atUpperLimit && (this.m_impulse.z = o.Min(this.m_impulse.z, 0));
            var B = -b - (this.m_impulse.z - D.z) * this.m_K.col3.x
              , w = -v - (this.m_impulse.z - D.z) * this.m_K.col3.y
              , A = this.m_K.Solve22(new n, B, w);
            A.x += D.x,
            A.y += D.y,
            this.m_impulse.x = A.x,
            this.m_impulse.y = A.y,
            C.x = this.m_impulse.x - D.x,
            C.y = this.m_impulse.y - D.y,
            C.z = this.m_impulse.z - D.z,
            c = C.x * this.m_perp.x + C.z * this.m_axis.x,
            h = C.x * this.m_perp.y + C.z * this.m_axis.y,
            u = C.x * this.m_s1 + C.y + C.z * this.m_a1,
            y = C.x * this.m_s2 + C.y + C.z * this.m_a2,
            r.x -= this.m_invMassA * c,
            r.y -= this.m_invMassA * h,
            a -= this.m_invIA * u,
            l.x += this.m_invMassB * c,
            l.y += this.m_invMassB * h,
            m += this.m_invIB * y
        } else {
            var S = this.m_K.Solve22(new n, -b, -v);
            this.m_impulse.x += S.x,
            this.m_impulse.y += S.y,
            c = S.x * this.m_perp.x,
            h = S.x * this.m_perp.y,
            u = S.x * this.m_s1 + S.y,
            y = S.x * this.m_s2 + S.y,
            r.x -= this.m_invMassA * c,
            r.y -= this.m_invMassA * h,
            a -= this.m_invIA * u,
            l.x += this.m_invMassB * c,
            l.y += this.m_invMassB * h,
            m += this.m_invIB * y
        }
        e.m_linearVelocity.SetV(r),
        e.m_angularVelocity = a,
        i.m_linearVelocity.SetV(l),
        i.m_angularVelocity = m
    }
    ,
    v.prototype.SolvePositionConstraints = function(i) {
        void 0 === i && (i = 0);
        var r, a = this.m_bodyA, l = this.m_bodyB, m = a.m_sweep.c, c = a.m_sweep.a, h = l.m_sweep.c, u = l.m_sweep.a, p = 0, y = 0, _ = 0, d = 0, f = 0, x = 0, b = 0, v = !1, g = 0, D = e.FromAngle(c), C = e.FromAngle(u);
        r = D;
        var B = this.m_localAnchor1.x - this.m_localCenterA.x
          , w = this.m_localAnchor1.y - this.m_localCenterA.y;
        p = r.col1.x * B + r.col2.x * w,
        w = r.col1.y * B + r.col2.y * w,
        B = p,
        r = C;
        var A = this.m_localAnchor2.x - this.m_localCenterB.x
          , S = this.m_localAnchor2.y - this.m_localCenterB.y;
        p = r.col1.x * A + r.col2.x * S,
        S = r.col1.y * A + r.col2.y * S,
        A = p;
        var M = h.x + A - m.x - B
          , V = h.y + S - m.y - w;
        if (this.m_enableLimit) {
            this.m_axis = o.MulMV(D, this.m_localXAxis1),
            this.m_a1 = (M + B) * this.m_axis.y - (V + w) * this.m_axis.x,
            this.m_a2 = A * this.m_axis.y - S * this.m_axis.x;
            var I = this.m_axis.x * M + this.m_axis.y * V;
            o.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * t.b2_linearSlop ? (g = o.Clamp(I, -t.b2_maxLinearCorrection, t.b2_maxLinearCorrection),
            x = o.Abs(I),
            v = !0) : I <= this.m_lowerTranslation ? (g = o.Clamp(I - this.m_lowerTranslation + t.b2_linearSlop, -t.b2_maxLinearCorrection, 0),
            x = this.m_lowerTranslation - I,
            v = !0) : I >= this.m_upperTranslation && (g = o.Clamp(I - this.m_upperTranslation + t.b2_linearSlop, 0, t.b2_maxLinearCorrection),
            x = I - this.m_upperTranslation,
            v = !0)
        }
        this.m_perp = o.MulMV(D, this.m_localYAxis1),
        this.m_s1 = (M + B) * this.m_perp.y - (V + w) * this.m_perp.x,
        this.m_s2 = A * this.m_perp.y - S * this.m_perp.x;
        var T = new s
          , L = this.m_perp.x * M + this.m_perp.y * V
          , G = u - c - this.m_refAngle;
        if (x = o.Max(x, o.Abs(L)),
        b = o.Abs(G),
        v)
            y = this.m_invMassA,
            _ = this.m_invMassB,
            d = this.m_invIA,
            f = this.m_invIB,
            this.m_K.col1.x = y + _ + d * this.m_s1 * this.m_s1 + f * this.m_s2 * this.m_s2,
            this.m_K.col1.y = d * this.m_s1 + f * this.m_s2,
            this.m_K.col1.z = d * this.m_s1 * this.m_a1 + f * this.m_s2 * this.m_a2,
            this.m_K.col2.x = this.m_K.col1.y,
            this.m_K.col2.y = d + f,
            this.m_K.col2.z = d * this.m_a1 + f * this.m_a2,
            this.m_K.col3.x = this.m_K.col1.z,
            this.m_K.col3.y = this.m_K.col2.z,
            this.m_K.col3.z = y + _ + d * this.m_a1 * this.m_a1 + f * this.m_a2 * this.m_a2,
            this.m_K.Solve33(T, -L, -G, -g);
        else {
            y = this.m_invMassA,
            _ = this.m_invMassB,
            d = this.m_invIA,
            f = this.m_invIB;
            var F = y + _ + d * this.m_s1 * this.m_s1 + f * this.m_s2 * this.m_s2
              , P = d * this.m_s1 + f * this.m_s2
              , J = d + f;
            this.m_K.col1.Set(F, P, 0),
            this.m_K.col2.Set(P, J, 0);
            var E = this.m_K.Solve22(new n, -L, -G);
            T.x = E.x,
            T.y = E.y,
            T.z = 0
        }
        var R = T.x * this.m_perp.x + T.z * this.m_axis.x
          , k = T.x * this.m_perp.y + T.z * this.m_axis.y
          , N = T.x * this.m_s1 + T.y + T.z * this.m_a1
          , j = T.x * this.m_s2 + T.y + T.z * this.m_a2;
        return m.x -= this.m_invMassA * R,
        m.y -= this.m_invMassA * k,
        c -= this.m_invIA * N,
        h.x += this.m_invMassB * R,
        h.y += this.m_invMassB * k,
        u += this.m_invIB * j,
        a.m_sweep.a = c,
        l.m_sweep.a = u,
        a.SynchronizeTransform(),
        l.SynchronizeTransform(),
        x <= t.b2_linearSlop && b <= t.b2_angularSlop
    }
    ,
    Box2D.inherit(g, Box2D.Dynamics.Joints.b2JointDef),
    g.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype,
    g.b2PrismaticJointDef = function() {
        Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments),
        this.localAnchorA = new n,
        this.localAnchorB = new n,
        this.localAxisA = new n
    }
    ,
    g.prototype.b2PrismaticJointDef = function() {
        this.__super.b2JointDef.call(this),
        this.type = p.e_prismaticJoint,
        this.localAxisA.Set(1, 0),
        this.referenceAngle = 0,
        this.enableLimit = !1,
        this.lowerTranslation = 0,
        this.upperTranslation = 0,
        this.enableMotor = !1,
        this.maxMotorForce = 0,
        this.motorSpeed = 0
    }
    ,
    g.prototype.Initialize = function(t, e, i, o) {
        this.bodyA = t,
        this.bodyB = e,
        this.localAnchorA = this.bodyA.GetLocalPoint(i),
        this.localAnchorB = this.bodyB.GetLocalPoint(i),
        this.localAxisA = this.bodyA.GetLocalVector(o),
        this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle()
    }
    ,
    Box2D.inherit(D, Box2D.Dynamics.Joints.b2Joint),
    D.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype,
    D.b2PulleyJoint = function() {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments),
        this.m_groundAnchor1 = new n,
        this.m_groundAnchor2 = new n,
        this.m_localAnchor1 = new n,
        this.m_localAnchor2 = new n,
        this.m_u1 = new n,
        this.m_u2 = new n
    }
    ,
    D.prototype.GetAnchorA = function() {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1)
    }
    ,
    D.prototype.GetAnchorB = function() {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2)
    }
    ,
    D.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        new n(t * this.m_impulse * this.m_u2.x,t * this.m_impulse * this.m_u2.y)
    }
    ,
    D.prototype.GetReactionTorque = function(t) {
        return void 0 === t && (t = 0),
        0
    }
    ,
    D.prototype.GetGroundAnchorA = function() {
        var t = this.m_ground.m_xf.position.Copy();
        return t.Add(this.m_groundAnchor1),
        t
    }
    ,
    D.prototype.GetGroundAnchorB = function() {
        var t = this.m_ground.m_xf.position.Copy();
        return t.Add(this.m_groundAnchor2),
        t
    }
    ,
    D.prototype.GetLength1 = function() {
        var t = this.m_bodyA.GetWorldPoint(this.m_localAnchor1)
          , e = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x
          , i = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y
          , o = t.x - e
          , n = t.y - i;
        return Math.sqrt(o * o + n * n)
    }
    ,
    D.prototype.GetLength2 = function() {
        var t = this.m_bodyB.GetWorldPoint(this.m_localAnchor2)
          , e = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x
          , i = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y
          , o = t.x - e
          , n = t.y - i;
        return Math.sqrt(o * o + n * n)
    }
    ,
    D.prototype.GetRatio = function() {
        return this.m_ratio
    }
    ,
    D.prototype.b2PulleyJoint = function(t) {
        this.__super.b2Joint.call(this, t),
        this.m_ground = this.m_bodyA.m_world.m_groundBody,
        this.m_groundAnchor1.x = t.groundAnchorA.x - this.m_ground.m_xf.position.x,
        this.m_groundAnchor1.y = t.groundAnchorA.y - this.m_ground.m_xf.position.y,
        this.m_groundAnchor2.x = t.groundAnchorB.x - this.m_ground.m_xf.position.x,
        this.m_groundAnchor2.y = t.groundAnchorB.y - this.m_ground.m_xf.position.y,
        this.m_localAnchor1.SetV(t.localAnchorA),
        this.m_localAnchor2.SetV(t.localAnchorB),
        this.m_ratio = t.ratio,
        this.m_constant = t.lengthA + this.m_ratio * t.lengthB,
        this.m_maxLength1 = o.Min(t.maxLengthA, this.m_constant - this.m_ratio * D.b2_minPulleyLength),
        this.m_maxLength2 = o.Min(t.maxLengthB, (this.m_constant - D.b2_minPulleyLength) / this.m_ratio),
        this.m_impulse = 0,
        this.m_limitImpulse1 = 0,
        this.m_limitImpulse2 = 0
    }
    ,
    D.prototype.InitVelocityConstraints = function(e) {
        var i, o = this.m_bodyA, n = this.m_bodyB;
        i = o.m_xf.R;
        var s = this.m_localAnchor1.x - o.m_sweep.localCenter.x
          , r = this.m_localAnchor1.y - o.m_sweep.localCenter.y
          , a = i.col1.x * s + i.col2.x * r;
        r = i.col1.y * s + i.col2.y * r,
        s = a,
        i = n.m_xf.R;
        var l = this.m_localAnchor2.x - n.m_sweep.localCenter.x
          , m = this.m_localAnchor2.y - n.m_sweep.localCenter.y;
        a = i.col1.x * l + i.col2.x * m,
        m = i.col1.y * l + i.col2.y * m,
        l = a;
        var c = o.m_sweep.c.x + s
          , h = o.m_sweep.c.y + r
          , u = n.m_sweep.c.x + l
          , y = n.m_sweep.c.y + m
          , _ = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x
          , d = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y
          , f = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x
          , x = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
        this.m_u1.Set(c - _, h - d),
        this.m_u2.Set(u - f, y - x);
        var b = this.m_u1.Length()
          , v = this.m_u2.Length();
        b > t.b2_linearSlop ? this.m_u1.Multiply(1 / b) : this.m_u1.SetZero(),
        v > t.b2_linearSlop ? this.m_u2.Multiply(1 / v) : this.m_u2.SetZero();
        var g = this.m_constant - b - this.m_ratio * v;
        g > 0 ? (this.m_state = p.e_inactiveLimit,
        this.m_impulse = 0) : this.m_state = p.e_atUpperLimit,
        b < this.m_maxLength1 ? (this.m_limitState1 = p.e_inactiveLimit,
        this.m_limitImpulse1 = 0) : this.m_limitState1 = p.e_atUpperLimit,
        v < this.m_maxLength2 ? (this.m_limitState2 = p.e_inactiveLimit,
        this.m_limitImpulse2 = 0) : this.m_limitState2 = p.e_atUpperLimit;
        var D = s * this.m_u1.y - r * this.m_u1.x
          , C = l * this.m_u2.y - m * this.m_u2.x;
        if (this.m_limitMass1 = o.m_invMass + o.m_invI * D * D,
        this.m_limitMass2 = n.m_invMass + n.m_invI * C * C,
        this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2,
        this.m_limitMass1 = 1 / this.m_limitMass1,
        this.m_limitMass2 = 1 / this.m_limitMass2,
        this.m_pulleyMass = 1 / this.m_pulleyMass,
        e.warmStarting) {
            this.m_impulse *= e.dtRatio,
            this.m_limitImpulse1 *= e.dtRatio,
            this.m_limitImpulse2 *= e.dtRatio;
            var B = (-this.m_impulse - this.m_limitImpulse1) * this.m_u1.x
              , w = (-this.m_impulse - this.m_limitImpulse1) * this.m_u1.y
              , A = (-this.m_ratio * this.m_impulse - this.m_limitImpulse2) * this.m_u2.x
              , S = (-this.m_ratio * this.m_impulse - this.m_limitImpulse2) * this.m_u2.y;
            o.m_linearVelocity.x += o.m_invMass * B,
            o.m_linearVelocity.y += o.m_invMass * w,
            o.m_angularVelocity += o.m_invI * (s * w - r * B),
            n.m_linearVelocity.x += n.m_invMass * A,
            n.m_linearVelocity.y += n.m_invMass * S,
            n.m_angularVelocity += n.m_invI * (l * S - m * A)
        } else
            this.m_impulse = 0,
            this.m_limitImpulse1 = 0,
            this.m_limitImpulse2 = 0
    }
    ,
    D.prototype.SolveVelocityConstraints = function() {
        var t, e = this.m_bodyA, i = this.m_bodyB;
        t = e.m_xf.R;
        var n = this.m_localAnchor1.x - e.m_sweep.localCenter.x
          , s = this.m_localAnchor1.y - e.m_sweep.localCenter.y
          , r = t.col1.x * n + t.col2.x * s;
        s = t.col1.y * n + t.col2.y * s,
        n = r,
        t = i.m_xf.R;
        var a = this.m_localAnchor2.x - i.m_sweep.localCenter.x
          , l = this.m_localAnchor2.y - i.m_sweep.localCenter.y;
        r = t.col1.x * a + t.col2.x * l,
        l = t.col1.y * a + t.col2.y * l,
        a = r;
        var m = 0
          , c = 0
          , h = 0
          , u = 0
          , y = 0
          , _ = 0
          , d = 0
          , f = 0
          , x = 0
          , b = 0
          , v = 0;
        this.m_state == p.e_atUpperLimit && (m = e.m_linearVelocity.x + -e.m_angularVelocity * s,
        c = e.m_linearVelocity.y + e.m_angularVelocity * n,
        h = i.m_linearVelocity.x + -i.m_angularVelocity * l,
        u = i.m_linearVelocity.y + i.m_angularVelocity * a,
        x = -(this.m_u1.x * m + this.m_u1.y * c) - this.m_ratio * (this.m_u2.x * h + this.m_u2.y * u),
        b = this.m_pulleyMass * -x,
        v = this.m_impulse,
        this.m_impulse = o.Max(0, this.m_impulse + b),
        b = this.m_impulse - v,
        y = -b * this.m_u1.x,
        _ = -b * this.m_u1.y,
        d = -this.m_ratio * b * this.m_u2.x,
        f = -this.m_ratio * b * this.m_u2.y,
        e.m_linearVelocity.x += e.m_invMass * y,
        e.m_linearVelocity.y += e.m_invMass * _,
        e.m_angularVelocity += e.m_invI * (n * _ - s * y),
        i.m_linearVelocity.x += i.m_invMass * d,
        i.m_linearVelocity.y += i.m_invMass * f,
        i.m_angularVelocity += i.m_invI * (a * f - l * d)),
        this.m_limitState1 == p.e_atUpperLimit && (m = e.m_linearVelocity.x + -e.m_angularVelocity * s,
        c = e.m_linearVelocity.y + e.m_angularVelocity * n,
        x = -(this.m_u1.x * m + this.m_u1.y * c),
        b = -this.m_limitMass1 * x,
        v = this.m_limitImpulse1,
        this.m_limitImpulse1 = o.Max(0, this.m_limitImpulse1 + b),
        b = this.m_limitImpulse1 - v,
        y = -b * this.m_u1.x,
        _ = -b * this.m_u1.y,
        e.m_linearVelocity.x += e.m_invMass * y,
        e.m_linearVelocity.y += e.m_invMass * _,
        e.m_angularVelocity += e.m_invI * (n * _ - s * y)),
        this.m_limitState2 == p.e_atUpperLimit && (h = i.m_linearVelocity.x + -i.m_angularVelocity * l,
        u = i.m_linearVelocity.y + i.m_angularVelocity * a,
        x = -(this.m_u2.x * h + this.m_u2.y * u),
        b = -this.m_limitMass2 * x,
        v = this.m_limitImpulse2,
        this.m_limitImpulse2 = o.Max(0, this.m_limitImpulse2 + b),
        b = this.m_limitImpulse2 - v,
        d = -b * this.m_u2.x,
        f = -b * this.m_u2.y,
        i.m_linearVelocity.x += i.m_invMass * d,
        i.m_linearVelocity.y += i.m_invMass * f,
        i.m_angularVelocity += i.m_invI * (a * f - l * d))
    }
    ,
    D.prototype.SolvePositionConstraints = function(e) {
        void 0 === e && (e = 0);
        var i, n = this.m_bodyA, s = this.m_bodyB, r = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x, a = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y, l = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x, m = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y, c = 0, h = 0, u = 0, y = 0, _ = 0, d = 0, f = 0, x = 0, b = 0, v = 0, g = 0, D = 0, C = 0, B = 0;
        return this.m_state == p.e_atUpperLimit && (i = n.m_xf.R,
        c = this.m_localAnchor1.x - n.m_sweep.localCenter.x,
        h = this.m_localAnchor1.y - n.m_sweep.localCenter.y,
        C = i.col1.x * c + i.col2.x * h,
        h = i.col1.y * c + i.col2.y * h,
        c = C,
        i = s.m_xf.R,
        u = this.m_localAnchor2.x - s.m_sweep.localCenter.x,
        y = this.m_localAnchor2.y - s.m_sweep.localCenter.y,
        C = i.col1.x * u + i.col2.x * y,
        y = i.col1.y * u + i.col2.y * y,
        u = C,
        _ = n.m_sweep.c.x + c,
        d = n.m_sweep.c.y + h,
        f = s.m_sweep.c.x + u,
        x = s.m_sweep.c.y + y,
        this.m_u1.Set(_ - r, d - a),
        this.m_u2.Set(f - l, x - m),
        b = this.m_u1.Length(),
        v = this.m_u2.Length(),
        b > t.b2_linearSlop ? this.m_u1.Multiply(1 / b) : this.m_u1.SetZero(),
        v > t.b2_linearSlop ? this.m_u2.Multiply(1 / v) : this.m_u2.SetZero(),
        g = this.m_constant - b - this.m_ratio * v,
        B = o.Max(B, -g),
        g = o.Clamp(g + t.b2_linearSlop, -t.b2_maxLinearCorrection, 0),
        D = -this.m_pulleyMass * g,
        _ = -D * this.m_u1.x,
        d = -D * this.m_u1.y,
        f = -this.m_ratio * D * this.m_u2.x,
        x = -this.m_ratio * D * this.m_u2.y,
        n.m_sweep.c.x += n.m_invMass * _,
        n.m_sweep.c.y += n.m_invMass * d,
        n.m_sweep.a += n.m_invI * (c * d - h * _),
        s.m_sweep.c.x += s.m_invMass * f,
        s.m_sweep.c.y += s.m_invMass * x,
        s.m_sweep.a += s.m_invI * (u * x - y * f),
        n.SynchronizeTransform(),
        s.SynchronizeTransform()),
        this.m_limitState1 == p.e_atUpperLimit && (i = n.m_xf.R,
        c = this.m_localAnchor1.x - n.m_sweep.localCenter.x,
        h = this.m_localAnchor1.y - n.m_sweep.localCenter.y,
        C = i.col1.x * c + i.col2.x * h,
        h = i.col1.y * c + i.col2.y * h,
        c = C,
        _ = n.m_sweep.c.x + c,
        d = n.m_sweep.c.y + h,
        this.m_u1.Set(_ - r, d - a),
        b = this.m_u1.Length(),
        b > t.b2_linearSlop ? (this.m_u1.x *= 1 / b,
        this.m_u1.y *= 1 / b) : this.m_u1.SetZero(),
        g = this.m_maxLength1 - b,
        B = o.Max(B, -g),
        g = o.Clamp(g + t.b2_linearSlop, -t.b2_maxLinearCorrection, 0),
        D = -this.m_limitMass1 * g,
        _ = -D * this.m_u1.x,
        d = -D * this.m_u1.y,
        n.m_sweep.c.x += n.m_invMass * _,
        n.m_sweep.c.y += n.m_invMass * d,
        n.m_sweep.a += n.m_invI * (c * d - h * _),
        n.SynchronizeTransform()),
        this.m_limitState2 == p.e_atUpperLimit && (i = s.m_xf.R,
        u = this.m_localAnchor2.x - s.m_sweep.localCenter.x,
        y = this.m_localAnchor2.y - s.m_sweep.localCenter.y,
        C = i.col1.x * u + i.col2.x * y,
        y = i.col1.y * u + i.col2.y * y,
        u = C,
        f = s.m_sweep.c.x + u,
        x = s.m_sweep.c.y + y,
        this.m_u2.Set(f - l, x - m),
        v = this.m_u2.Length(),
        v > t.b2_linearSlop ? (this.m_u2.x *= 1 / v,
        this.m_u2.y *= 1 / v) : this.m_u2.SetZero(),
        g = this.m_maxLength2 - v,
        B = o.Max(B, -g),
        g = o.Clamp(g + t.b2_linearSlop, -t.b2_maxLinearCorrection, 0),
        D = -this.m_limitMass2 * g,
        f = -D * this.m_u2.x,
        x = -D * this.m_u2.y,
        s.m_sweep.c.x += s.m_invMass * f,
        s.m_sweep.c.y += s.m_invMass * x,
        s.m_sweep.a += s.m_invI * (u * x - y * f),
        s.SynchronizeTransform()),
        B < t.b2_linearSlop
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength = 2
    }),
    Box2D.inherit(C, Box2D.Dynamics.Joints.b2JointDef),
    C.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype,
    C.b2PulleyJointDef = function() {
        Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments),
        this.groundAnchorA = new n,
        this.groundAnchorB = new n,
        this.localAnchorA = new n,
        this.localAnchorB = new n
    }
    ,
    C.prototype.b2PulleyJointDef = function() {
        this.__super.b2JointDef.call(this),
        this.type = p.e_pulleyJoint,
        this.groundAnchorA.Set(-1, 1),
        this.groundAnchorB.Set(1, 1),
        this.localAnchorA.Set(-1, 0),
        this.localAnchorB.Set(1, 0),
        this.lengthA = 0,
        this.maxLengthA = 0,
        this.lengthB = 0,
        this.maxLengthB = 0,
        this.ratio = 1,
        this.collideConnected = !0
    }
    ,
    C.prototype.Initialize = function(t, e, i, o, n, s, r) {
        void 0 === r && (r = 0),
        this.bodyA = t,
        this.bodyB = e,
        this.groundAnchorA.SetV(i),
        this.groundAnchorB.SetV(o),
        this.localAnchorA = this.bodyA.GetLocalPoint(n),
        this.localAnchorB = this.bodyB.GetLocalPoint(s);
        var a = n.x - i.x
          , l = n.y - i.y;
        this.lengthA = Math.sqrt(a * a + l * l);
        var m = s.x - o.x
          , c = s.y - o.y;
        this.lengthB = Math.sqrt(m * m + c * c),
        this.ratio = r;
        var h = this.lengthA + this.ratio * this.lengthB;
        this.maxLengthA = h - this.ratio * D.b2_minPulleyLength,
        this.maxLengthB = (h - D.b2_minPulleyLength) / this.ratio
    }
    ,
    Box2D.inherit(B, Box2D.Dynamics.Joints.b2Joint),
    B.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype,
    B.b2RevoluteJoint = function() {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments),
        this.K = new e,
        this.K1 = new e,
        this.K2 = new e,
        this.K3 = new e,
        this.impulse3 = new s,
        this.impulse2 = new n,
        this.reduced = new n,
        this.m_localAnchor1 = new n,
        this.m_localAnchor2 = new n,
        this.m_impulse = new s,
        this.m_mass = new i
    }
    ,
    B.prototype.GetAnchorA = function() {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1)
    }
    ,
    B.prototype.GetAnchorB = function() {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2)
    }
    ,
    B.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        new n(t * this.m_impulse.x,t * this.m_impulse.y)
    }
    ,
    B.prototype.GetReactionTorque = function(t) {
        return void 0 === t && (t = 0),
        t * this.m_impulse.z
    }
    ,
    B.prototype.GetJointAngle = function() {
        return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle
    }
    ,
    B.prototype.GetJointSpeed = function() {
        return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity
    }
    ,
    B.prototype.IsLimitEnabled = function() {
        return this.m_enableLimit
    }
    ,
    B.prototype.EnableLimit = function(t) {
        this.m_enableLimit = t
    }
    ,
    B.prototype.GetLowerLimit = function() {
        return this.m_lowerAngle
    }
    ,
    B.prototype.GetUpperLimit = function() {
        return this.m_upperAngle
    }
    ,
    B.prototype.SetLimits = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        this.m_lowerAngle = t,
        this.m_upperAngle = e
    }
    ,
    B.prototype.IsMotorEnabled = function() {
        return this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_enableMotor
    }
    ,
    B.prototype.EnableMotor = function(t) {
        this.m_enableMotor = t
    }
    ,
    B.prototype.SetMotorSpeed = function(t) {
        void 0 === t && (t = 0),
        this.m_bodyA.SetAwake(!0),
        this.m_bodyB.SetAwake(!0),
        this.m_motorSpeed = t
    }
    ,
    B.prototype.GetMotorSpeed = function() {
        return this.m_motorSpeed
    }
    ,
    B.prototype.SetMaxMotorTorque = function(t) {
        void 0 === t && (t = 0),
        this.m_maxMotorTorque = t
    }
    ,
    B.prototype.GetMotorTorque = function() {
        return this.m_maxMotorTorque
    }
    ,
    B.prototype.b2RevoluteJoint = function(t) {
        this.__super.b2Joint.call(this, t),
        this.m_localAnchor1.SetV(t.localAnchorA),
        this.m_localAnchor2.SetV(t.localAnchorB),
        this.m_referenceAngle = t.referenceAngle,
        this.m_impulse.SetZero(),
        this.m_motorImpulse = 0,
        this.m_lowerAngle = t.lowerAngle,
        this.m_upperAngle = t.upperAngle,
        this.m_maxMotorTorque = t.maxMotorTorque,
        this.m_motorSpeed = t.motorSpeed,
        this.m_enableLimit = t.enableLimit,
        this.m_enableMotor = t.enableMotor,
        this.m_limitState = p.e_inactiveLimit
    }
    ,
    B.prototype.InitVelocityConstraints = function(e) {
        var i, n = this.m_bodyA, s = this.m_bodyB, r = 0;
        this.m_enableMotor || this.m_enableLimit,
        i = n.m_xf.R;
        var a = this.m_localAnchor1.x - n.m_sweep.localCenter.x
          , l = this.m_localAnchor1.y - n.m_sweep.localCenter.y;
        r = i.col1.x * a + i.col2.x * l,
        l = i.col1.y * a + i.col2.y * l,
        a = r,
        i = s.m_xf.R;
        var m = this.m_localAnchor2.x - s.m_sweep.localCenter.x
          , c = this.m_localAnchor2.y - s.m_sweep.localCenter.y;
        r = i.col1.x * m + i.col2.x * c,
        c = i.col1.y * m + i.col2.y * c,
        m = r;
        var h = n.m_invMass
          , u = s.m_invMass
          , y = n.m_invI
          , _ = s.m_invI;
        if (this.m_mass.col1.x = h + u + l * l * y + c * c * _,
        this.m_mass.col2.x = -l * a * y - c * m * _,
        this.m_mass.col3.x = -l * y - c * _,
        this.m_mass.col1.y = this.m_mass.col2.x,
        this.m_mass.col2.y = h + u + a * a * y + m * m * _,
        this.m_mass.col3.y = a * y + m * _,
        this.m_mass.col1.z = this.m_mass.col3.x,
        this.m_mass.col2.z = this.m_mass.col3.y,
        this.m_mass.col3.z = y + _,
        this.m_motorMass = 1 / (y + _),
        0 == this.m_enableMotor && (this.m_motorImpulse = 0),
        this.m_enableLimit) {
            var d = s.m_sweep.a - n.m_sweep.a - this.m_referenceAngle;
            o.Abs(this.m_upperAngle - this.m_lowerAngle) < 2 * t.b2_angularSlop ? this.m_limitState = p.e_equalLimits : d <= this.m_lowerAngle ? (this.m_limitState != p.e_atLowerLimit && (this.m_impulse.z = 0),
            this.m_limitState = p.e_atLowerLimit) : d >= this.m_upperAngle ? (this.m_limitState != p.e_atUpperLimit && (this.m_impulse.z = 0),
            this.m_limitState = p.e_atUpperLimit) : (this.m_limitState = p.e_inactiveLimit,
            this.m_impulse.z = 0)
        } else
            this.m_limitState = p.e_inactiveLimit;
        if (e.warmStarting) {
            this.m_impulse.x *= e.dtRatio,
            this.m_impulse.y *= e.dtRatio,
            this.m_motorImpulse *= e.dtRatio;
            var f = this.m_impulse.x
              , x = this.m_impulse.y;
            n.m_linearVelocity.x -= h * f,
            n.m_linearVelocity.y -= h * x,
            n.m_angularVelocity -= y * (a * x - l * f + this.m_motorImpulse + this.m_impulse.z),
            s.m_linearVelocity.x += u * f,
            s.m_linearVelocity.y += u * x,
            s.m_angularVelocity += _ * (m * x - c * f + this.m_motorImpulse + this.m_impulse.z)
        } else
            this.m_impulse.SetZero(),
            this.m_motorImpulse = 0
    }
    ,
    B.prototype.SolveVelocityConstraints = function(t) {
        var e, i = this.m_bodyA, n = this.m_bodyB, s = 0, r = 0, a = 0, l = 0, m = 0, c = 0, h = i.m_linearVelocity, u = i.m_angularVelocity, y = n.m_linearVelocity, _ = n.m_angularVelocity, d = i.m_invMass, f = n.m_invMass, x = i.m_invI, b = n.m_invI;
        if (this.m_enableMotor && this.m_limitState != p.e_equalLimits) {
            var v = _ - u - this.m_motorSpeed
              , g = this.m_motorMass * -v
              , D = this.m_motorImpulse
              , C = t.dt * this.m_maxMotorTorque;
            this.m_motorImpulse = o.Clamp(this.m_motorImpulse + g, -C, C),
            g = this.m_motorImpulse - D,
            u -= x * g,
            _ += b * g
        }
        if (this.m_enableLimit && this.m_limitState != p.e_inactiveLimit) {
            e = i.m_xf.R,
            a = this.m_localAnchor1.x - i.m_sweep.localCenter.x,
            l = this.m_localAnchor1.y - i.m_sweep.localCenter.y,
            s = e.col1.x * a + e.col2.x * l,
            l = e.col1.y * a + e.col2.y * l,
            a = s,
            e = n.m_xf.R,
            m = this.m_localAnchor2.x - n.m_sweep.localCenter.x,
            c = this.m_localAnchor2.y - n.m_sweep.localCenter.y,
            s = e.col1.x * m + e.col2.x * c,
            c = e.col1.y * m + e.col2.y * c,
            m = s;
            var B = y.x + -_ * c - h.x - -u * l
              , w = y.y + _ * m - h.y - u * a
              , A = _ - u;
            this.m_mass.Solve33(this.impulse3, -B, -w, -A),
            this.m_limitState == p.e_equalLimits ? this.m_impulse.Add(this.impulse3) : this.m_limitState == p.e_atLowerLimit ? (r = this.m_impulse.z + this.impulse3.z,
            0 > r && (this.m_mass.Solve22(this.reduced, -B, -w),
            this.impulse3.x = this.reduced.x,
            this.impulse3.y = this.reduced.y,
            this.impulse3.z = -this.m_impulse.z,
            this.m_impulse.x += this.reduced.x,
            this.m_impulse.y += this.reduced.y,
            this.m_impulse.z = 0)) : this.m_limitState == p.e_atUpperLimit && (r = this.m_impulse.z + this.impulse3.z,
            r > 0 && (this.m_mass.Solve22(this.reduced, -B, -w),
            this.impulse3.x = this.reduced.x,
            this.impulse3.y = this.reduced.y,
            this.impulse3.z = -this.m_impulse.z,
            this.m_impulse.x += this.reduced.x,
            this.m_impulse.y += this.reduced.y,
            this.m_impulse.z = 0)),
            h.x -= d * this.impulse3.x,
            h.y -= d * this.impulse3.y,
            u -= x * (a * this.impulse3.y - l * this.impulse3.x + this.impulse3.z),
            y.x += f * this.impulse3.x,
            y.y += f * this.impulse3.y,
            _ += b * (m * this.impulse3.y - c * this.impulse3.x + this.impulse3.z)
        } else {
            e = i.m_xf.R,
            a = this.m_localAnchor1.x - i.m_sweep.localCenter.x,
            l = this.m_localAnchor1.y - i.m_sweep.localCenter.y,
            s = e.col1.x * a + e.col2.x * l,
            l = e.col1.y * a + e.col2.y * l,
            a = s,
            e = n.m_xf.R,
            m = this.m_localAnchor2.x - n.m_sweep.localCenter.x,
            c = this.m_localAnchor2.y - n.m_sweep.localCenter.y,
            s = e.col1.x * m + e.col2.x * c,
            c = e.col1.y * m + e.col2.y * c,
            m = s;
            var S = y.x + -_ * c - h.x - -u * l
              , M = y.y + _ * m - h.y - u * a;
            this.m_mass.Solve22(this.impulse2, -S, -M),
            this.m_impulse.x += this.impulse2.x,
            this.m_impulse.y += this.impulse2.y,
            h.x -= d * this.impulse2.x,
            h.y -= d * this.impulse2.y,
            u -= x * (a * this.impulse2.y - l * this.impulse2.x),
            y.x += f * this.impulse2.x,
            y.y += f * this.impulse2.y,
            _ += b * (m * this.impulse2.y - c * this.impulse2.x)
        }
        i.m_linearVelocity.SetV(h),
        i.m_angularVelocity = u,
        n.m_linearVelocity.SetV(y),
        n.m_angularVelocity = _
    }
    ,
    B.prototype.SolvePositionConstraints = function(e) {
        void 0 === e && (e = 0);
        var i, n = 0, s = this.m_bodyA, r = this.m_bodyB, a = 0, l = 0, m = 0, c = 0, h = 0;
        if (this.m_enableLimit && this.m_limitState != p.e_inactiveLimit) {
            var u = r.m_sweep.a - s.m_sweep.a - this.m_referenceAngle
              , y = 0;
            this.m_limitState == p.e_equalLimits ? (n = o.Clamp(u - this.m_lowerAngle, -t.b2_maxAngularCorrection, t.b2_maxAngularCorrection),
            y = -this.m_motorMass * n,
            a = o.Abs(n)) : this.m_limitState == p.e_atLowerLimit ? (n = u - this.m_lowerAngle,
            a = -n,
            n = o.Clamp(n + t.b2_angularSlop, -t.b2_maxAngularCorrection, 0),
            y = -this.m_motorMass * n) : this.m_limitState == p.e_atUpperLimit && (n = u - this.m_upperAngle,
            a = n,
            n = o.Clamp(n - t.b2_angularSlop, 0, t.b2_maxAngularCorrection),
            y = -this.m_motorMass * n),
            s.m_sweep.a -= s.m_invI * y,
            r.m_sweep.a += r.m_invI * y,
            s.SynchronizeTransform(),
            r.SynchronizeTransform()
        }
        i = s.m_xf.R;
        var _ = this.m_localAnchor1.x - s.m_sweep.localCenter.x
          , d = this.m_localAnchor1.y - s.m_sweep.localCenter.y;
        m = i.col1.x * _ + i.col2.x * d,
        d = i.col1.y * _ + i.col2.y * d,
        _ = m,
        i = r.m_xf.R;
        var f = this.m_localAnchor2.x - r.m_sweep.localCenter.x
          , x = this.m_localAnchor2.y - r.m_sweep.localCenter.y;
        m = i.col1.x * f + i.col2.x * x,
        x = i.col1.y * f + i.col2.y * x,
        f = m;
        var b = r.m_sweep.c.x + f - s.m_sweep.c.x - _
          , v = r.m_sweep.c.y + x - s.m_sweep.c.y - d
          , g = b * b + v * v
          , D = Math.sqrt(g);
        l = D;
        var C = s.m_invMass
          , w = r.m_invMass
          , A = s.m_invI
          , S = r.m_invI
          , M = 10 * t.b2_linearSlop;
        if (g > M * M) {
            var V = C + w
              , I = 1 / V;
            c = I * -b,
            h = I * -v;
            var T = .5;
            s.m_sweep.c.x -= T * C * c,
            s.m_sweep.c.y -= T * C * h,
            r.m_sweep.c.x += T * w * c,
            r.m_sweep.c.y += T * w * h,
            b = r.m_sweep.c.x + f - s.m_sweep.c.x - _,
            v = r.m_sweep.c.y + x - s.m_sweep.c.y - d
        }
        return this.K1.col1.x = C + w,
        this.K1.col2.x = 0,
        this.K1.col1.y = 0,
        this.K1.col2.y = C + w,
        this.K2.col1.x = A * d * d,
        this.K2.col2.x = -A * _ * d,
        this.K2.col1.y = -A * _ * d,
        this.K2.col2.y = A * _ * _,
        this.K3.col1.x = S * x * x,
        this.K3.col2.x = -S * f * x,
        this.K3.col1.y = -S * f * x,
        this.K3.col2.y = S * f * f,
        this.K.SetM(this.K1),
        this.K.AddM(this.K2),
        this.K.AddM(this.K3),
        this.K.Solve(B.tImpulse, -b, -v),
        c = B.tImpulse.x,
        h = B.tImpulse.y,
        s.m_sweep.c.x -= s.m_invMass * c,
        s.m_sweep.c.y -= s.m_invMass * h,
        s.m_sweep.a -= s.m_invI * (_ * h - d * c),
        r.m_sweep.c.x += r.m_invMass * c,
        r.m_sweep.c.y += r.m_invMass * h,
        r.m_sweep.a += r.m_invI * (f * h - x * c),
        s.SynchronizeTransform(),
        r.SynchronizeTransform(),
        l <= t.b2_linearSlop && a <= t.b2_angularSlop
    }
    ,
    Box2D.postDefs.push(function() {
        Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse = new n
    }),
    Box2D.inherit(w, Box2D.Dynamics.Joints.b2JointDef),
    w.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype,
    w.b2RevoluteJointDef = function() {
        Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments),
        this.localAnchorA = new n,
        this.localAnchorB = new n
    }
    ,
    w.prototype.b2RevoluteJointDef = function() {
        this.__super.b2JointDef.call(this),
        this.type = p.e_revoluteJoint,
        this.localAnchorA.Set(0, 0),
        this.localAnchorB.Set(0, 0),
        this.referenceAngle = 0,
        this.lowerAngle = 0,
        this.upperAngle = 0,
        this.maxMotorTorque = 0,
        this.motorSpeed = 0,
        this.enableLimit = !1,
        this.enableMotor = !1
    }
    ,
    w.prototype.Initialize = function(t, e, i) {
        this.bodyA = t,
        this.bodyB = e,
        this.localAnchorA = this.bodyA.GetLocalPoint(i),
        this.localAnchorB = this.bodyB.GetLocalPoint(i),
        this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle()
    }
    ,
    Box2D.inherit(A, Box2D.Dynamics.Joints.b2Joint),
    A.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype,
    A.b2WeldJoint = function() {
        Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments),
        this.m_localAnchorA = new n,
        this.m_localAnchorB = new n,
        this.m_impulse = new s,
        this.m_mass = new i
    }
    ,
    A.prototype.GetAnchorA = function() {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA)
    }
    ,
    A.prototype.GetAnchorB = function() {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB)
    }
    ,
    A.prototype.GetReactionForce = function(t) {
        return void 0 === t && (t = 0),
        new n(t * this.m_impulse.x,t * this.m_impulse.y)
    }
    ,
    A.prototype.GetReactionTorque = function(t) {
        return void 0 === t && (t = 0),
        t * this.m_impulse.z
    }
    ,
    A.prototype.b2WeldJoint = function(t) {
        this.__super.b2Joint.call(this, t),
        this.m_localAnchorA.SetV(t.localAnchorA),
        this.m_localAnchorB.SetV(t.localAnchorB),
        this.m_referenceAngle = t.referenceAngle,
        this.m_impulse.SetZero(),
        this.m_mass = new i
    }
    ,
    A.prototype.InitVelocityConstraints = function(t) {
        var e, i = 0, o = this.m_bodyA, n = this.m_bodyB;
        e = o.m_xf.R;
        var s = this.m_localAnchorA.x - o.m_sweep.localCenter.x
          , r = this.m_localAnchorA.y - o.m_sweep.localCenter.y;
        i = e.col1.x * s + e.col2.x * r,
        r = e.col1.y * s + e.col2.y * r,
        s = i,
        e = n.m_xf.R;
        var a = this.m_localAnchorB.x - n.m_sweep.localCenter.x
          , l = this.m_localAnchorB.y - n.m_sweep.localCenter.y;
        i = e.col1.x * a + e.col2.x * l,
        l = e.col1.y * a + e.col2.y * l,
        a = i;
        var m = o.m_invMass
          , c = n.m_invMass
          , h = o.m_invI
          , u = n.m_invI;
        this.m_mass.col1.x = m + c + r * r * h + l * l * u,
        this.m_mass.col2.x = -r * s * h - l * a * u,
        this.m_mass.col3.x = -r * h - l * u,
        this.m_mass.col1.y = this.m_mass.col2.x,
        this.m_mass.col2.y = m + c + s * s * h + a * a * u,
        this.m_mass.col3.y = s * h + a * u,
        this.m_mass.col1.z = this.m_mass.col3.x,
        this.m_mass.col2.z = this.m_mass.col3.y,
        this.m_mass.col3.z = h + u,
        t.warmStarting ? (this.m_impulse.x *= t.dtRatio,
        this.m_impulse.y *= t.dtRatio,
        this.m_impulse.z *= t.dtRatio,
        o.m_linearVelocity.x -= m * this.m_impulse.x,
        o.m_linearVelocity.y -= m * this.m_impulse.y,
        o.m_angularVelocity -= h * (s * this.m_impulse.y - r * this.m_impulse.x + this.m_impulse.z),
        n.m_linearVelocity.x += c * this.m_impulse.x,
        n.m_linearVelocity.y += c * this.m_impulse.y,
        n.m_angularVelocity += u * (a * this.m_impulse.y - l * this.m_impulse.x + this.m_impulse.z)) : this.m_impulse.SetZero()
    }
    ,
    A.prototype.SolveVelocityConstraints = function() {
        var t, e = 0, i = this.m_bodyA, o = this.m_bodyB, n = i.m_linearVelocity, r = i.m_angularVelocity, a = o.m_linearVelocity, l = o.m_angularVelocity, m = i.m_invMass, c = o.m_invMass, h = i.m_invI, u = o.m_invI;
        t = i.m_xf.R;
        var p = this.m_localAnchorA.x - i.m_sweep.localCenter.x
          , y = this.m_localAnchorA.y - i.m_sweep.localCenter.y;
        e = t.col1.x * p + t.col2.x * y,
        y = t.col1.y * p + t.col2.y * y,
        p = e,
        t = o.m_xf.R;
        var _ = this.m_localAnchorB.x - o.m_sweep.localCenter.x
          , d = this.m_localAnchorB.y - o.m_sweep.localCenter.y;
        e = t.col1.x * _ + t.col2.x * d,
        d = t.col1.y * _ + t.col2.y * d,
        _ = e;
        var f = a.x - l * d - n.x + r * y
          , x = a.y + l * _ - n.y - r * p
          , b = l - r
          , v = new s;
        this.m_mass.Solve33(v, -f, -x, -b),
        this.m_impulse.Add(v),
        n.x -= m * v.x,
        n.y -= m * v.y,
        r -= h * (p * v.y - y * v.x + v.z),
        a.x += c * v.x,
        a.y += c * v.y,
        l += u * (_ * v.y - d * v.x + v.z),
        i.m_angularVelocity = r,
        o.m_angularVelocity = l
    }
    ,
    A.prototype.SolvePositionConstraints = function(e) {
        void 0 === e && (e = 0);
        var i, n = 0, r = this.m_bodyA, a = this.m_bodyB;
        i = r.m_xf.R;
        var l = this.m_localAnchorA.x - r.m_sweep.localCenter.x
          , m = this.m_localAnchorA.y - r.m_sweep.localCenter.y;
        n = i.col1.x * l + i.col2.x * m,
        m = i.col1.y * l + i.col2.y * m,
        l = n,
        i = a.m_xf.R;
        var c = this.m_localAnchorB.x - a.m_sweep.localCenter.x
          , h = this.m_localAnchorB.y - a.m_sweep.localCenter.y;
        n = i.col1.x * c + i.col2.x * h,
        h = i.col1.y * c + i.col2.y * h,
        c = n;
        var u = r.m_invMass
          , p = a.m_invMass
          , y = r.m_invI
          , _ = a.m_invI
          , d = a.m_sweep.c.x + c - r.m_sweep.c.x - l
          , f = a.m_sweep.c.y + h - r.m_sweep.c.y - m
          , x = a.m_sweep.a - r.m_sweep.a - this.m_referenceAngle
          , b = 10 * t.b2_linearSlop
          , v = Math.sqrt(d * d + f * f)
          , g = o.Abs(x);
        v > b && (y *= 1,
        _ *= 1),
        this.m_mass.col1.x = u + p + m * m * y + h * h * _,
        this.m_mass.col2.x = -m * l * y - h * c * _,
        this.m_mass.col3.x = -m * y - h * _,
        this.m_mass.col1.y = this.m_mass.col2.x,
        this.m_mass.col2.y = u + p + l * l * y + c * c * _,
        this.m_mass.col3.y = l * y + c * _,
        this.m_mass.col1.z = this.m_mass.col3.x,
        this.m_mass.col2.z = this.m_mass.col3.y,
        this.m_mass.col3.z = y + _;
        var D = new s;
        return this.m_mass.Solve33(D, -d, -f, -x),
        r.m_sweep.c.x -= u * D.x,
        r.m_sweep.c.y -= u * D.y,
        r.m_sweep.a -= y * (l * D.y - m * D.x + D.z),
        a.m_sweep.c.x += p * D.x,
        a.m_sweep.c.y += p * D.y,
        a.m_sweep.a += _ * (c * D.y - h * D.x + D.z),
        r.SynchronizeTransform(),
        a.SynchronizeTransform(),
        v <= t.b2_linearSlop && g <= t.b2_angularSlop
    }
    ,
    Box2D.inherit(S, Box2D.Dynamics.Joints.b2JointDef),
    S.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype,
    S.b2WeldJointDef = function() {
        Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments),
        this.localAnchorA = new n,
        this.localAnchorB = new n
    }
    ,
    S.prototype.b2WeldJointDef = function() {
        this.__super.b2JointDef.call(this),
        this.type = p.e_weldJoint,
        this.referenceAngle = 0
    }
    ,
    S.prototype.Initialize = function(t, e, i) {
        this.bodyA = t,
        this.bodyB = e,
        this.localAnchorA.SetV(this.bodyA.GetLocalPoint(i)),
        this.localAnchorB.SetV(this.bodyB.GetLocalPoint(i)),
        this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle()
    }
}(),
function() {
    var t = Box2D.Dynamics.b2DebugDraw;
    t.b2DebugDraw = function() {
        this.m_drawScale = 1,
        this.m_lineThickness = 1,
        this.m_alpha = 1,
        this.m_fillAlpha = 1,
        this.m_xformScale = 1;
        var t = this;
        this.m_sprite = {
            graphics: {
                clear: function() {
                    t.m_ctx.clearRect(0, 0, t.m_ctx.canvas.width, t.m_ctx.canvas.height)
                }
            }
        }
    }
    ,
    t.prototype._color = function(t, e) {
        return "rgba(" + ((16711680 & t) >> 16) + "," + ((65280 & t) >> 8) + "," + (255 & t) + "," + e + ")"
    }
    ,
    t.prototype.b2DebugDraw = function() {
        this.m_drawFlags = 0
    }
    ,
    t.prototype.SetFlags = function(t) {
        void 0 === t && (t = 0),
        this.m_drawFlags = t
    }
    ,
    t.prototype.GetFlags = function() {
        return this.m_drawFlags
    }
    ,
    t.prototype.AppendFlags = function(t) {
        void 0 === t && (t = 0),
        this.m_drawFlags |= t
    }
    ,
    t.prototype.ClearFlags = function(t) {
        void 0 === t && (t = 0),
        this.m_drawFlags &= ~t
    }
    ,
    t.prototype.SetSprite = function(t) {
        this.m_ctx = t
    }
    ,
    t.prototype.GetSprite = function() {
        return this.m_ctx
    }
    ,
    t.prototype.SetDrawScale = function(t) {
        void 0 === t && (t = 0),
        this.m_drawScale = t
    }
    ,
    t.prototype.GetDrawScale = function() {
        return this.m_drawScale
    }
    ,
    t.prototype.SetLineThickness = function(t) {
        void 0 === t && (t = 0),
        this.m_lineThickness = t,
        this.m_ctx.strokeWidth = t
    }
    ,
    t.prototype.GetLineThickness = function() {
        return this.m_lineThickness
    }
    ,
    t.prototype.SetAlpha = function(t) {
        void 0 === t && (t = 0),
        this.m_alpha = t
    }
    ,
    t.prototype.GetAlpha = function() {
        return this.m_alpha
    }
    ,
    t.prototype.SetFillAlpha = function(t) {
        void 0 === t && (t = 0),
        this.m_fillAlpha = t
    }
    ,
    t.prototype.GetFillAlpha = function() {
        return this.m_fillAlpha
    }
    ,
    t.prototype.SetXFormScale = function(t) {
        void 0 === t && (t = 0),
        this.m_xformScale = t
    }
    ,
    t.prototype.GetXFormScale = function() {
        return this.m_xformScale
    }
    ,
    t.prototype.DrawPolygon = function(t, e, i) {
        if (e) {
            var o = this.m_ctx
              , n = this.m_drawScale;
            o.beginPath(),
            o.strokeStyle = this._color(i.color, this.m_alpha),
            o.moveTo(t[0].x * n, t[0].y * n);
            for (var s = 1; e > s; s++)
                o.lineTo(t[s].x * n, t[s].y * n);
            o.lineTo(t[0].x * n, t[0].y * n),
            o.closePath(),
            o.stroke()
        }
    }
    ,
    t.prototype.DrawSolidPolygon = function(t, e, i) {
        if (e) {
            var o = this.m_ctx
              , n = this.m_drawScale;
            o.beginPath(),
            o.strokeStyle = this._color(i.color, this.m_alpha),
            o.fillStyle = this._color(i.color, this.m_fillAlpha),
            o.moveTo(t[0].x * n, t[0].y * n);
            for (var s = 1; e > s; s++)
                o.lineTo(t[s].x * n, t[s].y * n);
            o.lineTo(t[0].x * n, t[0].y * n),
            o.closePath(),
            o.fill(),
            o.stroke()
        }
    }
    ,
    t.prototype.DrawCircle = function(t, e, i) {
        if (e) {
            var o = this.m_ctx
              , n = this.m_drawScale;
            o.beginPath(),
            o.strokeStyle = this._color(i.color, this.m_alpha),
            o.arc(t.x * n, t.y * n, e * n, 0, 2 * Math.PI, !0),
            o.closePath(),
            o.stroke()
        }
    }
    ,
    t.prototype.DrawSolidCircle = function(t, e, i, o) {
        if (e) {
            var n = this.m_ctx
              , s = this.m_drawScale
              , r = t.x * s
              , a = t.y * s;
            n.moveTo(0, 0),
            n.beginPath(),
            n.strokeStyle = this._color(o.color, this.m_alpha),
            n.fillStyle = this._color(o.color, this.m_fillAlpha),
            n.arc(r, a, e * s, 0, 2 * Math.PI, !0),
            n.moveTo(r, a),
            n.lineTo((t.x + i.x * e) * s, (t.y + i.y * e) * s),
            n.closePath(),
            n.fill(),
            n.stroke()
        }
    }
    ,
    t.prototype.DrawSegment = function(t, e, i) {
        var o = this.m_ctx
          , n = this.m_drawScale;
        o.strokeStyle = this._color(i.color, this.m_alpha),
        o.beginPath(),
        o.moveTo(t.x * n, t.y * n),
        o.lineTo(e.x * n, e.y * n),
        o.closePath(),
        o.stroke()
    }
    ,
    t.prototype.DrawTransform = function(t) {
        var e = this.m_ctx
          , i = this.m_drawScale;
        e.beginPath(),
        e.strokeStyle = this._color(16711680, this.m_alpha),
        e.moveTo(t.position.x * i, t.position.y * i),
        e.lineTo((t.position.x + this.m_xformScale * t.R.col1.x) * i, (t.position.y + this.m_xformScale * t.R.col1.y) * i),
        e.strokeStyle = this._color(65280, this.m_alpha),
        e.moveTo(t.position.x * i, t.position.y * i),
        e.lineTo((t.position.x + this.m_xformScale * t.R.col2.x) * i, (t.position.y + this.m_xformScale * t.R.col2.y) * i),
        e.closePath(),
        e.stroke()
    }
}();
var i;
for (i = 0; i < Box2D.postDefs.length; ++i)
    Box2D.postDefs[i]();
delete Box2D.postDefs,
Box2D.Common.b2Settings.b2_maxTranslation = 100,
Box2D.Common.b2Settings.b2_maxTranslationSquared = 1e4;
var VEC = Box2D.Common.Math.b2Vec2
  , MAT = Box2D.Common.Math.b2Mat22
  , POLYGON = Box2D.Collision.Shapes.b2PolygonShape
  , CIRCLE = Box2D.Collision.Shapes.b2CircleShape
  , BODY = Box2D.Dynamics.b2Body
  , world = new Box2D.Dynamics.b2World(new VEC(0,-200),!0)
  , objects = new Array
  , listener = new Box2D.Dynamics.b2ContactListener;
listener.PreSolve = function(t) {
    var e = t.GetFixtureA()
      , i = t.GetFixtureB()
      , o = e.GetUserData().obj
      , n = i.GetUserData().obj;
    o.presolve && o.presolve(t, i.GetUserData()),
    n.presolve && n.presolve(t, e.GetUserData())
}
,
listener.PostSolve = function(t, e) {
    for (var i = t.GetFixtureA().GetUserData(), o = t.GetFixtureB().GetUserData(), n = 0, s = 0; s < e.normalImpulses.length; ++s)
        n += e.normalImpulses[s];
    i.obj.damage(i.type, o.type, n),
    o.obj.damage(o.type, i.type, n)
}
,
listener.BeginContact = function(t) {
    var e = t.GetFixtureA().GetUserData()
      , i = t.GetFixtureB().GetUserData();
    e.obj.contact && e.obj.contact(!0, i, e),
    i.obj.contact && i.obj.contact(!0, e, i)
}
,
listener.EndContact = function(t) {
    var e = t.GetFixtureA().GetUserData()
      , i = t.GetFixtureB().GetUserData();
    e.obj.contact && e.obj.contact(!1, i, e),
    i.obj.contact && i.obj.contact(!1, e, i)
}
,
world.SetContactListener(listener),
animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
    setTimeout(t, 20)
}
;
var lastframe = +new Date, eachstep = function() {}, shooting = !1, point0, point1, point2, launch, ltype, scale = 1, worldwidth, worldheight;
$("#shot").bind("mousedown touchstart", function(t) {
    if (t.preventDefault(),
    t.originalEvent.touches) {
        if (1 != t.originalEvent.touches.length)
            return;
        t = t.originalEvent.changedTouches[0]
    }
    shooting = !0,
    $(".line").css("display", "block"),
    ltype = nextlaunch(),
    launch = new ltype(-1e3,0,0,0,0,!0),
    drawline(getxy(t))
}),
$(document).bind("mousemove touchmove", function(t) {
    if (t.preventDefault(),
    t.originalEvent.touches) {
        if (1 != t.originalEvent.touches.length)
            return;
        t = t.originalEvent.touches[0]
    }
    shooting && drawline(getxy(t))
}).bind("mouseup touchend", function(t) {
    if (t.preventDefault(),
    t.originalEvent.touches) {
        if (0 != t.originalEvent.touches.length)
            return;
        t = t.originalEvent.changedTouches[0]
    }
    if (shooting) {
        shooting = !1,
        $(".line").css("display", "none"),
        launch.dead = !0,
        launch = void 0;
        var e = getxy(t)
          , i = e.x
          , o = e.y
          , n = point0.x - i
          , s = point0.y - o;
        new ltype(i,o,5 * n,5 * s,Math.atan2(s, n))
    }
}).mousedown(function(t) {
    t.preventDefault()
});
var empty = "rgb(62, 62, 62)";
Ae.prototype = new Entity;
var metalfill = "rgb(140, 140, 140)";
Al.prototype = new Entity,
Aq.prototype = new Entity;
var devlog = !1
  , colors = ["#0078ff", "#fd6600"]
  , points = []
  , theBird = [2];
Am.prototype = new Entity,
Am.prototype.radius = 24,
Am.prototype.img = "",
Am.prototype.color = 0;
var portalSteps = [];
Ay.prototype = new Entity,
Ay.prototype.hw = 48,
Ay.prototype.hh = 9,
Ay.list = [],
Ay.active = !1,
Aa.prototype = new Entity,
Aa.prototype.hw = 48,
Aa.prototype.hh = 9,
Aa.prototype.portals = new Array,
Aa.prototype.fade = 0,
Aa.active = !1,
Aw.prototype = new Entity,
Aw.number = 0;
var nl = null
  , birds = [drawbird($("#bleft"), Am.prototype.radius, 0).click(function() {
    selectBird(0)
}).on("touchstart", function() {
    this.click()
})];
hyu(location.pathname) !== ab("seXhtYBhueImsZJltS") && birds.push(drawbird($("#bleft"), Am.prototype.radius, 1).click(function() {
    selectBird(1)
}).on("touchstart", function() {
    this.click()
}));
var restore = $("<img>").attr({
    src: "assets/undo.png",
    id: "restore"
});
restore.click(function() {
    undo()
}).on("touchstart", function() {
    this.click()
}),
restore.appendTo($("#bright"));
var supportsClipPath = function() {
    for (var t = "clipPath", e = [t], i = document.createElement("testelement"), o = "polygon(50% 0%, 0% 100%, 100% 100%)", n = 0, s = e.length; s > n; n++) {
        var r = e[n];
        if ("" === i.style[r] && (i.style[r] = o,
        "" !== i.style[r]))
            return !0
    }
    return !1
};
birds[0].click(),
$(document).keypress(function(t) {
    var e = birds[t.which - 49];
    e && e.click()
}),
$(document).keypress(function(t) {
    var e = String.fromCharCode(t.which);
    "u" == e && undo()
});
var whirAudio = $("<audio>").attr("src", "sounds/367768__johandeecke__fx-whir-tinkle-hit.wav")[0]
  , oinkAudio1 = $("<audio>").attr("src", "sounds/oink1.wav")[0]
  , oinkAudio2 = $("<audio>").attr("src", "sounds/oink2.wav")[0]
  , quackAudio1 = $("<audio>").attr("src", "sounds/quack1.wav")[0]
  , swipAudio = $("<audio>").attr("src", "sounds/chicken.wav")[0]
  , squealAudio = $("<audio>").attr("src", "sounds/squeal.wav")[0]
  , transformAudio = $("<audio>").attr("src", "sounds/249613__otisjames__explosionsfx.wav")[0];
if ($(run),
hyu(location.pathname) == "game.html") {
    iw(1150, 1300, .6),
    new Ae(empty,[0, 150],[100,150],[50,700],[0,700]),
    new Ae(empty,[250, 150],[0, 150],[0, 0],[250, 0]),
    new Al(empty,[600,200],[600,400],[500,300]),
    new Al(empty,[500, 500],[600,500],[600,925],[500,925]),
    new Al(empty,[1060, 475],[1150, 475],[1150, 675],[1050, 675]),
    new Ae(empty,[960, 0],[1150, 0],[1150, 150],[960, 150]),
    new Al(empty,[860, 0],[960, 0],[960, 425],[860, 425]),
    new Al(empty,[960, 485],[920, 595],[780, 535],[860, 425],[960, 425]),
    new Aw(960,140),
    new Ay(860,350,new VEC(-1,0),"urlsarenotapuzzleneitheristhispagenorthesongnorthesourcecodenorthenamesofthepigsnorthecakenoreally");
    var left = 50
      , bot = 145
      , startx = left+50
      , starty = bot;
    point1 = {
        x: 59 + startx,
        y: starty + 55
    },
    point2 = {
        x: 31 + startx,
        y: starty + 45
    },
    point0 = {
        x: 45 + startx,
        y: starty + 50
    },
    si(startx, starty, 0)
}
fi(),
$("#svg-container").html($("#svg-container").html()),
function() {
    function t(t) {
        return this.timeout_id = null,
        this.duration = 3e3,
        this.content = "",
        this.position = "bottom",
        t && "object" == typeof t ? (t.duration && (this.duration = parseFloat(t.duration)),
        t.content && (this.content = t.content),
        t.position && (position = t.position.toLowerCase(),
        "top" == position || "bottom" == position ? this.position = position : this.position = "bottom"),
        void this.show()) : !1
    }
    t.prototype.show = function() {
        if (!this.content)
            return !1;
        clearTimeout(this.timeout_id);
        var t = document.getElementsByTagName("body")[0]
          , e = document.getElementById("android_toast_container");
        e && t.removeChild(e);
        var i = "android_toast_fadein";
        "top" == this.position && (i = "android_toast_fadein android_toast_top");
        var o = document.createElement("div");
        o.setAttribute("id", "android_toast_container"),
        o.setAttribute("class", i),
        t.appendChild(o);
        var n = document.createElement("div");
        return n.setAttribute("id", "android_toast"),
        n.innerHTML = this.content,
        o.appendChild(n),
        this.timeout_id = setTimeout(this.hide, this.duration),
        !0
    }
    ,
    t.prototype.hide = function() {
        function t() {
            var t = document.getElementById("android_toast_container");
            return t ? void t.parentNode.removeChild(t) : !1
        }
        var e = document.getElementById("android_toast_container");
        return e ? (clearTimeout(this.timeout_id),
        e.className += " android_toast_fadeout",
        e.addEventListener("webkitAnimationEnd", t),
        e.addEventListener("animationEnd", t),
        e.addEventListener("msAnimationEnd", t),
        e.addEventListener("oAnimationEnd", t),
        !0) : !1
    }
    ,
    window.Android_Toast = t
}();

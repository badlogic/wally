var wally;
(function (wally) {
    var Input = (function () {
        function Input(element) {
            this.lastX = 0;
            this.lastY = 0;
            this.buttonDown = false;
            this.currTouch = null;
            this.listeners = new Array();
            this.element = element;
            this.setupCallbacks(element);
        }
        Input.prototype.setupCallbacks = function (element) {
            var _this = this;
            element.addEventListener("mousedown", function (ev) {
                if (ev instanceof MouseEvent) {
                    var rect = element.getBoundingClientRect();
                    var x = ev.clientX - rect.left;
                    var y = ev.clientY - rect.top;
                    var listeners = _this.listeners;
                    for (var i = 0; i < listeners.length; i++) {
                        listeners[i].down(x, y);
                    }
                    _this.lastX = x;
                    _this.lastY = y;
                    _this.buttonDown = true;
                }
            }, true);
            element.addEventListener("mousemove", function (ev) {
                if (ev instanceof MouseEvent) {
                    var rect = element.getBoundingClientRect();
                    var x = ev.clientX - rect.left;
                    var y = ev.clientY - rect.top;
                    var listeners = _this.listeners;
                    for (var i = 0; i < listeners.length; i++) {
                        if (_this.buttonDown) {
                            listeners[i].dragged(x, y);
                        }
                        else {
                            listeners[i].moved(x, y);
                        }
                    }
                    _this.lastX = x;
                    _this.lastY = y;
                }
            }, true);
            element.addEventListener("mouseup", function (ev) {
                if (ev instanceof MouseEvent) {
                    var rect = element.getBoundingClientRect();
                    var x = ev.clientX - rect.left;
                    var y = ev.clientY - rect.top;
                    var listeners = _this.listeners;
                    for (var i = 0; i < listeners.length; i++) {
                        listeners[i].up(x, y);
                    }
                    _this.lastX = x;
                    _this.lastY = y;
                    _this.buttonDown = false;
                }
            }, true);
            element.addEventListener("touchstart", function (ev) {
                if (_this.currTouch != null)
                    return;
                var touches = ev.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    var rect = element.getBoundingClientRect();
                    var x = touch.clientX - rect.left;
                    var y = touch.clientY - rect.top;
                    _this.currTouch = new Touch(0, 0, 0);
                    _this.currTouch.identifier = touch.identifier;
                    _this.currTouch.x = x;
                    _this.currTouch.y = y;
                    break;
                }
                var listeners = _this.listeners;
                for (var i_1 = 0; i_1 < listeners.length; i_1++) {
                    listeners[i_1].down(_this.currTouch.x, _this.currTouch.y);
                }
                console.log("Start " + _this.currTouch.x + ", " + _this.currTouch.y);
                _this.lastX = _this.currTouch.x;
                _this.lastY = _this.currTouch.y;
                _this.buttonDown = true;
                ev.preventDefault();
            }, false);
            element.addEventListener("touchend", function (ev) {
                var touches = ev.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    if (_this.currTouch.identifier === touch.identifier) {
                        var rect = element.getBoundingClientRect();
                        var x = _this.currTouch.x = touch.clientX - rect.left;
                        var y = _this.currTouch.y = touch.clientY - rect.top;
                        var listeners = _this.listeners;
                        for (var i_2 = 0; i_2 < listeners.length; i_2++) {
                            listeners[i_2].up(x, y);
                        }
                        console.log("End " + x + ", " + y);
                        _this.lastX = x;
                        _this.lastY = y;
                        _this.buttonDown = false;
                        _this.currTouch = null;
                        break;
                    }
                }
                ev.preventDefault();
            }, false);
            element.addEventListener("touchcancel", function (ev) {
                var touches = ev.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    if (_this.currTouch.identifier === touch.identifier) {
                        var rect = element.getBoundingClientRect();
                        var x = _this.currTouch.x = touch.clientX - rect.left;
                        var y = _this.currTouch.y = touch.clientY - rect.top;
                        var listeners = _this.listeners;
                        for (var i_3 = 0; i_3 < listeners.length; i_3++) {
                            listeners[i_3].up(x, y);
                        }
                        console.log("End " + x + ", " + y);
                        _this.lastX = x;
                        _this.lastY = y;
                        _this.buttonDown = false;
                        _this.currTouch = null;
                        break;
                    }
                }
                ev.preventDefault();
            }, false);
            element.addEventListener("touchmove", function (ev) {
                if (_this.currTouch == null)
                    return;
                var touches = ev.changedTouches;
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    if (_this.currTouch.identifier === touch.identifier) {
                        var rect = element.getBoundingClientRect();
                        var x = touch.clientX - rect.left;
                        var y = touch.clientY - rect.top;
                        var listeners = _this.listeners;
                        for (var i_4 = 0; i_4 < listeners.length; i_4++) {
                            listeners[i_4].dragged(x, y);
                        }
                        console.log("Drag " + x + ", " + y);
                        _this.lastX = _this.currTouch.x = x;
                        _this.lastY = _this.currTouch.y = y;
                        break;
                    }
                }
                ev.preventDefault();
            }, false);
        };
        Input.prototype.addListener = function (listener) {
            this.listeners.push(listener);
        };
        Input.prototype.removeListener = function (listener) {
            var idx = this.listeners.indexOf(listener);
            if (idx > -1) {
                this.listeners.splice(idx, 1);
            }
        };
        return Input;
    }());
    wally.Input = Input;
    var Touch = (function () {
        function Touch(identifier, x, y) {
            this.identifier = identifier;
            this.x = x;
            this.y = y;
        }
        return Touch;
    }());
    wally.Touch = Touch;
})(wally || (wally = {}));
var wally;
(function (wally_1) {
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Point.prototype.dst = function (point) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        return Point;
    }());
    wally_1.Point = Point;
    var Wall = (function () {
        function Wall() {
            this.corners = new Array();
            this.corners.push(new Point());
            this.corners.push(new Point());
            this.corners.push(new Point());
            this.corners.push(new Point());
        }
        return Wall;
    }());
    wally_1.Wall = Wall;
    var Painting = (function () {
        function Painting() {
            this.id = Painting.nextId++;
            this.corners = new Array();
            this.corners.push(new Point());
            this.corners.push(new Point());
            this.corners.push(new Point());
            this.corners.push(new Point());
            this.position = new Point();
        }
        Painting.prototype.copy = function () {
            var newPainting = new Painting();
            newPainting.id = this.id;
            newPainting.image = this.image;
            newPainting.width = this.width;
            newPainting.height = this.height;
            return newPainting;
        };
        Painting.nextId = 0;
        return Painting;
    }());
    wally_1.Painting = Painting;
    var Wally = (function () {
        function Wally() {
            this.walls = new Array();
            this.paintings = new Array();
            this.hungPaintings = new Array();
            this.body = $("#body");
            this.setScreen(new BackgroundScreen());
        }
        Wally.prototype.testSetup = function () {
            var _this = this;
            var wall = {
                corners: [
                    new Point(1518.72, 687.6800000000001),
                    new Point(2759.68, 701.120000000000),
                    new Point(2728.32, 2139.2),
                    new Point(1523.2, 2139.2)
                ],
                height: 258
            };
            this.walls.push(wall);
            var background = document.createElement("img");
            background.onload = function () {
                _this.background = background;
                var painting = document.createElement("img");
                painting.onload = function () {
                    var p = new Painting();
                    p.width = 61;
                    p.height = 86;
                    p.image = painting;
                    p.position = _this.wallCenterPoint();
                    _this.paintings.push(p);
                    _this.setScreen(new PaintingMoverScreen());
                };
                painting.src = "img/rabbit.png";
            };
            background.src = "img/background-example.jpg";
        };
        Wally.prototype.setScreen = function (screen) {
            this.body.empty();
            this.body.append(screen.render(this));
        };
        Wally.prototype.loadImage = function (file, success, error) {
            if (!file.type.match("image.*")) {
                error();
            }
            var reader = new FileReader();
            reader.onload = function (event) {
                var image = document.createElement("img");
                image.onload = function () { success(image); };
                image.onerror = error;
                image.src = event.target.result;
            };
            reader.onerror = error;
            reader.readAsDataURL(file);
        };
        Wally.prototype.wallCenterPoint = function () {
            var corners = this.walls[0].corners;
            var x = 0;
            var y = 0;
            for (var i = 0; i < corners.length; i++) {
                x += corners[i].x;
                y += corners[i].y;
            }
            return new Point(x / 4, y / 4);
        };
        Wally.prototype.updatePaintings = function () {
            var wall = this.walls[0];
            var corners = wall.corners;
            var wallHeightCm = wall.height;
            var wallHeightLeftPx = corners[0].dst(corners[3]);
            var cmToPx = wallHeightLeftPx / wallHeightCm;
            for (var i = 0; i < this.hungPaintings.length; i++) {
                var painting = this.hungPaintings[i];
                var topLeftX = painting.position.x - painting.width / 2 * cmToPx;
                var topLeftY = painting.position.y - painting.height / 2 * cmToPx;
                var widthPx = painting.width * cmToPx;
                var heightPx = painting.height * cmToPx;
                painting.corners[0].set(topLeftX, topLeftY);
                painting.corners[1].set(topLeftX + widthPx, topLeftY);
                painting.corners[2].set(topLeftX + widthPx, topLeftY + heightPx);
                painting.corners[3].set(topLeftX, topLeftY + heightPx);
            }
        };
        return Wally;
    }());
    wally_1.Wally = Wally;
    var BackgroundScreen = (function () {
        function BackgroundScreen() {
        }
        BackgroundScreen.prototype.render = function (wally) {
            var dom = $("\n\t\t\t<div>\n\t\t\t\t<h2>1. Set a background image</h2>\n\t\t\t\t<p>Select an image of your wall on which the ceiling and floor corners visible.</p>\n\t\t\t\t<div id=\"filePreview\"><img src=\"img/background-example.jpg\"></div>\n\t\t\t\t<input id=\"file\" type=\"file\">\n\t\t\t\t<div id=\"fileError\" class=\"error\"></div>\n\t\t\t\t<input id=\"set\" type=\"button\" class=\"btn btn-disabled\" value=\"Set\" disabled>\n\t\t\t</div>\n\t\t\t");
            var filePreview = dom.find("#filePreview");
            var file = dom.find("#file");
            var fileError = dom.find("#fileError");
            var set = dom.find("#set");
            file[0].addEventListener("change", function () {
                wally.loadImage(file[0].files[0], function (image) {
                    wally.background = image;
                    fileError.empty();
                    filePreview.empty();
                    filePreview.append(wally.background);
                    set.attr("disabled", null);
                    set.removeClass("btn-disabled");
                }, function () {
                    filePreview.empty();
                    fileError.empty();
                    fileError.append("<p>Sorry, couldn't load the image.</p>");
                    set.attr("disabled", "true");
                    set.addClass("btn-disabled");
                });
            }, false);
            set.click(function () {
                wally.setScreen(new WallDefinitionScreen());
            });
            return dom;
        };
        return BackgroundScreen;
    }());
    wally_1.BackgroundScreen = BackgroundScreen;
    var WallDefinitionScreen = (function () {
        function WallDefinitionScreen() {
        }
        WallDefinitionScreen.prototype.render = function (wally) {
            var dom = $("\n\t\t\t\t<div>\n\t\t\t\t\t<h2>2. Define wall corners</h2>\n\t\t\t\t\t<p>Move the handles to the walls corners and specify the height of your wall.</p>\n\t\t\t\t\t<label>Height (cm)</label>\n\t\t\t\t\t<input id=\"height\" type=\"text\" style=\"width: 10em;\" value=\"258\">\n\t\t\t\t\t<canvas id=\"canvas\"></canvas>\n\t\t\t\t\t<input id=\"set\" type=\"button\" class=\"btn\" value=\"Done\">\n\t\t\t\t</div>\n\t\t\t");
            var canvas = dom.find("#canvas")[0];
            canvas.width = wally.background.width;
            canvas.height = wally.background.height;
            var input = new wally_1.Input(canvas);
            var ctx = canvas.getContext("2d");
            var wall = new Wall();
            var corners = wall.corners;
            var w = wally.background.width;
            var h = wally.background.height;
            corners[0].set(w * 0.1, h * 0.1);
            corners[1].set(w * 0.9, h * 0.1);
            corners[2].set(w * 0.9, h * 0.9);
            corners[3].set(w * 0.1, h * 0.9);
            wally.walls.push(wall);
            var selectedCorner = null;
            var intersectCorners = function (x, y, radius) {
                if (radius === void 0) { radius = 10; }
                console.log(x + ", " + y);
                x = x / canvas.clientWidth * canvas.width;
                y = y / canvas.clientHeight * canvas.height;
                radius = radius / canvas.clientWidth * canvas.width;
                console.log(x + ", " + y);
                var mousePoint = new Point(x, y);
                var nearestDst = 100000000000;
                var nearest = null;
                for (var i = 0; i < corners.length; i++) {
                    var corner = corners[i];
                    var dst = corner.dst(mousePoint);
                    if (dst < radius && dst < nearestDst) {
                        nearest = corner;
                        nearestDst = dst;
                    }
                }
                return nearest;
            };
            var offsetX = 0;
            var offsetY = 0;
            input.addListener({
                down: function (x, y) {
                    selectedCorner = intersectCorners(x, y);
                    if (selectedCorner) {
                        x = x / canvas.clientWidth * canvas.width;
                        y = y / canvas.clientHeight * canvas.height;
                        offsetX = selectedCorner.x - x;
                        offsetY = selectedCorner.y - y;
                    }
                },
                up: function (x, y) {
                },
                dragged: function (x, y) {
                    if (selectedCorner) {
                        x = x / canvas.clientWidth * canvas.width;
                        y = y / canvas.clientHeight * canvas.height;
                        selectedCorner.x = x + offsetX;
                        selectedCorner.y = y + offsetY;
                    }
                },
                moved: function (x, y) {
                    selectedCorner = intersectCorners(x, y);
                }
            });
            var loop = function () {
                requestAnimationFrame(loop);
                ctx.drawImage(wally.background, 0, 0);
                var radius = 10;
                radius = radius / canvas.clientWidth * canvas.width;
                var lineWidth = 1;
                lineWidth = lineWidth / canvas.clientWidth * canvas.width;
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = "rgba(200, 0, 0, 0.5)";
                for (var i = 0; i < corners.length; i++) {
                    var s = corners[i];
                    var e = i == corners.length - 1 ? corners[0] : corners[i + 1];
                    ctx.beginPath();
                    if (s == selectedCorner)
                        ctx.fillStyle = "rgba(0, 200, 0, 0.5)";
                    else
                        ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
                    ctx.ellipse(s.x, s.y, radius, radius, 0, 0, 360);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(e.x, e.y);
                    ctx.stroke();
                }
            };
            loop();
            var height = dom.find("#height");
            var set = dom.find("#set");
            set.click(function () {
                wall.height = parseFloat(height.val());
                wally.setScreen(new PaintingDefinitionScreen());
            });
            return dom;
        };
        return WallDefinitionScreen;
    }());
    wally_1.WallDefinitionScreen = WallDefinitionScreen;
    var PaintingDefinitionScreen = (function () {
        function PaintingDefinitionScreen() {
        }
        PaintingDefinitionScreen.prototype.render = function (wally) {
            var dom = $("\n\t\t\t<div>\n\t\t\t\t<h2>3. Define a painting</h2>\n\t\t\t\t<p>Select an image of your painting and define its width and height.</p>\n\t\t\t\t<label>Width (cm)</label>\n\t\t\t\t<input id=\"width\" type=\"text\" value=\"74\">\n\t\t\t\t<label>Height (cm)</label>\n\t\t\t\t<input id=\"height\" type=\"text\" value=\"74\">\n\t\t\t\t<div id=\"filePreview\"><img src=\"img/painting-example.jpg\"></div>\n\t\t\t\t<input id=\"file\" type=\"file\">\n\t\t\t\t<div id=\"fileError\" class=\"error\"></div>\n\t\t\t\t<input id=\"set\" type=\"button\" class=\"btn btn-disabled\" value=\"Set\" disabled>\n\t\t\t</div>\n\t\t\t");
            var width = dom.find("#width");
            var height = dom.find("#height");
            var filePreview = dom.find("#filePreview");
            var file = dom.find("#file");
            var fileError = dom.find("#fileError");
            var set = dom.find("#set");
            var painting = new Painting();
            file[0].addEventListener("change", function () {
                wally.loadImage(file[0].files[0], function (image) {
                    painting.image = image;
                    fileError.empty();
                    filePreview.empty();
                    filePreview.append(image);
                    set.attr("disabled", null);
                    set.removeClass("btn-disabled");
                }, function () {
                    filePreview.empty();
                    fileError.empty();
                    fileError.append("<p>Sorry, couldn't load the image.</p>");
                    set.attr("disabled", "true");
                    set.addClass("btn-disabled");
                });
            }, false);
            set.click(function () {
                painting.width = parseFloat(width.val());
                painting.height = parseFloat(height.val());
                wally.paintings.push(painting);
                wally.setScreen(new PaintingMoverScreen());
            });
            return dom;
        };
        return PaintingDefinitionScreen;
    }());
    wally_1.PaintingDefinitionScreen = PaintingDefinitionScreen;
    var PaintingMoverScreen = (function () {
        function PaintingMoverScreen() {
        }
        PaintingMoverScreen.prototype.render = function (wally) {
            var _this = this;
            var dom = $("\n\t\t\t\t<div>\n\t\t\t\t\t<h2>4. Hang your painting!</h2>\n\t\t\t\t\t<p>Click a painting to add it to the wall. Double click a painting on the wall to delete it.</p>\n\t\t\t\t\t<input id=\"newPainting\" type=\"button\" class=\"btn\" value=\"New Painting\">\n\t\t\t\t\t<div id=\"paintings\"></div>\n\t\t\t\t\t<canvas id=\"canvas\"></canvas>\n\t\t\t\t</div>\n\t\t\t");
            var paintingsDiv = dom.find("#paintings");
            for (var i = 0; i < wally.paintings.length; i++) {
                var painting = wally.paintings[i];
                var img = document.createElement("img");
                img.src = painting.image.src;
                (function (p) {
                    $(img).click(function () {
                        var hungPainting = p.copy();
                        hungPainting.position = wally.wallCenterPoint();
                        wally.hungPaintings.push(hungPainting);
                        requestAnimationFrame(loop);
                    });
                })(painting);
                paintingsDiv.append(img);
            }
            dom.find("#newPainting").click(function () {
                wally.setScreen(new PaintingDefinitionScreen());
            });
            var canvas = dom.find("#canvas")[0];
            canvas.width = wally.background.width;
            canvas.height = wally.background.height;
            var input = new wally_1.Input(canvas);
            var ctx = canvas.getContext("2d");
            var loop = function () {
                wally.updatePaintings();
                ctx.drawImage(wally.background, 0, 0);
                var lineWidth = 1;
                lineWidth = lineWidth / canvas.clientWidth * canvas.width;
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = "rgba(200, 0, 0, 0.5)";
                for (var j = 0; j < wally.hungPaintings.length; j++) {
                    var painting = wally.hungPaintings[j];
                    var corners = painting.corners;
                    _this.drawQuadrilateral(ctx, painting.image, painting.corners);
                }
            };
            loop();
            var offsetX = 0;
            var offsetY = 0;
            var selectedPainting = null;
            var dragged = false;
            input.addListener({
                down: function (x, y) {
                    dragged = false;
                    selectedPainting = null;
                    x = x / canvas.clientWidth * canvas.width;
                    y = y / canvas.clientHeight * canvas.height;
                    var point = new Point(x, y);
                    var paintings = wally.hungPaintings;
                    for (var i = paintings.length - 1; i >= 0; i--) {
                        var painting = paintings[i];
                        if (_this.isPointInPolygon(painting.corners, point)) {
                            selectedPainting = painting;
                            offsetX = selectedPainting.position.x - x;
                            offsetY = selectedPainting.position.y - y;
                            return;
                        }
                    }
                },
                up: function (x, y) {
                    if (!dragged && selectedPainting) {
                        var index = wally.hungPaintings.indexOf(selectedPainting);
                        wally.hungPaintings.splice(index, 1);
                        requestAnimationFrame(loop);
                    }
                    dragged = false;
                },
                dragged: function (x, y) {
                    dragged = true;
                    requestAnimationFrame(loop);
                    if (selectedPainting) {
                        x = x / canvas.clientWidth * canvas.width;
                        y = y / canvas.clientHeight * canvas.height;
                        selectedPainting.position.x = x + offsetX;
                        selectedPainting.position.y = y + offsetY;
                    }
                },
                moved: function (x, y) {
                    requestAnimationFrame(loop);
                }
            });
            return dom;
        };
        PaintingMoverScreen.prototype.drawQuadrilateral = function (ctx, img, points) {
            var p0 = points[0];
            var p1 = points[1];
            var p2 = points[2];
            var p3 = points[3];
            this.drawTriangle(ctx, img, p0.x, p0.y, 0, 0, p1.x, p1.y, 1, 0, p2.x, p2.y, 1, 1);
            this.drawTriangle(ctx, img, p0.x, p0.y, 0, 0, p2.x, p2.y, 1, 1, p3.x, p3.y, 0, 1);
        };
        PaintingMoverScreen.prototype.drawTriangle = function (ctx, img, x0, y0, u0, v0, x1, y1, u1, v1, x2, y2, u2, v2) {
            u0 *= img.width;
            v0 *= img.height;
            u1 *= img.width;
            v1 *= img.height;
            u2 *= img.width;
            v2 *= img.height;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            x1 -= x0;
            y1 -= y0;
            x2 -= x0;
            y2 -= y0;
            u1 -= u0;
            v1 -= v0;
            u2 -= u0;
            v2 -= v0;
            var det = 1 / (u1 * v2 - u2 * v1), a = (v2 * x1 - v1 * x2) * det, b = (v2 * y1 - v1 * y2) * det, c = (u1 * x2 - u2 * x1) * det, d = (u1 * y2 - u2 * y1) * det, e = x0 - a * u0 - c * v0, f = y0 - b * u0 - d * v0;
            ctx.save();
            ctx.transform(a, b, c, d, e, f);
            ctx.clip();
            ctx.drawImage(img, 0, 0);
            ctx.restore();
        };
        PaintingMoverScreen.prototype.isPointInPolygon = function (polygon, point) {
            var lastVertice = polygon[polygon.length - 1];
            var oddNodes = false;
            for (var i = 0; i < polygon.length; i++) {
                var vertice = polygon[i];
                if ((vertice.y < point.y && lastVertice.y >= point.y) || (lastVertice.y < point.y && vertice.y >= point.y)) {
                    if (vertice.x + (point.y - vertice.y) / (lastVertice.y - vertice.y) * (lastVertice.x - vertice.x) < point.x) {
                        oddNodes = !oddNodes;
                    }
                }
                lastVertice = vertice;
            }
            return oddNodes;
        };
        return PaintingMoverScreen;
    }());
    wally_1.PaintingMoverScreen = PaintingMoverScreen;
})(wally || (wally = {}));
//# sourceMappingURL=wally.js.map
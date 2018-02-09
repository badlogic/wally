module wally {
	export class Point {
		x: number;
		y: number;

		constructor (x: number = 0, y: number = 0) {
			this.x = x;
			this.y = y;
		}

		set (x: number, y: number) {
			this.x = x;
			this.y = y;
		}

		dst(point: Point) {
			let dx = this.x - point.x;
			let dy = this.y - point.y;
			return Math.sqrt(dx * dx + dy * dy);
		}
	}

	export class Wall {
		corners: Array<Point>;
		height: number;

		constructor () {
			this.corners = new Array<Point>();
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.corners.push(new Point());
		}
	}

	export class Painting {
		static nextId = 0;
		id: number;
		image: HTMLImageElement;
		width: number;
		height: number;
		position: Point;
		corners: Array<Point>;

		constructor () {
			this.id = Painting.nextId++;
			this.corners = new Array<Point>();
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.position = new Point();
		}

		copy () {
			var newPainting = new Painting();
			newPainting.id = this.id;
			newPainting.image = this.image;
			newPainting.width = this.width;
			newPainting.height = this.height;
			return newPainting;
		}
	}

	export class Wally {
		body: JQuery;

		background: HTMLImageElement;
		walls = new Array<Wall>();
		paintings = new Array<Painting>();
		hungPaintings = new Array<Painting>();

		constructor () {
			this.body = $("#body");
			this.setScreen(new BackgroundScreen());
			//this.testSetup();
		}

		testSetup () {
			// TEST!
			var wall: Wall = {
				corners: [
					new Point(1518.72, 687.6800000000001),
					new Point(2759.68, 701.120000000000),
					new Point(2728.32,2139.2),
					new Point(1523.2,2139.2)
				] as Point[],
				height :258
			} as Wall;
			this.walls.push(wall);
			var background = document.createElement("img");
			background.onload = () => {
				this.background = background;
				var painting = document.createElement("img");
				painting.onload = () => {
					var p = new Painting();
					p.width = 61;
					p.height = 86;
					p.image = painting;
					p.position = this.wallCenterPoint();
					this.paintings.push(p);
					this.setScreen(new PaintingMoverScreen());
				}
				painting.src = "img/rabbit.png";
			};
			background.src = "img/background-example.jpg";
		}

		setScreen (screen: Screen) {
			this.body.empty();
			this.body.append(screen.render(this));
		}

		loadImage (file: File, success: (img: HTMLImageElement) => void, error: () => void)  {
			if (!file.type.match("image.*")) {
				error();
			}

			var reader = new FileReader();
			reader.onload = (event: Event) => {
				var image = document.createElement("img");
				image.onload = () => { success(image) };
				image.onerror = error;
				image.src = (event.target as any).result;
			}
			reader.onerror = error;
			reader.readAsDataURL(file);
		}

		wallCenterPoint () {
			var corners = this.walls[0].corners;
			var x = 0;
			var y = 0;
			for (var i = 0; i < corners.length; i++) {
				x += corners[i].x;
				y += corners[i].y;
			}
			return new Point(x / 4, y / 4);
		}

		updatePaintings () {
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
		}
	}

	export interface Screen {
		render (wally: Wally) : JQuery;
	}

	export class BackgroundScreen implements Screen {
		render (wally: Wally) : JQuery {
			let dom = $(`
			<div>
				<h2>1. Set a background image</h2>
				<p>Select an image of your wall on which the ceiling and floor corners visible.</p>
				<div id="filePreview"><img src="img/background-example.jpg"></div>
				<input id="file" type="file">
				<div id="fileError" class="error"></div>
				<input id="set" type="button" class="btn btn-disabled" value="Set" disabled>
			</div>
			`);

			var filePreview = dom.find("#filePreview");
			var file = dom.find("#file");
			var fileError = dom.find("#fileError");
			var set = dom.find("#set");

			file[0].addEventListener("change", () => {
				wally.loadImage((file[0] as HTMLInputElement).files[0] as File,
				(image: HTMLImageElement) => {
					wally.background = image;
					fileError.empty();
					filePreview.empty();
					filePreview.append(wally.background);
					set.attr("disabled", null);
					set.removeClass("btn-disabled");
				}, () => {
					filePreview.empty();
					fileError.empty();
					fileError.append("<p>Sorry, couldn't load the image.</p>");
					set.attr("disabled", "true");
					set.addClass("btn-disabled");
				});
			}, false);

			set.click(() => {
				wally.setScreen(new WallDefinitionScreen());
			});

			return dom;
		}
	}

	export class WallDefinitionScreen implements Screen {
		render (wally: Wally) : JQuery {
			let dom = $(`
				<div>
					<h2>2. Define wall corners</h2>
					<p>Move the handles to the walls corners and specify the height of your wall.</p>
					<label>Height (cm)</label>
					<input id="height" type="text" style="width: 10em;" value="258">
					<canvas id="canvas"></canvas>
					<input id="set" type="button" class="btn" value="Done">
				</div>
			`)

			var canvas = dom.find("#canvas")[0] as HTMLCanvasElement;
			canvas.width = wally.background.width;
			canvas.height = wally.background.height;
			var input = new Input(canvas);
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
			var selectedCorner: Point = null;

			var intersectCorners = (x: number, y: number, radius: number = 10) => {
				console.log(x + ", " + y);
				x = x / canvas.clientWidth * canvas.width;
				y = y / canvas.clientHeight * canvas.height;
				radius = radius / canvas.clientWidth * canvas.width;
				console.log(x + ", " + y);
				var mousePoint = new Point(x, y);
				var nearestDst: number= 100000000000;
				var nearest: Point = null;
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
				down: (x: number, y: number) => {
					selectedCorner = intersectCorners(x, y);
					if (selectedCorner) {
						x = x / canvas.clientWidth * canvas.width;
						y = y / canvas.clientHeight * canvas.height;
						offsetX = selectedCorner.x - x;
						offsetY = selectedCorner.y - y;
					}
				},
				up: (x: number, y: number) => {

				},
				dragged: (x: number, y: number) => {
					if (selectedCorner) {
						x = x / canvas.clientWidth * canvas.width;
						y = y / canvas.clientHeight * canvas.height;
						selectedCorner.x = x + offsetX;
						selectedCorner.y = y + offsetY;
					}
				},
				moved: (x: number, y: number) => {
					selectedCorner = intersectCorners(x, y);
				}
			} as InputListener);

			var loop = () => {
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
					var e = i == corners.length - 1? corners[0] : corners[i+1];
					ctx.beginPath()
					if (s == selectedCorner) ctx.fillStyle = "rgba(0, 200, 0, 0.5)";
					else ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
					ctx.ellipse(s.x, s.y, radius, radius, 0, 0, 360);
					ctx.fill();

					ctx.beginPath();
					ctx.moveTo(s.x, s.y);
					ctx.lineTo(e.x, e.y);
					ctx.stroke();
				}
			}
			loop();

			var height = dom.find("#height");
			var set = dom.find("#set");
			set.click(() => {
				wall.height = parseFloat(height.val());
				wally.setScreen(new PaintingDefinitionScreen());
			});

			return dom;
		}
	}

	export class PaintingDefinitionScreen implements Screen {
		render (wally: Wally) : JQuery {
			let dom = $(`
			<div>
				<h2>3. Define a painting</h2>
				<p>Select an image of your painting and define its width and height.</p>
				<label>Width (cm)</label>
				<input id="width" type="text" value="74">
				<label>Height (cm)</label>
				<input id="height" type="text" value="74">
				<div id="filePreview"><img src="img/painting-example.jpg"></div>
				<input id="file" type="file">
				<div id="fileError" class="error"></div>
				<input id="set" type="button" class="btn btn-disabled" value="Set" disabled>
			</div>
			`);

			var width = dom.find("#width");
			var height = dom.find("#height");
			var filePreview = dom.find("#filePreview");
			var file = dom.find("#file");
			var fileError = dom.find("#fileError");
			var set = dom.find("#set");

			var painting = new Painting();

			file[0].addEventListener("change", () => {
				wally.loadImage((file[0] as HTMLInputElement).files[0] as File,
				(image: HTMLImageElement) => {
					painting.image = image;
					fileError.empty();
					filePreview.empty();
					filePreview.append(image);
					set.attr("disabled", null);
					set.removeClass("btn-disabled");
				}, () => {
					filePreview.empty();
					fileError.empty();
					fileError.append("<p>Sorry, couldn't load the image.</p>");
					set.attr("disabled", "true");
					set.addClass("btn-disabled");
				});
			}, false);

			set.click(() => {
				painting.width = parseFloat(width.val());
				painting.height = parseFloat(height.val());
				wally.paintings.push(painting);
				wally.setScreen(new PaintingMoverScreen());
			});

			return dom;
		}
	}

	export class PaintingMoverScreen implements Screen {
		render (wally: Wally) : JQuery {
			let dom = $(`
				<div>
					<h2>4. Hang your painting!</h2>
					<p>Click a painting to add it to the wall. Double click a painting on the wall to delete it.</p>
					<input id="newPainting" type="button" class="btn" value="New Painting">
					<div id="paintings"></div>
					<canvas id="canvas"></canvas>
				</div>
			`);

			var paintingsDiv = dom.find("#paintings");
			for (var i = 0; i < wally.paintings.length; i++) {
				var painting = wally.paintings[i];
				var img = document.createElement("img");
				img.src = painting.image.src;
				(function(p:Painting) {
					$(img).click(() => {
						var hungPainting = p.copy();
						hungPainting.position = wally.wallCenterPoint();
						wally.hungPaintings.push(hungPainting);
						requestAnimationFrame(loop);
					});
				}) (painting);
				paintingsDiv.append(img);
			}

			dom.find("#newPainting").click(() => {
				wally.setScreen(new PaintingDefinitionScreen());
			})

			var canvas = dom.find("#canvas")[0] as HTMLCanvasElement;
			canvas.width = wally.background.width;
			canvas.height = wally.background.height;
			var input = new Input(canvas);
			var ctx = canvas.getContext("2d");

			var loop = () => {
				wally.updatePaintings();
				ctx.drawImage(wally.background, 0, 0);

				var lineWidth = 1;
				lineWidth = lineWidth / canvas.clientWidth * canvas.width;
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = "rgba(200, 0, 0, 0.5)";

				/*var corners = wally.walls[0].corners;
				for (var i = 0; i < corners.length; i++) {
					var s = corners[i];
					var e = i == corners.length - 1? corners[0] : corners[i+1];

					ctx.beginPath();
					ctx.moveTo(s.x, s.y);
					ctx.lineTo(e.x, e.y);
					ctx.stroke();
				}*/

				for (var j = 0; j < wally.hungPaintings.length; j++) {
					var painting = wally.hungPaintings[j];
					var corners = painting.corners;
					/*for (var i = 0; i < corners.length; i++) {
						var s = corners[i];
						var e = i == corners.length - 1? corners[0] : corners[i+1];
						ctx.fillStyle = "rgba(200, 0, 0, 0.5)";

						ctx.beginPath();
						ctx.moveTo(s.x, s.y);
						ctx.lineTo(e.x, e.y);
						ctx.stroke();
					}*/

					this.drawQuadrilateral(ctx, painting.image, painting.corners);
				}
			}
			loop();

			var offsetX = 0;
			var offsetY = 0;
			var selectedPainting: Painting = null;
			var dragged = false;
			input.addListener({
				down: (x: number, y: number) => {
					dragged = false;
					selectedPainting = null;
					x = x / canvas.clientWidth * canvas.width;
					y = y / canvas.clientHeight * canvas.height;
					var point = new Point(x, y);
					var paintings = wally.hungPaintings;
					for (var i = paintings.length - 1; i >= 0; i--) {
						var painting = paintings[i];
						if (this.isPointInPolygon(painting.corners, point)) {
							selectedPainting = painting;
							offsetX = selectedPainting.position.x - x;
							offsetY = selectedPainting.position.y - y;
							return;
						}
					}
				},
				up: (x: number, y: number) => {
					if (!dragged && selectedPainting) {
						var index = wally.hungPaintings.indexOf(selectedPainting);
						wally.hungPaintings.splice(index, 1);
						requestAnimationFrame(loop);
					}
					dragged = false;
				},
				dragged: (x: number, y: number) => {
					dragged = true;
					requestAnimationFrame(loop);
					if (selectedPainting) {
						x = x / canvas.clientWidth * canvas.width;
						y = y / canvas.clientHeight * canvas.height;
						selectedPainting.position.x = x + offsetX;
						selectedPainting.position.y = y + offsetY;
					}
				},
				moved: (x: number, y: number) => {
					requestAnimationFrame(loop);
				}
			} as InputListener);

			return dom;
		}

		private drawQuadrilateral (ctx: CanvasRenderingContext2D, img: HTMLImageElement, points: Point[]) {
			var p0 = points[0];
			var p1 = points[1];
			var p2 = points[2];
			var p3 = points[3];
			this.drawTriangle(ctx, img, p0.x, p0.y, 0, 0, p1.x, p1.y, 1, 0, p2.x, p2.y, 1, 1);
			this.drawTriangle(ctx, img, p0.x, p0.y, 0, 0, p2.x, p2.y, 1, 1, p3.x, p3.y, 0, 1);
		}

		private drawTriangle(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x0: number, y0: number, u0: number, v0: number,
			x1: number, y1: number, u1: number, v1: number,
			x2: number, y2: number, u2: number, v2: number) {

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

			var det = 1 / (u1*v2 - u2*v1),

			// linear transformation
			a = (v2*x1 - v1*x2) * det,
			b = (v2*y1 - v1*y2) * det,
			c = (u1*x2 - u2*x1) * det,
			d = (u1*y2 - u2*y1) * det,

			// translation
			e = x0 - a*u0 - c*v0,
			f = y0 - b*u0 - d*v0;

			ctx.save();
			ctx.transform(a, b, c, d, e, f);
			ctx.clip();
			ctx.drawImage(img, 0, 0);
			ctx.restore();
		}

		isPointInPolygon (polygon: Array<Point>, point:  Point) {
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
		}
	}
}
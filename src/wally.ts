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
		height: Number;

		constructor () {
			this.corners = new Array<Point>();
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.corners.push(new Point());
		}
	}

	export class Painting {
		image: HTMLImageElement;
		width: number;
		height: number;
		position: Point;
		corners: Array<Point>;

		constructor () {
			this.corners = new Array<Point>();
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.corners.push(new Point());
			this.position = new Point();
		}
	}

	export class Wally {
		body: JQuery;

		background: HTMLImageElement;
		walls = new Array<Wall>();
		paintings = new Array<Painting>();

		constructor () {
			this.body = $("#body");
			// this.setScreen(new BackgroundScreen());

			// TEST!
			var wall: Wall = {corners:[{"x":1518.72,"y":687.6800000000001},{"x":2759.68,"y":701.1200000000001},{"x":2728.32,"y":2139.2},{"x":1523.2,"y":2139.2}] as Point[], height :230} as Wall;
			this.walls.push(wall);
			var background = document.createElement("img");
			background.onload = () => {
				this.background = background;
				var painting = document.createElement("img");
				painting.onload = () => {
					var p = new Painting();
					p.width = 74;
					p.height = 74;
					p.image = painting;
					this.paintings.push(p);
					this.setScreen(new PaintingMoverScreen());
				}
				painting.src = "img/painting-example.jpg";
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

		updatePaintings () {

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
					<input id="height" type="text" style="width: 10em;" value="230">
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
					painting.width = parseFloat(width.val());
					painting.height = parseFloat(height.val());
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
					<canvas id="canvas"></canvas>
				</div>
			`);

			var canvas = dom.find("#canvas")[0] as HTMLCanvasElement;
			canvas.width = wally.background.width;
			canvas.height = wally.background.height;
			var input = new Input(canvas);
			var ctx = canvas.getContext("2d");

			var loop = () => {
				requestAnimationFrame(loop);

				wally.updatePaintings();
				ctx.drawImage(wally.background, 0, 0);

				for (var j = 0; j < wally.paintings.length; j++) {
					var painting = wally.paintings[j];
					var corners = painting.corners;
					for (var i = 0; i < corners.length; i++) {
						var s = corners[i];
						var e = i == corners.length - 1? corners[0] : corners[i+1];
						ctx.fillStyle = "rgba(200, 0, 0, 0.5)";

						ctx.beginPath();
						ctx.moveTo(s.x, s.y);
						ctx.lineTo(e.x, e.y);
						ctx.stroke();
					}
				}
			}
			loop();

			return dom;
		}
	}
}
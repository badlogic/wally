declare module wally {
    class Input {
        element: HTMLElement;
        lastX: number;
        lastY: number;
        buttonDown: boolean;
        currTouch: Touch;
        private listeners;
        constructor(element: HTMLElement);
        private setupCallbacks(element);
        addListener(listener: InputListener): void;
        removeListener(listener: InputListener): void;
    }
    class Touch {
        identifier: number;
        x: number;
        y: number;
        constructor(identifier: number, x: number, y: number);
    }
    interface InputListener {
        down(x: number, y: number): void;
        up(x: number, y: number): void;
        moved(x: number, y: number): void;
        dragged(x: number, y: number): void;
    }
}
declare module wally {
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        set(x: number, y: number): void;
        dst(point: Point): number;
    }
    class Wall {
        corners: Array<Point>;
        height: number;
        constructor();
    }
    class Painting {
        static nextId: number;
        id: number;
        image: HTMLImageElement;
        width: number;
        height: number;
        position: Point;
        corners: Array<Point>;
        constructor();
        copy(): Painting;
    }
    class Wally {
        body: JQuery;
        background: HTMLImageElement;
        walls: Wall[];
        paintings: Painting[];
        hungPaintings: Painting[];
        constructor();
        testSetup(): void;
        setScreen(screen: Screen): void;
        loadImage(file: File, success: (img: HTMLImageElement) => void, error: () => void): void;
        wallCenterPoint(): Point;
        updatePaintings(): void;
    }
    interface Screen {
        render(wally: Wally): JQuery;
    }
    class BackgroundScreen implements Screen {
        render(wally: Wally): JQuery;
    }
    class WallDefinitionScreen implements Screen {
        render(wally: Wally): JQuery;
    }
    class PaintingDefinitionScreen implements Screen {
        render(wally: Wally): JQuery;
    }
    class PaintingMoverScreen implements Screen {
        render(wally: Wally): JQuery;
        private drawQuadrilateral(ctx, img, points);
        private drawTriangle(ctx, img, x0, y0, u0, v0, x1, y1, u1, v1, x2, y2, u2, v2);
        isPointInPolygon(polygon: Array<Point>, point: Point): boolean;
    }
}

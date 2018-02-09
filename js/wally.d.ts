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
        height: Number;
        constructor();
    }
    class Painting {
        image: HTMLImageElement;
        width: number;
        height: number;
        position: Point;
        corners: Array<Point>;
        constructor();
    }
    class Wally {
        body: JQuery;
        background: HTMLImageElement;
        walls: Wall[];
        paintings: Painting[];
        constructor();
        setScreen(screen: Screen): void;
        loadImage(file: File, success: (img: HTMLImageElement) => void, error: () => void): void;
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
    }
}

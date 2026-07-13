export type SceneId =
  | "flower-wall-lamp"
  | "wire-bird-nest"
  | "tile-moss"
  | "circle-moss"
  | "boardwalk-snail"
  | "plumeria-bop-cat"
  | "totoro-lighthouse";

export type SceneItem = {
  id: SceneId;
  title: string;
  image: string;
};

export const defaultSceneId: SceneId = "flower-wall-lamp";

export const sceneItems: SceneItem[] = [
  {
    id: "flower-wall-lamp",
    title: "花牆路燈",
    image: "/gift-scenes/flower-wall-lamp.png",
  },
  {
    id: "wire-bird-nest",
    title: "鳥巢天空",
    image: "/gift-scenes/wire-bird-nest-readable.png",
  },
  {
    id: "tile-moss",
    title: "地磚苔癬",
    image: "/gift-scenes/tile-moss.webp",
  },
  {
    id: "circle-moss",
    title: "圓洞苔癬",
    image: "/gift-scenes/circle-moss-readable.png",
  },
  {
    id: "boardwalk-snail",
    title: "蝸牛第八棧道",
    image: "/gift-scenes/boardwalk-snail-readable.png",
  },
  {
    id: "plumeria-bop-cat",
    title: "花樹小路貓",
    image: "/gift-scenes/plumeria-bop-cat-readable.png",
  },
  {
    id: "totoro-lighthouse",
    title: "森林小屋",
    image: "/gift-scenes/totoro-lighthouse-readable.png",
  },
];

export const sceneMap: Record<SceneId, SceneItem> = Object.fromEntries(
  sceneItems.map((scene) => [scene.id, scene]),
) as Record<SceneId, SceneItem>;

export function resolveSceneId(value: string | null | undefined): SceneId {
  return value && value in sceneMap ? (value as SceneId) : defaultSceneId;
}

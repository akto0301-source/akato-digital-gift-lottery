export type SceneId =
  | "campus-plumeria"
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

export const defaultSceneId: SceneId = "campus-plumeria";

export const sceneItems: SceneItem[] = [
  {
    id: "campus-plumeria",
    title: "校園雞蛋花",
    image: "/gift-scenes/campus-plumeria.webp",
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
    title: "雞蛋花天堂鳥步道乳牛貓",
    image: "/gift-scenes/plumeria-bop-cat-readable.png",
  },
  {
    id: "totoro-lighthouse",
    title: "龍貓燈塔",
    image: "/gift-scenes/totoro-lighthouse-readable.png",
  },
];

export const sceneMap: Record<SceneId, SceneItem> = Object.fromEntries(
  sceneItems.map((scene) => [scene.id, scene]),
) as Record<SceneId, SceneItem>;

export function resolveSceneId(value: string | null | undefined): SceneId {
  return value && value in sceneMap ? (value as SceneId) : defaultSceneId;
}

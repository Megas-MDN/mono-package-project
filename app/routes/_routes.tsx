import { ChatRouter } from "./ChatRouter";
import { HomeRouter } from "./HomeRouter";
import { UsersRouter } from "./UsersRouter";
import { PostsRouter } from "./PostsRouter";
import { AuthRoutes } from "./AuthRouter";

export const routeWihtoutLayout = [
  ...AuthRoutes,
];

export const mainRoutes = [
  // DefaultRouter,
  HomeRouter,
  ChatRouter,
  UsersRouter,
  PostsRouter,
  // DIARouter,
  // IPTransitRouter,
  // Lan2LanRouter,
  // RegistersRouter,
  // SettingsRouter,
];

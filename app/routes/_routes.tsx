import { ChatRouter } from "./ChatRouter";
import { HomeRouter } from "./HomeRouter";
import { UsersRouter } from "./UsersRouter";
import { PostsRouter } from "./PostsRouter";

export const routeWihtoutLayout = [
  // LoginRouter,
  // RegisterRouter,
  // VerifyPinCodeRouter,
  // RecoverAccountRouter,
  // RestorePasswordRouter,
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

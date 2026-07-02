import { Router } from "express";
import { playlistsPlaceholder } from "./playlists.controller";

export const playlistsRouter = Router();

playlistsRouter.all("*", playlistsPlaceholder);


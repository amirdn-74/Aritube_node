import { Request, Response, NextFunction } from "express";
import validateObjectId from "../../helpers/validateObjectId";
import validation from "../../helpers/validation";
import Playlist from "../../models/Playlist";
import { IPlaylist } from "../../schema/interface/IPlaylist";
import createPlaylistValidationSchema from "../../schema/validation/createPlaylist.validationSchema";
import updatePlaylistValidationSchema from "../../schema/validation/UpdatePlaylist.validationSchema";

export const createPlaylistValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = await validation(req.body, createPlaylistValidationSchema());
  if (errors) return res.status(400).send(errors.inner);

  next();
};

export const updatePlaylistValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = validateObjectId.single(req.params.id);
  if (!id) return res.status(404).send();

  const playlist = <IPlaylist>await Playlist.findById(id);
  if (!playlist) return res.status(404).send();

  const errors = await validation(req.body, updatePlaylistValidationSchema());
  if (errors) return res.status(400).send(errors.inner);

  req.playlist = playlist;

  next();
};

export const deletePlaylistValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ids = req.body.playlists;

  if (ids.length === 0) return res.status(400).send();

  if (validateObjectId.many(ids).length === 0) return res.status(400).send();

  next();
};

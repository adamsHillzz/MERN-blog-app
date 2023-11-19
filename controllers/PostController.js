import PostModel from "../models/Post.js";

import { validationResult } from "express-validator";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    await PostModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $inc: { viewCount: 1 },
      },
      {
        returnDocument: "after",
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }

        res.json(doc);
      })
      .catch((err) => {
        console.log(err);

        return res.status(500).json({
          message: "Не удалось получить статью",
        });
      });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      user: req.userId,
      imagerUrl: req.body.imageUrl,
    });

    const post = await doc.save();

    res.send(post);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);

        res.status(500).json({
          message: "Не удалось удалить статью",
        });
      });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);

        res.status(500).json({
          message: "Не удалось обновить статью",
        });
      });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};

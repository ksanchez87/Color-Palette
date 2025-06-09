import express, { Express, Request, Response } from "express";
import type { ColorPalette, ColorRequest } from "./types/types";
import { randomUUID } from "crypto";
import path from "path";

const app: Express = express();
const PORT = process.env.PORT || 3000;

const colors: ColorPalette[] = [];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS del frontend)
app.use(express.static(path.join(__dirname, "..", "public")));

// API para obtener todas las paletas
app.get("/getAll", (_req: Request, res: Response) => {
  res.json(colors);
});

// Registrar una nueva paleta
app.post("/register", (req: Request, res: Response) => {
  const { title, color1, color2, color3, color4 }: ColorRequest = req.body;

  const values = [color1, color2, color3, color4];
  const map: Map<string, number> = new Map();

  values.forEach((value) => {
    map.set(value, (map.get(value) || 0) + 1);
  });

  const repeated = [...map.values()].some((count) => count > 1);

  if (repeated) {
    res.send("Valores repetidos");
  } else {
    colors.push({
      id: randomUUID(),
      title,
      color1,
      color2,
      color3,
      color4,
    });
    res.redirect("/");
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

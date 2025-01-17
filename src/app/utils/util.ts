export class Util {
  //Dado un una ruta de imagen la convierte
  static getImageDataUrl(localPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let canvas = document.createElement("canvas");
      let img = new Image();
      img.onload = () => {
        canvas.height = img.height;
        canvas.width = img.width;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject("Imagen no disponible");
      img.src = localPath;
    });
  }
}

namespace engine {
    export namespace RES {
        var config = new Array<ResourcesData>();
        var RESOURCE_PATH = "././Resources/";
        export function getRes(path: string) {
            let image = document.createElement("img");
            image.src = RESOURCE_PATH + path;
            if(onload){

            }
            return image;
            /* return new Promise(function (resolve, reject) {
                 var result = new Image();
                 result.src = RESOURCE_PATH + path;
                 result.onload = () => {
                     resolve(result);
                 }
             });*/
        }

        //config配置文件，没有实在图片
        //images：加载好的图片
        //image：当前正在加载的图片
        export function loadConfig(callback: (completedImages) => void) {
            var images = [];
            var i = 0;
            config.forEach((imageConfig) => {
                var image = new Image();
                image.width = imageConfig.width;
                image.height = imageConfig.height;
                image.name = imageConfig.texture;
                image.onload = () => {
                    i++;
                    images.push(image);
                    if (i == config.length - 1) {
                        callback(images);
                    }
                }
            })

        }
    }

    class ResourcesData {
        texture: string;
        width: number = -1;
        height: number = -1;
        constructor(texture: string, width?: number, height?: number) {
            this.texture = texture;
            if (width && height) {
                this.width = width;
                this.height = height;
            }
        }
    }

    var imageJason = {
        "image":[
            {
                "name": "senpai.png",
                "width": 10,
                "height": 10
            }
        ]
    }
}



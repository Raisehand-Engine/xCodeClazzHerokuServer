const { image_containers } = require("./RaisehandCloudinaryImageService");

var ImageContainerConfig;
{
    class ConfigV1 {

        static #configAndroid = {
            key: PLATFORMS.ANDROID,
            value: {
                [APP_NAMES.END]: image_containers?.image_container_raisehand,
                [APP_NAMES.SHOP]: image_containers?.image_container_raisehand,
                [APP_NAMES.ADMIN]: image_containers?.image_container_raisehand,
                [APP_NAMES.CONTRIBUTOR]: image_containers?.image_container_raisehand,
            }
        }

        static #configDesktop = {
            key: PLATFORMS.DESKTOP,
            value: {
                // ...
            }
        }

        static #configWeb = {
            // redirect page has a ad
            key: PLATFORMS.OTHER,
            value: {
                // ... route specify
            }
        }

        static get config() {
            return [this.#configAndroid, this.#configDesktop, this.#configWeb];
        }

        static android_end(to = image_containers.image_container_raisehand) {
            this.#configAndroid.value[APP_NAMES.END] = to;
        }

        static android_shop(to = image_containers.image_container_raisehand) {
            this.#configAndroid.value[APP_NAMES.SHOP] = to;
        }

        static android_contributor(to = image_containers.image_container_raisehand) {
            this.#configAndroid.value[APP_NAMES.CONTRIBUTOR] = to;
        }

        static android_admin(to = image_containers.image_container_raisehand) {
            this.#configAndroid.value[APP_NAMES.ADMIN] = to;
        }

        static see(platform, appname, to = image_containers.image_container_raisehand) {
            switch (platform) {
                case PLATFORMS.ANDROID:
                    switch (appname) {
                        case APP_NAMES.END:
                            return this.android_end(to);
                        case APP_NAMES.SHOP:
                            return this.android_shop(to);
                        case APP_NAMES.CONTRIBUTOR:
                            return this.android_contributor(to);
                        case APP_NAMES.ADMIN:
                            return this.android_admin(to);
                        default:
                            break;
                    }
                    break;
                case PLATFORMS.OTHER:
                case PLATFORMS.DESKTOP:
                    break;
                default:
                    break;
            }
        }

    }
    class ConfigV2 {
        constructor() { }
    }
    ImageContainerConfig = class _ {
        constructor() { }
        static get ic_configV1() {
            return ConfigV1.config;
        }
        static get methods() {
            return ConfigV1;
        }
    }
}

module.exports = ImageContainerConfig;
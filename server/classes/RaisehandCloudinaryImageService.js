// Please don't change these, these won't change, you can add more here if you got
// other cloudinary accounts with free space, make sure you also add these to client side as well

// --Areas should be effected--,
// .env
// README.md
// factory method
// Digital Ocean Documents/
// client side add new ic_name, encrypt api, secret, app, electron

const image_containers = {
    image_container_c1hm: "c1hm",
    image_container_c2hm: "c2hm",
    image_container_c3hm: "c3hm",
    image_container_c4hm: "c4hm",
    image_container_c1ym: "c1ym",
    image_container_c2ym: "c2ym",
    image_container_c1pm: "c1pm",
    image_container_oh920: "oh920",
    image_container_th920: "th920",
    image_container_fh920: "fh920",
    image_container_vg_rh: "vg-rh",
    image_container_gg920: "gg920",
    image_container_c1aol: "c1aol",
    image_container_gg920_gg: "gg920-gg",
    image_container_gg420_840: "gg420-840",
    image_container_raisehand: "raisehand",
    image_container_fivehox920: "fivehox920",
    image_container_threehox920: "threehox920",
    image_container_raisehand_software: "raisehand-software",
}

const static_images = {
    WHITE_STRIP_RH_IMAGE_PLACEHOLDER: { url: 'v1629193238/placeholders/rjhktttgpzjkpcgkqxb0.png', imageContainer: image_containers.image_container_raisehand },
    BLACK_STRIP_RH_IMAGE_PLACEHOLDER: { url: 'v1629193238/placeholders/xuyswdzhp420kjvlcflk.png', imageContainer: image_containers.image_container_raisehand },
    USER_AVATAR: { url: 'v1617597744/placeholders/bs31ctfmkv59ekurxi5a.png', image_containers: image_containers.image_container_raisehand },
    NO_IMAGE: { url: 'v1608273379/placeholders/d4hvycei5ymlp0gtxdvd.jpg', image_containers: image_containers.image_container_raisehand },
    MOTIVATION: { url: 'v1616479613/placeholders/pbqkohwfny6ng1jmybw2.png', imageContainer: image_containers.image_container_raisehand },
    UNLOCKED: { url: 'v1616479296/placeholders/jdvputblyc451xgsz7xc.jpg', imageContainer: image_containers.image_container_raisehand },
    NAMASTE: { url: 'v1616479690/placeholders/vhgbfynhonxtpji3st4i.jpg', imageContainer: image_containers.image_container_raisehand },
    UPDATED: { url: 'v1616479390/placeholders/ejtlga0ilhoq3iffcdib.png', imageContainer: image_containers.image_container_raisehand },
    IDEA: { url: 'v1616479006/placeholders/vdz8krgvnm195ovub57k.jpg', imageContainer: image_containers.image_container_raisehand },
}

function base_cloudinary_url_for(image_container = image_containers.image_container_raisehand) {
    return `https://res.cloudinary.com/--imageContainer--/image/upload/`.replace('--imageContainer--', image_container);
}

// class copied from electron application
class RaisehandCloudinaryImageService {

    constructor(env = 'dev') {
        this.env = env;
        this.FOLDER_NAMES = {
            productRepositories: "productRepositories",
            raisehandUsers: "raisehandUsers",
            shopProfiles: "shopProfiles",
            repoProducts: "repoProducts",
        }
    }

    removeBaseImageUrl(imageContainer, fullPath = "") {
        if (fullPath == null) return static_images.BLACK_STRIP_RH_IMAGE_PLACEHOLDER.url;
        return fullPath.replace(this.getBaseImageUrl(imageContainer), "");
    }

    removeBaseImageUrl(imageContainer, fullPathUrls = {}) {
        const result = {};
        for (let key of Object.keys(fullPathUrls))
            result[this.removeBaseImageUrl(imageContainer, key)] = this.removeBaseImageUrl(imageContainer, fullPathUrls[key]);
        return result;
    }

    getBaseImageUrl(imageContainer) {
        return this.getGeneratedImagePath(imageContainer, "");
    }

    getGeneratedImagePath(imageContainer, partialImagePath = "") {
        return base_cloudinary_url_for(imageContainer) + partialImagePath;
    }

    getGeneratedImagePaths(imageContainer, partialImagePaths = []) {
        const completePaths = [];
        if (partialImagePaths == null) return completePaths;
        for (let pth of partialImagePaths)
            completePaths.add(this.getGeneratedImagePath(imageContainer, pth));
        return completePaths;
    }

    /**
     * FOLDER PATH CREATION FOR RAISEHAND CLOUD SERVICE
     */

    raisehandUsersPath(emailId) {
        return this.env + "/" + this.FOLDER_NAMES.raisehandUsers + "/" + emailId + "/avatar/";
    }

    productRepositoryPath(repoID, repoName) {
        return this.env + "/" + this.FOLDER_NAMES.productRepositories + "/" + repoID + "/avatar/" + repoName + "/";
    }

    shopProfilesPath(shopID, indexFigure, flavour) {
        return this.env + "/" + this.FOLDER_NAMES.shopProfiles + "/" + shopID + "-#" + indexFigure + "/" + flavour + "/";
    }

    repoProductsPath(prodID) {
        return this.env + "/" + this.FOLDER_NAMES.repoProducts + "/" + prodID + "/";
    }

    /**
     * HELPERs
     */

    static imageExt() { return ".jpg"; }
    static removeExtention(mes = "") { return mes.replace(/\.[^/.]+$/, ""); }
    static removeCloudinaryBaseUrl(imageContainer, mes = "") { return mes.replace(base_cloudinary_url_for(imageContainer), ""); }
    static getPublicIdWithoutVersion(imageContainer, mes = "") {
        const slash = '/';
        let unpurePublicId = this.removeCloudinaryBaseUrl(imageContainer, mes).split(slash);
        if (unpurePublicId.length == 1) return unpurePublicId.join(slash);
        if (unpurePublicId[0] == this.env) return unpurePublicId.join(slash);
        return unpurePublicId.splice(1, unpurePublicId.length).join(slash);
    }

    static ic_raisehand() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_raisehand,
            api_secret: process.env.cloudinary_apiSecret_raisehand,
            api_key: process.env.cloudinary_apiKey_raisehand,
        });
        return o;
    }

    static ic_raisehand_software() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_raisehand_software,
            api_secret: process.env.cloudinary_apiSecret_raisehand_software,
            api_key: process.env.cloudinary_apiKey_raisehand_software,
        });
        return o;
    }

    static ic_gg920() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_gg920,
            api_secret: process.env.cloudinary_apiSecret_gg920,
            api_key: process.env.cloudinary_apiKey_gg920,
        });
        return o;
    }

    static ic_vg_rh() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_vg_rh,
            api_secret: process.env.cloudinary_apiSecret_vg_rh,
            api_key: process.env.cloudinary_apiKey_vg_rh,
        });
        return o;
    }

    static ic_gg920_gg() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_gg920_gg,
            api_secret: process.env.cloudinary_apiSecret_gg920_gg,
            api_key: process.env.cloudinary_apiKey_gg920_gg,
        });
        return o;
    }

    static ic_gg420_840() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_gg420_840,
            api_secret: process.env.cloudinary_apiSecret_gg420_840,
            api_key: process.env.cloudinary_apiKey_gg420_840,
        });
        return o;
    }

    static ic_c1hm() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_c1hm,
            api_secret: process.env.cloudinary_apiSecret_c1hm,
            api_key: process.env.cloudinary_apiKey_c1hm,
        });
        return o;
    }

    static ic_c2hm() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_c2hm,
            api_secret: process.env.cloudinary_apiSecret_c2hm,
            api_key: process.env.cloudinary_apiKey_c2hm,
        });
        return o;
    }

    static ic_c3hm() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_c3hm,
            api_secret: process.env.cloudinary_apiSecret_c3hm,
            api_key: process.env.cloudinary_apiKey_c3hm,
        });
        return o;
    }

    static ic_c4hm() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_c4hm,
            api_secret: process.env.cloudinary_apiSecret_c4hm,
            api_key: process.env.cloudinary_apiKey_c4hm,
        });
        return o;
    }

    static ic_c1ym() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_c1ym,
            api_secret: process.env.cloudinary_apiSecret_c1ym,
            api_key: process.env.cloudinary_apiKey_c1ym,
        });
        return o;
    }

    static ic_c2ym() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_c2ym,
            api_secret: process.env.cloudinary_apiSecret_c2ym,
            api_key: process.env.cloudinary_apiKey_c2ym,
        });
        return o;
    }

    static ic_c1pm() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_c1pm,
            api_secret: process.env.cloudinary_apiSecret_c1pm,
            api_key: process.env.cloudinary_apiKey_c1pm,
        });
        return o;
    }

    static ic_c1aol() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_c1aol,
            api_secret: process.env.cloudinary_apiSecret_c1aol,
            api_key: process.env.cloudinary_apiKey_c1aol,
        });
        return o;
    }

    static ic_oh920() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_oh920,
            api_secret: process.env.cloudinary_apiSecret_oh920,
            api_key: process.env.cloudinary_apiKey_oh920,
        });
        return o;
    }

    static ic_th920() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_th920,
            api_secret: process.env.cloudinary_apiSecret_th920,
            api_key: process.env.cloudinary_apiKey_th920,
        });
        return o;
    }

    static ic_fh920() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_fh920,
            api_secret: process.env.cloudinary_apiSecret_fh920,
            api_key: process.env.cloudinary_apiKey_fh920,
        });
        return o;
    }

    static ic_fivehox920() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_fivehox920,
            api_secret: process.env.cloudinary_apiSecret_fivehox920,
            api_key: process.env.cloudinary_apiKey_fivehox920,
        });
        return o;
    }

    static ic_threehox920() {
        const o = require('cloudinary').v2;
        o.config({
            cloud_name: process.env.cloudinary_cloudName_threehox920,
            api_secret: process.env.cloudinary_apiSecret_threehox920,
            api_key: process.env.cloudinary_apiKey_threehox920,
        });
        return o;
    }

    static async ic_info(ic = image_containers.image_container_raisehand) {
        if (ic === image_containers.image_container_raisehand) return { ...await this.ic_raisehand().api.usage({}), ic: image_containers.image_container_raisehand }
        else if (ic === image_containers.image_container_c1hm) return { ...await this.ic_c1hm().api.usage({}), ic: image_containers.image_container_c1hm }
        else if (ic === image_containers.image_container_c2hm) return { ...await this.ic_c2hm().api.usage({}), ic: image_containers.image_container_c2hm }
        else if (ic === image_containers.image_container_c3hm) return { ...await this.ic_c3hm().api.usage({}), ic: image_containers.image_container_c3hm }
        else if (ic === image_containers.image_container_c4hm) return { ...await this.ic_c4hm().api.usage({}), ic: image_containers.image_container_c4hm }
        else if (ic === image_containers.image_container_c1ym) return { ...await this.ic_c1ym().api.usage({}), ic: image_containers.image_container_c1ym }
        else if (ic === image_containers.image_container_c2ym) return { ...await this.ic_c2ym().api.usage({}), ic: image_containers.image_container_c2ym }
        else if (ic === image_containers.image_container_c1pm) return { ...await this.ic_c1pm().api.usage({}), ic: image_containers.image_container_c1pm }
        else if (ic === image_containers.image_container_vg_rh) return { ...await this.ic_vg_rh().api.usage({}), ic: image_containers.image_container_vg_rh }
        else if (ic === image_containers.image_container_gg920) return { ...await this.ic_gg920().api.usage({}), ic: image_containers.image_container_gg920 }
        else if (ic === image_containers.image_container_c1aol) return { ...await this.ic_c1aol().api.usage({}), ic: image_containers.image_container_c1aol }
        else if (ic === image_containers.image_container_oh920) return { ...await this.ic_oh920().api.usage({}), ic: image_containers.image_container_oh920 }
        else if (ic === image_containers.image_container_th920) return { ...await this.ic_th920().api.usage({}), ic: image_containers.image_container_th920 }
        else if (ic === image_containers.image_container_fh920) return { ...await this.ic_fh920().api.usage({}), ic: image_containers.image_container_fh920 }
        else if (ic === image_containers.image_container_gg920_gg) return { ...await this.ic_gg920_gg().api.usage({}), ic: image_containers.image_container_gg920_gg }
        else if (ic === image_containers.image_container_gg420_840) return { ...await this.ic_gg420_840().api.usage({}), ic: image_containers.image_container_gg420_840 }
        else if (ic === image_containers.image_container_fivehox920) return { ...await this.ic_fivehox920().api.usage({}), ic: image_containers.image_container_fivehox920 }
        else if (ic === image_containers.image_container_threehox920) return { ...await this.ic_threehox920().api.usage({}), ic: image_containers.image_container_threehox920 };
        else if (ic === image_containers.image_container_raisehand_software) return { ... await this.ic_raisehand_software().api.usage({}), ic: image_containers.image_container_raisehand_software }
        else return await new Promise((resolve, reject) => resolve(null)); // bydefault
    }

    static ic_instance(ic = image_containers.image_container_raisehand) {
        if (ic === image_containers.image_container_raisehand) return this.ic_raisehand();
        else if (ic === image_containers.image_container_c1hm) return this.ic_c1hm();
        else if (ic === image_containers.image_container_c2hm) return this.ic_c2hm();
        else if (ic === image_containers.image_container_c3hm) return this.ic_c3hm();
        else if (ic === image_containers.image_container_c4hm) return this.ic_c4hm();
        else if (ic === image_containers.image_container_c1ym) return this.ic_c1ym();
        else if (ic === image_containers.image_container_c2ym) return this.ic_c2ym();
        else if (ic === image_containers.image_container_c1pm) return this.ic_c1pm();
        else if (ic === image_containers.image_container_vg_rh) return this.ic_vg_rh();
        else if (ic === image_containers.image_container_gg920) return this.ic_gg920();
        else if (ic === image_containers.image_container_c1aol) return this.ic_c1aol();
        else if (ic === image_containers.image_container_oh920) return this.ic_oh920();
        else if (ic === image_containers.image_container_th920) return this.ic_th920();
        else if (ic === image_containers.image_container_fh920) return this.ic_fh920();
        else if (ic === image_containers.image_container_gg920_gg) return this.ic_gg920_gg();
        else if (ic === image_containers.image_container_gg420_840) return this.ic_gg420_840();
        else if (ic === image_containers.image_container_fivehox920) return this.ic_fivehox920();
        else if (ic === image_containers.image_container_threehox920) return this.ic_threehox920();
        else if (ic === image_containers.image_container_raisehand_software) return this.ic_raisehand_software();
        else return this.ic_raisehand(); // bydefault
    }

}

module.exports = {
    RaisehandCloudinaryImageService,
    image_containers,
    static_images,
};
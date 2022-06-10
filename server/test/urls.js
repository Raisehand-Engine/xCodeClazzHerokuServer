// Routes Paths
exports.POST_INDEXING_USERS = `/v1/api/helper/indexing/users`;
exports.POST_INDEXING_SHOPS = `/v1/api/helper/indexing/shops`;
exports.POST_CURRENCIES_ALL = `/v1/api/helper/currencies/all`;
exports.POST_CATEGORIES_ALL = `/v1/api/helper/categories/all`;
exports.POST_SECRETKEYS_ALL = `/v1/api/helper/secretKeys/all`;
exports.POST_COUNTRIES_ALL = `/v1/api/helper/countries/all`;
exports.POST_COUNTERS_ALL = `/v1/api/helper/counters/all`;
exports.POST_SIUNITS_ALL = `/v1/api/helper/siUnits/all`;

exports.GET_HOME = `/v1`;
exports.GET_INIT = `/v1/__init__`;
exports.GET_API_BLOCK_PASSWORD = `/v1/api/block/:password`;
exports.GET_API_UNBLOCK_PASSWORD = `/v1/api/unblock/:password`;
exports.GET_ADS_BLOCK_PLATFORM_XCODECLAZZ_PASSWORD = `/v1/ads/block/:platform/:appname/:password`;
exports.GET_ADS_UNBLOCK_PLATFORM_XCODECLAZZ_PASSWORD = `/v1/ads/unblock/:platform/:appname/:password`;
exports.GET_ICS_CONFIG_CHANGE_PLATFORM_XCODECLAZZ_IMAGE_CONTAINER_PASSWORD = `/v1/ic_config/change/:platform/:appname/:image_container/:password`;
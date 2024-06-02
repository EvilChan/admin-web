/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getPrivateKey } = require("./utils.cjs");

/**
 * @type {import("ssh2-sftp-client").ConnectOptions[]}
 */
exports.staging = [
    {
        // 服务器ip地址
        host: "",
        // 服务器用户
        username: "",
        // 私钥文件名称
        privateKey: getPrivateKey("id_ed25519"),
        // 部署路径
        path: "/path/to",
        // 备份路径
        backupPath: "/path/to"
    },
];

/**
 * @type {import("ssh2-sftp-client").ConnectOptions[]}
 */
exports.production = [
    {
        // 服务器ip地址
        host: "",
        // 服务器用户
        username: "",
        // 私钥文件名称
        privateKey: getPrivateKey("id_ed25519"),
        // 部署路径
        path: "/path/to",
        // 备份路径
        backupPath: "/path/to"
    },
];

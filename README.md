# admin-web

## 项目环境
> 本项目必须使用 pnpm 包管理环境

## 使用版本

> node: v20.12.2

> pnpm: 9.1.0

## 项目开发运行

```shell
pnpm run dev
```

## 项目打包

```shell
pnpm run build
```

## 项目部署

```shell
# staging 环境
pnpm run deploy:staging

# production 环境
pnpm run deploy:prod
```

## scripts/config.cjs （项目部署脚本相关）

exports.staging 与 .env.staging 与 package.json 中的 script 里的 build:staging 相关。exports.production 以此类推

> 注：私钥名称必须存在，否则脚本报错


```javascript
const { getPrivateKey } = require("./utils.cjs");

/**
 * @type {import("ssh2-sftp-client").ConnectOptions[]}
 */
exports.staging = [
    {
        // 服务器ip地址
        host: "0.0.0.0",
        // 服务器用户
        username: "xxx",
        // 私钥文件名称（不使用私钥，可以替换成密码字段，password）
        privateKey: getPrivateKey("xxx_id_rsa"),
        // 部署路径
        path: "/path/to/...",
        // 备份路径
        backupPath: "/path/to/...",
    },
];

/**
 * @type {import("ssh2-sftp-client").ConnectOptions[]}
 */
exports.production = [
    {
        // 服务器ip地址
        host: "0.0.0.0",
        // 服务器用户
        username: "xxx",
        // 私钥文件名称
        privateKey: getPrivateKey("xxx_id_rsa"),
        // 部署路径
        path: "/path/to/...",
        // 备份路径
        backupPath: "/path/to/...",
    },
];
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### 遇到的各种奇怪问题

1. 开始时使用nextjs14 app router，发现nextjs13以后配合koa会有无法[正确写入返回值问题](https://github.com/vercel/next.js/issues/65691)

2. 尝试替换使用nextjs提供的api接口，发现和主流数据库框架结合有问题（typeorm、knex），会报找不到[引用错误](https://github.com/vercel/next.js/issues/53944)

3. 干脆先降到12，反正不是很想用rsc功能，刚好解决koa问题。然后又有antd[服务端渲染问题](https://ant.design/docs/react/server-side-rendering-cn)和[初始化渲染闪屏问题](https://ant.design/docs/react/use-with-next-cn)

4. antd有样式优先级问题，自己定义的样式优先级较低，一开始使用[layer方式](https://ant.design/docs/react/compatible-style-cn)降权，却发现会导致初始化渲染不能正常渲染antd样式，主要表现为初始渲染时padding为0，然后才慢慢移动到正确的位置，最后通过[添加自定义前缀](https://ant.design/docs/react/compatible-style-cn#where-%E9%80%89%E6%8B%A9%E5%99%A8)增加优先级解决

### TODO LIST

[] user表，增加表权限字段
[] table表，表名（英文）、显示名、权限用户、关联列
[] column表：列名、列显示名、类型、使用控件、备注

   控件数据：配置、来自其他表的列


[] request log、errorhandler
[] database log


### 记录命令

docker run -e POSTGRESQL_PASSWORD=123456 --name sonoda_postsql -p 5432:5432 -d 685c84f6023e
winpty docker exec -it sonoda_postsql bash
psql -U postgres
SELECT table_name FROM information_schema.tables WHERE table_schema='public';

ts-node -O {"module": "commonjs"} test.ts

### その他

json存储的字段服务端最好不要用值，感觉会被服务端注入
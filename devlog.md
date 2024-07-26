### 遇到的各种奇怪问题

1. 开始时使用nextjs14 app router，发现nextjs13以后配合koa会有无法[正确写入返回值问题](https://github.com/vercel/next.js/issues/65691)

2. 尝试替换使用nextjs提供的api接口，发现和主流数据库框架结合有问题（typeorm、knex），会报找不到[引用错误](https://github.com/vercel/next.js/issues/53944)

3. 干脆先降到12，反正不是很想用rsc功能，刚好解决koa问题。然后又有antd[服务端渲染问题](https://ant.design/docs/react/server-side-rendering-cn)和[初始化渲染闪屏问题](https://ant.design/docs/react/use-with-next-cn)

4. antd有样式优先级问题，自己定义的样式优先级较低，一开始使用[layer方式](https://ant.design/docs/react/compatible-style-cn)降权，却发现会导致初始化渲染不能正常渲染antd样式，主要表现为初始渲染时padding为0，然后才慢慢移动到正确的位置，最后通过[添加自定义前缀](https://ant.design/docs/react/compatible-style-cn#where-%E9%80%89%E6%8B%A9%E5%99%A8)增加优先级解决

### 记录命令

docker run -e POSTGRESQL_PASSWORD=123456 --name sonoda_postsql -p 5432:5432 -d 685c84f6023e
winpty docker exec -it sonoda_postsql bash
psql -U postgres
SELECT table_name FROM information_schema.tables WHERE table_schema='public';

npx ts-node --project tsconfig.server.json test.ts

### CHANGELOG

`20240719`
https://github.com/vercel/next.js/issues/65691
https://github.com/vercel/next.js/issues/10285
https://github.com/ant-design/ant-design/issues/47989

由于各种不可抗力原因，决定区分前后端服务器
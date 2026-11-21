# Pi Agent 服务：Node + DeepSeek
FROM node:22-slim

WORKDIR /app

# 安装依赖
COPY agent-service/package.json ./
RUN npm install

# 复制源码与提示词
COPY agent-service/src ./src
COPY agent-service/prompts ./prompts

EXPOSE 3000

CMD ["npm", "start"]

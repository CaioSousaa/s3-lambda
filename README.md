# infra-lambda-app

## Descrição do projeto

Monorepo que implementa um fluxo de **upload de arquivos CSV** para a **Amazon S3**, com API REST documentada e uma **função Lambda** disparada automaticamente quando novos objetos são criados no bucket (prefixo `uploads/`, sufixo `.csv`).

1. **csv-upload-api** — API NestJS que recebe o CSV via `multipart/form-data`, valida a extensão, faz o parse para contar linhas e envia o arquivo ao S3.
2. **infra** — Terraform que provisiona o bucket S3 (acesso privado, versionamento, criptografia SSE), a Lambda de monitoramento, papéis IAM, permissões de invocação pelo S3 e a notificação de eventos.
3. **lambda** — Handler Node.js acionado pelo S3; consulta metadados do objeto (e tags, quando existirem) e registra informações nos logs do CloudWatch, retornando um JSON com o resumo do processamento.

---

## Arquitetura do projeto (árvore de arquivos)

```
infra-lambda-app/
├── .gitignore
├── README.md
├── csv-upload-api/                 # API NestJS
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.mjs
│   ├── nest-cli.json
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── .prettierrc
│   └── src/
│       ├── main.ts                 # Bootstrap, Swagger em /api/docs
│       ├── modules/
│       │   ├── app/
│       │   │   └── app.module.ts   # Módulo raiz + ConfigModule
│       │   └── upload/
│       │       ├── upload.module.ts
│       │       ├── dto/
│       │       │   └── upload-response.dto.ts
│       │       ├── infra/
│       │       │   └── controller/
│       │       │       └── upload.controller.ts   # POST /upload
│       │       └── services/
│       │           └── upload.service.ts          # CSV + PutObject S3
│       └── utils/
│           └── memory-uploaded-file.ts
├── infra/                          # Terraform (AWS)
│   ├── main.tf                     # S3, Lambda, IAM, notificação
│   ├── variables.tf
│   ├── outputs.tf
│   ├── providers.tf
│   └── terraform.tfvars.example
└── lambda/                         # Código da Lambda (zip pelo Terraform)
    ├── index.js
    └── package.json
```

Arquivos locais comuns (não versionados): `csv-upload-api/.env`, `infra/terraform.tfvars`, `infra/lambda.zip`, `infra/.terraform/`, `**/node_modules/`.

---

## Stacks utilizadas

| Área | Tecnologia |
|------|------------|
| API | [NestJS](https://nestjs.com/) 11, [Node.js](https://nodejs.org/), [TypeScript](https://www.typescriptlang.org/) |
| HTTP / documentação | [Express](https://expressjs.com/) (via `@nestjs/platform-express`), [Swagger / OpenAPI](https://swagger.io/) (`@nestjs/swagger`, `swagger-ui-express`) |
| Configuração | [`@nestjs/config`](https://docs.nestjs.com/techniques/configuration), variáveis em `.env` |
| Upload e CSV | [Multer](https://github.com/expressjs/multer), [csv-parse](https://csv.js.org/parse/) |
| Validação | [class-validator](https://github.com/typestack/class-validator), [class-transformer](https://github.com/typestack/class-transformer) |
| AWS (aplicação) | [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/) — `@aws-sdk/client-s3` |
| Infraestrutura | [Terraform](https://www.terraform.io/) ≥ 1.6, providers [AWS](https://registry.terraform.io/providers/hashicorp/aws/latest) e [archive](https://registry.terraform.io/providers/hashicorp/archive/latest) |
| AWS (nuvem) | S3, Lambda (runtime Node.js 20.x), IAM, CloudWatch Logs |

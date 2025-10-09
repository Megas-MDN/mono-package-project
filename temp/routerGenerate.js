// routerGenerate.js
const fs = require("fs/promises");
const path = require("path");
const exec = require("child_process").exec;

const rootSrc = path.resolve("src");
const routerFolder = path.resolve(rootSrc, "routes");
const controllerFolder = path.resolve(rootSrc, "controllers");
const serviceFolder = path.resolve(rootSrc, "services");
const modelFolder = path.resolve(rootSrc, "models");
const constants = path.resolve(rootSrc, "constants");
const validations = path.resolve(rootSrc, "validations");

//********************************************* */
let newResourceName = ""; // O nome da rota aqui no singular/plural; ex.: "user" ou "users"
const hasLogs = false; // <---- ON/OFF Para criar com logs
//********************************************* */

const indexRouteFolder = "_index.ts";
const basePathFile = "basePathRoutes.ts";

const apiVersion = "V1";
const pointOfTheLastImport = `export const routes = Router();`;
const routeUseName = "routes.use";
let importMiddleAuth = "";//`import { auth } from "../auth";`;
let authName = ""; //"auth";
const customRequest = `import { CustomRequest } from "../types/custom";`;

console.clear();

const up1 = (word) => word.charAt(0).toUpperCase() + word.slice(1);
const toLashCase = (word) =>
  word
    .replace(/([A-Z])/g, "-$1")
    .trim()
    .toLowerCase();

const isPlural = (str) => str[str.length - 1] === "s";

/** singular para prisma: "users" -> "user", "user" -> "user" */
const singularOf = (str) => (isPlural(str) ? str.slice(0, -1) : str);

const routeIndexImportGen = async () => {
  const indexFile = await fs.readFile(
    path.resolve(routerFolder, indexRouteFolder),
    "utf8",
  );
  const newRouteFile = indexFile.split(pointOfTheLastImport);
  const newRouteFileWithImport =
    newRouteFile[0].trim() +
    `\nimport { ${newResourceName}Routes } from "./${newResourceName}.routes";\n\n` +
    pointOfTheLastImport +
    newRouteFile[1];

  const newRouteFileWithImportAndExportWithRoutes =
    newRouteFileWithImport + `${routeUseName}(${newResourceName}Routes);\n`;

  await fs.writeFile(
    path.resolve(routerFolder, indexRouteFolder),
    newRouteFileWithImportAndExportWithRoutes,
  );
};

const basePathFileGen = async () => {
  const basePath = await fs.readFile(
    path.resolve(constants, basePathFile),
    "utf8",
  );

  const [p1, p2] = basePath.split("export const ROOT_PATH = {");
  if (!p2) return;
  if (p2.toUpperCase().includes(newResourceName.toUpperCase())) return;
  const [ob1, ob2] = p2.split("};");
  const newLine =
    `${newResourceName.toUpperCase()}: "/${toLashCase(newResourceName)}",`.trim();

  const newBsePath =
    p1 + `export const ROOT_PATH = {` + ob1 + newLine + ob2 + `};`;
  await fs.writeFile(path.resolve(constants, basePathFile), newBsePath);
};

const routeFileGen = async () => {
  const route = `
import { Router } from "express";
import { ${up1(newResourceName)}Controller } from "../controllers/${up1(
    newResourceName,
  )}Controller";
${importMiddleAuth ? importMiddleAuth : ""}
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";

const BASE_PATH = API_VERSION.${apiVersion} + ROOT_PATH.${newResourceName.toUpperCase()}; // /api/${apiVersion.toLowerCase()}/${toLashCase(newResourceName)}

const ${newResourceName}Routes = Router();

const ${newResourceName}Controller = new ${up1(newResourceName)}Controller();
  
${newResourceName}Routes.get(\`\${BASE_PATH}\`${authName ? `, ${authName}` : ""}, async (req, res) => { await ${newResourceName}Controller.listAll(req, res) });

${newResourceName}Routes.get(\`\${BASE_PATH}/:id${up1(newResourceName)}\`${authName ? `, ${authName}` : ""}, async (req, res) => {
  await ${newResourceName}Controller.getById(req, res);
});

${newResourceName}Routes.post(\`\${BASE_PATH}\`${authName ? `, ${authName}` : ""}, async (req, res) => {
  await ${newResourceName}Controller.create(req, res);
});

${newResourceName}Routes.put(\`\${BASE_PATH}/:id${up1(newResourceName)}\`${authName ? `, ${authName}` : ""}, async (req, res) => {
  await ${newResourceName}Controller.update(req, res);
});

${newResourceName}Routes.delete(\`\${BASE_PATH}/:id${up1(newResourceName)}\`${authName ? `, ${authName}` : ""}, async (req, res) => {
  await ${newResourceName}Controller.delete(req, res);
});

export { ${newResourceName}Routes };  
`.trim();

  await fs.writeFile(
    path.resolve(routerFolder, `${newResourceName}.routes.ts`),
    route,
  );
};

const controllerFileGen = async () => {
  const singular = singularOf(newResourceName);

  const baseImports = `
import { Response${customRequest ? "" : ", Request"} } from "express";
${customRequest ? customRequest : ""}
import { ${up1(newResourceName)}Service } from "../services/${up1(
    newResourceName,
  )}Service";
import { STATUS_CODE } from "../constants/statusCode";
`;

  const logUserImport = hasLogs
    ? `import { user } from "@prisma/client";\n`
    : ``;

  const controllerBody = `
export class ${up1(newResourceName)}Controller {
  private ${newResourceName}Service = new ${up1(newResourceName)}Service();

  async listAll(req: ${customRequest ? `CustomRequest<unknown>` : `Request`}, res: Response) {
    const result = await this.${newResourceName}Service.listAll(req.query);
    return res.status(STATUS_CODE.OK).json(result);
  }
  
  async getById(req: ${customRequest ? `CustomRequest<unknown>` : `Request`}, res: Response) {
    const result = await this.${newResourceName}Service.getById(Number(req.params.id${up1(
      singular,
    )}));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async create(req: ${customRequest ? `CustomRequest<unknown>` : `Request`}, res: Response) {
    ${hasLogs ? `const who = req.user as user;` : ``}
    const result = await this.${newResourceName}Service.create(
      req.body${hasLogs ? `, who` : ``}
    );
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async update(req: ${customRequest ? `CustomRequest<unknown>` : `Request`}, res: Response) {
    ${hasLogs ? `const who = req.user as user;` : ``}
    const result = await this.${newResourceName}Service.update(
      Number(req.params.id${up1(singular)}),
      req.body${hasLogs ? `, who` : ``}
    );
    return res.status(STATUS_CODE.OK).json(result);
  }

  async delete(req: ${customRequest ? `CustomRequest<unknown>` : `Request`}, res: Response) {
    ${hasLogs ? `const who = req.user as user;` : ``}
    const result = await this.${newResourceName}Service.delete(
      Number(req.params.id${up1(singular)})${hasLogs ? `, who` : ``}
    );
    return res.status(STATUS_CODE.OK).json(result);
  }
}
`.trim();

  const controller = (baseImports + logUserImport + controllerBody).trim();

  await fs.writeFile(
    path.resolve(controllerFolder, `${up1(newResourceName)}Controller.ts`),
    controller,
  );
};

const serviceFileGen = async () => {
  const singular = singularOf(newResourceName);
  const ModelName = up1(newResourceName);

  if (!hasLogs) {
    const service = `
import { ${ModelName}Model } from "../models/${ModelName}Model";
import { querySchema } from "../validations/Queries/listAll";
import { create${ModelName}Schema } from "../validations/${ModelName}/create${ModelName}Schema";
import { update${ModelName}Schema } from "../validations/${ModelName}/update${ModelName}Schema";

export class ${ModelName}Service {
  private ${newResourceName}Model = new ${ModelName}Model()

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.${newResourceName}Model.listAll(validQuery);
  }
    
  async getById(id${up1(singular)}: number) {
    return this.${newResourceName}Model.getById(id${up1(singular)});
  }

  async create(data: unknown) {
    const validData = create${ModelName}Schema.parse(data);
    return this.${newResourceName}Model.create(validData);
  }

  async update(id${up1(singular)}: number, data: unknown) {
    const validData = update${ModelName}Schema.parse(data);
    return this.${newResourceName}Model.update(id${up1(singular)}, validData);
  }

  async delete(id${up1(singular)}: number) {
    return this.${newResourceName}Model.delete(id${up1(singular)});
  }
}
`.trim();

    await fs.writeFile(
      path.resolve(serviceFolder, `${ModelName}Service.ts`),
      service,
    );
    return;
  }

  // --- with logs ---
  const serviceWithLogs = `
import { EInteraction, user } from "@prisma/client";
import { ${ModelName}Model } from "../models/${ModelName}Model";
import { Log${ModelName}Model } from "../models/Log${ModelName}Model";
import { querySchema } from "../validations/Queries/listAll";
import { create${ModelName}Schema, TCreate${ModelName} } from "../validations/${ModelName}/create${ModelName}Schema";
import { update${ModelName}Schema, TUpdate${ModelName} } from "../validations/${ModelName}/update${ModelName}Schema";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";

interface ILogCreate {
  validData: TCreate${ModelName};
  idWhoDid: number;
}
interface ILogUpdate {
  id${up1(singular)}: number;
  validData: TUpdate${ModelName};
  oldValues: any;
  idWhoDid: number;
}
interface ILogDelete {
  id${up1(singular)}: number;
  idWhoDid: number;
}

export class ${ModelName}Service {
  private ${newResourceName}Model = new ${ModelName}Model();

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.${newResourceName}Model.listAll(validQuery);
  }

  async getById(id${up1(singular)}: number) {
    return this.${newResourceName}Model.getById(id${up1(singular)});
  }

  private async createWithLog({ validData, idWhoDid }: ILogCreate) {
    const resourceCreated = await this.${newResourceName}Model.create(validData);
    await new Log${ModelName}Model().createNewLog({
      interaction: EInteraction.CREATE,
      id${up1(singular)}: resourceCreated.id${up1(singular)},
      idWhoDid,
      oldValues: {},
      newValues: { ...resourceCreated },
    });
    return resourceCreated;
  }

  async create(data: unknown, who: user) {
    const validData = create${ModelName}Schema.parse(data);
    return this.createWithLog({
      validData,
      idWhoDid: who.idUser,
    });
  }

  private async updateWithLog({ id${up1(
    singular,
  )}, validData, oldValues, idWhoDid }: ILogUpdate) {
    const resourceUpdated = await this.${newResourceName}Model.update(id${up1(
      singular,
    )}, validData);
    await new Log${ModelName}Model().createNewLog({
      interaction: EInteraction.UPDATE,
      id${up1(singular)}: resourceUpdated.id${up1(singular)},
      idWhoDid,
      oldValues: { ...oldValues },
      newValues: { ...resourceUpdated },
    });
    return resourceUpdated;
  }

  async update(id${up1(singular)}: number, data: unknown, who: user) {
    const validData = update${ModelName}Schema.parse(data);
    const oldOne = await this.${newResourceName}Model.getById(Number(id${up1(
      singular,
    )}));
    if (!oldOne) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return this.updateWithLog({
      id${up1(singular)}: Number(id${up1(singular)}),
      validData,
      oldValues: oldOne,
      idWhoDid: who.idUser,
    });
  }

  private async deleteWithLog({ id${up1(singular)}, idWhoDid }: ILogDelete) {
    const resourceUpdated = await this.${newResourceName}Model.delete(id${up1(
      singular,
    )});
    await new Log${ModelName}Model().createNewLog({
      interaction: EInteraction.DELETE,
      id${up1(singular)}: resourceUpdated.id${up1(singular)},
      idWhoDid,
      oldValues: { ...resourceUpdated, deletedAt: null },
      newValues: { ...resourceUpdated },
    });
    return resourceUpdated;
  }

  async delete(id${up1(singular)}: number, who: user) {
    const oldOne = await this.${newResourceName}Model.getById(Number(id${up1(
      singular,
    )}));
    if (!oldOne) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return this.deleteWithLog({
      id${up1(singular)}: Number(id${up1(singular)}),
      idWhoDid: who.idUser,
    });
  }
}
`.trim();

  await fs.writeFile(
    path.resolve(serviceFolder, `${ModelName}Service.ts`),
    serviceWithLogs,
  );
};

const modelFileGen = async () => {
  const singular = singularOf(newResourceName);
  const model = `
import { prisma } from "../db/prisma";
import { TQuery } from "../validations/Queries/listAll";
import { TCreate${up1(newResourceName)} } from "../validations/${up1(
    newResourceName,
  )}/create${up1(newResourceName)}Schema";
import { TUpdate${up1(newResourceName)} } from "../validations/${up1(
    newResourceName,
  )}/update${up1(newResourceName)}Schema";

export class ${up1(newResourceName)}Model {
  async totalCount(query: TQuery) {
    return prisma.${singular}.count({
      where: {
        name: { contains: query.search },
        deletedAt: null,
      },
    });
  }

  async listAll(query: TQuery) {
    const limit = query.limit || 0;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({ [field]: direction })) || [];

    const result = await prisma.${singular}.findMany({
      where: {
        name: { contains: query.search },
        deletedAt: null,
      },
      take: limit || undefined,
      skip,
      orderBy,
    });

    const totalCount = await this.totalCount(query);
    return { result, totalCount };
  }

  async getById(id${up1(singular)}: number) {
    return prisma.${singular}.findUnique({ where: { id${up1(singular)} } });
  }

  async create(data: TCreate${up1(newResourceName)}) {
    return prisma.${singular}.create({ data });
  }

  async update(id${up1(singular)}: number, data: TUpdate${up1(newResourceName)}) {
    return prisma.${singular}.update({
      where: { id${up1(singular)} },
      data,
    });
  }

  async delete(id${up1(singular)}: number) {
    return prisma.${singular}.update({
      where: { id${up1(singular)} },
      data: { deletedAt: new Date() },
    });
  }
}
`.trim();

  await fs.writeFile(
    path.resolve(modelFolder, `${up1(newResourceName)}Model.ts`),
    model,
  );
};

const logModelFileGen = async () => {
  if (!hasLogs) return;
  const singular = singularOf(newResourceName);
  const NeedsPasswordScrub = singular.toLowerCase() === "user";

  const imports = `
import { EInteraction } from "@prisma/client";
import { prisma } from "../db/prisma";
${NeedsPasswordScrub ? `import { removePassword } from "../utils/removePassword";` : ""}
import { getDifferentKeys } from "../utils/getDifferentKeys";
`.trim();

  const iface = `
interface I${up1(newResourceName)}Log {
  id${up1(singular)}: number;
  interaction: EInteraction;
  idWhoDid: number | undefined;
  oldValues: object;
  newValues: object;
}
`.trim();

  const body = `
export class Log${up1(newResourceName)}Model {
  async createNewLog({
    interaction,
    id${up1(singular)},
    idWhoDid,
    oldValues,
    newValues,
  }: I${up1(newResourceName)}Log) {
    const diff = getDifferentKeys(
      oldValues as Record<string, unknown>,
      newValues as Record<string, unknown>,
    );

    return await prisma.log${up1(newResourceName)}.create({
      data: {
        id${up1(singular)},
        idWhoDid,
        interaction,
        oldValues: ${
          NeedsPasswordScrub ? "removePassword(oldValues)" : "oldValues"
        },
        newValues: ${
          NeedsPasswordScrub ? "removePassword(newValues)" : "newValues"
        },
        diff,
      },
    });
  }
}
`.trim();

  const logModel = [imports, iface, body].join("\n\n");

  await fs.writeFile(
    path.resolve(modelFolder, `Log${up1(newResourceName)}Model.ts`),
    logModel,
  );
};

const genZodValiddations = async () => {
  const folder = path.resolve(validations, up1(newResourceName));
  await fs.mkdir(folder, { recursive: true });

  const schemaCreate = `
import { z } from "zod";

export const create${up1(newResourceName)}Schema = z.object({});

export type TCreate${up1(newResourceName)} = z.infer<typeof create${up1(
    newResourceName,
  )}Schema>;
`.trim();

  await fs.writeFile(
    path.resolve(folder, `create${up1(newResourceName)}Schema.ts`),
    schemaCreate,
  );

  const schemaUpdate = `
import { z } from "zod";
import { create${up1(
    newResourceName,
  )}Schema } from "./create${up1(newResourceName)}Schema";

export const update${up1(
    newResourceName,
  )}Schema = create${up1(newResourceName)}Schema.partial();

export type TUpdate${up1(newResourceName)} = z.infer<typeof update${up1(
    newResourceName,
  )}Schema>;
`.trim();

  await fs.writeFile(
    path.resolve(folder, `update${up1(newResourceName)}Schema.ts`),
    schemaUpdate,
  );
};

const setResourceName = () => {
  if (process.argv.length < 3) return;
  const resourceName = process.argv[process.argv.length - 1];
  newResourceName = resourceName ? resourceName : newResourceName;
};

const main = async () => {
  setResourceName();
  if (!newResourceName) return;

  try {
    await fs.readFile(
      path.resolve(controllerFolder, `${up1(newResourceName)}Controller.ts`),
    );
  } catch (_error) {
    await routeIndexImportGen();
  }

  await basePathFileGen();
  await routeFileGen();
  await controllerFileGen();
  await serviceFileGen();
  await modelFileGen();
  await logModelFileGen();
  await genZodValiddations();

  console.log("Recursos gerados com sucesso");
  // exec(`npx prettier --write .`, () => {});
};

main();
// Fim do arquivo routerGenerate.js

import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Meilisearch, Index } from "meilisearch";

export const RESOURCES_INDEX = "resources";

export interface ResourceSearchDocument {
  id: string;
  title: string;
  description?: string | null;
  fileType: string;
  fileUrl: string;
  semesterId: string;
  subjectId: string;
  unitId: string;
  uploaderId: string;
  status: string;
  createdAt: string;
}

@Injectable()
export class MeilisearchService implements OnModuleInit {
  private readonly logger = new Logger(MeilisearchService.name);
  private client!: Meilisearch;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host =
      this.configService.get<string>("MEILI_URL") ||
      process.env.MEILI_URL ||
      "http://localhost:7700";
    const apiKey =
      this.configService.get<string>("MEILI_MASTER_KEY") ||
      process.env.MEILI_MASTER_KEY ||
      "codexa_dev_master_key";

    try {
      // Dynamic import for pure ESM package in CommonJS runtime
      const { Meilisearch: MeilisearchClient } = (await (Function(
        'return import("meilisearch")',
      )() as Promise<typeof import("meilisearch")>));

      this.client = new MeilisearchClient({ host, apiKey });

      const health = await this.client.isHealthy();
      if (health) {
        this.logger.log("Connected to Meilisearch");
        await this.initIndexes();
      }
    } catch (err: any) {
      this.logger.warn(`Meilisearch connection: ${err.message}`);
    }
  }

  private async initIndexes() {
    try {
      const index = this.client.index(RESOURCES_INDEX);
      await index.updateFilterableAttributes([
        "semesterId",
        "subjectId",
        "unitId",
        "fileType",
        "status",
      ]);
      await index.updateSearchableAttributes(["title", "description"]);
      await index.updateSortableAttributes(["createdAt"]);
      this.logger.log(`Meilisearch '${RESOURCES_INDEX}' index settings updated`);
    } catch (err: any) {
      this.logger.warn(`Failed to initialize Meilisearch index: ${err.message}`);
    }
  }

  getClient(): Meilisearch {
    return this.client;
  }

  getIndex(indexName: string = RESOURCES_INDEX): Index {
    return this.client.index(indexName);
  }

  async search<T extends Record<string, any>>(
    query: string,
    options?: {
      filter?: string | string[];
      limit?: number;
      offset?: number;
      sort?: string[];
    },
    indexName: string = RESOURCES_INDEX,
  ) {
    const index = this.client.index<T>(indexName);
    return index.search(query, options);
  }

  async addDocuments<T extends Record<string, any>>(
    documents: T[],
    primaryKey?: string,
    indexName: string = RESOURCES_INDEX,
  ) {
    const index = this.client.index(indexName);
    return index.addDocuments(documents, { primaryKey });
  }

  async deleteDocument(
    documentId: string | number,
    indexName: string = RESOURCES_INDEX,
  ) {
    const index = this.client.index(indexName);
    return index.deleteDocument(documentId);
  }

  async deleteDocuments(
    documentIds: string[],
    indexName: string = RESOURCES_INDEX,
  ) {
    const index = this.client.index(indexName);
    return index.deleteDocuments(documentIds);
  }

  async isHealthy(): Promise<boolean> {
    try {
      return await this.client.isHealthy();
    } catch {
      return false;
    }
  }
}

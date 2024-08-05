import { Controller, Get, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import axios from "axios";
import { ApiConfigService } from "../../shared/services/api-config.service";
@Controller("/health")
export class HealthController {
  constructor(private configService: ApiConfigService) {}
  private logger = new Logger(HealthController.name);
  @Get()
  getHello() {
    return {
      api: "N Blog API",
      version: "1.0.0",
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }

  // every 5 minutes
  @Cron("0 */5 * * * *")
  async cronHeathCheck() {
    try {
      await axios.get(this.configService.host + "/api/health");
    } catch (error) {}
  }
}

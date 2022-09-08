import { BaseSeeder } from './base';

export class ProdSeeder extends BaseSeeder {
  async migrate() {
    console.log('Creating base tags...');
    await this.createBaseTags();
  }
}

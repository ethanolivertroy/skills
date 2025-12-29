import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';

config();

export class VaultManager {
  constructor(vaultPath = process.env.OBSIDIAN_VAULT_PATH) {
    if (!vaultPath) {
      throw new Error('OBSIDIAN_VAULT_PATH not set');
    }
    this.vaultPath = vaultPath;
  }

  async getAllNotes() {
    const notes = [];
    await this.walkDir(this.vaultPath, notes);
    return notes.filter(f => f.endsWith('.md'));
  }

  async walkDir(dir, fileList = []) {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        if (!file.startsWith('.')) {
          await this.walkDir(filePath, fileList);
        }
      } else {
        fileList.push(filePath);
      }
    }

    return fileList;
  }

  async readNote(notePath) {
    const content = await fs.readFile(notePath, 'utf-8');
    return content;
  }

  async writeNote(notePath, content) {
    const dir = path.dirname(notePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(notePath, content, 'utf-8');
  }

  getRelativePath(absolutePath) {
    return path.relative(this.vaultPath, absolutePath);
  }
}

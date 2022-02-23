import * as globby from 'globby'
import { ensureDir, remove } from 'fs-extra'

export const secretsDirectory = {
  path: '.secrets/',
  async list () {
    return await globby([`${this.path}/*`, `!${this.path}/.gitignore`])
  },
  async ensure () {
    return await ensureDir(this.path)
  },
  async delete () {
    return await remove(this.path)
  }
}

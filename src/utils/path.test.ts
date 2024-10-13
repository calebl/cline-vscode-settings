import { describe, it, expect } from 'vitest'
import { arePathsEqual, getReadablePath } from './path'
import * as path from 'path'
import os from 'os'

describe('path utilities', () => {
  describe('arePathsEqual', () => {
    it('should return true for identical paths', () => {
      expect(arePathsEqual('/home/user/file.txt', '/home/user/file.txt')).toBe(true)
    })

    it('should return true for paths with different separators', () => {
      expect(arePathsEqual('/home/user/file.txt', '\\home\\user\\file.txt')).toBe(true)
    })

    it('should return false for different paths', () => {
      expect(arePathsEqual('/home/user/file1.txt', '/home/user/file2.txt')).toBe(false)
    })

    it('should handle undefined inputs', () => {
      expect(arePathsEqual(undefined, undefined)).toBe(true)
      expect(arePathsEqual('/home/user/file.txt', undefined)).toBe(false)
      expect(arePathsEqual(undefined, '/home/user/file.txt')).toBe(false)
    })

    it('should compare paths case-insensitively on Windows', () => {
      const originalPlatform = process.platform
      Object.defineProperty(process, 'platform', { value: 'win32' })

      expect(arePathsEqual('C:\\Users\\Test\\file.txt', 'c:\\users\\test\\FILE.TXT')).toBe(true)

      Object.defineProperty(process, 'platform', { value: originalPlatform })
    })

    it('should compare paths case-sensitively on non-Windows platforms', () => {
      const originalPlatform = process.platform
      Object.defineProperty(process, 'platform', { value: 'darwin' })

      expect(arePathsEqual('/home/user/file.txt', '/home/user/FILE.TXT')).toBe(false)

      Object.defineProperty(process, 'platform', { value: originalPlatform })
    })
  })

  describe('getReadablePath', () => {
    const homeDir = os.homedir()
    const desktop = path.join(homeDir, 'Desktop')

    it('should return basename when cwd equals absolutePath', () => {
      const cwd = '/home/user/project'
      expect(getReadablePath(cwd, '')).toBe('project')
    })

    it('should return relative path when absolutePath is within cwd', () => {
      const cwd = '/home/user/project'
      expect(getReadablePath(cwd, 'src/file.ts')).toBe('src/file.ts')
    })

    it('should return absolute path when absolutePath is outside cwd', () => {
      const cwd = '/home/user/project'
      expect(getReadablePath(cwd, '../../other/file.ts')).toBe('/home/other/file.ts')
    })

    it('should return absolute path when cwd is Desktop', () => {
      expect(getReadablePath(desktop, 'file.ts')).toBe(`${desktop}/file.ts`)
    })
  })

  describe('String.prototype.toPosix', () => {
    it('should convert Windows-style path to POSIX', () => {
      expect('C:\\Users\\test\\file.txt'.toPosix()).toBe('C:/Users/test/file.txt')
    })

    it('should not change POSIX-style path', () => {
      expect('/home/user/file.txt'.toPosix()).toBe('/home/user/file.txt')
    })

    it('should handle empty string', () => {
      expect(''.toPosix()).toBe('')
    })

    it('should not modify extended-length Windows paths', () => {
      const extendedPath = '\\\\?\\C:\\Very Long\\Path\\That\\Exceeds\\Windows\\Limits.txt'
      expect(extendedPath.toPosix()).toBe(extendedPath)
    })
  })
})

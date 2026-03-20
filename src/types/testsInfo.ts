export interface TestsInfoEntry {
  type: string
  dir: string
  img_url: string
  tests: string[]
}

export interface TestsInfo {
  tests: TestsInfoEntry[]
}


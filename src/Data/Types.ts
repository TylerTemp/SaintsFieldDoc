export interface TitleAndContent {
    Title: string
    TitleId: string
    TitleLevel: number
    Content: string
    SubContents: TitleAndContent[]
}

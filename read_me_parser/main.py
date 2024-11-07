from __future__ import annotations
import sys
import os
import re
import json
import dataclasses
from dataclasses import dataclass


class EnhancedJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if dataclasses.is_dataclass(o):
            return dataclasses.asdict(o)
        return super().default(o)


@dataclass(frozen=True)
class TitleAndContent:
    title: str
    title_id: str
    title_level: int
    content: list[str]
    sub_content: list[TitleAndContent]


readme_path = os.path.join(os.path.dirname(__file__), 'SaintsField', 'README.md')

root_title: TitleAndContent | None = None
title_chain: list[TitleAndContent] = []

with open(readme_path, 'r') as f:
    for line in f:
        if line.startswith('#') and not line.startswith('#if ') and not line.startswith('#endif'):
            split_header_md = line.split()
            split_header_md.pop(len(split_header_md) - 1)
            title_start = split_header_md.pop(0)
            title_level = len(title_start)
            title = ' '.join(split_header_md)
            title_id: str = re.sub(r'[^a-zA-Z\s\-]', '', title).replace(' ', '-').lower()

            if title_level == 1:
                root_title = TitleAndContent(title, title_id, title_level, [], [])
                title_chain.append(root_title)
            else:
                last_title = title_chain[-1]
                if last_title.title_level >= title_level:
                    while title_chain[-1].title_level >= title_level:
                        title_chain.pop()
                new_title = TitleAndContent(title, title_id, title_level, [], [])
                title_chain[-1].sub_content.append(new_title)
                title_chain.append(new_title)
        else:
            title_chain[-1].content.append(line)

# print(json.dumps(root_title, cls=EnhancedJSONEncoder, indent=4))
@dataclass(frozen=True)
class TitleAndContentCompact:
    Title: str
    TitleId: str
    TitleLevel: int
    Content: str
    SubContents: list[TitleAndContentCompact]


def compact_title_and_content(title_and_content: TitleAndContent) -> TitleAndContentCompact:
    return TitleAndContentCompact(
        Title=title_and_content.title,
        TitleId=title_and_content.title_id,
        TitleLevel=title_and_content.title_level,
        Content=''.join(title_and_content.content),
        SubContents=[compact_title_and_content(sub) for sub in title_and_content.sub_content]
    )

root_compact = compact_title_and_content(root_title)
print(json.dumps(root_compact, cls=EnhancedJSONEncoder, indent=4))

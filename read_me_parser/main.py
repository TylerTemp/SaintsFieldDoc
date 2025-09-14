from __future__ import annotations
import sys
import os
import json
import dataclasses
from dataclasses import dataclass
import re
import colorlog
import requests
import logging


handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
	'%(log_color)s[%(levelname)s:%(name)s] %(message)s'))

logger = colorlog.getLogger('read_me_parser')
logger.addHandler(handler)
# logging.basicConfig(level=logging.DEBUG)
logger.setLevel(logging.DEBUG)

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

with open(readme_path, 'r', encoding='utf-8') as f:
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
@dataclass()
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
        Content=''.join(title_and_content.content).strip(),
        SubContents=[compact_title_and_content(sub) for sub in title_and_content.sub_content]
    )

root_compact = compact_title_and_content(root_title)

list_compact: list[TitleAndContentCompact] = []
root_node = root_compact
root_node.TitleId = ""
sub_list = list(root_compact.SubContents)
root_compact.SubContents.clear()

list_compact.append(root_node)
list_compact.extend(sub_list)

if list_compact[0].Title == 'SaintsField':
    list_compact[0].Title = ''

# markdown_link_pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
markdown_image_pattern = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')

def get_github_resources(url: str) -> requests.Response:
    # file_base_name = os.path.basename(url)
    resp = requests.head(url, allow_redirects=False)
    assert resp.status_code == 302, f'[{resp.status_code}: {url}]: {resp.text}'
    redirected_url = resp.headers['Location']

    file_resp = requests.get(redirected_url)
    assert file_resp.status_code == 200, f'[{file_resp.status_code}: {redirected_url}]: {file_resp.text}'
    return file_resp


def get_ext_from_response(remote_res: requests.Response) -> str:
    content_type = remote_res.headers.get('Content-Type', '')
    if content_type:
        if 'image/jpeg' in content_type:
            return '.jpg'
        elif 'image/png' in content_type:
            return '.png'
        elif 'image/gif' in content_type:
            return '.gif'
        elif 'image/webp' in content_type:
            return '.webp'
        elif 'image/svg+xml' in content_type:
            return '.svg'
        elif 'video/mp4' in content_type:
            return '.mp4'
        elif 'video/webm' in content_type:
            return '.webm'
        elif 'video/ogg' in content_type:
            return '.ogg'
        elif 'audio/mpeg' in content_type:
            return '.mp3'
        elif 'audio/wav' in content_type:
            return '.wav'
        elif 'audio/ogg' in content_type:
            return '.ogg'
    raise ValueError(f'Unsupported Content-Type: {content_type} for {remote_res.url}')


def get_or_download_resource(url: str, resource_id: str, resource_folder: str) -> str:
    # logger.debug(url)

    use_resource_id: str = '' if resource_id == '/' else resource_id

    file_base_name = os.path.basename(url)

    os.makedirs(resource_folder, exist_ok=True)

    for file_name in os.listdir(resource_folder):
        exist_file_base: str = os.path.splitext(file_name)[0]
        if exist_file_base == file_base_name:
            logger.debug(f'Found existing resource for {url}: /assets{use_resource_id}/{file_name}')
            return f'/assets{use_resource_id}/{file_name}'

    else:
        remote_res = get_github_resources(url)
        ext: str = get_ext_from_response(remote_res)
        file_full_name = f'{file_base_name}{ext}'

        os.makedirs(resource_folder, exist_ok=True)

        with open(os.path.join(resource_folder, file_full_name), 'wb') as f:
            f.write(remote_res.content)
        logger.debug(f'Write resource for {url}: /assets{use_resource_id}/{file_full_name}')
        return f'/assets{use_resource_id}/{file_full_name}'


def convert_image(line: str, resource_id: str, resource_folder: str) -> str:
    logger.debug(f'Converting image for {resource_id}: {line}; resource_id={resource_id}')
    match = markdown_image_pattern.match(line)
    # print(line, match)
    alt_text = match.group(1)
    url = match.group(2)

    if not url.startswith('https://github.com/TylerTemp/SaintsField/assets') and not url.startswith('https://github.com/user-attachments/assets/'):
        return line

    use_url: str = get_or_download_resource(url, resource_id, resource_folder)

    return f'![{alt_text}]({use_url})'

def convert_link(line: str, resource_id: str, resource_folder: str) -> str:
    logger.debug(f'Converting link for {resource_id}: {line}')

    square_split: list[str] = line.split('](')
    if len(square_split) < 2:
        return line

    url = square_split[-1][:-1]

    square_split.pop(-1)
    alt_text = ']('.join(square_split)[1:]

    logger.debug(f'link alt text: {alt_text}, URL: {url}')

    new_alt_text: str = alt_text

    if alt_text.startswith('![') and alt_text.endswith(')'):
        new_alt_text = convert_image(alt_text, resource_id, resource_folder)
        logger.debug(f'link alt text final: {alt_text}')

    alt_text_changed: bool = alt_text != new_alt_text

    if not url.startswith('https://github.com/TylerTemp/SaintsField/assets') and not url.startswith('https://github.com/user-attachments/assets/'):
        if alt_text_changed:
            logger.debug(f'Update link for image {resource_id} to {new_alt_text}: {url}')
            return f'[{new_alt_text}]({url})'

        logger.debug(f'Skip link for {resource_id}: {url}')
        return line

    use_url: str = get_or_download_resource(url, resource_id, resource_folder)
    logger.debug(f'Converting link get {use_url} from {url}')

    return f'[{new_alt_text}]({use_url})'

def convert_content(content: str, root: str, resource_folder: str) -> str:

    lines: list[str] = []
    for line in content.splitlines():
        l_strip: str = line.lstrip(' ')
        indent_space: int = len(line) - len(l_strip)

        result_line: str = line

        strip: str = line.strip()

        if strip.startswith('![') and strip.endswith(')'):
            result_line = indent_space * ' ' + convert_image(l_strip, root, resource_folder)
        elif strip.startswith('[') and strip.endswith(')'):
            # print(f'processing link line: {line}')
            result_line = indent_space * ' ' + convert_link(l_strip, root, resource_folder)
        # else:
        #     print(strip)

        lines.append(result_line)

    return '\n'.join(lines)


def make_id(root: str, title_id: str) -> str:
    if title_id == '':
        return '/'
    return f'{root}/{title_id}'

def make_linked_item(item: TitleAndContentCompact, root: str, resource_folder: str) -> TitleAndContentCompact:
    raw_content: str = item.Content
    # linked_content = convert_link(raw_content, root)

    # logger.debug(item.TitleId)

    # sub_id: str = make_id(root, item.TitleId)
    # logger.debug(f'Processing linked item id: {sub_id}')

    linked_content = convert_content(raw_content, root, resource_folder)
    sub_contents: list[TitleAndContentCompact] = []
    for sub in item.SubContents:
        sub_contents.append(make_linked_item(sub, make_id(root, sub.TitleId), f'{resource_folder}/{sub.TitleId}'))

    return TitleAndContentCompact(
        Title=item.Title,
        TitleId=item.TitleId,
        TitleLevel=item.TitleLevel,
        Content=linked_content,
        SubContents=sub_contents
    )


def make_linked_list(list_compact: list[TitleAndContentCompact], root: str, project_folder: str):
    for item in list_compact:
        title_id: str = item.TitleId
        resource_id: str = make_id(root, title_id)
        logger.debug(f'Processing id: {resource_id}')
        resource_folder: str = os.path.join(project_folder, title_id)
        yield make_linked_item(item, resource_id, resource_folder)

proj_folder = os.path.normpath(os.path.join(__file__, '..', '..'))

linked_lis = list(make_linked_list(list_compact, '', os.path.join(proj_folder, 'src', 'Assets')))

json_path = os.path.join(proj_folder, 'src', 'Data', 'ReadMe.json')

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(linked_lis, f, cls=EnhancedJSONEncoder, indent=4)

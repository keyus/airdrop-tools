import os
import uuid
import time
import json


def add_name_bookmark(user_data_dir, name="AirDrop Tools", url=f"chrome://newtab/"):
    default_dir = os.path.join(user_data_dir, "Default")
    if not os.path.exists(default_dir):
        return False

    bookmarks_path = os.path.join(default_dir, "Bookmarks")

    # 创建基本的书签结构
    current_time = int(time.time())
    bookmark_structure = {
        "checksum": "",
        "roots": {
            "bookmark_bar": {
                "children": [
                    {
                        "date_added": str(current_time),
                        "date_last_used": "0",
                        "guid": str(uuid.uuid4()),
                        "id": "1",
                        "meta_info": {"power_bookmark_meta": ""},
                        "name": name,
                        "type": "url",
                        "url": url,
                    }
                ],
                "date_added": str(current_time),
                "date_modified": str(current_time),
                "name": "Bookmarks bar",
                "type": "folder",
            },
            "other": {
                "children": [],
                "date_added": str(current_time),
                "date_modified": str(current_time),
                "name": "Other bookmarks",
                "type": "folder",
            },
            "synced": {
                "children": [],
                "date_added": str(current_time),
                "date_modified": str(current_time),
                "name": "Mobile bookmarks",
                "type": "folder",
            },
        },
        "version": 1,
    }

    # 如果已存在书签文件，则读取并添加我们的书签标识
    if os.path.exists(bookmarks_path):
        # 更新bookmarks_path 权限为可读可写
        print("已存在书签文件，更新书签文件")
        os.chmod(bookmarks_path, 0o644)
        try:
            with open(bookmarks_path, "r", encoding="utf-8") as f:
                existing_bookmarks = json.load(f)

            # 检查书签栏中是否已有我们的书签
            bookmark_bar = existing_bookmarks.get("roots", {}).get("bookmark_bar", {})
            children = bookmark_bar.get("children", [])

            # 检查是否已存在相同名称的书签
            bookmark_exists = False
            for bookmark in children:
                if bookmark.get("name") == name:
                    bookmark_exists = True
                    break
            # 如果已存在相同名称的书签，则不添加
            if bookmark_exists:
                return False

            print("不存在相同名称的书签，添加新的书签")
            namebookmark = {
                "date_added": str(current_time),
                "date_last_used": "0",
                "guid": str(uuid.uuid4()),
                "id": str(len(children) + 1),
                "meta_info": {"power_bookmark_meta": ""},
                "name": name,
                "type": "url",
                "url": url,
            }
            children.insert(0, namebookmark)  # 添加到书签栏的开头
            bookmark_bar["children"] = children
            existing_bookmarks["roots"]["bookmark_bar"] = bookmark_bar

            with open(bookmarks_path, "w", encoding="utf-8") as f:
                json.dump(existing_bookmarks, f, indent=4)

        except (json.JSONDecodeError, FileNotFoundError):
            # 如果文件损坏或无法读取，使用我们的默认结构
            pass
    else:
        print("没有找到书签文件，创建新的书签文件")
        # 写入书签文件
        with open(bookmarks_path, "w", encoding="utf-8") as f:
            json.dump(bookmark_structure, f, indent=4)

    return True


# 启用书签栏，通过修改Chrome的Preferences文件
def enable_bookmark_bar(user_data_dir):
    if not os.path.exists(user_data_dir):
        os.makedirs(user_data_dir)

    default_dir = os.path.join(user_data_dir, "Default")
    if not os.path.exists(default_dir):
        os.makedirs(default_dir)

    prefs_path = os.path.join(default_dir, "Preferences")

    prefs_data = {}
    if os.path.exists(prefs_path):
        try:
            with open(prefs_path, "r", encoding="utf-8") as f:
                prefs_data = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            prefs_data = {}

    if "bookmark_bar" not in prefs_data:
        prefs_data["bookmark_bar"] = {}
    prefs_data["bookmark_bar"]["show_on_all_tabs"] = True

    with open(prefs_path, "w", encoding="utf-8") as f:
        json.dump(prefs_data, f, indent=4)
    return True

import zipfile
import re
import sys

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read('word/document.xml').decode('utf-8')
            # Remove XML tags
            text = re.sub('<[^<]+?>', '', xml_content)
            with open('about_us.txt', 'w', encoding='utf-8') as f:
                f.write(text)
            print("Extracted to about_us.txt")
    except Exception as e:
        print(f"Error reading docx: {e}")

if __name__ == "__main__":
    read_docx('../assets/ABOUT US (1).docx')

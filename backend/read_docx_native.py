import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read('word/document.xml')
        
        tree = ET.fromstring(xml_content)
        text = []
        
        # XML namespace for Word
        namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        for p in tree.iterfind('.//w:p', namespace):
            paragraph_text = []
            for t in p.iterfind('.//w:t', namespace):
                if t.text:
                    paragraph_text.append(t.text)
            if paragraph_text:
                text.append(''.join(paragraph_text))
                
        return '\n'.join(text)
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    file_path = sys.argv[1]
    print(read_docx(file_path))

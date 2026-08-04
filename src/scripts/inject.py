import re
import base64

with open('newlogoAl.png', 'rb') as img_file:
    b64 = base64.b64encode(img_file.read()).decode('utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'src="newlogoAl\.png"',
    f'src="data:image/png;base64,{b64}"',
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
